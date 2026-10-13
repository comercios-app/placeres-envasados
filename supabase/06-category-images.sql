-- Ejecutar una vez en SQL Editor después de los scripts 01 a 03.
-- No modifica precios ni reemplaza las imágenes actuales.
begin;
create table if not exists public.category_images (
  category_id integer primary key references public.catalog_categories(id),
  image_path text unique,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);
insert into public.category_images(category_id) select id from public.catalog_categories on conflict do nothing;
alter table public.category_images enable row level security;
revoke all on public.category_images from public, anon, authenticated;
grant select on public.category_images to anon, authenticated;
drop policy if exists images_read on public.category_images;
create policy images_read on public.category_images for select to anon, authenticated using (true);

-- Cada nombre de archivo se usa una sola vez; una foto retirada no se puede
-- volver a asociar mientras se está eliminando desde Storage.
create table if not exists private.used_category_image_paths (path text primary key);
alter table private.used_category_image_paths enable row level security;
revoke all on private.used_category_image_paths from public, anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('category-images', 'category-images', true, 307200, array['image/webp'])
on conflict (id) do update set public = true, file_size_limit = 307200, allowed_mime_types = array['image/webp'];

drop policy if exists category_images_upload on storage.objects;
create policy category_images_upload on storage.objects for insert to authenticated with check (
  bucket_id = 'category-images' and (select public.is_price_admin())
  and name ~ '^[0-9]+/[0-9a-f-]{36}\.webp$'
);
drop policy if exists category_images_admin_read on storage.objects;
create policy category_images_admin_read on storage.objects for select to authenticated using (
  bucket_id = 'category-images' and (select public.is_price_admin())
);
drop policy if exists category_images_remove_unused on storage.objects;
create policy category_images_remove_unused on storage.objects for delete to authenticated using (
  bucket_id = 'category-images' and (select public.is_price_admin())
  and not exists (select 1 from public.category_images where image_path = name)
);
-- Sin permiso UPDATE: las fotos se suben con una ruta nueva, nunca se pisan.

create or replace function public.save_category_image(target_id integer, new_path text, expected_version integer)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare current_row public.category_images%rowtype;
begin
  if not public.is_price_admin() then raise exception 'NOT_ADMIN' using errcode = '42501'; end if;
  select * into current_row from public.category_images where category_id = target_id for update;
  if not found then raise exception 'UNKNOWN_CATEGORY'; end if;
  if expected_version is null or current_row.version <> expected_version then raise exception 'IMAGE_CONFLICT'; end if;
  if new_path is not null then
    if new_path !~ ('^' || target_id::text || '/[0-9a-f-]{36}\.webp$') then raise exception 'INVALID_IMAGE'; end if;
    perform 1 from storage.objects where bucket_id = 'category-images' and name = new_path for update;
    if not found then raise exception 'IMAGE_NOT_UPLOADED'; end if;
    insert into private.used_category_image_paths(path) values (new_path);
  end if;
  update public.category_images set image_path = new_path, version = version + 1, updated_at = now() where category_id = target_id;
  return jsonb_build_object('image_path', new_path, 'version', current_row.version + 1, 'previous_path', current_row.image_path);
end;
$$;
revoke all on function public.save_category_image(integer, text, integer) from public, anon, authenticated;
grant execute on function public.save_category_image(integer, text, integer) to authenticated;
commit;

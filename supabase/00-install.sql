-- PLACERES ENVASADOS. Ejecutar solamente en su proyecto de Supabase.
-- Antes, crear gaston3x@gmail.com en Authentication > Users.
begin;

-- 01-schema.sql
-- Ejecutar como postgres en SQL Editor. No requiere claves secretas en la web.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.price_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table private.price_admins enable row level security;
revoke all on private.price_admins from public, anon, authenticated;

create table if not exists public.product_prices (
  id integer primary key,
  price integer not null check (price between 1 and 10000000),
  version integer not null default 1 check (version > 0),
  updated_at timestamptz not null default now()
);

create table if not exists public.price_history (
  id bigint generated always as identity primary key,
  product_id integer not null references public.product_prices(id),
  old_price integer not null,
  new_price integer not null,
  changed_at timestamptz not null default now(),
  changed_by uuid not null
);

create or replace function public.is_price_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (select 1 from private.price_admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_price_admin() from public, anon, authenticated;
grant execute on function public.is_price_admin() to authenticated;

alter table public.product_prices enable row level security;
alter table public.price_history enable row level security;
revoke all on public.product_prices, public.price_history from public, anon, authenticated;
revoke all on sequence public.price_history_id_seq from public, anon, authenticated;
grant select on public.product_prices to anon, authenticated;
grant select on public.price_history to authenticated;
drop policy if exists prices_public_read on public.product_prices;
create policy prices_public_read on public.product_prices for select to anon, authenticated using (true);
drop policy if exists history_admin_read on public.price_history;
create policy history_admin_read on public.price_history for select to authenticated using ((select public.is_price_admin()));

-- Única vía de escritura desde la app: permisos, validación, bloqueo de filas,
-- control de versión e historial en una misma transacción.
create or replace function public.save_prices(changes jsonb)
returns void language plpgsql security definer set search_path = ''
as $$
declare
  item jsonb;
  current_row public.product_prices%rowtype;
  product_id integer;
  new_price integer;
  expected_version integer;
begin
  if not public.is_price_admin() then
    raise exception 'NOT_ADMIN' using errcode = '42501';
  end if;
  if changes is null or jsonb_typeof(changes) <> 'array' then
    raise exception 'INVALID_CHANGES';
  end if;
  if jsonb_array_length(changes) < 1 or jsonb_array_length(changes) > 200 then
    raise exception 'INVALID_CHANGES';
  end if;
  for item in select value from jsonb_array_elements(changes) loop
    if jsonb_typeof(item) <> 'object'
       or coalesce(jsonb_typeof(item->'id'), '') <> 'number'
       or coalesce(jsonb_typeof(item->'price'), '') <> 'number'
       or coalesce(jsonb_typeof(item->'expected_version'), '') <> 'number'
       or (item->>'id') !~ '^[0-9]+$'
       or (item->>'price') !~ '^[0-9]+$'
       or (item->>'expected_version') !~ '^[0-9]+$' then
      raise exception 'INVALID_PRICE';
    end if;
    if (item->>'price')::numeric not between 1 and 10000000 then
      raise exception 'INVALID_PRICE';
    end if;
  end loop;
  if (select count(distinct (value->>'id')::integer) from jsonb_array_elements(changes)) <> jsonb_array_length(changes) then
    raise exception 'DUPLICATE_PRODUCT';
  end if;
  -- Orden estable para evitar bloqueos cruzados entre dos administradores.
  for item in select value from jsonb_array_elements(changes) order by (value->>'id')::integer loop
    product_id := (item->>'id')::integer;
    new_price := (item->>'price')::integer;
    expected_version := (item->>'expected_version')::integer;
    select * into current_row from public.product_prices where id = product_id for update;
    if not found then raise exception 'UNKNOWN_PRODUCT'; end if;
    if current_row.version <> expected_version then raise exception 'PRICE_CONFLICT'; end if;
    if current_row.price <> new_price then
      update public.product_prices set price = new_price, version = version + 1, updated_at = now() where id = product_id;
      insert into public.price_history (product_id, old_price, new_price, changed_by)
        values (product_id, current_row.price, new_price, auth.uid());
    end if;
  end loop;
end;
$$;
revoke all on function public.save_prices(jsonb) from public, anon, authenticated;
grant execute on function public.save_prices(jsonb) to authenticated;


-- 02-prices.sql

insert into public.product_prices(id,price) values
(1,4900),
(2,2500),
(3,4900),
(4,2500),
(5,3800),
(6,3500),
(7,6000),
(8,9000),
(9,8000),
(10,8000),
(11,11000),
(12,16000),
(13,12000),
(14,5000),
(15,6000),
(16,7500),
(17,6000),
(18,5000),
(19,7000),
(20,7000),
(21,8900),
(22,19500),
(23,18900),
(24,17500),
(25,22000),
(26,23500),
(27,25000),
(28,25000),
(29,22000),
(30,32000),
(31,18000),
(32,8900),
(33,9900),
(34,3900),
(35,3900),
(36,9500),
(37,8000),
(38,8000),
(39,3000),
(40,4500),
(41,24000),
(42,29000),
(43,39000),
(44,52000),
(45,25000),
(46,33000),
(47,38000),
(48,12000),
(49,12000),
(50,11000),
(51,15000),
(52,15000)
on conflict(id) do nothing;


-- 04-images.sql
-- Ejecutar una vez en SQL Editor después de los scripts 01 a 03.
-- No modifica precios ni reemplaza las imágenes actuales.

create table if not exists public.product_images (
  product_id integer primary key references public.product_prices(id),
  image_path text unique,
  version integer not null default 1,
  updated_at timestamptz not null default now()
);
insert into public.product_images(product_id) select id from public.product_prices on conflict do nothing;
alter table public.product_images enable row level security;
revoke all on public.product_images from public, anon, authenticated;
grant select on public.product_images to anon, authenticated;
drop policy if exists images_read on public.product_images;
create policy images_read on public.product_images for select to anon, authenticated using (true);

-- Cada nombre de archivo se usa una sola vez; una foto retirada no se puede
-- volver a asociar mientras se está eliminando desde Storage.
create table if not exists private.used_image_paths (path text primary key);
alter table private.used_image_paths enable row level security;
revoke all on private.used_image_paths from public, anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 307200, array['image/webp'])
on conflict (id) do update set public = true, file_size_limit = 307200, allowed_mime_types = array['image/webp'];

drop policy if exists product_images_upload on storage.objects;
create policy product_images_upload on storage.objects for insert to authenticated with check (
  bucket_id = 'product-images' and (select public.is_price_admin())
  and name ~ '^[0-9]+/[0-9a-f-]{36}\.webp$'
);
drop policy if exists product_images_admin_read on storage.objects;
create policy product_images_admin_read on storage.objects for select to authenticated using (
  bucket_id = 'product-images' and (select public.is_price_admin())
);
drop policy if exists product_images_remove_unused on storage.objects;
create policy product_images_remove_unused on storage.objects for delete to authenticated using (
  bucket_id = 'product-images' and (select public.is_price_admin())
  and not exists (select 1 from public.product_images where image_path = name)
);
-- Sin permiso UPDATE: las fotos se suben con una ruta nueva, nunca se pisan.

create or replace function public.save_product_image(target_id integer, new_path text, expected_version integer)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare current_row public.product_images%rowtype;
begin
  if not public.is_price_admin() then raise exception 'NOT_ADMIN' using errcode = '42501'; end if;
  select * into current_row from public.product_images where product_id = target_id for update;
  if not found then raise exception 'UNKNOWN_PRODUCT'; end if;
  if expected_version is null or current_row.version <> expected_version then raise exception 'IMAGE_CONFLICT'; end if;
  if new_path is not null then
    if new_path !~ ('^' || target_id::text || '/[0-9a-f-]{36}\.webp$') then raise exception 'INVALID_IMAGE'; end if;
    perform 1 from storage.objects where bucket_id = 'product-images' and name = new_path for update;
    if not found then raise exception 'IMAGE_NOT_UPLOADED'; end if;
    insert into private.used_image_paths(path) values (new_path);
  end if;
  update public.product_images set image_path = new_path, version = version + 1, updated_at = now() where product_id = target_id;
  return jsonb_build_object('image_path', new_path, 'version', current_row.version + 1, 'previous_path', current_row.image_path);
end;
$$;
revoke all on function public.save_product_image(integer, text, integer) from public, anon, authenticated;
grant execute on function public.save_product_image(integer, text, integer) to authenticated;


-- 05-catalog.sql
-- ABM del catálogo. Ejecutar después de 01 a 04. No sobrescribe precios ni fotos.

select pg_advisory_xact_lock(21671, 1);
create table if not exists public.catalog_categories (
  id integer generated by default as identity primary key,
  name text not null check (length(btrim(name)) between 1 and 80),
  sort_order integer not null default 0 check (sort_order between 0 and 10000),
  archived boolean not null default false,
  version integer not null default 1,
  creation_key uuid not null unique default gen_random_uuid()
);
create unique index if not exists catalog_category_name on public.catalog_categories(lower(btrim(name)));
create table if not exists public.catalog_products (
  id integer primary key references public.product_prices(id),
  name text not null check (length(btrim(name)) between 1 and 120),
  category_id integer not null references public.catalog_categories(id),
  sort_order integer not null default 0 check (sort_order between 0 and 10000),
  archived boolean not null default false,
  version integer not null default 1,
  creation_key uuid not null unique default gen_random_uuid()
);
alter table public.catalog_products add column if not exists subtitle text not null default '' check(length(subtitle)<=300);
alter table public.catalog_products add column if not exists details jsonb not null default '[]'::jsonb check(jsonb_typeof(details)='array' and jsonb_array_length(details)<=50);
create unique index if not exists catalog_product_name on public.catalog_products(category_id, lower(btrim(name)));
create table if not exists private.catalog_history (
  id bigint generated always as identity primary key,
  entity text not null,
  entity_id integer not null,
  before_value jsonb,
  after_value jsonb not null,
  changed_by uuid not null,
  changed_at timestamptz not null default now()
);
alter table public.catalog_categories enable row level security;
alter table public.catalog_products enable row level security;
alter table private.catalog_history enable row level security;
revoke all on public.catalog_categories, public.catalog_products, private.catalog_history from public, anon, authenticated;
revoke all on sequence public.catalog_categories_id_seq, private.catalog_history_id_seq from public, anon, authenticated;

insert into public.catalog_categories(id, name, sort_order) values
(1,'PICADAS',10),
(2,'VINOS',20),
(3,'CERVEZAS',30),
(4,'BEBIDAS SIN ALCOHOL',40),
(5,'APERITIVOS Y DESTILADOS',50),
(6,'PROMO P/ PREVIAS',60),
(7,'FIAMBRES y QUESOS',70),
(8,'PASTAS POLIDORI',80),
(9,'CHOCOLATES Y LICORES',90),
(10,'DELICATESSENS',100),
(11,'REGALERIA',110),
(12,'TABACOS',120),
(13,'OTROS PRODUCTOS..',130)
on conflict (id) do nothing;

insert into public.catalog_products(id, name, category_id, sort_order, subtitle, details) values
(1,'Coca cola 1,5 Descartable',4,1,'','[]'::jsonb),
(2,'Cunington 1,5 Pomelo',4,2,'','[]'::jsonb),
(3,'Coca Zero 1,5 Descartable',4,3,'','[]'::jsonb),
(4,'Cunington 1,5 tonica',4,4,'','[]'::jsonb),
(5,'Pryty 2,25lts',4,5,'','[]'::jsonb),
(6,'Prity Zero 2,25lts',4,6,'','[]'::jsonb),
(7,'CAZADOR MALBEC',2,7,'','[]'::jsonb),
(8,'LOS CARDOS MALBEC',2,8,'','[]'::jsonb),
(9,'TILIMUKI ORGANICO MALBEC',2,9,'','[]'::jsonb),
(10,'TILIMUKI ORGANICO BONARDA',2,10,'','[]'::jsonb),
(11,'SANTA JULIA DULCE CHENIN',2,11,'','[]'::jsonb),
(12,'BARBERIS RESERVA CAB SAUV.',2,12,'','[]'::jsonb),
(13,'RAZA ARGENTINA BLEND',2,13,'','[]'::jsonb),
(14,'LATA FERMENTUM SESSION IPA',3,14,'','[]'::jsonb),
(15,'LATA FERMENTUM AMERICAN IPA',3,15,'','[]'::jsonb),
(16,'IBIRRA ARTESANAL 1LT IPA',3,16,'','[]'::jsonb),
(17,'GOYENECHE IPA 500 cc VIDRIO',3,17,'','[]'::jsonb),
(18,'GOYENECHE GOLDEN 500 cc VIDRIO',3,18,'','[]'::jsonb),
(19,'EL BUHO ARTESANAL DE MIEL Y JENGIBRE DE 1LT RETORNABLE',3,19,'','[]'::jsonb),
(20,'EL BUHO ARTESANAL SCOTCH DE 1LT RETORNABLE',3,20,'','[]'::jsonb),
(21,'AMARGO OBRERO + CUNINGTON POMELO 1,5lts',6,21,'','[]'::jsonb),
(22,'SKY SABOR + 3 SPEED 250cc + HIELO',6,22,'','[]'::jsonb),
(23,'SMIRNOFF SABOR + 3 SPEED 250cc + HIELO',6,23,'','[]'::jsonb),
(24,'SORRENTINOS JAMON MOZZARELLA Y ALBAHACA',8,24,'','[]'::jsonb),
(25,'SORRENTINOS HONGOS RICOTA Y NUECES',8,25,'','[]'::jsonb),
(26,'AGNOLOTIS OSOBUCO BRASEADO Y MIX HONGOS',8,26,'','[]'::jsonb),
(27,'RAVIOLES DE TERNERA Y ESPINACA',8,27,'','[]'::jsonb),
(28,'RAVIOLES DE ESPINACA Y RICOTA',8,28,'','[]'::jsonb),
(29,'NOQUIS MIXTOS',8,29,'','[]'::jsonb),
(30,'LASAGNA DE CARNE LISTA PARA CALENTAR 2 PORCIONES',8,30,'','[]'::jsonb),
(31,'LASAGNA DE CARNE 1 PORCION',8,31,'','[]'::jsonb),
(32,'SALSA CREMA CON HIERBAS',8,32,'','[]'::jsonb),
(33,'SALSA BOLOGENSA',8,33,'','[]'::jsonb),
(34,'CHOCOLATE ARTESANAL NEGRO RELLENO DE DULCE DE LECHE 50grs ESTACION LA FINCA',9,34,'','[]'::jsonb),
(35,'CHOCOLATE ARTESANAL BLANCO RELLENO DE DULCE DE LECHE 50grs ESTACION LA FINCA',9,35,'','[]'::jsonb),
(36,'LICOR CREMOSO ARTESANAL ROCHER 250cc',9,36,'','[]'::jsonb),
(37,'LICOR CREMOSO CHOCOLATE EL ABUELO DE 700CC',9,37,'','[]'::jsonb),
(38,'LICOR CREMOSO DULCE DE LECHE EL ABUELO DE 700CC',9,38,'','[]'::jsonb),
(39,'HIELO 1,5KG',13,39,'','[]'::jsonb),
(40,'CARBON QUEBRACHO BLANCO 4kg',13,40,'','[]'::jsonb),
(41,'Picada Especial de Placeres para 2',1,41,'Come 1, pican 2. Bandeja de 25 cm.','["Salame y bondiola Don Ramon de Oncativo","Queso pategras","Queso ahumado saborizado","Mix de olivas","Berenjenas condimentadas al aceite","Touch de frutos secos","Pan casero mediano","Papas snack"]'::jsonb),
(42,'Picada Especial de Placeres para 3',1,42,'Pican 3, o comen 1 o 2. Bandeja de 25 cm.','["Salame y bondiola Don Ramon de Oncativo","Queso pategras","Queso ahumado saborizado","Mix de olivas","Berenjenas condimentadas al aceite","Touch de frutos secos","Pan casero grande","Papas snack","Mani saborizado o salado"]'::jsonb),
(43,'Picada Especial de Placeres para 4/5',1,43,'Comen 2 o 3. Bandeja de 30 cm.','["Salame y bondiola de Oncativo","Quesos pategras y ahumado saborizado","Mix de olivas verdes y griegas negras","Berenjenas condimentadas al aceite","Touch de frutos secos","Pan casero grande","Papas snack","Mani saborizado o salado"]'::jsonb),
(44,'Picada Especial de Placeres para 5/6',1,44,'Pican 5 o 6, o comen 3 o 4. Bandeja de 40 x 30 cm.','["Salame, bondiola y lomito ahumado Don Ramon","Quesos ahumados y saborizados","Queso pategras y queso azul","Mix de olivas verdes, griegas y con morrones","Berenjenas condimentadas","Touch de frutos secos","Pan casero grande","Papas snack","Mani salado o saborizado"]'::jsonb),
(45,'Picada Esencial de Placeres para 3',1,45,'Come 1, pican 2 o 3. Bandeja de 25 cm.','["Salame colonial","Bondiola Don Ramon Oncativo","Queso pategras","Queso azul","Mini sandwiches de miga de jamon cocido y queso","Touch de berenjenas condimentadas al aceite","Mix de olivas verdes, negras y con morrones","Pan casero mediano","Papas snack","Mani saborizado o salado"]'::jsonb),
(46,'Picada Esencial de Placeres para 4/5',1,46,'Comen 2 o 3, pican 4 o 5. Bandeja de 30 cm.','["Salame colonial","Bondiola Don Ramon Oncativo","Queso pategras","Queso azul","Mini sandwiches de miga de jamon cocido y queso","Touch de berenjenas condimentadas al aceite","Mix de olivas verdes, negras y con morrones","Pan casero grande","Papas snack","Mani saborizado o salado"]'::jsonb),
(47,'Picada de Quesos para 4/5',1,47,'Comen 2 o 3. Bandeja de 30 cm.','["Surtido de quesos","Aceitunas verdes, griegas y rellenas con morron","Berenjenas condimentadas al aceite","Pan casero grande","Papas snack"]'::jsonb),
(48,'Promo 2 x EL BUHO ARTESANAL DE MIEL Y JENGIBRE DE 1LT RETORNABLE',3,48,'','[]'::jsonb),
(49,'Promo 2 x EL BUHO ARTESANAL SCOTCH DE 1LT RETORNABLE',3,49,'','[]'::jsonb),
(50,'Promo 2 x GOYENECHE IPA 500 cc VIDRIO',3,50,'','[]'::jsonb),
(51,'Promo 2 x LICOR CREMOSO CHOCOLATE EL ABUELO DE 700CC',9,51,'','[]'::jsonb),
(52,'Promo 2 x LICOR CREMOSO DULCE DE LECHE EL ABUELO DE 700CC',9,52,'','[]'::jsonb)
on conflict (id) do nothing;

create sequence if not exists public.catalog_product_id_seq;
select setval('public.catalog_product_id_seq', greatest((select coalesce(max(id), 0) + 1 from public.product_prices), (select last_value from public.catalog_product_id_seq)), false);
select setval('public.catalog_categories_id_seq', greatest((select coalesce(max(id), 0) + 1 from public.catalog_categories), (select last_value from public.catalog_categories_id_seq)), false);
revoke all on sequence public.catalog_product_id_seq from public, anon, authenticated;

create table if not exists public.category_images (
 category_id integer primary key references public.catalog_categories(id),
 image_path text unique, version integer not null default 1, updated_at timestamptz not null default now()
);
insert into public.category_images(category_id) select id from public.catalog_categories on conflict do nothing;
alter table public.category_images enable row level security;
revoke all on public.category_images from public, anon, authenticated;
grant select on public.category_images to anon, authenticated;
drop policy if exists category_images_read on public.category_images;
create policy category_images_read on public.category_images for select to anon, authenticated using(true);

create or replace function public.get_catalog(include_archived boolean default false)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
begin
  if include_archived and not public.is_price_admin() then raise exception 'NOT_ADMIN' using errcode = '42501'; end if;
  return jsonb_build_object(
    'categories', coalesce((select jsonb_agg(jsonb_build_object('id', c.id, 'name', c.name, 'sort_order', c.sort_order, 'archived', c.archived, 'version', c.version, 'image_path', ci.image_path, 'image_version', ci.version) order by c.sort_order, c.id)
      from public.catalog_categories c join public.category_images ci on ci.category_id=c.id where include_archived or not c.archived), '[]'::jsonb),
    'products', coalesce((select jsonb_agg(jsonb_build_object(
      'id', p.id, 'name', p.name, 'subtitle', p.subtitle, 'details', p.details, 'category_id', p.category_id, 'sort_order', p.sort_order,
      'archived', p.archived, 'catalog_version', p.version,
      'price', prices.price, 'version', prices.version, 'image_path', images.image_path, 'image_version', images.version
    ) order by c.sort_order, c.id, p.sort_order, p.id)
      from public.catalog_products p join public.catalog_categories c on c.id = p.category_id
      join public.product_prices prices on prices.id = p.id
      join public.product_images images on images.product_id = p.id
      where include_archived or (not p.archived and not c.archived)), '[]'::jsonb)
  );
end;
$$;
revoke all on function public.get_catalog(boolean) from public, anon, authenticated;
grant execute on function public.get_catalog(boolean) to anon, authenticated;

create or replace function public.save_catalog_category(input jsonb)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  target integer := (input->>'id')::integer;
  category_name text := btrim(input->>'name');
  position integer := (input->>'sort_order')::integer;
  is_archived boolean := (input->>'archived')::boolean;
  old_row public.catalog_categories%rowtype;
  new_row public.catalog_categories%rowtype;
  request_key uuid := (input->>'request_id')::uuid;
begin
  if not public.is_price_admin() then raise exception 'NOT_ADMIN' using errcode = '42501'; end if;
  perform pg_advisory_xact_lock(21671, 1);
  if category_name is null or length(category_name) not between 1 and 80 or position is null or position not between 0 and 10000 or is_archived is null then raise exception 'INVALID_CATALOG'; end if;
  if target is null then
    if request_key is null then raise exception 'INVALID_REQUEST'; end if;
    select id into target from public.catalog_categories where creation_key = request_key;
    if found then return target; end if;
    insert into public.catalog_categories(name, sort_order, archived, creation_key) values(category_name, position, is_archived, request_key) returning * into new_row;
    insert into public.category_images(category_id) values(new_row.id);
  else
    select * into old_row from public.catalog_categories where id = target for update;
    if not found then raise exception 'UNKNOWN_CATEGORY'; end if;
    if old_row.version is distinct from (input->>'expected_version')::integer then raise exception 'CATALOG_CONFLICT'; end if;
    if is_archived and exists(select 1 from public.catalog_products where category_id = target and not archived) then raise exception 'CATEGORY_HAS_PRODUCTS'; end if;
    update public.catalog_categories set name = category_name, sort_order = position, archived = is_archived, version = version + 1 where id = target returning * into new_row;
  end if;
  insert into private.catalog_history(entity, entity_id, before_value, after_value, changed_by)
    values('category', new_row.id, case when old_row.id is null then null else to_jsonb(old_row) end, to_jsonb(new_row), auth.uid());
  return new_row.id;
end;
$$;
revoke all on function public.save_catalog_category(jsonb) from public, anon, authenticated;
grant execute on function public.save_catalog_category(jsonb) to authenticated;

create or replace function public.save_catalog_product(input jsonb)
returns integer language plpgsql security definer set search_path = '' as $$
declare
  target integer := (input->>'id')::integer;
  product_name text := btrim(input->>'name');
  category integer := (input->>'category_id')::integer;
  position integer := (input->>'sort_order')::integer;
  is_archived boolean := (input->>'archived')::boolean;
  subtitle_value text := coalesce(input->>'subtitle', '');
  details_value jsonb := coalesce(input->'details', '[]'::jsonb);
  new_price integer;
  current_price public.product_prices%rowtype;
  old_row public.catalog_products%rowtype;
  new_row public.catalog_products%rowtype;
  request_key uuid := (input->>'request_id')::uuid;
begin
  if not public.is_price_admin() then raise exception 'NOT_ADMIN' using errcode = '42501'; end if;
  perform pg_advisory_xact_lock(21671, 1);
  if product_name is null or length(product_name) not between 1 and 120 or position is null or position not between 0 and 10000 or is_archived is null
     or coalesce(input->>'price', '') !~ '^[0-9]+$' then raise exception 'INVALID_CATALOG'; end if;
  if length(subtitle_value)>300 or jsonb_typeof(details_value)<>'array' then raise exception 'INVALID_CATALOG'; end if;
  if jsonb_array_length(details_value)>50 then raise exception 'INVALID_CATALOG'; end if;
  if exists(select 1 from jsonb_array_elements(details_value) v where jsonb_typeof(v)<>'string' or length(btrim(v #>> '{}')) not between 1 and 300) then raise exception 'INVALID_CATALOG'; end if;
  new_price := (input->>'price')::integer;
  if new_price not between 1 and 10000000 then raise exception 'INVALID_PRICE'; end if;
  if target is null then
    if request_key is null then raise exception 'INVALID_REQUEST'; end if;
    select id into target from public.catalog_products where creation_key = request_key;
    if found then return target; end if;
  end if;
  if not exists(select 1 from public.catalog_categories where id = category and (not archived or is_archived)) then raise exception 'CATEGORY_UNAVAILABLE'; end if;
  if target is null then
    target := nextval('public.catalog_product_id_seq');
    insert into public.product_prices(id, price) values(target, new_price);
    insert into public.product_images(product_id) values(target);
    insert into public.catalog_products(id, name, category_id, sort_order, archived, creation_key, subtitle, details) values(target, product_name, category, position, is_archived, request_key, subtitle_value, details_value) returning * into new_row;
  else
    select * into current_price from public.product_prices where id = target for update;
    select * into old_row from public.catalog_products where id = target for update;
    if not found then raise exception 'UNKNOWN_PRODUCT'; end if;
    if old_row.version is distinct from (input->>'expected_version')::integer or current_price.version is distinct from (input->>'expected_price_version')::integer then raise exception 'CATALOG_CONFLICT'; end if;
    if current_price.price <> new_price then
      update public.product_prices set price = new_price, version = version + 1, updated_at = now() where id = target;
      insert into public.price_history(product_id, old_price, new_price, changed_by) values(target, current_price.price, new_price, auth.uid());
    end if;
    update public.catalog_products set subtitle = subtitle_value, details = details_value, name = product_name, category_id = category, sort_order = position, archived = is_archived, version = version + 1 where id = target returning * into new_row;
  end if;
  insert into private.catalog_history(entity, entity_id, before_value, after_value, changed_by)
    values('product', new_row.id, case when old_row.id is null then null else to_jsonb(old_row) end, to_jsonb(new_row), auth.uid());
  return new_row.id;
end;
$$;
revoke all on function public.save_catalog_product(jsonb) from public, anon, authenticated;
grant execute on function public.save_catalog_product(jsonb) to authenticated;


-- 06-category-images.sql
-- Ejecutar una vez en SQL Editor después de los scripts 01 a 03.
-- No modifica precios ni reemplaza las imágenes actuales.

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


-- 03-admin.sql
-- Primero crear este usuario en Authentication > Users > Add user.
-- La contraseña se define en Supabase, nunca se pega en este archivo.
do $$
declare admin_id uuid;
begin
  select id into admin_id from auth.users where lower(email) = 'gaston3x@gmail.com';
  if admin_id is null then
    raise exception 'Primero creá gaston3x@gmail.com en Authentication > Users';
  end if;
  insert into private.price_admins (user_id) values (admin_id) on conflict do nothing;
end;
$$;

commit;

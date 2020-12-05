CREATE TABLE IF NOT EXISTS "products" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT UNIQUE,
  "description" TEXT,
  "price" INT,
  "thumbnail" TEXT,
  "image" TEXT,
 
  "create_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "stock" INTEGER
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT,
  "create_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "options" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT
);

CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT UNIQUE,
  "password" TEXT,
  "user_is_teacher" BOOLEAN,
  "create_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "user_products" (    --Cart
  "id" INT,
  "user_id" INT,
  "product_id" INT,
  "qty" INT
);

CREATE TABLE IF NOT EXISTS "products_orders" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INT,
  "order_id" INT,
  "qty" INT
);

CREATE TABLE IF NOT EXISTS "product_options" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INTEGER,
  "option_id" INTEGER
);

CREATE TABLE IF NOT EXISTS "product_categories" (
  "id" SERIAL PRIMARY KEY,
  "product_id" INT,
  "category_id" INT
);

CREATE TABLE IF NOT EXISTS "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT UNIQUE,
  "thumbnail" TEXT
);


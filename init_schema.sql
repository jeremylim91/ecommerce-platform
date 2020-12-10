CREATE TABLE "user_products_cart" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT,
  "product_id" INT,
  "order_id" INT,
  "qty" INT,
  "inside_cart" BOOLEAN DEFAULT TRUE,
  "order_placed" BOOLEAN DEFAULT FALSE,
  "order_status_id" INT DEFAULT 1,
  "create_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "order_status" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT,
  "remarks" TEXT
);


-- CREATE TABLE IF NOT EXISTS "product_orders" (
--   "id" SERIAL PRIMARY KEY,
--   "product_id" INT,
--   "order_id" INT,
--   "qty" INT
-- );

CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "email" TEXT UNIQUE,
  "password" TEXT,
  "is_teacher" BOOLEAN,
  "create_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "orders" (
  "id" SERIAL PRIMARY KEY,
  "user_id" INT,
  "proof_of_payment" TEXT,
  "create_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "products" (
  "id" SERIAL PRIMARY KEY,
  "title" TEXT,
  "description" TEXT,
  "price" INT,
  "thumbnail" TEXT,
  "image" TEXT,
  "category_id" INT,
  "option_id" INT,
  "create_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "options" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT
);

-- CREATE TABLE IF NOT EXISTS "product_categories" (
--   "id" SERIAL PRIMARY KEY,
--   "product_id" INT,
--   "category_id" INT
-- );

CREATE TABLE IF NOT EXISTS "categories" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT UNIQUE,
  "thumbnail" TEXT
);

-- CREATE TABLE IF NOT EXISTS "product_options_inventory" (
--   "id" SERIAL PRIMARY KEY,
--   "product_id" INTEGER,
--   "option_id" INT,
--   "stock" INT
-- );


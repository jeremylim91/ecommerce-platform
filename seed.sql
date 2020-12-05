INSERT INTO products ( title, description, price, thumbnail, image, stock)
VALUES('Boys school uniform', 'Shirt and shorts', 10, 'Thumbnail- boys uniform', 'image- boys uniform', 30);

INSERT INTO products ( title, description, price, thumbnail, image, stock)
VALUES('Girls school uniform', 'Dress', 10, 'Thumbnail- girls uniform', 'image- girls uniform', 30);

INSERT INTO products ( title, description, price, thumbnail, image, stock)
VALUES('K1 enrichment book', 'For drawing', 5, 'Thumbnail- k1 enrichment book', 'image- k1 enrichment book', 50);

INSERT INTO products ( title, description, price, thumbnail, image, stock)
VALUES('Maplebear face shield', 'Face shield to keep your child safe', 11, 'Thumbnail-MP face shield', 'image- MP face shield', 100);

INSERT INTO options (name)
VALUES('Small');

INSERT INTO options (name)
VALUES('Medium');

INSERT INTO options (name)
VALUES('Large');

INSERT INTO product_options(product_id, option_id)
VALUES (1,1); --boys uniform, size s
INSERT INTO product_options(product_id, option_id)
VALUES (1,2); --boys uniform, size M
INSERT INTO product_options(product_id, option_id)
VALUES (1,3);--boys uniform, size L
INSERT INTO product_options(product_id, option_id)
VALUES (2,1); --girls uniform, size s
INSERT INTO product_options(product_id, option_id)
VALUES (2,2); --girls uniform, size M
INSERT INTO product_options(product_id, option_id)
VALUES (2,3);--girls uniform, size L

INSERT INTO categories (name, thumbnail) 
VALUES('Garments', 'thumbnail-garments');
INSERT INTO categories (name, thumbnail) 
VALUES('Health', 'thumbnail-health');
INSERT INTO categories (name, thumbnail) 
VALUES('Books', 'thumbnail-books');

INSERT INTO product_categories(product_id, category_id)
VALUES (1,1); --boys uniform, category: garments
INSERT INTO product_categories(product_id, category_id)
VALUES (2,1); --girls uniform, category: garments
INSERT INTO product_categories(product_id, category_id)
VALUES (3,3);--k1 enrichment book, category:books
INSERT INTO product_categories(product_id, category_id)
VALUES (4,2); --Maplebear face shield, category: health


INSERT INTO users (email, password, user_is_teacher)
VALUES ('tester1@tester.com', 'password1', TRUE);
INSERT INTO users (email, password, user_is_teacher)
VALUES ('tester2@tester.com', 'password1', FALSE);
INSERT INTO users (email, password, user_is_teacher)
VALUES ('tester3@tester.com', 'password1', FALSE);
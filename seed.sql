INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Boys school uniform', 'Shirt and shorts', 10, 'Thumbnail- boys uniform', 'image- boys uniform', 1, 1);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Boys school uniform', 'Shirt and shorts', 10, 'Thumbnail- boys uniform', 'image- boys uniform', 1, 2);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Boys school uniform', 'Shirt and shorts', 10, 'Thumbnail- boys uniform', 'image- boys uniform', 1, 3);

INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Girls school uniform', 'Dress', 10, 'Thumbnail- girls uniform', 'image- girls uniform', 1, 1);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Girls school uniform', 'Dress', 10, 'Thumbnail- girls uniform', 'image- girls uniform', 1, 2);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Girls school uniform', 'Dress', 10, 'Thumbnail- girls uniform', 'image- girls uniform', 1, 3);

INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('K1 enrichment book', 'For drawing', 5, 'Thumbnail- k1 enrichment book', 'image- k1 enrichment book', 3,3 );

INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Maplebear face shield', 'Face shield to keep your child safe', 11, 'Thumbnail-MP face shield', 'image- MP face shield', 2,2);

INSERT INTO options (name)
VALUES('Small');

INSERT INTO options (name)
VALUES('Medium');

INSERT INTO options (name)
VALUES('Large');

-- INSERT INTO product_options_inventory(product_id, option_id)
-- VALUES (1,1); --boys uniform, size s
-- INSERT INTO product_options_inventory(product_id, option_id)
-- VALUES (1,2); --boys uniform, size M
-- INSERT INTO product_options_inventory(product_id, option_id)
-- VALUES (1,3);--boys uniform, size L
-- INSERT INTO product_options_inventory(product_id, option_id)
-- VALUES (2,1); --girls uniform, size s
-- INSERT INTO product_options_inventory(product_id, option_id)
-- VALUES (2,2); --girls uniform, size M
-- INSERT INTO product_options_inventory(product_id, option_id)
-- VALUES (2,3);--girls uniform, size L

INSERT INTO categories (name, thumbnail) 
VALUES('Garments', 'thumbnail-garments');
INSERT INTO categories (name, thumbnail) 
VALUES('Health', 'thumbnail-health');
INSERT INTO categories (name, thumbnail) 
VALUES('Books', 'thumbnail-books');

-- INSERT INTO product_categories(product_id, category_id)
-- VALUES (1,1); --boys uniform, category: garments
-- INSERT INTO product_categories(product_id, category_id)
-- VALUES (2,1); --girls uniform, category: garments
-- INSERT INTO product_categories(product_id, category_id)
-- VALUES (3,3);--k1 enrichment book, category:books
-- INSERT INTO product_categories(product_id, category_id)
-- VALUES (4,2); --Maplebear face shield, category: health


INSERT INTO users (email, password, is_teacher)
VALUES ('tester1@tester.com', 'bc547750b92797f955b36112cc9bdd5cddf7d0862151d03a167ada8995aa24a9ad24610b36a68bc02da24141ee51670aea13ed6469099a4453f335cb239db5da', TRUE);
INSERT INTO users (email, password, is_teacher)
VALUES ('tester2@tester.com', 'bc547750b92797f955b36112cc9bdd5cddf7d0862151d03a167ada8995aa24a9ad24610b36a68bc02da24141ee51670aea13ed6469099a4453f335cb239db5da', FALSE);
INSERT INTO users (email, password, is_teacher)
VALUES ('tester3@tester.com', 'bc547750b92797f955b36112cc9bdd5cddf7d0862151d03a167ada8995aa24a9ad24610b36a68bc02da24141ee51670aea13ed6469099a4453f335cb239db5da', FALSE);
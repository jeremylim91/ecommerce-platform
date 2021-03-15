INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Boys school uniform', 'Shirt and shorts', 10, 'maple_bear_uniform_1578371603_0e102367_progressive', 'maplebear-logo', 1, 1);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Boys school uniform', 'Shirt and shorts', 10, 'maple_bear_uniform_1578371603_0e102367_progressive', 'maplebear-logo', 1, 2);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Boys school uniform', 'Shirt and shorts', 10, 'maple_bear_uniform_1578371603_0e102367_progressive', 'maplebear-logo', 1, 3);

INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Girls school uniform', 'Dress', 10, 'maple_bear_uniform_1578371603_0e102367_progressive', 'maplebear-logo', 1, 1);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Girls school uniform', 'Dress', 10, 'maple_bear_uniform_1578371603_0e102367_progressive', 'maplebear-logo', 1, 2);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Girls school uniform', 'Dress', 10, 'maple_bear_uniform_1578371603_0e102367_progressive', 'maplebear-logo', 1, 3);

INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('K1 enrichment book', 'For drawing', 5, 'k1-enrichmentbooks-18eabeeb0aca9fb41446fd47795dfc7b', 'k1-enrichmentbooks-1', 3,3 );
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Cinderella', 'A Disney Classic. Spend some quality time with your child by reading to them.', 26, 'cinderella_thumbnail', 'maplebear-logo', 3,3 );
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Pocahontas', 'A Disney Classic. Spend some quality time with your child by reading to them.', 26, 'pocahontas', 'maplebear-logo', 3,3 );
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Sleepy Hollow', 'A book more suitable for the Halloween season maybe? Send some chills through their spine with this one.', 26, 'sleepyHollow_thumbnail', 'maplebear-logo', 3,3 );




INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Maplebear face shield', 'Face shield to keep your child safe', 11, 'maplebear_faceshield2', 'maplebear-logo', 2,2);

INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Kids Cap', 'Keep your child safe from the sun with this quick-dry cap!', 25, 'maplebear_cap_1589729703_8c3db2f8_progressive', 'maplebear-logo', 1,1);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Kids Cap', 'Keep your child safe from the sun with this quick-dry cap!', 25, 'maplebear_cap_1589729703_8c3db2f8_progressive', 'maplebear-logo', 1,2);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Kids Cap', 'Keep your child safe from the sun with this quick-dry cap!', 25, 'maplebear_cap_1589729703_8c3db2f8_progressive', 'maplebear-logo', 1,3);

-- Toys category
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Star Wars- Toy Yoda', 'Buy me... you must. Happy, your child will be!', 45, 'yoda_thumbnail', 'yoda_img', 4,3);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Lego Classic- 1500 pieces', 'Spur your child''s creativity with Lego! Bring imagination into reality with a variety of colors and blocks. Not recommended for children under 2 years of age.', 240, 'lego_thumbnail', 'lego_others', 4,3);

-- Stationary category
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Paint brushes', 'Let your child color your life (but hopefully not walls ;)) with this set of brushes! They come in varous sizes to meet all your painting needs', 18, 'paintbrushes_thumbnail', 'maplebear-logo', 5,3);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Art apron', 'Save on that extra time washing clothes by keeping their clothes free of paint.', 8, 'apron_thumbnail', 'maplebear-logo', 5,1);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Art apron', 'Save on that extra time washing clothes by keeping their clothes free of paint.', 8, 'apron_thumbnail', 'maplebear-logo', 5,2);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Art apron', 'Save on that extra time washing clothes by keeping their clothes free of paint.', 8, 'apron_thumbnail', 'maplebear-logo', 5,3);

-- Parties and Special Events category
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Party hats', 'Parties and hats go like peanut butter and jelly', 6, 'partyHats_thumbnail', 'partyHats_img', 6,1);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Party hats', 'Parties and hats go like peanut butter and jelly', 6, 'partyHats_thumbnail', 'partyHats_img', 6,2);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Party hats', 'Parties and hats go like peanut butter and jelly', 6, 'partyHats_thumbnail', 'partyHats_img', 6,3);

INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Party poppers', 'Need a party to go out with a bang? These will do it.', 6, 'partyPoppers_thumbnail', 'maplebear-logo', 6,4);
INSERT INTO products ( title, description, price, thumbnail, image, category_id, option_id)
VALUES('Party poppers', 'Need a party to go out with a bang? These will do it.', 6, 'partyPoppers_thumbnail', 'maplebear-logo', 6,5);



-- Options
INSERT INTO options (name)
VALUES('Small');

INSERT INTO options (name)
VALUES('Medium');

INSERT INTO options (name)
VALUES('Large');

INSERT INTO options (name)
VALUES('Red');
INSERT INTO options (name)
VALUES('Green');
INSERT INTO options (name)
VALUES('Blue');

INSERT INTO order_status (title, remarks)
VALUES('Added to Cart', 'Customer has added item to cart, but has not checked-out the item');
INSERT INTO order_status (title, remarks)
VALUES('Pending Payment', 'Customer has checked-out the item but has yet to make payment');
INSERT INTO order_status (title, remarks)
VALUES('Pending Ack', 'Customer has paid, awaiting administrator''s acknowledgement of payment');
INSERT INTO order_status (title, remarks)
VALUES('Completed', 'Payment has been ack + item has been delivered');
INSERT INTO order_status (title, remarks)
VALUES('Deleted', 'This order has been deleted');



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
VALUES('Garments', 'thumbnail-garments.png');
INSERT INTO categories (name, thumbnail) 
VALUES('Health', 'thumbnail-health.png');
INSERT INTO categories (name, thumbnail) 
VALUES('Books', 'thumbnail-books.png');
INSERT INTO categories (name, thumbnail) 
VALUES('Toys', 'thumbnail-toys.png');
INSERT INTO categories (name, thumbnail) 
VALUES('Stationary', 'thumbnail-stationary.png');
INSERT INTO categories (name, thumbnail) 
VALUES('Parties and Special Events', 'thumbnail-parties.png');

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

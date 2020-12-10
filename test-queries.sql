-- SELECT * 
-- FROM products
-- INNER JOIN user_products_cart on products.id= user_products_cart.product_id

-- INNER JOIN orders on user_products_cart.order_id= orders.id;

SELECT orders.id AS orderId, orders.user_id, orders.create_at, orders.proof_of_payment, user_products_cart.id AS user_products_cartId, user_products_cart.user_id, user_products_cart.product_id, user_products_cart.order_id, user_products_cart.qty, user_products_cart.inside_cart, user_products_cart.order_placed, user_products_cart.order_status, products.id AS productId, products.title, products.description, products.price, products.thumbnail, products.image, products.category_id, products.option_id, options.id AS optionId, options.name AS optionName

FROM orders

INNER JOIN user_products_cart on orders.id= user_products_cart.product_id

INNER JOIN products on user_products_cart.order_id= products.id

INNER JOIN options on products.option_id= options.id

WHERE order_placed= true;


UPDATE products
SET 
thumbnail='f33dafjnsfkjhasf'
WHERE 
title='Boys school uniform';

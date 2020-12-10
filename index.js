// import express
import express from 'express';
import pg from 'pg';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import jsSHA from 'jssha';
import multer from 'multer';

// Initialise the DB connection
const { Pool } = pg;
// config the connection
const pgConnectionConfig = {
  name: 'jeremylim',
  host: 'localhost',
  database: 'ecommerce_platform',
  port: 5432,
};
const pool = new Pool(pgConnectionConfig);

// initialise express
const app = express();
const PORT = 3004;

// initialise multer: set the name of the multer upload directory
const multerUpload = multer({ dest: 'uploads/' });

// =========middleware configs===================

app.set('view engine', 'ejs');
// config to allow use of external CSS stylesheets
app.use(express.static('public'));
// config to allow file uploads from the 'uploads' folder
app.use(express.static('uploads'));
// config to accept request form data
app.use(express.urlencoded({ extended: false }));
// config to allow use of method override with POST having ?_method=PUT
app.use(methodOverride('_method'));
// config to allow cookie parser
app.use(cookieParser());

function checkQueryErr(queryError, res) {
  if (queryError) {
    console.log(`method error:${queryError} `);
    res.status(500).send('Bad request');
  }
}
//= ===========functions for middlware===============

const { SALT } = process.env;

const getHash = (input) => {
  // create new SHA object
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  // create an unhashed cookie string based on user ID and salt
  const unhashedString = `${input}-${SALT}`;

  // generate a hashed cookie string using SHA object
  shaObj.update(unhashedString);

  return shaObj.getHash('HEX');
};

const checkAuth = (req, res, next) => {
  console.log('checking auth');
  // set the default value
  req.isUserLoggedIn = false;

  // check to see if the cookies you need exists
  if (req.cookies.loggedIn && req.cookies.userId) {
    // get the hashed value that should be inside the cookie
    const hash = getHash(req.cookies.userId);

    // test the value of the cookie
    if (req.cookies.loggedIn === hash) {
      req.isUserLoggedIn = true;
    }
  }
  // prevent user from accessing page unless logged in
  if (req.isUserLoggedIn === false) {
    res.status(403).send('sorry, please login to proceed');
    return;
  }
  next();
};
// ===========specify routes and their reqs/res==========

// Route description: Home or main page
app.get('/', checkAuth, (req, res) => {
  if (req.isUserLoggedIn === false) {
    res.status(403).send('sorry, please login to proceed');
    return;
  }
  res.render('home');
});

// Route description: user login page
app.get('/login', (req, res) => {
  console.log('received request to login');
  res.render('login.ejs');
});
app.post('/login', (req, res) => {
  console.log('received post request to login');
  // get the values from the form
  const { fUsername, fPassword } = req.body;
  // use fUsername to query the database for the hashed password
  const queryForPassword = 'SELECT * FROM users WHERE email=$1';
  pool
    .query(queryForPassword, [fUsername])
    .then((result) => {
      const user = result.rows[0];
      // hash user.password and compare it with userPassword:
      // initialise SHA object
      const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
      // input the password from the request to the SHA object
      shaObj.update(fPassword);
      // get the hashed value as output from the SHA object
      const hashedPassword = shaObj.getHash('HEX');

      /* If the user's hashed password in the database does not
       match the hashed input password, login fails */
      if (user.password !== hashedPassword) {
      // the error for incorrect email and incorrect password are the same for security reasons.
      // This is to prevent detection of whether a user has an account for a given service.
        res.status(403).send('login failed!');
      }
      // the user's password matches the hashed password in the DB
      else {
        // create new SHA object
        const hashedCookieShaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
        // create an unhashed cookie string based on user ID and salt
        const unhashedCookieString = `${user.id}-${SALT}`;
        // generate a hashed cookie string using SHA object
        hashedCookieShaObj.update(unhashedCookieString);
        const hashedCookieString = hashedCookieShaObj.getHash('HEX');
        // set the loggedInHash and userId cookies in the response
        res.cookie('loggedIn', hashedCookieString);
        res.cookie('userId', user.id);
        // end the request-response cycle

        // redirect to homepage
        res.redirect('/');
      }
    })
    .catch((error) => console.log(error.stack));
});

// Route description: user signup
app.get('/signup', (req, res) => {
  console.log('received get request to signup');
  res.render('signup.ejs');
});
app.post('/signup', (req, res) => {
  console.log('received post request to signup');
  // convert fIsATeacher into a boolean;
  let { fIsATeacher } = req.body;
  if (fIsATeacher === 'true') {
    fIsATeacher = true;
    console.log('signed-up as a teacher');
  } else {
    fIsATeacher = false;
    console.log('signed-up as a non-teacher');
  }
  // initialise the SHA object
  const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
  // input the password from the request to the SHA object
  shaObj.update(req.body.fPassword);
  // get the hashed password as output from the SHA object
  const hashedPassword = shaObj.getHash('HEX');

  // set the sql query that stores the username and hashed password in the db;
  const insertUserCredentials = 'INSERT INTO users (email, password, is_teacher) VALUES ($1, $2, $3) RETURNING *';
  console.log(`sql query is: ${insertUserCredentials}`);
  // execute the query
  pool
    .query(insertUserCredentials, [req.body.fUsername, hashedPassword, fIsATeacher])
    .then((result) => {
      console.log(result.rows);
      // insert modal here to say acct created successfully
      res.redirect('/login');
    })
    .catch((error) => console.log(error.stack));
});

// Route description: view categories
app.get('/categories', checkAuth, (req, res) => {
  const queryForCategories = 'SELECT * FROM categories';
  pool.query(queryForCategories, (err, result) => {
    checkQueryErr(err, res);
    console.table(result.rows);
    const dataToDisplay = result.rows;
    res.render('categories', { dataToDisplay });
  });
});

// Route description: view products in a specific category
app.get('/categories/:categoryName', checkAuth, (req, res) => {
  // display all the products in a given category
  const { categoryName } = req.params;
  console.log('categoryName is:');
  console.log(categoryName);
  // get the category.id that fits this category.name
  const queryCategoryIdUsingCategoryName = 'SELECT * FROM categories WHERE name= $1';
  pool
    .query(queryCategoryIdUsingCategoryName, [categoryName])
    .then((result) => {
      const categoryId = result.rows[0].id;
      console.log(categoryId);

      // const queryForProductsWithCatX = `SELECT * FROM products
      // INNER JOIN product_categories
      // ON products.id= product_categories.product_id
      // WHERE product_categories.category_id=$1`;

      const queryForProductsWithCatX = 'SELECT * FROM categories INNER JOIN products ON categories.id= products.category_id WHERE products.category_id=$1';

      return pool.query(queryForProductsWithCatX, [categoryId]);
    })
    .then((result) => {
      let dataToDisplay = {};

      const arrayOfProducts = result.rows;
      const arrayOfUniqueProducts = [];
      /* look through the array of products and filter out unique
      products by their title (unsure of how it works) */
      arrayOfProducts.filter((value, index, self) => self.findIndex((v) => v.title === value.title) === index).map((ele) => {
        arrayOfUniqueProducts.push(ele);
      });
      dataToDisplay = arrayOfUniqueProducts;

      console.log('dataToDisplay is:');
      console.log(dataToDisplay);

      res.render('categories-product', { dataToDisplay });
    })
    .catch((error) => console.log(error.stack));
});

// Route description: specific orders (view and submit )
app.get('/products/:productId', checkAuth, (req, res) => {
  // set an object that holds all the data that will be renedered eventually
  const dataToDisplay = {};
  // get data from req.params
  const { productId } = req.params;
  const queryProductById = 'SELECT * FROM products WHERE id=$1';
  pool
    .query(queryProductById, [productId])
    .then((result) => {
      const productDetails = result.rows[0];
      console.log('product details:');
      console.log(productDetails);
      dataToDisplay.productDetails = productDetails;
      console.log('data to display:');
      console.log(dataToDisplay);

      // set the sql query that gets the list of options that are relevant for this product
      // const queryProductXOptions = `SELECT * FROM options
      // INNER JOIN product_options_inventory
      // ON options.id=product_options_inventory.option_id
      // WHERE product_options_inventory.product_id=$1`;
      // return pool.query(queryProductXOptions, [productId]);
      const queryProductXOptions = `SELECT * FROM options
      INNER JOIN products
      ON options.id=products.option_id
      WHERE products.title=$1`;
      return pool.query(queryProductXOptions, [productDetails.title]);
    })
    .then((result) => {
      const productOptions = result.rows;// multiple results expected, so don't specify row
      dataToDisplay.productOptions = productOptions;
    }).then(() => {
      res.render('products-productId', dataToDisplay);
      //* ***=====  next step: add the options into ejs as a drop down list, then create post form*/
    })
    .catch((error) => console.log(error.stack));
});
app.post('/products/:productId', checkAuth, (req, res) => {
  const { fProductOptions, fProductTitle } = req.body;
  console.log('option id:');
  console.log(fProductOptions);
  console.log('fProductTitle:');
  console.log(fProductTitle);
  // get the user id
  const { userId } = req.cookies;

  // set the query that looks for products.id based on the options & title of the user-selected item
  const queryForProduct = `SELECT * FROM products WHERE title='${fProductTitle}' AND option_id=${fProductOptions}`;
  // execute the query
  pool.query(queryForProduct)
    .then((result) => {
      console.table(result.rows);
      // set the query to insert this product into the cart table
      const insertProductIntoCart = 'INSERT INTO user_products_cart (user_id, product_id) VALUES ($1, $2)';
      return pool.query(insertProductIntoCart, [userId, result.rows[0].id]);
    }).then(() => {
      res.send('added to cart');
    })
    .catch((error) => console.log(error.stack));
});

// Route description: view all listings and delete if nec
app.get('/manageListings', checkAuth, (req, res) => {
// dislay all listings
  const queryToDisplayProducts = 'SELECT * FROM products';
  pool
    .query(queryToDisplayProducts)
    .then((result) => {
      const dataToDisplay = result.rows;

      res.render('manageListings', { dataToDisplay });
    })
    .catch((error) => console.log(`Error:${error.stack}`));
});

// Route description:add new listings
app.get('/addlisting', checkAuth, (req, res) => {
  // set an object variable that will hold the content to display
  const dataToDisplay = {};

  // query for all available options
  const queryForOptions = 'SELECT * FROM options';
  // execute the query
  pool
    .query(queryForOptions)
    .then((result) => {
      const options = result.rows;
      dataToDisplay.options = options;

      // query for all avaialble categories categories
      const queryForCategories = 'SELECT * FROM categories';
      return pool.query(queryForCategories);
    })
    .then((result) => {
      const categories = result.rows;
      dataToDisplay.categories = categories;
      console.log('final dataToDisplay is:');
      console.log(dataToDisplay);
      // get the ejs form
      res.render('addlisting', dataToDisplay);
    })
    .catch((error) => console.log(error.stack));
});
app.post('/addlisting', checkAuth, multerUpload.fields([{ name: 'fThumbnail', maxCount: 1 }, { name: 'fImage', maxCount: 1 }]), (req, res) => {
  // store the form data as variables
  const {
    fTitle, fPrice, fDescription, fCategory,
  } = req.body;

  const fThumbnail = req.files.fThumbnail[0].filename;

  const fImage = req.files.fImage[0].filename;
  let { fOptions } = req.body;
  console.log('fCategory is: ');
  console.log(fCategory);

  // ensure that the form's checkbox produces an array even if only one checkbox was used
  if (!Array.isArray(fOptions)) {
    fOptions = [fOptions];
  }
  // update products with the listing details (new entry per option)
  fOptions.forEach((element, index) => {
    // set the query that inserts the data into products table
    const insertIntoProducts = 'INSERT INTO products (title, description, price, thumbnail, image, category_id, option_id) VALUES ($1, $2, $3,$4, $5, $6, $7) RETURNING *';
    const insertValues = [fTitle, fDescription, fPrice, fThumbnail, fImage, fCategory, fOptions[index]];

    console.log('insertValues is:');
    console.log(insertValues);
    // execute the query
    pool.query(insertIntoProducts, insertValues, (err, result) => {
      if (err) {
        console.log(`Err: ${err}`);
      }
      console.table(result.rows[0]);
    });
  });
  res.redirect('/categories');
});

// Route description: view items in my cart
app.get('/mycart', (req, res) => {
// get the user's id
  const { userId } = req.cookies;
  // set the query to check the cart for all products relating to this user
  const queryForCartItems = `SELECT products.id AS productsId, products.title, products.price, products.thumbnail, products.option_id, user_products_cart.id AS user_products_cartId, user_products_cart.product_id, user_products_cart.order_id, user_products_cart.qty, user_products_cart.inside_cart, user_products_cart.order_placed, user_products_cart.order_status_id
  FROM PRODUCTS
  INNER JOIN user_products_cart 
  ON products.id= user_products_cart.product_id
  WHERE user_id=${userId} AND inside_cart=TRUE AND order_placed=FALSE`;

  // execute the query
  pool.query(queryForCartItems)
    .then((result) => {
      const cartItems = result.rows;
      console.table(cartItems);
      const dataToDisplay = { cartItems };
      res.render('mycart', dataToDisplay);
    })
    .catch((error) => console.log(error.stack));
});
app.post('/mycart', (req, res) => {
  console.log(' received post request for /mycart');
  const { fCartItems } = req.body;
  console.log('fCartItems are:');
  console.log(fCartItems);

  res.redirect('/mycart/review');
});

// Route description: review items in cart
app.post('/mycart/review', (req, res) => {
  console.log(' received post request for /mycart/review');
  let { fCartItems } = req.body;
  // if the user did not check any items, tell them to do so
  if (fCartItems === undefined) {
    res.send('Please choose at least one item to proceed');
    return;
  }
  // ensure that fCartItems yields an array even if it's only one checkbox
  if (Array.isArray(fCartItems) === false) {
    fCartItems = [fCartItems];
  }
  console.log(`fcartItems: ${fCartItems}`);
  // set a variable for the total price of items in the cart
  const totalPrice = 0;

  // set an object variable to hold the data to display
  const dataToDisplay = { totalPrice };
  dataToDisplay.cartItems = [];

  // set the sql query that retrieves the items in fCartItems
  fCartItems.forEach((element, index) => {
    const queryForItems = `SELECT * FROM products WHERE id= ${element}`;
    pool.query(queryForItems, (err, result) => {
      if (err) {
        console.log(err);
      }
      dataToDisplay.cartItems.push(result.rows[0]);
      dataToDisplay.totalPrice += result.rows[0].price;
      console.log(`index= ${index}`);
      if (fCartItems.length - 1 === index) {
        console.log('data to display is:');
        console.log(dataToDisplay);
        res.render('mycart-review', dataToDisplay);
      }
    });
  });
});
app.post('/mycart/review/pay', (req, res) => {
  console.log('received post request to mycart/review/pay');
  // get the order number
  let { fCartItems } = req.body;
  if (Array.isArray(fCartItems) === false) {
    fCartItems = [fCartItems];
  }
  console.log(fCartItems);
  // set a variable to hold the date in the forEach loop below:
  const details = [];
  const userOrderData = { details };
  // add a new order into the orders table
  const insertNewOrder = 'INSERT INTO orders (user_id) VALUES ($1) RETURNING *';
  pool
    .query(insertNewOrder, [req.cookies.userId])
    .then((result) => {
      const orderId = result.rows[0].id;
      console.log(orderId);
      // set the query to update user_products that the respective product IDs
      fCartItems.forEach((element) => {
        const createOrderAndUpdateOrderStatus = `UPDATE user_products_cart
        SET
        order_id= ${orderId},
        order_placed= ${true},
        order_status_id= 2,
        inside_cart= ${false}
        
        WHERE 
        user_id=  ${req.cookies.userId} AND
        inside_cart= true AND
        product_id = ${element}
        RETURNING * 
        `;
        pool.query(createOrderAndUpdateOrderStatus, (err, createOrderResult) => {
          if (err) { console.log(err); }
          userOrderData.details.push(createOrderResult.rows[0]);
          console.log('userOrderData is:');
          console.log(userOrderData);
        });
      });
      console.table(userOrderData);
      res.redirect(`/payment/${orderId}`);
    })
    .catch((error) => console.log(error.stack));
  // res.send('Please proceed to payment');
});

// Route description: allow user to upload paynow details
app.get('/payment/:orderId', (req, res) => {
  const { orderId } = req.params;
  console.log('received get request for payment/:orderId');
  console.log(`order id is: ${orderId}`);

  // authenticate that the current user matches the order in the orders table
  // Step1: set the query to call out details matching the orderId
  const orderDetails = `SELECT * FROM orders WHERE id=${orderId}`;
  // step 2: execute the query
  pool.query(orderDetails)
    .then((result) => {
      const userIdAttachedToOrder = result.rows[0].user_id;
      console.log('userIdAttachedToOrder is:');
      console.log(userIdAttachedToOrder);
      // const userIdFromBrowser = Number(req.cookies.userId);
      let { userId: userIdFromCookies } = req.cookies;
      userIdFromCookies = Number(userIdFromCookies);
      console.log('userId from cookies is:');
      console.log(userIdFromCookies);
      // step3: compare the details with req.cookies.userId
      if (userIdAttachedToOrder === userIdFromCookies) {
        console.log('credentials are valid to access this order');
        // allow the user to upload photos of his/her paynow transaction
        res.render('payment-orderid', { orderId });
      } else {
        /* step4: if not the same, send message that there seems to be something
      wrong with the order: User not match order ID */
        res.send('Sorry, it appears that there has been an error: user Id does not match order Id');
      }
    })
    .catch((error) => (error.stack));
});

app.post('/payment/:orderId', multerUpload.single('fPaymentDetails'), (req, res) => {
  const { orderId } = req.params;
  console.log(orderId);
  // set the update query to update the appropriate order id with the payment info
  const updateOrderWithPhoto = `UPDATE orders
  SET 
  proof_of_payment = '${req.file.filename}'
  WHERE 
  id=${orderId}
  RETURNING *
  `;
  pool.query(updateOrderWithPhoto, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(result.rows);
    res.send('Payment details successfully updated');
  });
});
// Route description: view all orders
app.get('/manageOrders', (req, res) => {
// limit this page to only users that  is_teacher===true
// step1: get the current user's id from the cookies
  const { userId: currentUserId } = req.cookies;
  console.log(currentUserId);
  // step 2: use the current user's id to query the databsae
  const queryForUser = `SELECT * FROM users WHERE id=${currentUserId}`;
  pool
    .query(queryForUser)
    .then((result) => {
      /* step 3: if the user has is_teacher set to be false, send message to say that
      they don't have access to this page */
      console.log(result.rows[0].is_teacher);
      if (result.rows[0].is_teacher === false) {
        res.send('sorry, you don\'t have permissions to view this page');
        return;
      }
      // query into database to retrieve all orders that are active
      const getAllActiveOrders = `SELECT orders.id AS orderId, orders.user_id, orders.create_at, orders.proof_of_payment, user_products_cart.id AS user_products_cartId, user_products_cart.user_id, user_products_cart.product_id, user_products_cart.order_id, user_products_cart.qty, user_products_cart.inside_cart, user_products_cart.order_placed, user_products_cart.order_status_id, products.id AS productId, products.title, products.description, products.price, products.thumbnail, products.image, products.category_id, products.option_id, options.id AS optionId, options.name AS optionName
        FROM orders

        INNER JOIN user_products_cart on orders.id= user_products_cart.product_id

        INNER JOIN products on user_products_cart.order_id= products.id

        INNER JOIN options on products.option_id= options.id

        WHERE order_placed= true`;
      return pool.query(getAllActiveOrders);
    })
    .then((result) => {
      const dataToDisplay = result.rows;
      res.render('manageorders', { dataToDisplay });
    })
    .catch((err) => console.log(err.stack));
});
// Route description: acknowledge payment

app.post('/manageorder/:orderId/paid', (req, res) => {
  const { orderId } = req.params;
  // set the update query to update user_products.order_status_id to 4/'paid'
  const updateOrderStatus = `UPDATE user_products_cart
  SET
  order_status_id= 4,
  inside_cart='false'
  WHERE
  order_id=${orderId}
  RETURNING *
  `;
  pool
    .query(updateOrderStatus)
    .then((result) => {
      console.table(result.rows);
    })
    .catch((error) => console.log(error.stack));
});
app.listen(PORT);

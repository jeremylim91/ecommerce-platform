// import express
import express from 'express';
import pg from 'pg';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import jsSHA from 'jssha';

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

// =========middleware configs===================

app.set('view engine', 'ejs');
// config to allow use of external CSS stylesheets
app.use(express.static('public'));
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
  res.send('This is home');
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

      // If the user's hashed password in the database does not match the hashed input password, login fails
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
  const insertUserCredentials = 'INSERT INTO users (email, password, user_is_teacher) VALUES ($1, $2, $3) RETURNING *';
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
  if (req.isUserLoggedIn === false) {
    res.status(403).send('sorry, please login to proceed');
    return;
  }
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
  // prevent the user from access page if not logged in
  if (req.isUserLoggedIn === false) {
    res.status(403).send('sorry, please login to proceed');
    return;
  }
  // display all the products in a given category
  const { categoryName } = req.params;
  console.log('categoryName is:');
  console.log(categoryName);
  // get the category.id that fits this category.name
  const queryCategoryIdUsingCategoryName = 'SELECT * FROM categories WHERE name= $1';
  pool
    .query(queryCategoryIdUsingCategoryName, [categoryName])
    .then((result) => {
      console.log('then-1');
      const categoryId = result.rows[0].id;

      const queryForProductsWithCatX = `SELECT * FROM products
      INNER JOIN product_categories
      ON products.id= product_categories.product_id
      WHERE product_categories.category_id=$1`;

      return pool.query(queryForProductsWithCatX, [categoryId]);
    })
    .then((result) => {
      console.log('then-2');

      const dataToDisplay = result.rows;
      console.table(dataToDisplay);
      res.send(dataToDisplay);
    })
    .catch((error) => console.log(error.stack));
});

// add customer's product order info into orders table

// Route description: specific orders (view and submit )
app.get('/products/:productId', checkAuth, (req, res) => {
  // prevent the user from accessing page unless logged in
  if (req.isUserLoggedIn === false) {
    res.status(403).send('sorry, please login to proceed');
    return;
  }
  // set an object that holds all the data that will be renedered eventually
  const dataToDisplay = {};
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
      const queryProductXOptions = `SELECT * FROM options 
      INNER JOIN product_options 
      ON options.id=product_options.option_id 
      WHERE product_options.product_id=$1`;
      return pool.query(queryProductXOptions, [productId]);
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
  // prevent user from accessing page unless logged in
  if (req.isUserLoggedIn === false) {
    res.status(403).send('sorry, please login to proceed');
    return;
  }
  const { fProductOptions } = req.body;
  console.log('option id:');
  console.log(fProductOptions);
  const { productId } = req.params;
  // GET
  // update the cart with this product
  const queryToUpdateCart = 'INSERT INTO user_products (product_id) VALUES($1)';
  pool
    .query(queryToUpdateCart, [productId])
    .then((result) => {
      // insert modal here
      console.log('successfully added item to cart');
      res.end();
    });
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

app.get('/addlisting', checkAuth, (req, res) => {
  // get all the available options from options
  const queryForOptions = 'SELECT * FROM options';
  // execute the query
  pool
    .query(queryForOptions)
    .then((result) => {
      const options = result.rows;
      res.render('addlisting', { options });
    })
    .catch((error) => console.log(error.stack));
  // get the ejs form
});

app.listen(PORT);

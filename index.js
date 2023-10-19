const express = require('express');
const app = express();
const ejs = require('ejs');
const port = 3000;
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const session = require('express-session');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: "secret" }));
app.use(express.static('public'));
app.set('view engine', 'ejs');


function isProductInCart(cart, id) {
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            return true;
        }
    }
    return false;
}
function calculateTotal(cart, req) {
    total = 0;
    for (let i = 0; i < cart.length; i++) {
       if(cart[i].sale_price){
              total += cart[i].sale_price * cart[i].quantity;
         } else {
                total += cart[i].price * cart[i].quantity;
             }
    }
    req.session.total = total;
    return total;
}


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "node_project"
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to the database: ', error);
    } else {
        console.log('Connected to the database');
    }
});

// Home page
app.get('/', async (req, res) => {
    // Fetch products from the database
    connection.query('SELECT * FROM products', (error, results) => {
        if (error) {
            console.error('Error fetching products: ', error);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('pages/index', { products: results });
        }
    });
});

app.post('/add_to_cart', (req, res) => {
    let id = req.body.id;
    let name = req.body.name;
    let description = req.body.description;
    let price = req.body.price;
    let sale_price = req.body.sale_price;
    let quantity = req.body.quantity;
    let image = req.body.image;
    let product = { id: id, name: name, description: description, price: price, sale_price: sale_price, quantity: quantity, image: image };

    if (req.session.cart) {
        let cart = req.session.cart;

        if (!isProductInCart(cart.id)) {
            cart.push(product);
        }
    } else {
        req.session.cart = [product];
        let cart = req.session.cart;
    }

    //calculate total
    calcutaleTotal(cart, req);

    //redirect to cart
    res.redirect('/cart');
}
);

app.get('/cart', (req, res) => {
    let cart = req.session.cart;
    let total = req.session.total;
    res.render('pages/cart', { cart: cart, total: total });
}
);

app.get('/products', (req, res) => {
    res.render('pages/products');
});

app.post('/products', upload.single('image'), (req, res) => {
    let name = req.body.name;
    let description = req.body.description;
    let price = req.body.price;
    let sale_price = req.body.sale_price;
    let quantity = req.body.quantity;
    let image = req.file.filename;
    let category = req.body.category;
    let type = req.body.type;
    let rating = req.body.rating;
    let sql = `INSERT INTO products (name, description, price, sale_price, quantity, image, category, type , rating) VALUES ('${name}', '${description}', '${price}', '${sale_price}', '${quantity}', '${image}', '${category}', '${type}' ,'${rating}')`;
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Error inserting product: ', error);
            res.status(500).send('Internal Server Error');
        } else {
            res.redirect('/products');
        }
    });
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
// name	description	price	sale_price	quantity	image	category	type
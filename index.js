const express = require('express');
const app = express();
const ejs = require('ejs');
const port = 3000;
const mysql = require('mysql');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

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
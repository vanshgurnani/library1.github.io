const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'mysql123',
  database: 'lms'
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/sign.html');
});
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/home', (req, res) => {
  res.sendFile(__dirname + '/public/home.html');
});
app.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/public/contact.html');
  
});

// Handle form submissions
app.post('/', (req, res) => {
  // Extract the form data from the request body
  const { fName, lName, email, password } = req.body;

  // Validate input fields
  if (!fName || !lName || !email || !password) {
    return res.status(400).send("<script>alert('Please fill in all fields in Sign Up');window.location.href='/'</script>");
  }

  if (password.length < 6) {
    return res.status(400).send("<script>alert('Password must be at least 6 characters long');window.location.href='/'</script>");
  }



  pool.query(`CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fName VARCHAR(255) NOT NULL,
    lName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )`, (error, results, fields) => {
    if (error) {
      console.error('Error creating table: ' + error.stack);
    } else {
      console.log('Table created successfully');
    }
  });

  // Insert the form data into the MySQL database
  pool.query(
    'INSERT INTO users (fName, lName, email, password) VALUES (?, ?, ?, ?)',
    [fName, lName, email, password],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error saving data to database');
      } else {
        console.log('Data saved successfully');
        // res.send('Data saved successfully');
        return res.status(400).send("<script>alert('Signup successfully');window.location.href='/'</script>");
      }
    }
  );




});

app.post('/login',(req,res)=>{
  // Extract the form data from the request body
  const {email, password } = req.body;

  // Validate input fields
  if (!email || !password) {
    return res.status(400).send("<script>alert('Please fill in all fields in Login Form');window.location.href='/'</script>");
  }

  pool.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("<script>alert('Error checking login credentials');window.location.href='/'</script>");
      } else if (results.length === 0) {
        // No user found with these credentials
        res.status(401).send("<script>alert('Invalid email or password');window.location.href='/'</script>");
      } else {
        // User is authenticated, redirect to home page
        res.redirect('/home');
      }
    }
  );


});


app.post('/contact', (req, res) => {
  // Extract the form data from the request body
  const {name, pno,email } = req.body;

  // Validate input fields
  if (!name || !email || !pno) {
    return res.status(400).send("<script>alert('Please fill in all fields in Sign Up');window.location.href='/'</script>");
  }



  pool.query(`CREATE TABLE IF NOT EXISTS contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    pno VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
  )`, (error, results, fields) => {
    if (error) {
      console.error('Error creating table: ' + error.stack);
    } else {
      console.log('Table created successfully');
    }
  });

  // Insert the form data into the MySQL database
  pool.query(
    'INSERT INTO contacts (name, pno,email) VALUES (?, ?, ?)',
    [name, pno,email],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('Error saving data to database');
      } else {
        console.log('Data saved successfully');
        // res.send('Data saved successfully');
        // return res.status(400).send("<script>alert('Contact saved successfully in Database');</script>");
        res.sendFile(__dirname + '/public/contact.html');
      }
    }
  );


  // return res.send("<script>alert('Contact saved successfully in Database');/script>");

});



// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

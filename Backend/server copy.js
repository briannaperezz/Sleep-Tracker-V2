

require('dotenv').config();


const express = require('express')
const cors = require('cors');
const mysql = require('mysql2')


// Create an instance of express

const app = express(); // this is our bridge


/// Middleware (its a software layer that connects applications databases and OS)

// In backend development, "middleware" refers to a layer of software that sits 
// between the client request and the backend application, acting as an intermediary 
// to process and modify  before it reaches the main application logic, allowing 
// for functionalities like authentication, logging, data validation, and error handling
//  to be implemented in a centralized manner across different parts of the backend system.

app.use(express.json());
app.use(cors())


//
// // Create a connection pool to the MYSQL database

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,

});

 // Test DB Connection
 db.getConnection((err) => {
    if(err){
        console.error("Error connecting to MYSQL", err);
        return;
    }

    console.log("Connected to the MYSQL database.");
 })



 

// establish port as 3000
 const PORT = 3000;
 // starts the web server
 app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
 })

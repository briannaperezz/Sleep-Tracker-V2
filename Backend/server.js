

require('dotenv').config();


const express = require('express')
const cors = require('cors');
const mysql = require('mysql2')


// Create an instance of express

const app = express(); // this is our bridge


/// Middleware (its a software layer that connects applications databases and OS). its the whataspp

app.use(express.json());
app.use(cors())



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


//  Routes / API EndPoints



app.get("/entries", (req, res) => {
    const query = 'SELECT * FROM sleep_entries ORDER BY DATE ASC';

    db.query(query, (err, results) => {
        if(err){
            console.error("Error fetching the data: ", err);
            return res.status(500).send('Server Error');
        }
        res.json(results);
    });
});


app.post("/entries", (req, res) => {
    const {date, hours} = req.body;

    if(!date || !hours){
        return res.status(400).send("Missing date or hours.");
    }

    const query = 'INSERT INTO sleep_entries (date, hours) VALUES (?, ?)';

    db.query(query, [date, hours], (err, result) => {
        if(err){
            console.error("Error inserting data:", err);
            return res.status(500).send("Server error.");
        }

        res.json({id: result.insertId, date, hours})
    })
})


// // Delete an entry backend setup

app.delete('/entries/:id', (req, res) => {
    console.log(req, "delete!!!!");
    const {id} = req.params;
    const query = 'DELETE FROM sleep_entries WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if(err){
            console.error("Error deleting data:", err);
            return res.status(500).send("Server Error.");
        }
        if(result.affectedRows === 0){
            return res.status(404).send("Entry not found");
        }
        res.json({message: "Entry with ID ${id} deleted succesfully"})
    })
})

// Edit entry backend setup

app.put('/entries/:id', (req,res)=> {
    const {id} = req.params;
    const {DATE, hours} = req.body
    const sql = "UPDATE sleep_entries SET DATE = ?, hours = ? WHERE id = ?"
    db.query(sql, [DATE, hours, id], (err,result) => {
        if(err) return res.status(500).json({error: err.message})
        res.json({message: "Entry updated successfully", result})
    })
})


 const PORT = 3000;
 app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
 })

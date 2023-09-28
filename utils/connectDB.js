// require("dotenv").config()
const  dblink = "mongodb+srv://frankluv4christ:klassic0508@cluster0.fn1riof.mongodb.net/test"
const mongoose = require('mongoose');
//console.log(process.env.dblink)

function connectDB() {
    try{
        console.log("connection to db")
        mongoose.connect((dblink),{
            useNewUrlParser:true,
            useUnifiedTopology:true})

        
        console.log("connected")
    } catch (error) {
          console.log(error)
    }
}


// mongoose.connect('mongodb://127.0.0.1:27017/db')
module.exports = connectDB
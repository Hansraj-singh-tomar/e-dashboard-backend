const mongoose = require('mongoose');
// const dotenv = require("dotenv").config();
const dotenv = require("dotenv")

dotenv.config({path: './config.env'})

const uri = process.env.MONGODB_CONNECTION_STRING;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("connection successful");
}).catch((err) => console.log("no connection"))

// ,{
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }
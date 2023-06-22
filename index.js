const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors")

// This is our mongodb connection
require("./db/config");
const PORT = process.env.PORT || 5000;

// This is our mongoDB schema modal 
const User = require("./db/userSchema");
const Product = require("./db/productSchema")
const app = express();



app.use(express.json()); // it's control json data which we passed from ui part
app.use(cors()); // while passing data from frontend to backend we get an error this cors is solution of this problem

// Here we are getting data of user and saving it in database 
app.post("/register", async(req,res) => {
    let user = new User(req.body)
    let result = await user.save(); // yha ham password ko hide karne ke liye select() ka use nhi kar sakte hai kyonki ham save() method ka use kar rhe hai 
    // const {name, email} = result; // we can use destructure method to hide password
    // result = result.assign({}, result);  // this is an another method to create an object 
    result = result.toObject();
    delete result.password;
    res.send(result);  
})

// Here we are getting login user info and finding it from database
app.post("/login", async (req,res) => {
    // console.log(req.body);
    if(req.body.email && req.body.password){
        let user = await User.findOne(req.body).select("-password");
        if(user){
            res.send(user);
        }else{
            res.send({result: "No User Found"})    
        }
    }else{
        res.send({result: "No User Found"})    
    }
}) 

// Here we are getting product data to save in database
app.post("/add-product", async (req,res) => {
    // console.log(req.body);
    let product = new Product(req.body);
    let result  = await product.save();
    // console.log(result);
    res.send(result);
})

// Here we are sending products list
app.get("/products", async (req,res) => {
    let products = await Product.find();
    if(products.length > 0){
        res.send(products)
    }else{
        res.send({result: "No Data Found"})
    }
})

// Here we are deleting single user by ID
app.delete("/product/:id", async (req,res) => {
    // console.log(req.params.id);
    let result = await Product.deleteOne({_id: req.params.id})
    res.send(result);
})

// here we are sending single user detail
app.get("/product/:id",async (req, res) => {
    let result = await Product.findOne({_id: req.params.id})

    if(result){
        res.send(result)
    }else{
        res.send({result: "No Data Found"})
    }
})

// here we are getting updated products info and replacing it our older data 
app.put("/product/:id", async (req, res) => {
    let result = await Product.updateOne(
        {_id: req.params.id}, 
        {
            $set: req.body
        }
    )
    res.send(result)
})

// search api 
app.get('/search/:key', async (req, res) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key }},
            { company: { $regex: req.params.key }}
        ]
    });
    res.send(result);
})


app.listen(PORT, () => {
    console.log(`server is running at port no ${PORT}`);
});


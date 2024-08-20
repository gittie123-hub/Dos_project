/*Initializing all dependencies and modules*/
const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const multer = require("multer");
const path = require("path");/*Using the path we can get access to backend directory in our express app */
const cors = require("cors");
const { Console } = require("console");

app.use(express.json()); /* we use express.json so that whatever request we get from response that will automatically pass through json */
app.use(cors());/*React js project connect to express app on 4000 port*/

// Database connection with MongoDB
mongoose.connect("mongodb+srv://seeramsainath:Mongodb337@cluster1.fprulyn.mongodb.net/e-commerce")

// API Creation (app will be started on this port)
//endpoints "/express login","/all_product" after we will create API to add our product in the database)

app.get("/",(req,res)=>{
    res.send("Express App is Running");
})

// we will create endpoint using that we can add the product in our mongodb atlas database
// whenever we upload any object in mongodb database, we have to create a schema

//Schema for creating products

const Product = mongoose.model("Product",{
    id: {
        type: Number, //if id is not available, it wont be added to the database
        required:true, 
    },
    name:{
        type:String, //if we try to upload any product without any name,that wont be uploaded
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    new_price:{
        type:Number,
        required:true,
    },
    old_price:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now,
    },
    available:{
        type:Boolean,
        default:true,
    },

})
app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({}); //we will get all the products in one array, and we can access this using this products
    let id;
    if(products.length>0)//if product is available in our database, from that product list we will find the last product and from that id we will get the value and 
    {
        let last_product_array = products.slice(-1); //this id we will add one increased value // In array, we will get only one product that will be the lastproduct
        let last_product = last_product_array[0];//we have only one product, and we can access using 0 index
        id = last_product.id+1;//increment by one and generate new id
    }
    else //if the database has no product
    {
        id=1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    console.log(product);
    await product.save(); //whenever we have to save any product in database, it will take some time, that is the reason we use await
    console.log("Saved"); 
    res.json({
        success:true,
        name:req.body.name, //generate response for the frontend
    })
})

//Creating API for deleting products

app.post('/removeproduct',async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});//to delete product from the database
    console.log("Removed");
    res.json({
        success:true,
        name:req.body.name
    })
})
//Creating API for getting all products (using this we can display the product in frontend)
app.get('/allproducts',async(req,res)=>{
    let products = await Product.find({}); // we will get all the products in one array
    console.log("All Products Fetched");
    res.send(products);
})

//schema creating for user model

const Users = mongoose.model('Users',{
    name:{    // defining the structure of the user
        type:String,
    },
    email:{
            type:String,
            unique:true, // if any user create account with one email ID, he cannot create account with the same email ID
    },
    password:{
            type:String,
    },
    cartData:{
            type:Object,
    },
    date:{
            type:Date,
            default:Date.now,
    }
    
})

// Creating endpoint for registering the user
app.post('/signup',async (req,res)=>{

    let check = await Users.findOne({email:req.body.email}); // checking the email, password that is already existing or not?
    if (check)
    {
        return res.status(400).json({success:false,errors:"exisiting user found with same email address"})
    }
    let cart = {};
    for (let i=0; i < 300; i++){ //create empty object where we will get keys from 1 to 300 
        cart[i] = 0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })

    await user.save();

    const data = { // to use JWT authentication we create data
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data,'secret_ecom'); //(salt)data encrypted by one layer
    res.json({success:true,token})
})

//creating endpoint for user login
app.post('/login',async (req,res)=>{
   let user = await Users.findOne({email:req.body.email}); // first we use the email address we get from the API, 
   //using this we will get the user 
   //..related to particular emailid and it will be stored in the user variable
   if(user){
    const passCompare = req.body.password === user.password; // comparing password from API and user's register password
    if(passCompare){
        const data = {
            user:{
                id:user.id
            }
        }
        const token = jwt.sign(data,'secret_ecom');
        res.json({success:true,token});
    }
    else{
        res.json({success:false,errors:"Wrong Password"});
    }
   }
   else{
    res.json({success:false,errors:"Wrong Email Id"}); // if user is not available with the particular emailID
   }
})

//Creating API endpoint for new collection
app.get('/newcollections',async (req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8); // in newcollection array, we get recently added 8 products
    console.log("NewCollection Fetched");
    res.send(newcollection);
})

//Creating API endpoint for women selection
app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"});
    let popular_in_women = products.slice(0,4);
    console.log("Popular in women fetched");
    res.send(popular_in_women);

})
// Creating middleware to fetch user
    const fetchUser = async (req,res,next)=>{
        const token = req.header('auth-token');
        if (!token){
            res.status(401).send({errors:"Please authenticate using valid token"})
        }
        else{
            try {
                const data = jwt.verify(token,'secret_ecom');
                req.user = data.user;
                next(); //using this our token will be decoded and we get the access of the user data in our request
            } catch (error) {
                res.status(401).send({errors:"Please authenticate using a valid token"});
            }
        }
    }
//Creating endpoint for adding products in cartdata
app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log("Added",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData}); // will find the user and in their cartdata it will update the data with modified data
    res.send("Added")
})

//Creating endpoint to remove product from cartdata
app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("removed",req.body.itemId);
    let userData = await Users.findOne({_id:req.user.id});
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData}); // will find the user and in their cartdata it will update the data with modified data
    res.send("Removed")
})
//Creating endpoint for getting cartdata
app.post('/getcart',fetchUser,async(req,res)=>{
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.listen(port,(error)=>{
    if(!error){
        console.log("Server running on Port" +port)
    }
    else
    {
        console.log("Error : "+error)
    }
})

// Image Storage Engine
// passing one object in the diskstorage

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`) // we will get the original name of the uploaded file
    }
    
})
//Using this multer, we will create upload function, in that we will pass this configuration

const upload = multer({storage:storage})

// Creating Upload Endpoint for images
app.use('/images',express.static('upload/images'))//get the images folder at/images endpoint

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}` // to get the image name use the req that we get from diskstorage // using the image url we can access the uploaded image
    })
})
// as our image will be uploaded in this end point(post) using this post method at the same time our
// middleware i.,e multer diskstoarage that will rename that image with new name, and that image will
// be stored in the images folder   

// in the req we will get the name of the uploaded file, using this name we will generate 1 response, using that user can access this image for that we use res.json({
        //success:1,
        //image_url:`http:/(same from above)
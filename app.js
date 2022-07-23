const express = require("express");
const React = require("react");
const ReactDom = require("react-dom");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require('https');
var arrFromSearch=1;
var arrays=[];

//mongodb update
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/peopleDb');
const userSchema = new mongoose.Schema({
  name: {
      type:String,
      required: [true,"Name is required"]
  },
  age: Number,
  userName: {
      type:String,
      required: true
  },
  password: {
      type:String,
      required: true
  }
});
const Person = mongoose.model("Person",userSchema);

// const nutritionSchema = new mongoose.Schema({
//    user: Person,
//    food:{
//     type:String,
//     required:true,
//    },
//    serving:{
//     type:Number,
//     required:true,
//    },
//    calorie:{
//     type:Number,
//     required:true,
//    }
// });


const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/calories", function (req, res) {
  let arrayLen =arrays.length;
    res.render("calories",{recievedFromApp:arrays,len:arrayLen});
    console.log();
});

app.post("/calories", function (req, res){
  var arrayLen =arrays.length;
  arrFromSearch=req.body;
  if(req.body.postFood!==''){
  arrays.push(arrFromSearch);
  };
  // console.log(arrays.length);

  //comment here
  // const url ="https://api.nutritionix.com/v1_1/search/"+ req.body.postFood+"?results=0:20&fields=item_name,nf_total_fat,brand_name,item_id,nf_calories,nf_protein&appId=dc210fd5&appKey=135a6af303c7c5cde8026f549f61e283#";
  //   https.get(url, function (response) {
  //   console.log("Response status code="+response.statusCode);
  //   response.on("data", function (data) {
  //      obj = JSON.parse(data);
  //     // for (let i = 0; i < obj.hits.length; i++) {
  //     //   console.log(obj.hits[i].fields.item_name,obj.hits[i].fields.nf_serving_size_qty,obj.hits[i].fields.nf_protein,obj.hits[i].fields.nf_calories);
  //     // }
  //     // console.log(obj.hits[i].fields.nf_serving_size_qty);
  //   });
  // });
    res.redirect("/calories#previewLog");
});


app.get("/exercise", function (req, res) {
  res.render("exercise");
});

app.get("/login",function(req,res){
  

  res.render("login");
});

app.post("/login",function(req,res){
  const testName=req.body.uName;
  const testPass=req.body.uPass;
  Person.find({username:testName, password:testPass},function(err,persons){
      if(err)
      console.log(err);
      else{
        if(persons.length>0){
            console.log("This will be taken to new Page!")
        }else{
          console.log("No user found");
        }
      }
  });
 
  res.redirect("/login");
});

app.post("/signup",function(req,res){  
  const person = new Person({
      name: req.body.uFName,
      age: req.body.uAge,
      userName: req.body.uName,
      password: req.body.uPass,
  });
  person.save();

  //to see database of users 

  // Person.find(function(err,persons){
  //   if(err)
  //        console.log(err);
  //   else
  //       persons.forEach(element => {
  //           console.log(element.name);
  //       });
  // });
  res.redirect("/");
});


app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on 3000");
});





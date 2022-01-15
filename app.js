const express = require("express");
const bodyParser = require("body-parser");
const ejs =require("ejs");

const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.render("home");
});

app.get("/calories",function(req,res){
  res.render("calories");
});
app.get("/exercise",function(req,res){
  res.render("exercise");
});

app.listen(process.env.PORT||3000,function(){
  console.log("server is running on 3000");
});

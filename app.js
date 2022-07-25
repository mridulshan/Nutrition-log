const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require('https');
var arrFromSearch;
var arrays=[];
var pArray=[];
var mainProfile={

};
var nutritionProfile=[];
var pnPlen=0;

//mongodb update
const mongoose = require('mongoose');
const { prependListener } = require("process");
const { parentPort } = require("worker_threads");
mongoose.connect('mongodb+srv://admin-mridul:013611sc@cluster0.j9ukryr.mongodb.net/peopleDb');
//user
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
//food related to user
const nutritionSchema = new mongoose.Schema({
   user: {
    type: userSchema,
    required: true
   },
   food:{
    type:String,
    required:true,
   },
   serving:{
    type:Number,
    required:true,
   },
   calorie:{
    type:Number,
    required:true,
   }
});
const Food = mongoose.model("Food",nutritionSchema);

Food.find(function(err,food){
  if(err){
    console.log(err);
  }else{
    nutritionProfile=food;
    pnPlen=nutritionProfile.length;

    // console.log(nutritionProfile);
  }
});

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
  if(req.body.postFood){
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
  if(req.body.svg){
    for(var i=req.body.svg-1;i<arrayLen-1;i++){
      arrays[i]=arrays[i+1];
    }
    arrays.pop();   
  }

  console.log(req.body);
    res.redirect("/calories#previewLog");
});
// app.post("/calories/delete", function (req, res){
//   console.log("");
//     res.redirect("/calories#previewLog");
// });


app.get("/calories/:uname",function(req,res){
  
  Food.find(function(err,food){
    if(err){
      console.log(err);
    }else{
      nutritionProfile=food;
      pnPlen=nutritionProfile.length;
  
      // console.log(nutritionProfile);
    }
  });
    console.log(req.params.uname);
    Person.find({userName: req.params.uname},function(err,person){
    if(err){
        console.log(err);
    }else{
      person.forEach(element => {
                  pArray.push(element);
                  // console.log(pArray);
                });
                mainProfile=pArray[0];
                
      res.render("profile",{
        personObjname:req.params.uname, 
        dataObj:pArray[0],
        passednutritionProfile:nutritionProfile,
        passedNPlen:pnPlen
      });
    }
  });
  // res.redirect("/");
});
app.post("/calories/:unamed/delete",function(req,res){
  const checkedId=req.body.delete;
  Food.findByIdAndRemove(checkedId,function(err){
    if(!err){
      console.log("Sucessfully deleted checked");
      res.redirect("/calories/"+mainProfile.userName);
    }
    Food.find(function(err,food){
      if(err){
        console.log(err);
      }else{
        nutritionProfile=food;
        pnPlen=nutritionProfile.length;
    
        // console.log(nutritionProfile);
      }
    });
  });

});
app.post("/calories/:unamep",function(req,res){
  // console.log(mainProfile);
  const food = new Food({
    user: mainProfile,
    food: req.body.addFood,
    serving: req.body.addServing,
    calorie: req.body.addCalorie,
});
food.save(function(err,result){
  if (err){
      console.log(err);
  }
  else{
    res.redirect("/calories/"+req.params.unamep);
      // console.log(result)
  }
});  // console.log(req.body);
Food.find(function(err,food){
  if(err){
    console.log(err);
  }else{
    nutritionProfile=food;
    pnPlen=nutritionProfile.length;

    // console.log(nutritionProfile);
  }
});
  
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
            res.redirect("/"+testName);
        }else{
          console.log("No user found");
          res.redirect("/");
        }
      }
  });
 
  
});

app.post("/signup",function(req,res){  
  const person = new Person({
      name: req.body.uFName,
      age: req.body.uAge,
      userName: req.body.uName,
      password: req.body.uPass,
  });
  person.save();
  
  
  res.redirect("/login");
});

app.get("/:uId",function(req,res){
    // console.log(req.params);
    res.redirect("/calories/"+req.params.uId);
});


app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on 3000");
});




//to see database of users 

  // Person.find(function(err,persons){
  //   if(err)
  //        console.log(err);
  //   else
  //       persons.forEach(element => {
  //           console.log(element.name);
  //       });
  // });
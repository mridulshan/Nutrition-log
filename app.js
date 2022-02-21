const express = require("express");
const React = require("react");
const ReactDom = require("react-dom");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https = require('https');
var arrFromSearch=1;
var arrays=[];
var obj={
  total_hits: 0,
  max_score: 0.00,
  hits: [
    {
      _index: 0,
      _type: 'nil',
      _id: 'none',
      _score: 0,
      fields:{item_name:'enter item ..!.'}
    },
    {
      _index: 0,
      _type: 'nil',
      _id: 'none',
      _score: 0,
      fields:{item_name:'enter item ..!.'}
    },
    {
      _index: 0,
      _type: 'nil',
      _id: 'none',
      _score: 0,
      fields:{item_name:'enter item ..!.'}
    },
    {
      _index: 0,
      _type: 'nil',
      _id: 'none',
      _score: 0,
      fields:{item_name:'enter item ..!.'}
    },
  ]};
// const nutritionix = require("nutritionix-api");

// const YOUR_APP_ID = "dc210fd5"; // Your APP ID
// const YOUR_API_KEY = "135a6af303c7c5cde8026f549f61e283"; // Your KEY
// nutritionix.init(YOUR_APP_ID, YOUR_API_KEY); 

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/calories", function (req, res) {
  let arrayLen =arrays.length;

  if(obj==0){
    res.render("calories",{recievedFromApp:arrays,len:arrayLen});
  }else{
    res.render("calories",{recievedFromApp:arrays,len:arrayLen,foodFromApi:obj});

  }
  
});
app.post("/calories", function (req, res) {
  var arrayLen =arrays.length;

  arrFromSearch=req.body;
  if(req.body.postFood!==''){
  arrays.push(arrFromSearch);
  };
  // console.log(arrays.length);
  const url ="https://api.nutritionix.com/v1_1/search/"+ req.body.postFood+"?results=0:20&fields=item_name,nf_total_fat,brand_name,item_id,nf_calories,nf_protein&appId=dc210fd5&appKey=135a6af303c7c5cde8026f549f61e283#";
    https.get(url, function (response) {
    console.log("Response status code="+response.statusCode);
    response.on("data", function (data) {
       obj = JSON.parse(data);
      // for (let i = 0; i < obj.hits.length; i++) {
      //   console.log(obj.hits[i].fields.item_name,obj.hits[i].fields.nf_serving_size_qty,obj.hits[i].fields.nf_protein,obj.hits[i].fields.nf_calories);
      // }
      // console.log(obj.hits[i].fields.nf_serving_size_qty);
    });
  });

    res.redirect("/calories#previewLog");
    
    
});

app.get("/exercise", function (req, res) {
  res.render("exercise");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server is running on 3000");
  //   nutritionix.natural.search('beer').then(result => {
  //     console.log(result.foods);
  // });
  // url endpont for instant search
  // const url =" https://trackapi.nutritionix.com/v2/search/instant/?app-id=dc210fd5&app-key=135a6af303c7c5cde8026f549f61e283&query=beer"


  // const url ="https://api.nutritionix.com/v1_1/search/fish?results=0:20&fields=item_name,nf_total_fat,brand_name,item_id,nf_calories,nf_protein&appId=dc210fd5&appKey=135a6af303c7c5cde8026f549f61e283#";
  // https.get(url,function(response){
  //   console.log(response.statusCode);
  //   response.on("data",function(data){
  //     const obj=JSON.parse(data);
  //     for(let i=0;i<10;i++){
  //     console.log(obj.hits[i].fields);
  //     }
  //     console.log(obj);
    // })
  // })
});




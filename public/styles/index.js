const STATUS = document.getElementById('status');
const VIDEO = document.getElementById('webcam');
const ENABLE_CAM_BUTTON = document.getElementById('enableCam');
const RESET_BUTTON = document.getElementById('reset');
const TRAIN_BUTTON = document.getElementById('train');
const MOBILE_NET_INPUT_WIDTH = 224;
const MOBILE_NET_INPUT_HEIGHT = 224;
const STOP_DATA_GATHER = -1;
const CLASS_NAMES = [];
const apiout = document.getElementById('apiF');
const resultout = document.getElementById('apiF2');
const apiin= document.getElementById('apibox');
var FoodArr=[];
let link = "https://trackapi.nutritionix.com/v2/search/instant";
let link2 = "https://trackapi.nutritionix.com/v2/natural/nutrients";
let tempFoodArr=[];
let tempFoodObj={
  name:'',
  serving:'',
  serving_id:'',
  calories:'',
  protein:'',
  carbs:'',
  fats:'',
  fats_sat:'',
  id:'',
  date:''
}

apiin.addEventListener('input',fun);
apiout.addEventListener('click',fun2);



let button=document.getElementById('buttonId');
button.addEventListener('click',key_check);

function key_check(){
  
  const jsonObj=JSON.stringify(FoodArr);
  alert(FoodArr.length+ " Items Added");
  button.value=jsonObj;
}
const myHeaders = new Headers({
  'Content-Type': 'application/json,',
  'x-app-id': 'dc210fd5',
  'x-app-key': 'afa5da7a6b87c86ee814e6d0de9a8d37',
  
});
const mHeaders = new Headers({
  'x-app-id': 'dc210fd5',
  'x-app-key': 'afa5da7a6b87c86ee814e6d0de9a8d37',
  
});

function fun(){
  apiout.innerText="loading...";
  getText();
  
}
async function getNutri(item){
  const b= new URLSearchParams('query='+item)
  const myInit={
    method:'POST',
    headers:mHeaders,
    body:b
  }
  
  const myRequest = new Request(link2,myInit);

  tempFoodArr=await fetch(myRequest)
  .then((response) => {
    
    if (response.status === 200) {
      return response.json();
    } else {
      throw new Error('Something went wrong on API server!');
    }    
  })
  .then((data) => {
    return data;
    // console.log(data);
    // …
  }).catch((error) => {
    console.error(error);
  });
  // FoodArr.push(tempFoodArr.foods[0]);
  FoodArr.push({
          name:tempFoodArr.foods[0].food_name,
          serving:tempFoodArr.foods[0].serving_qty +  "-"+ tempFoodArr.foods[0].serving_unit,
          serving_id:tempFoodArr.foods[0].serving_weight_grams+'g',
          calories:tempFoodArr.foods[0].nf_calories,
          protein:tempFoodArr.foods[0].nf_protein,
          carbs:tempFoodArr.foods[0].nf_total_carbohydrate,
          fats:tempFoodArr.foods[0].nf_total_fat,
          fats_sat:0,
          id:tempFoodArr.foods[0].item_id,
          date:new Date().toLocaleString().split(',')[0]
        });
  tempFoodArr=[];
  apiout.innerText="";
  apiin.value="";
  resultout.innerText="";
  console.log(FoodArr[0].name);
  for(let i=0;i<FoodArr.length;i++){
    let node = document.createElement('li');
    let nodelink = document.createElement('a');
    node.appendChild(nodelink);
    
    console.log("updating");
    nodelink.innerText= FoodArr[i].name.toString().toUpperCase() + " - "+ "Servings: " + FoodArr[i].serving+" ("+FoodArr[i].serving_id+") - " + "Calories: "+ FoodArr[i].calories+" - Protein: "+ FoodArr[i].protein+" g";      
    resultout.appendChild(node);
  }

}
function fun2 (clicked_id){
  // apiout.innerHTML=clicked_id.path[1].innerText;
  // tempFoodArr.push(clicked_id.path[1].innerText);
  let pressed_index=clicked_id.path[1].id;
  // FoodArr.push(tempFoodArr.common[pressed_index]);

  // formv2post.submit();
  //post v2
  getNutri(tempFoodArr.common[pressed_index].food_name);
  
  //

}

async function getText() {
  if(apiin.value){
    const myInit={
      method:'GET',
      headers:myHeaders
    }
    
    const myRequest = new Request(link+'?query='+apiin.value,myInit);
  
    tempFoodArr= await fetch(myRequest)
    .then((response) => {
      
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Something went wrong on API server!');
      }    
    })
    .then((data) => {
      return data;
      // console.log(data);
      // …
    }).catch((error) => {
      console.error(error);
    });
  
    if(tempFoodArr.common.length>0){
      apiout.innerText="";
      for(let i=0;i<5;i++){
        let node = document.createElement('li');
      let nodelink = document.createElement('a');
      node.appendChild(nodelink);
      nodelink.innerText=(tempFoodArr.common[i].food_name +" "+" " + tempFoodArr.common[i].serving_unit+ " ");
      node.id=i;
      // click to add in temp
      node.onclick='fun2(this.id)';
        // apiin.name.postFood=data.hits[i].fields.item_id;
        
      apiout.appendChild(node);
      }
    }else{
      apiout.innerText="Api failed"
    }
  }
  
  //  await fetch(file,{
  //   method:"POST",
  //   headers:myHeaders,
  //   body:JSON.stringify({
  //     query:"banana"
  //   })
  // })
  // .then(res => res.json()) // the .json() method parses the JSON response into a JS object literal
  // .then(data => {
  //   // alert("in side data");
  //   // console.log(data);
  //   apiout.innerText=null;
  //   if(data.common.length>5){data.common.length=5;}
  //   tempFoodArr=[];
  //   for(let i=0;i<data.hits.length;i++){
  //     tempFoodArr.push({
  //       name:data.common[i].food_name,
  //       serving:data.common[i].serving_qty,
  //       serving_id:data.common[i].serving_unit,
  //       calories:data.common[i].nf_calories,
  //       protein:data.common[i].nf_protein,
  //       carbs:data.common[i].nf_total_carbohydrate,
  //       fats:data.common[i].nf_total_fat,
  //       fats_sat:data.common[i].nf_saturated_fat,
  //       id:data.common[i].item_id,
  //       date:new Date().toLocaleString().split(',')
  //     });
  //     console.log(tempFoodArr);
  //     let node = document.createElement('li');
  //     let nodelink = document.createElement('a');
  //     node.appendChild(nodelink);
  //     nodelink.innerText=(tempFoodArr[i].name +" "+" " + tempFoodArr[i].calories+ "cal.");
  //     node.id=i;
  //     node.onclick='fun2(this.id)';
  //     // apiin.name.postFood=data.hits[i].fields.item_id;
      
  //     apiout.appendChild(node);
  //   }
  
    
  // });
}



// ENABLE_CAM_BUTTON.addEventListener('click', enableCam);
// TRAIN_BUTTON.addEventListener('click', trainAndPredict);
// RESET_BUTTON.addEventListener('click', reset);

// function hasGetUserMedia() {
//   return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
// }
// function enableCam() {
//   // TODO: Fill this out later in the codelab!
//   if (hasGetUserMedia()) {
//     // getUsermedia parameters.
//     const constraints = {
//       video: true,
//       width: 640, 
//       height: 480 
//     };

//     // Activate the webcam stream.
//     navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
//       VIDEO.srcObject = stream;
//       VIDEO.addEventListener('loadeddata', function() {
//         videoPlaying = true;
//         ENABLE_CAM_BUTTON.classList.add('removed');
//       });
//     });
//   } else {
//     console.warn('getUserMedia() is not supported by your browser');
//   }
// }


// async function trainAndPredict() {
//   predict = false;
//   tf.util.shuffleCombo(trainingDataInputs, trainingDataOutputs);
//   let outputsAsTensor = tf.tensor1d(trainingDataOutputs, 'int32');
//   let oneHotOutputs = tf.oneHot(outputsAsTensor, CLASS_NAMES.length);
//   let inputsAsTensor = tf.stack(trainingDataInputs);
  
//   let results = await model.fit(inputsAsTensor, oneHotOutputs, {shuffle: true, batchSize: 5, epochs: 10, 
//       callbacks: {onEpochEnd: logProgress} });
  
//   outputsAsTensor.dispose();
//   oneHotOutputs.dispose();
//   inputsAsTensor.dispose();
//   predict = true;
//   predictLoop();
// }

// function logProgress(epoch, logs) {
//   console.log('Data for epoch ' + epoch, logs);
// }
// function predictLoop() {
//   if (predict) {
//     tf.tidy(function() {
//       let videoFrameAsTensor = tf.browser.fromPixels(VIDEO).div(255);
//       let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor,[MOBILE_NET_INPUT_HEIGHT, 
//           MOBILE_NET_INPUT_WIDTH], true);

//       let imageFeatures = mobilenet.predict(resizedTensorFrame.expandDims());
//       let prediction = model.predict(imageFeatures).squeeze();
//       let highestIndex = prediction.argMax().arraySync();
//       let predictionArray = prediction.arraySync();
//       let percent='';
//       if(Math.floor(predictionArray[highestIndex] * 100)>75){
//         percent='Prediction: ' + CLASS_NAMES[highestIndex] + ' with ' + Math.floor(predictionArray[highestIndex] * 100) + '% confidence';
//       }else{
//         percent =' Cant identify...'
//       }

//       STATUS.innerText = predict;
//     });

//     window.requestAnimationFrame(predictLoop);
//   }
// }

// function reset() {
//   predict = false;
//   examplesCount.length = 0;
//   for (let i = 0; i < trainingDataInputs.length; i++) {
//     trainingDataInputs[i].dispose();
//   }
//   trainingDataInputs.length = 0;
//   trainingDataOutputs.length = 0;
//   STATUS.innerText = 'No data collected';
  
//   console.log('Tensors in memory: ' + tf.memory().numTensors);
// }
// let dataCollectorButtons = document.querySelectorAll('button.dataCollector');
// for (let i = 0; i < dataCollectorButtons.length; i++) {
//   dataCollectorButtons[i].addEventListener('mousedown', gatherDataForClass);
//   dataCollectorButtons[i].addEventListener('mouseup', gatherDataForClass);
//   // Populate the human readable names for classes.
//   CLASS_NAMES.push(dataCollectorButtons[i].getAttribute('data-name'));
// }


// function gatherDataForClass() {
//   // TODO: Fill this out later in the codelab!
//   let classNumber = parseInt(this.getAttribute('data-1hot'));
//   gatherDataState = (gatherDataState === STOP_DATA_GATHER) ? classNumber : STOP_DATA_GATHER;
//   dataGatherLoop();
// }
// function dataGatherLoop() {
//   if (videoPlaying && gatherDataState !== STOP_DATA_GATHER) {
//     let imageFeatures = tf.tidy(function() {
//       let videoFrameAsTensor = tf.browser.fromPixels(VIDEO);
//       let resizedTensorFrame = tf.image.resizeBilinear(videoFrameAsTensor, [MOBILE_NET_INPUT_HEIGHT, 
//           MOBILE_NET_INPUT_WIDTH], true);
//       let normalizedTensorFrame = resizedTensorFrame.div(255);
//       return mobilenet.predict(normalizedTensorFrame.expandDims()).squeeze();
//     });

//     trainingDataInputs.push(imageFeatures);
//     trainingDataOutputs.push(gatherDataState);
    
//     // Intialize array index element if currently undefined.
//     if (examplesCount[gatherDataState] === undefined) {
//       examplesCount[gatherDataState] = 0;
//     }
//     examplesCount[gatherDataState]++;

//     STATUS.innerText = '';
//     for (let n = 0; n < CLASS_NAMES.length; n++) {
//       STATUS.innerText += CLASS_NAMES[n] + ' data count: ' + examplesCount[n] + '.    ';
//     }
//     window.requestAnimationFrame(dataGatherLoop);
//   }
// }

// let mobilenet = undefined;
// let gatherDataState = STOP_DATA_GATHER;
// let videoPlaying = false;
// let trainingDataInputs = [];
// let trainingDataOutputs = [];
// let examplesCount = [];
// let predict = false;

// /**
//  * Loads the MobileNet model and warms it up so ready for use.
//  **/
//  async function loadMobileNetFeatureModel() {
//     const URL = 
//       'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v3_small_100_224/feature_vector/5/default/1';
    
//     mobilenet = await tf.loadGraphModel(URL, {fromTFHub: true});
//     STATUS.innerText = 'MobileNet v3 loaded successfully!';
    
//     // Warm up the model by passing zeros through it once.
//     tf.tidy(function () {
//       let answer = mobilenet.predict(tf.zeros([1, MOBILE_NET_INPUT_HEIGHT, MOBILE_NET_INPUT_WIDTH, 3]));
//       console.log(answer.shape);
//     });
//   }
  
//   // Call the function immediately to start loading.
//   loadMobileNetFeatureModel();

//   let model = tf.sequential();
// model.add(tf.layers.dense({inputShape: [1024], units: 128, activation: 'relu'}));
// model.add(tf.layers.dense({units: CLASS_NAMES.length, activation: 'softmax'}));

// model.summary();

// // Compile the model with the defined optimizer and specify a loss function to use.
// model.compile({
//   // Adam changes the learning rate over time which is useful.
//   optimizer: 'adam',
//   // Use the correct loss function. If 2 classes of data, must use binaryCrossentropy.
//   // Else categoricalCrossentropy is used if more than 2 classes.
//   loss: (CLASS_NAMES.length === 2) ? 'binaryCrossentropy': 'categoricalCrossentropy', 
//   // As this is a classification problem you can record accuracy in the logs too!
//   metrics: ['accuracy']  
// });
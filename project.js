
const form = document.querySelector('form');
const ul = document.querySelector('ul');
const li = document.querySelector('li');
const button = document.getElementById('button');
const swap = document.getElementById('swap');
const from = document.getElementById('from');
const to = document.getElementById('to');
const valueData = document.getElementById('value');
var currencyDataArray = [];

let currencyData = "https://free.currencyconverterapi.com/api/v5/currencies";

let dbPromise = openDatabase();


/**
 * Makes API call to conversion API
 */
const conversionRate = (conversion) =>{
  let conversionRateURL = "https://free.currencyconverterapi.com/api/v5/convert?q="+ conversion +"&compact=ultra";
  var dataFromAPI = fetchConversionAPI(conversionRateURL, conversion);
  return dataFromAPI;
}

const pSetter = (text) => {
    const list = document.querySelector('list');
    list.textContent = text;
    ul.prependChild(list);
  }

/**
 * Sets the currencies in the DOM
 * @param {*} data 
 */
const currencySetter = (data) => {
  console.log(data)
  for (var item in data) {
    let name = data[item].currencyName;
    let symbol = data[item].currencySymbol;
    let currencyId = data[item].id;


    if(symbol == null){
    from.innerHTML += "<option value="+ currencyId+">" + name+ "</option>";
    to.innerHTML += "<option value="+ currencyId+">"+ name + "</option>";

    }else{
      from.innerHTML += "<option value="+ currencyId+">" + name+" ("+symbol+")" + "</option>";
      to.innerHTML += "<option value="+ currencyId+">" + name +" ("+symbol+")" + "</option>";

    }

  }
}

  /**
   * fetch currency data
   */
var fetchApi = () =>{
    fetch(currencyData)
    .then((resp) => resp.json()) // Transform the data into json thank you
    .then(function(data) {
      // Create and append the currencies 
      currencySetter(data.results);
      })
}

/**
 * Makes API calls
 */
function fetchConversionAPI(url, conversion){
  // var result = [];

  dbPromise.then(function(db) {
  if (!db)
  return;

  var requestUrl = db.transaction('conversionsKey','readwrite').objectStore('conversionsKey');

  return requestUrl.getAll();

}).then(function(urlList) {
  console.log('saved:', urlList);
  urlList.forEach(function(urlPath){
    console.log('url im aiming',url);
    console.log('posssible container',urlPath.keyId);
    if(url.includes(urlPath.keyId)){
        console.log('you are under my genjutsu:', conversion);
        let result = urlPath.value;
        var convert = valueData.value * result;
        console.log(valueData.value, result, conversion);
        li.innerHTML = "<span style='color:brown'>"+to.value+" "+ convert.toFixed(2)+"</span>";  

    }
  });
});



      //if the user has some connection, lets update that value
      console.log('If you escaped, Ill DEFINITELY get you next time:', conversion);
        fetch(url)
        .then((resp) => resp.json()) // Transform the data into pretty pretty json
        .then(function(data) {  
          // return Api data
            var keys = Object.keys(data);    
            keys.forEach(function(key){
              let result = data[key];
              var convert = valueData.value * result;
              console.log(valueData.value, result, conversion);
              li.innerHTML = "<span style='color:green'>"+to.value+" "+ convert.toFixed(2)+"</span>";  

              dbPromise.then(function(db) {
                if (!db) return;

                var tx = db.transaction('conversionsKey', 'readwrite');
                var storeConv = tx.objectStore('conversionsKey');
                storeConv.put({keyId:conversion,value:result});
              });

            });
        }).catch(function() {
            console.log("error");
      }); 
   

} 

//suuuuuper confusing idb stuff **sighhh**
function openDatabase() {
  // no service worker, no idb because whats the point lol
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

//but if it does
  return idb.open('conversionDB', 1, function(upgradeDb) {
    var storeConv = upgradeDb.createObjectStore('conversionsKey', {
      keyPath: 'keyId'
    });
    storeConv.createIndex('keyId','keyId');
  });
}

/**
 * Performs the conversion yaaayy
 */
  button.addEventListener('click', function (e) {
    e.preventDefault(); 
   
    if(valueData.value === ""){
      alert("Trying to get something for nothing I see. Crafty fellow. The value field is empty!");
    
    }
    else if(valueData.value.trim()==""){
      alert("** yawns airily ** I see what you're trying to do Neil Armstrong. No 'space' allowed here!");

    }        
    else if (parseFloat(valueData.value)<0 ){
      alert("Tsk tsk tsk! Positive amounts only! Smh. Pessimists ");
      
    }
    else if (isNaN(valueData.value)){
      alert("Shame on you, putting text in a number field. Begone! and next time, numbers only please :)");
    }     

    else{
       //combine currency
      var combine = from.value + "_" + to.value
      console.log(combine);
      let resultData = conversionRate(combine);
    }
    

  });


//a little swap action, the old switcheroo hahaha
  swap.addEventListener('click', function (e) {
    e.preventDefault(); 
   
       //swap currency

      var temp = from.value;
      from.value = to.value;
      to.value =temp;

          
    if(valueData.value === ""){
      //thats okay, do nothing. have a coffee my friend. let it be lol

    }
    else if(valueData.value.trim()==""){
      alert("** yawns airily ** I see what you're trying to do Neil Armstrong. No 'space' allowed here!");

    }   

    else if (parseFloat(valueData.value)<0 ){
      alert("Tsk tsk tsk! Positive amounts only! Smh. Pessimists ");

    }
    else if (isNaN(valueData.value)){
      alert("Shame on you, putting text in a number field. Begone! and next time, numbers only please :)");
    }  
    else{
       //combine currency
      var combine = from.value + "_" + to.value
      console.log(combine);
      let resultData = conversionRate(combine);
    }
    
    

  });

  document.addEventListener('DOMContentLoaded', function() {
    fetchApi();
 }, false);


  
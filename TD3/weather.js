let url = "https://www.prevision-meteo.ch/services/json/";
let jsonData = null;

const search = document.getElementById("search-button");
search.addEventListener("click", getMeteo);
const searchText = document.getElementById("search-text");



function initMap() {
    let lat = 48.852969;
    let lon = 2.349903;
    macarte = L.map('mapid').setView([44.8430557, -0.5750000], 13);
    L.tileLayer('https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
        attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        minZoom: 0,
        maxZoom: 22,
        subdomains: 'abcd',
        accessToken: '6r4lsKtVRbmZG0AyMTSNfLaAKTBaqcWGl4nJLRDO5djPSTuDIUnbyBPdvMZ7pAtq'
    }).addTo(macarte);
}

window.onload = function(){
    initMap(); 
};


function getMeteo() {
    const name = searchText.value.toLowerCase();
    const promise = fetch(url+name);
    promise.then(response => {return response.json()})    
        .then( data => {console.log(data); jsonData = data; jsonToHTML()})
        .catch(err => {console.error(err)})
}


function jsonToHTML(){
    if(!jsonData.errors){
        showCurrent();
        showDays();
        moveMapPointer();
    }
}

function moveMapPointer(){
    L.latLng(jsonData.city_info.latitude, jsonData.city_info.longitude);
}

function showCurrent() {
    document.getElementById("day").innerHTML       = "Maintenant ";
    document.getElementById("date").innerHTML      =  jsonData.fcst_day_0.date;  
    document.getElementById("condition").innerHTML = jsonData.current_condition.condition;
    document.getElementById("humidity").innerHTML  = "Humidity: " + jsonData.current_condition.humidity;
    document.getElementById("tmp").innerHTML       = "Temperature: " + jsonData.current_condition.tmp + "°C";
    const img = new Image();
    img.src = jsonData.current_condition.icon;
    const myNode = document.getElementById("img");
    while (myNode.lastElementChild) {
        myNode.removeChild(myNode.lastElementChild);
    }
    document.getElementById("img").appendChild(img);
}

function showDays(){
    for (let dayNb = 1; dayNb < 4; dayNb++) {
        const data = jsonData["fcst_day_" + dayNb];
        document.getElementById("day"+dayNb).innerHTML        = data.day_long;
        document.getElementById("date"+dayNb).innerHTML       = data.date;
        document.getElementById("condition"+dayNb).innerHTML  = data.condition;
        document.getElementById("tmin"+dayNb).innerHTML       = "Temperature min: " + data.tmin + "°C";
        document.getElementById("tmax"+dayNb).innerHTML       = "Temperature max: " + data.tmax + "°C";
        const img = new Image();
        img.src = data.icon;
        const myNode = document.getElementById("img"+dayNb);
        while (myNode.lastElementChild) {
            myNode.removeChild(myNode.lastElementChild);
        }
        document.getElementById("img"+dayNb).appendChild(img);
        
    }
}


// class City {
//     constructor(name,lat,long){
//         this.name = name;
//         this.lat = lat;
//         this.long = long
//     }


// }

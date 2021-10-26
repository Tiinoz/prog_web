const url = "https://www.prevision-meteo.ch/services/json/";
const list_cities = "https://apicarto.ign.fr/api/codes-postaux/communes/";

let allData;
let table;
let postalNumber;
let macarte = null;
let dataSaved = new Array();
let incr_marker_map = 0;

/*
    Initializing map
*/
function initMap() {
    let lat = 48.852969;
    let lon = 2.349903;
    // Créer l'objet "macarte" et l'insèrer dans l'élément HTML qui a l'ID "map"
    macarte = L.map('map').setView([lat, lon], 11);
    // Leaflet ne récupère pas les cartes (tiles) sur un serveur par défaut. Nous devons lui préciser où nous souhaitons les récupérer. Ici, openstreetmap.fr
    L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM France</a>',
        minZoom: 1,
        maxZoom: 20
    }).addTo(macarte);
    macarte.on('click', onMapClick);
}

function onMapClick(e) {
    let latitude = "lat=" + ((e.latlng.lat).toString()).substring(0,6);
    let longitude = "lng=" + ((e.latlng.lng).toString()).substring(0,6);
    let promise = fetch(url + latitude + longitude)
    .then((response) => { 
        return response.json(); 
    })
    .then((data) => {
        incr_marker_map++;
        allData = data;
        cleanUpFormGroup();
        generateHTML(data);
    })
    .catch((err) => console.log(err));
}

window.onload = function(){
    initMap(); 
};

/*
    Transform a word in lowercase and deleting every accents or special character for a normal one
*/
function slugify (str) {
    let map = {
        '-' : ' ',
        '-' : '_',
        'a' : 'á|à|ã|â|À|Á|Ã|Â',
        'e' : 'é|è|ê|É|È|Ê',
        'i' : 'í|ì|î|Í|Ì|Î',
        'o' : 'ó|ò|ô|õ|Ó|Ò|Ô|Õ',
        'u' : 'ú|ù|û|ü|Ú|Ù|Û|Ü',
        'c' : 'ç|Ç',
        'n' : 'ñ|Ñ'
    };
    
    for (let pattern in map) {
        str = str.replace(new RegExp(map[pattern], 'g'), pattern);
    };

    return str;
};

function enter(){
    if(event.key === 'Enter'){
        clicked();
    }
}


/*
    Fetching data about a city after an input in the first search bar
*/
function clicked(){
    name = slugify(document.getElementById("box").value);
    let promise = fetch(url + name)
    .then((response) => { 
        return response.json(); 
    })
    .then((data) => {
        allData = data;
        cleanUpFormGroup();
        generateHTML(data);
    })
    .catch((err) => console.log(err));
}

function postalEnter(){
    if(event.key === 'Enter'){
        postalClicked();
    }
}

/*
    Fetching data about a postal number after an input in the second search bar
*/
function postalClicked(){
    postalNumber = document.getElementById("box2").value;
    let promise = fetch(list_cities + postalNumber)
    .then((response) => { 
        return response.json(); 
    })
    .then((data) => {
        searchingCities(data);
    })
    .catch((err) => console.log(err));
}

/*
    Generates form group HTML
*/
function generateFormGroup(){
    let selectList = document.getElementById("select-list");
    selectList.hidden = false;

    let formGroup = document.getElementById("form-group");
    formGroup.innerHTML = "<label for=\"inputState\"> <div class = \"text3\">Choisissez votre ville</div></label><select id=\"inputState\" class=\"form-control\"></select>";

    let button = document.getElementById("incoming-button");
    button.innerHTML = "<button class=\"button-self-made\" onclick=\"validateCityOnClick();\">Valider</button>"
}

/*
    Function used to clean the form group HTML when there is no need to be used anymore
*/
function cleanUpFormGroup(){
    let selectList = document.getElementById("select-list");
    selectList.hidden = true;

    let formGroup = document.getElementById("form-group");
    formGroup.innerHTML = "";

    let button = document.getElementById("incoming-button");
    button.innerHTML = ""
}

/*
    Building form group by adding options with a city for each of them
*/
function searchingCities(json){
    let length = Object.keys(json).length;
    if(length == 1){
        cleanUpFormGroup();
        cityChoosen(slugify(json[0]["nomCommune"]), 3);
    }else{
        if(length > 1){
            generateFormGroup();
            let inputState = document.getElementById("inputState");
            for(let i = 0; i < length; i++){
                let option = document.createElement('option');
                option.innerHTML = json[i]["nomCommune"];
                inputState.appendChild(option);
            }
        }
    }
}

/*
    Validate city chosed in form group
*/
function validateCityOnClick(){
    let e = document.getElementById("inputState");
    let val = e.value;
    cityChoosen(slugify(val), 3);
}

/*
    Fetching data of a given city
*/
function cityChoosen(name, n){
    let promise = fetch(url + name)
    .then((response) => { 
        return response.json(); 
    })
    .then((data) => {
        allData = data;
        generateHTML(data);
    })
    .catch((err) => {
        //Fetch_retry
        //Conversion apicarto names to prevision-meteo.ch format
        if(n == 1){
            console.log(err);
        }
        //Without "Le "
        if(n == 2){
            return cityChoosen(name.substring(3,name.length-3), n-1);
        }
        //Adding "-" + first two digits of postal code
        if(n == 3){
            return cityChoosen(name + "-" + postalNumber.substring(0,2), n-1);
        }
    });
}

/*
    Generate the five day buttons above the table
*/
function generateDays(json){
    let today = document.getElementById("today");
    today.innerHTML = "<h3>Aujourd'hui</h3>";
    today.hidden = false;

    let day1 = document.getElementById("day1");
    day1.innerHTML = "<h3>" + json.fcst_day_1.day_long + " " + json.fcst_day_1.date + "</h3>";
    day1.hidden = false;

    let day2 = document.getElementById("day2");
    day2.innerHTML = "<h3>" + json.fcst_day_2.day_long + " " + json.fcst_day_2.date + "</h3>";
    day2.hidden = false;

    let day3 = document.getElementById("day3");
    day3.innerHTML = "<h3>" + json.fcst_day_3.day_long + " " + json.fcst_day_3.date + "</h3>";
    day3.hidden = false;

    let day4 = document.getElementById("day4");
    day4.innerHTML = "<h3>" + json.fcst_day_4.day_long + " " + json.fcst_day_4.date + "</h3>";
    day4.hidden = false;
}

/*
    Returns JSON of a specific day
*/
function getDataDay(json, dayId){
    if(dayId == 0){
        return json.fcst_day_0;
    }
    if(dayId == 1){
        return json.fcst_day_1;
    }
    if(dayId == 2){
        return json.fcst_day_2;
    }
    if(dayId == 3){
        return json.fcst_day_3;
    }
    if(dayId == 4){
        return json.fcst_day_4;
    }
}

/*
    Returns hexadecimal code for an arrow linked to a specific direction
*/
function getWindArrow(direction){
    if(direction === "O"){
        return "&#8656 ";
    }
    if(direction === "N"){
        return "&#8657 ";
    }
    if(direction === "S"){
        return "&#8659 ";
    }
    if(direction === "E"){
        return "&#8658 ";
    }
    if(direction === "NO"){
        return "&#8662 ";
    }
    if(direction === "NE"){
        return "&#8663 ";
    }
    if(direction === "SO"){
        return "&#8665 ";
    }
    if(direction === "SE"){
        return "&#8664 ";
    }
}

/*
    Function used to generate data for a specific day
*/
function generateTable(dayId){
    let length = table.rows[0].cells.length;
    let dataDay = getDataDay(allData, dayId);

    //Day
    if(dayId == 0){
        table.rows[0].cells[0].innerHTML = "<h3>" + "Aujourd'hui" + "</h3>";
    }
    else{
        table.rows[0].cells[0].innerHTML = "<h3>" + dataDay.day_long + " " + dataDay.date + "</h3>";
    }

    //Hour
    let tempTab = new Array();
    let hour = 0;

    //Generating table
    for(let i = 1; i < length; i++){
        let stringHour;
        stringHour = hour + "H00";

        table.rows[0].cells[i].innerHTML = hour + "H00";
        table.rows[1].cells[i].innerHTML = "<img src=\"" + dataDay["hourly_data"][stringHour]["ICON"] + "\">" + 
        "<br>" + dataDay["hourly_data"][stringHour]["CONDITION"];
        table.rows[2].cells[i].innerHTML = dataDay["hourly_data"][stringHour]["TMP2m"] + " °C";
        table.rows[3].cells[i].innerHTML = dataDay["hourly_data"][stringHour]["PRMSL"] + " hPa";
        table.rows[4].cells[i].innerHTML = dataDay["hourly_data"][stringHour]["APCPsfc"] + " mm";
        table.rows[5].cells[i].innerHTML = dataDay["hourly_data"][stringHour]["WNDSPD10m"] + " km/h";
        table.rows[6].cells[i].innerHTML = dataDay["hourly_data"][stringHour]["WNDGUST10m"] + " km/h";
        table.rows[7].cells[i].innerHTML = dataDay["hourly_data"][stringHour]["RH2m"] + " %";

        let direction = dataDay["hourly_data"][stringHour]["WNDDIRCARD10"]
        table.rows[8].cells[i].innerHTML = getWindArrow(direction) + direction;

        hour = hour + 2;

        tempTab.push(dataDay["hourly_data"][stringHour]["TMP2m"])
    }

    generateChartTmp(tempTab, dataDay.day_long + " " + dataDay.date);
}

/*
    Function used for saving and showing the weather of the last two choosen cities/locations
*/
function generateDataSaved(json){
    if(dataSaved.length == 2){
        dataSaved.shift();
        dataSaved.push(json);
    }else{
        dataSaved.push(json);
    }

    //First weather saved
    if(dataSaved.length >= 1){
        let firstWeatherJson = dataSaved[0];
        let firstWeatherContent = document.getElementById("content-first-weather");
        firstWeatherContent.innerHTML = "Température actuelle : " + firstWeatherJson.current_condition.tmp + " °C" + "<br>" + "Conditions : " + 
        firstWeatherJson.current_condition.condition + "<br>" + "Vent : " + firstWeatherJson.current_condition.wnd_spd + " km/h";

        let firstWeatherImg = document.getElementById("img-card1");
        firstWeatherImg.setAttribute("src",firstWeatherJson.current_condition.icon);

        let firstWeatherDetails = document.getElementById("details-first-weather");
        if(firstWeatherJson.city_info.name != "NA"){
            firstWeatherDetails.innerText = firstWeatherJson.city_info.name + ", " + firstWeatherJson.city_info.country;
        }else{
            if(dataSaved.length == 2){
                if(dataSaved[1].city_info.name == "NA"){
                    firstWeatherDetails.innerText = "Météo n°" + (incr_marker_map-1) + " sur la carte";
                }
            }else{
                firstWeatherDetails.innerText = "Météo n°" + incr_marker_map + " sur la carte";
            }

        }

        let firstWeatherDetails2 = document.getElementById("details2-first-weather");
        firstWeatherDetails2.innerText = "Météo sauvegardée";
    }

    //Second weather saved
    if(dataSaved.length == 2){
        let secondWeatherJson = dataSaved[1];
        let secondWeatherContent = document.getElementById("content-second-weather");
        secondWeatherContent.innerHTML = "Température actuelle : " + secondWeatherJson.current_condition.tmp + " °C" + "<br>" + "Conditions : " + 
        secondWeatherJson.current_condition.condition + "<br>" + "Vent : " + secondWeatherJson.current_condition.wnd_spd + " km/h";

        let secondWeatherImg = document.getElementById("img-card2");
        secondWeatherImg.setAttribute("src",secondWeatherJson.current_condition.icon);

        let secondWeatherDetails = document.getElementById("details-second-weather");
        if(secondWeatherJson.city_info.name != "NA"){
            secondWeatherDetails.innerText = secondWeatherJson.city_info.name + ", " + secondWeatherJson.city_info.country;
        }else{
            secondWeatherDetails.innerText = "Météo n°" + incr_marker_map + " sur la carte";
        }

        let secondWeatherDetails2 = document.getElementById("details2-second-weather");
        secondWeatherDetails2.innerText = "Météo sauvegardée";
    }
    
}

/*
    Main function used to be called first after fetching data and calling the rest of the functions
    Generates static elements, like those above the five day buttons, or the marker in the map
    Also generates the static elements of the table, those who are at the very left
*/
function generateHTML(json){
    //-------------MAP set--------------------//
    var marker = L.marker([json.city_info.latitude, json.city_info.longitude]).addTo(macarte);
    if(json.city_info.name != "NA"){
        marker.bindPopup(json.city_info.name + ", " + json.city_info.country + "<br>" + json.current_condition.tmp + "°C" + "<br>" + 
        json.current_condition.condition + "<br>" + "Vent: " + json.current_condition.wnd_spd + " km/h");
    }else{
        marker.bindPopup("Météo n°" + incr_marker_map + "<br>" + json.current_condition.tmp + "°C" + "<br>" + 
        json.current_condition.condition + "<br>" + "Vent: " + json.current_condition.wnd_spd + " km/h");
    }
    marker.openPopup();
    macarte.setView([json.city_info.latitude, json.city_info.longitude], 11);

    //-------------Top elements---------------//
    if(json.city_info.name != "NA"){ //Not showing if map interaction
        document.getElementById("city-country").innerHTML = json.city_info.name + ", " + json.city_info.country;
    }else{
        document.getElementById("city-country").innerHTML = "Météo n°" + incr_marker_map + " sur la carte";
    }
    document.getElementsByClassName("temp-value")[0].innerHTML = json.current_condition.tmp;
    document.getElementsByClassName("temp-unit")[0].innerHTML = "°C";
    var img = json.current_condition.icon;
    document.getElementById('img').setAttribute('src', img);
    document.getElementById("description").innerHTML = json.current_condition.condition;
    document.getElementsByClassName("current-wind")[0].innerHTML = "Vent: " + json.current_condition.wnd_spd + " km/h";
    //----------------------------------------//
    
    //--------Table static attributes--------//
    table = document.getElementById("table_day");
    table.rows[1].cells[0].innerHTML = "Ciel" 
    table.rows[2].cells[0].innerHTML = "Température (°C)";
    table.rows[3].cells[0].innerHTML = "Pression atmosphérique (hPa)";
    table.rows[4].cells[0].innerHTML = "Pluie (mm)";
    table.rows[5].cells[0].innerHTML = "Vent (km/h)";
    table.rows[6].cells[0].innerHTML = "Rafales (km/h)";
    table.rows[7].cells[0].innerHTML = "Humidité relative";
    table.rows[8].cells[0].innerHTML = "Direction du vent";
    //----------------------------------------//

    table.style.marginLeft = "0%";
    generateDays(json);
    generateTable(0);
    generateDataSaved(json);
    generateChartWeek(json);
}

/*
    Generates the char of minimal degree values and maximal degree values for every day
*/
function generateChartWeek(json){
    let days = new Array();
    days.push(json.fcst_day_0.day_long + " " + json.fcst_day_0.date);
    days.push(json.fcst_day_1.day_long + " " + json.fcst_day_1.date);  
    days.push(json.fcst_day_2.day_long + " " + json.fcst_day_2.date);  
    days.push(json.fcst_day_3.day_long + " " + json.fcst_day_3.date);  
    days.push(json.fcst_day_4.day_long + " " + json.fcst_day_4.date); 

    let minTab = new Array();
    let maxTab = new Array();

    let nbHours = 24;
    for(let i = 0; i < days.length; i++){
        let dataDay = getDataDay(json, i);
        let min = dataDay["hourly_data"]["0H00"]["TMP2m"];
        let max = dataDay["hourly_data"]["0H00"]["TMP2m"];
        let hour = 1;
        for(let j = 1; j < nbHours; j++){
            let stringHour = hour + "H00";
            if(dataDay["hourly_data"][stringHour]["TMP2m"] < min){
                min = dataDay["hourly_data"][stringHour]["TMP2m"];
            }
            if(dataDay["hourly_data"][stringHour]["TMP2m"] > max){
                max = dataDay["hourly_data"][stringHour]["TMP2m"];
            }
            hour++;
        }
        minTab.push(min);
        maxTab.push(max);
    }

    let ctxL = document.getElementById("lineChartWeek").getContext('2d');
    let myLineChartWeek = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: days,
            datasets: [{
                label: "Température maximale en °C",
                data: maxTab,
                backgroundColor: ['rgba(205, 0, 132, .2)',], 
                borderColor: ['rgba(255, 0, 0, .7)',],
                borderWidth: 2
            },
            {
                label: "Température minimale en °C",
                data: minTab,
                backgroundColor: ['rgba(92, 40, 205, .2)',], 
                borderColor: ['rgba(0, 0, 255, .7)',],
                borderWidth: 2
            }
        ]},
        options: {
            legend: {
                labels: {
                    fontColor: 'black'
                }
            },
            responsive: true
        }
    });
}

/*
    Generates the char of the degree values every two hour for a specific day
*/
function generateChartTmp(mydata, day){
    //line
    let ctxL = document.getElementById("lineChart").getContext('2d');
    let myLineChart = new Chart(ctxL, {
        type: 'line',
        data: {
            labels: ["0h00", "2h00", "4h00", "6h00", "8h00", "10h00", "12h00", "14h00", "16h00", "18h00", "20h00", "22h00"],
            datasets: [{
                label: "Température en °C : " + day,
                data: mydata,
                backgroundColor: ['rgba(205, 0, 132, .2)',], 
                borderColor: ['rgba(255, 0, 0, .7)',],
                borderWidth: 2
            }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: 'red'
                }
            },
            responsive: true
        }
    });
}



class Weather {
    constructor(city, lat, lng) {
        this.city = city;
        this.lat = lat;
        this.lng = lng;
        this.url = "https://www.prevision-meteo.ch/services/json/";
        this.data = undefined;
        this.request();

    }

    request() {
        // console.log(this.city);
        console.log(this.lat);
        console.log(this.lng);
        if(this.lat != undefined && this.lng != undefined){
            this.url += "lat=" + this.lat + "lng=" + this.lng;
        }
        else
            this.url += this.city; 

        console.log("Weather URL " + this.url);
        const promise = fetch(this.url);
        promise.then(response => {return response.json()})    
            .then(data => {
                console.log(data)
                this.data = data;
                this.jsonToHTML()})
            .catch(err => {console.error(err)})
    }

    jsonToHTML(){
        if(!this.data.errors){
            document.getElementById("city").innerHTML   = this.city.toUpperCase();
            this.showCurrent();
            this.showDays();
        }
    }

    showCurrent() {
        document.getElementById("day").innerHTML       = "Maintenant ";
        document.getElementById("date").innerHTML      =  this.data.fcst_day_0.date;  
        document.getElementById("condition").innerHTML = this.data.current_condition.condition;
        document.getElementById("humidity").innerHTML  = "Humidity: " + this.data.current_condition.humidity;
        document.getElementById("tmp").innerHTML       = "Temperature: " + this.data.current_condition.tmp + "°C";
        const img = new Image();
        img.src = this.data.current_condition.icon;
        const myNode = document.getElementById("img");
        while (myNode.lastElementChild) {
            myNode.removeChild(myNode.lastElementChild);
        }
        document.getElementById("img").appendChild(img);
        this.history();
    }
    
    showDays(){
        for (let dayNb = 1; dayNb < 4; dayNb++) {
            const data = this.data["fcst_day_" + dayNb];
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

    history(){
        let listCity = document.getElementById("historyData");
        let isPresent = false;
        for (let c of listCity.childNodes)
            if(c.id == this.city.toLowerCase())
                isPresent = true;
        if (!isPresent){
            let child = document.createElement('div');
            child.className = "row align-items-start";
            child.id = this.city.toLowerCase();
            let text = document.createTextNode(this.city.toUpperCase() + " : " + this.data.current_condition.condition + " : " + this.data.current_condition.tmp + "°C");
            let img = new Image();
            img.src = this.data.current_condition.icon;
            img.width = 30;
            child.appendChild(img);
            child.appendChild(text);
            listCity.appendChild(child);
        }        
    }
}
class Weather {
    constructor(city, lat, lng) {
        this.url = "https://www.prevision-meteo.ch/services/json/";
        this.city = city;
        this.json = undefined;
        this.lat = lat;
        this.lng = lng;
        this.requestJson();
    }

    requestJson() {
        let url = this.url + this.city;
        if (this.lat != undefined && this.lng != undefined){
            url = this.url + "lat=" + this.lat + "lng=" + this.lng; 
        }
        console.log(url)
        let meteo = fetch(url).then((resp) => { return resp.json(); })
            .then((json) => {
                this.json = json;
                this.showJsonData();
                if (this.json.errors)
                    return;
                if (this.json.current_condition)
                    this.showCurrent();
                this.showNextDays();
                chart(this.getTemperaturesTab(true), this.getTemperaturesTab(false), this.getDaysTab());
            })
            .catch((err) => console.log(err));
        return meteo;
    }
    
    getTemperaturesTab(ismin){
        let tab = [];
        for (let i = 0; i < 5; i++)
            if (this.json["fcst_day_" + i]){
                if (ismin) tab.push(parseInt(this.json["fcst_day_" + i].tmin));
                else tab.push(parseInt(this.json["fcst_day_" + i].tmax));
            }
        return tab;
    }

    getDaysTab(){
        let tab = [];
        for (let i = 0; i < 5; i++)
            if (this.json["fcst_day_" + i])
                tab.push(this.json["fcst_day_" + i].day_long);
        return tab;
    }
    showJsonData(){
        document.getElementById("collapseData").innerHTML = "<pre>" + syntaxHighlight(JSON.stringify(this.json, undefined, '\t')) +"</pre>";
    }

    showCurrent() {
        document.getElementById("tdh0").innerHTML      = "Maintenant";  
        document.getElementById("condition").innerHTML = this.json.current_condition.condition;
        document.getElementById("humidity").innerHTML  = "Humidity: " + this.json.current_condition.humidity;
        document.getElementById("tmp").innerHTML       = "Temperature: " + this.json.current_condition.tmp + "°C";
        let img = new Image();
        img.src = this.json.current_condition.icon;
        let node =  document.getElementById("img");
        this.clearNode(node);
        node.appendChild(img);
        this.history();

    }

    clearNode(node){
        node.querySelectorAll('*').forEach(n => n.remove());
    }

    showNextDays() {
        for (let i = 0; i < 5; i++)
            if (this.json["fcst_day_" + i])
                this.showNextDay(i);
    }

    history(){
        let node = document.getElementById("collapseHistoryData");
        let ispresent = false;
        for (c of node.childNodes)
            if(c.id == this.city.toLowerCase().trim())
                ispresent = true;
            
                
        if (!ispresent){
            let child = document.createElement('div');
            child.className = "row align-items-start";
            child.id = this.city.toLowerCase();

            let text = document.createTextNode(
                this.city.charAt(0).toUpperCase() + this.city.substring(1,this.city.length).toLowerCase()
                +" : " + this.json.current_condition.condition + " : " + this.json.current_condition.tmp + "°C");

            let img = new Image();
            img.src = this.json.current_condition.icon;
            img.width = 30;
            child.appendChild(img);
            child.appendChild(text);
            node.appendChild(child);
        }
    }

    showNextDay(dayNumber){
        let cond     = document.getElementById("condition" + dayNumber);
        let tmin     = document.getElementById("tmin"+ dayNumber);
        let tmax     = document.getElementById("tmax"+ dayNumber);
        let data     = this.json["fcst_day_" + dayNumber];
        tmin.innerHTML = "tmin: " + data.tmin + "°C";
        tmax.innerHTML = "tmax: " + data.tmax + "°C";
        cond.innerHTML = data.condition;
        
        let img = new Image();
        img.src = data.icon;
        document.getElementById("hd" + dayNumber).innerHTML  =  data.day_long;     
        let node = document.getElementById("img" + dayNumber);
        this.clearNode(node);
        node.appendChild(img);

        Object.keys(data.hourly_data).forEach(e => {
                let hour = new Hour(data.hourly_data[e],e,dayNumber);
                hour.showHour();
        });
    }
}
class Map {
    constructor(){
        this.map    = L.map('mapid').setView([44.8430557, -0.5750000], 13);
        this.marker = undefined;
        this.configureMap();
        this.startMap();
        
    }

    configureMap(){
        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
        {
           attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
           maxZoom: 18,
           id: 'mapbox/streets-v11',
           tileSize: 512,
           zoomOffset: -1,
           accessToken: 'pk.eyJ1IjoieXVraXl1a2lxc2RzIiwiYSI6ImNrZnR2NnRobjBudWMzMG1qZGxnMndvM3EifQ.ZCYPHmrIY5g2ejoI8fvXOg'
       }).addTo(this.map);

       this.marker = L.marker([44.8430557, -0.5750000]).addTo(this.map)
       .bindPopup("<b>Move the marker to get meteo of this location</b><br />").openPopup();
    }

    getCity(coordinates) { 
        console.log(coordinates);
        var lat = coordinates["lat"]; 
        var lng = coordinates["lng"]; 
       

        fetch(" https://us1.locationiq.com/v1/reverse.php?key=pk.626ff106f8c58353bba755d7da96331b&lat=" + 
        lat + "&lon=" + lng + "&format=json")
        .then((resp) => { return resp.json(); })
        .then((json) => {
            if (json.address != undefined && json.address.city != undefined){
                document.getElementById("city").value = json.address.city;
                console.log(document.getElementById("city").value)
                new Weather(document.getElementById("city").value, lat, lng);
             }
        })
        .catch((err) => console.log(err));
      
    } 

    moveMarker(e) {
        if (this.marker != undefined )
            this.map.removeLayer(this.marker);
        let new_marker = L.marker(e);
        this.marker  = new_marker;
        this.map.addLayer(new_marker);
        this.map.setView(e);
    }
    

    startMap(){
        this.map.on('click', e => {
            this.moveMarker(e.latlng)
            this.getCity(e.latlng);
        });
    }
}
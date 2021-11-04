class Map {
    constructor(){
        this.map = L.map('mapid').setView([44.8430557, -0.5750000], 13);
        this.marker = undefined;
        this.configureMap();
        this.startMap();       
    }

    configureMap(){
        const layer = L.tileLayer('https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}', 
        {
            attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            minZoom: 0,
            maxZoom: 22,
            subdomains: 'abcd',
            accessToken: '6r4lsKtVRbmZG0AyMTSNfLaAKTBaqcWGl4nJLRDO5djPSTuDIUnbyBPdvMZ7pAtq'
        }).addTo(this.map);

        this.marker = L.marker([44.8430557, -0.5750000]).addTo(this.map)
        .bindPopup("<b>Move the marker </b>").openPopup();

        this.map.addEventListener('click', e => {
            this.map.removeLayer(this.marker);
            this.marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map)
            
        });
    }

    getCity(coord) { 
        console.log(coord);
        const lat = coord["lat"]; 
        const lng = coord["lng"]; 
        fetch(" https://us1.locationiq.com/v1/reverse.php?key=pk.626ff106f8c58353bba755d7da96331b&lat=" + 
        lat + "&lon=" + lng + "&format=json").then(response => { return response.json(); })
            .then(json => {
                if (json.address != undefined && json.address.city != undefined){
                    console.log(json.address.city)
                    new Weather(json.address.city, lat, lng)
                }
            })
            .catch(err => {console.error(err)});
    } 


    startMap(){
        this.map.on('click', e => {
            this.getCity(e.latlng);
        });
    }
}
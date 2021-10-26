class Postal {
    constructor(code){
        this.code   = code;
        this.getCities();
    }

    getCities(){
        console.log('https://vicopo.selfbuild.fr/cherche/' + this.code);
        let f = fetch('https://vicopo.selfbuild.fr/cherche/' + this.code)
                .then(response => response.json())
                .then(json => 
                    {
                        if (json.cities[0]){
                            let w = new Weather(json.cities[0].city,undefined,undefined);
                            document.getElementById("city").value = json.cities[0].city; 
                        }
                    })
                .catch((err) => console.log(err));
        
    }

}
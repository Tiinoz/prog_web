class Hour{
    constructor (data, hour, day) {
        this.data = data;
        this.hour = hour;
        this.day  = day;
    }
    showHour(){
            let result = this.hour + "\n" + this.data.DPT2m + " - " + this.data.TMP2m + " °C " ;
            document.getElementById("d" + this.day + "h" + this.hour.split('H')[0]).innerHTML = result;       
    }
}
const NBDAYS = 5;
const map = new Map();
let scrollDown = [false, false, false, false, false];


initDaysDiv();
setInterval(scrollAllHours,1000);
setInterval(getAvailablesCities,500);

function scrollAllHours(){
    for (let i = 0; i < 5; i++)
        scroll('hourly' + i, i);
}

function initDaysDiv(){
    for (let i = 0; i < NBDAYS; i++){
        let node = document.getElementById('hourly' + i);
        let aligned = document.createElement('div');
        aligned.className = "row align-items-start";
        for (let h = 0; h < 24; h++){
            let hourDiv = document.createElement('div');
            hourDiv.id = "d" + i + "h" + h; 
            aligned.appendChild(hourDiv);
        }
        node.appendChild(aligned);
    }
}

function scroll(id, i){
    if (!scrollDown[i]){
       document.getElementById(id).scrollTop += document.getElementById(id).clientHeight /2;
       let current = document.getElementById(id).scrollTop;
       let max     = document.getElementById(id).scrollHeight - document.getElementById(id).clientHeight;
       if (current == max && current != 0 && max != 0){
            scrollDown[i] = true;
       }
    }
    else{
        let x = document.getElementById(id).scrollTop -= document.getElementById(id).clientHeight /2;
        if (x <= 0){
            document.getElementById(id).scrollTop = 0;
            scrollDown[i] = false;
        }
    }

}
let old_city = undefined;
function city(){
    let data = document.getElementById("city").value;
    if(old_city != data){
        if (!isNaN(data)){
            let postalSearch = new Postal(data);
        }
        else
        {
        let w = new Weather(data,undefined,undefined);
        }
    }
    old_city = data;
}


function chart(mydatamin, mydatamax, mylabels){
    let ch  = document.getElementById('myChart');
    let ctx = ch.getContext('2d');
    ch.width = 1900;
    ch.height = 500;
    let myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mylabels,
            datasets: [{
                label: 'Temperatures Min by week',
                data: mydatamin,
                backgroundColor: [
                    'rgba(209, 117, 19, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            },{
                label: 'Temperatures Max by week',
                data: mydatamax,
                backgroundColor: [
                    'rgba(229, 17, 19, 0.4)'
                ],
                borderColor: [
                    'rgba(55, 99, 132, 1)',
                    'rgba(154, 162, 235, 1)',
                    'rgba(255, 66, 86, 1)',
                    'rgba(75, 102, 192, 1)',
                    'rgba(253, 162, 255, 1)',
                    'rgba(155, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}



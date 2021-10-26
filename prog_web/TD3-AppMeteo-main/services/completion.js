function noDuplicates(tab, isText){
    let set = new Set();
    tab.forEach(element => set.add((isText) ? element.city.split(/(\d+)/)[0] : element.code));
    return [...set];
}


/* When you use datalist, behaviors navigators are differents.
 * Firefox has unlimited size datalist, but Chrome hasn't (512)
 */
const max_autocompleteChrome = 512;

function autoComplete(completionTab, isText){
    const list = document.getElementById('cityList');
    let tab = noDuplicates(completionTab.cities, isText);
    if (tab.length >= max_autocompleteChrome){
        list.querySelectorAll('*').forEach(n => n.remove());
        return;
    }
    tab.forEach(element => {
        let option = document.createElement('option');
        option.value = element;
        ispresent = false;
        for (c of list.childNodes)
            if (c.value == element)
                ispresent = true;    
        if(!ispresent)
            list.appendChild(option);
    });

}



function getAvailablesCities(){
    //const url = 'https://www.prevision-meteo.ch/services/json/list-cities';
    /* if I didn't have CORS issues, thats what i would have done, but they didn't allow access control allow origin*/
    let doc = document.getElementById('city').value;
    if (doc == '') return;
    const url = 'https://vicopo.selfbuild.fr/cherche/' + doc;
    let f = fetch(url)
                .then(response => response.json())
                .then(json => autoComplete(json, isNaN(doc)))
                .catch((err) => console.log(err));
    
}
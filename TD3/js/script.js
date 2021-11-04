const search = document.getElementById("search-button");
const searchText = document.getElementById("search-text");
const map = new Map();

search.addEventListener("click", getMeteo);

function getMeteo() {
    const name = searchText.value.toLowerCase();
    new Weather(name, undefined, undefined);
}


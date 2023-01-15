const allTabsBody = document.querySelectorAll('.tab-body-single');
const allTabsHead = document.querySelectorAll('.tab-head-single');
const searchForm = document.querySelector('.app-header-search');
let searchList = document.getElementById('search-list');

let activeTab = 1, allData;

// methods

const init = () => {
    // initialization
    initializeHero("man");
    showActiveTabHead();
    showActiveTabBody();
};

const initializeHero = async(searchText) => {
    let url = `https://www.superheroapi.com/api.php/1652398125216523/search/${searchText}`;
    try {
        const response = await fetch(url);
        allData = await response.json();
        if(allData.response === 'success') {
            // console.log(allData.results, allData.results.length);
            let min = 0;
            let max = allData.results.length - 1;
            idx = Math.floor(Math.random() * (max - min + 1)) + min;
            console.log(allData.results[idx]);
            let hero = [];
            hero.push(allData.results[idx]);
            showSuperheroDetails(hero);
        }
    } catch (error) {
        console.log(error);
    }
};

const showActiveTabHead = () => allTabsHead[activeTab - 1].classList.add('active-tab');

const showActiveTabBody = () => {
    hideAllTabsBody();
    allTabsBody[activeTab - 1].classList.add('show-tab');
};

const hideAllTabsHead = () => allTabsHead.forEach(singleTabHead =>singleTabHead.classList.remove('active-tab'));

const hideAllTabsBody = () => allTabsBody.forEach(singleTabBody => singleTabBody.classList.remove('show-tab'));

const showSearchList = (data) => {
    searchList.innerHTML = '';
    data.forEach(dataItem => {
        const divElem = document.createElement('div');
        divElem.classList.add('search-list-item');
        divElem.innerHTML = `
            <img src="${dataItem.image.url ? dataItem.image.url : ""}" data-id="${dataItem.id}" alt="">
            <p data-id="${dataItem.id}">${dataItem.name}</p>
        `;
        searchList.appendChild(divElem);
    });
};

const fetchAllSuperHero = async(searchText) => {
    let url = `https://www.superheroapi.com/api.php/1652398125216523/search/${searchText}`;
    try {
        const response = await fetch(url);
        allData = await response.json();
        if(allData.response === 'success') {
            console.log(allData);
            showSearchList(allData.results);
        }
    } catch (error) {
        console.log(error);
    }
};

const getInputValue = (event) => {
    event.preventDefault();
    let searchText = searchForm.search.value;
    fetchAllSuperHero(searchText);
};

const showSuperheroDetails = (data) => {
    document.querySelector('.app-body-content-thumbnail').innerHTML = `
        <img src="${data[0].image.url}">
    `;
    document.querySelector('.name').textContent = data[0].name;
    document.querySelector('.powerstats').innerHTML = "";
    Object.keys(data[0].powerstats).forEach(key => {
        // console.log(key);
        // console.log(data[0].powerstats[key]);
        document.querySelector('.powerstats').innerHTML += `
            <li>
                <div><i class="fa-solid fa-shield-halved"></i><span>${key}</span></div><span>${data[0].powerstats[key]}</span>
            </li>
        `;
    });
    
    document.querySelector('.biography').innerHTML = "";
    Object.keys(data[0].biography).forEach(key => {
        document.querySelector('.biography').innerHTML += `
            <li>
                <span>${key}</span>
                <span>${data[0].biography[key]}</span>
            </li>
        `;
    });
    
    document.querySelector('.appearance').innerHTML = "";
    Object.keys(data[0].appearance).forEach(key => {
        document.querySelector('.appearance').innerHTML += `
            <li>
                <span><i class="fas fa-star"></i>${key}</span>
                <span>${data[0].appearance[key]}</span>
            </li>
        `;
    });
    
    document.querySelector('.connections').innerHTML = "";
    Object.keys(data[0].connections).forEach(key => {
        document.querySelector('.connections').innerHTML += `
        <li>
            <span>${key}</span>
            <span>${data[0].connections[key]}</span>
        </li>
        `;
    });
    
};

// event listener

window.addEventListener('DOMContentLoaded', () => init());

searchForm.addEventListener('submit', getInputValue);

searchForm.search.addEventListener('keyup', () => {
    if(searchForm.search.value.length > 1) {
        fetchAllSuperHero(searchForm.search.value);
    } else {
        searchList.innerHTML = '';
    }
});

searchList.addEventListener('click', (event) => {
    let searchId = event.target.dataset.id;
    console.log(searchId);
    let singleData = allData.results.filter(singleData => {
        return searchId === singleData.id;
    });
    console.log(singleData);
    showSuperheroDetails(singleData);
    searchList.innerHTML = '';
});

allTabsHead.forEach(singleTabHead => {
    singleTabHead.addEventListener('click', () => {
        hideAllTabsHead();
        activeTab = singleTabHead.dataset.id;
        showActiveTabHead();
        showActiveTabBody();
    });
});









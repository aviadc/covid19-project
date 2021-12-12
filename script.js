
const data = {
  
};

let continentConfig = {
  type: 'bar',
  data: data,
  options: {
    responsive: true,
  }
};

let countryConfig = {
  type: 'doughnut',
  data: data,
  options: {
    responsive: true,
  }
};

const regions = {
  asia: {name: 'asia'},
  europe: {name: 'europe'},
  americas: {name: 'americas'},
  africa: {name: 'africa'}
};
  
const regionincludeCountryes = {
  asia: [],
  europe: [],
  americas: [],
  africa: [],
}

const worldDataObj = {
  asia: {},
  africa: {},
  europe: {},
  americas: {}
};

const worldDataArr = {
  asia: {},
  africa: {},
  europe: {},
  americas: {}
}

let statButtonsWasCalled = false;
let selectedRegion = '';


const continentChart = new Chart(
  document.getElementById('continent-chart'),
  continentConfig
);
const countryChart = new Chart(
  document.getElementById('country-chart'),
  countryConfig
);


const regionButtons = document.querySelectorAll('.continent-btn');
const container = document.querySelector('.container');
const statAndContinentContainer = document.querySelector('.stat-and-continent-container');
const chartContainer = document.querySelector('.chart-container');
const countriesAndSmallChartContainer = document.querySelector('.countries-and-small-chart-container');

createEventlistenerForContinent();

function createEventlistenerForContinent(){
  regionButtons.forEach((region)=>{
    const theregion = region.textContent;
    region.addEventListener('click',function(e){
      countriesAndSmallChartContainer.removeChild(countriesAndSmallChartContainer.firstChild);
     if(!regions[theregion].wasFetched){
       getCountrysByRegion(theregion);
     }
     countriesAndSmallChartContainer.prepend(regions[theregion].div);
     regions[theregion].wasFetched = true;
     if(!statButtonsWasCalled){
       createStatButtons();
       statButtonsWasCalled=true;
     }
    selectedRegion = theregion;
    resetCharts();
    console.log(worldDataArr);
    })
  })
}

async function getCountrysByRegion(region){
  createDivElement(region);
  try{
    const result = await fetch(`https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${region}`);
    // console.log(result);
    const data = await result.json();
    createArrAtWorldData(region);
    addCountriesAndElements(data,region,regions[region].div);
  }catch(e){
    console.log(e);
  }
}

 function addCountriesAndElements(data,region,divElement){
   data.forEach((country)=>{
    addCountriesButtons(country.name.common,divElement);
    getDataforCountry(country.cca2,region);
    regionincludeCountryes[region].push({name: country.name.common ,cca2: country.cca2});
   })
}

async function getDataforCountry(country,region){
  try{
    const result = await fetch(`https://intense-mesa-62220.herokuapp.com/https://corona-api.com/countries/${country}`);
    // console.log(result);
    const data = await  result.json();
    // console.log(data);
    storecountryDetailsObj(region,data);
    storecountryDetailsArr(region,data);
  }catch(e){
    console.log(e);
  }
}

function addCountriesButtons(country,divElement){
  const btn = document.createElement('button');
  btn.textContent = country;
  divElement.appendChild(btn);
}

function createDivElement(region){
  const countriesContainer = document.createElement('div');
  countriesContainer.classList.add('countries-container');
  countriesContainer.addEventListener('click',(e)=>{
    let country = e.target.textContent.split(' ').join('');
    updateCountryChart(e.target.textContent,worldDataObj[region][country]);
    console.log(e.target.textContent);
  })
  regions[region].div = countriesContainer;
}

function storecountryDetailsObj(region,data){
  const name = data.data.name.split(' ').join('');
  // console.log(region);
  worldDataObj[region][name] = 
  {
    confirmed: data.data.latest_data.confirmed,
    deaths: data.data.latest_data.deaths,
    recovered: data.data.latest_data.recovered,
    critical: data.data.latest_data.critical,
    newCases: data.data.today.confirmed,
    newDeaths: data.data.today.deaths
  }
}

function storecountryDetailsArr(region,data){
  worldDataArr[region].country.push(data.data.name);
  worldDataArr[region].confirmed.push(data.data.latest_data.confirmed);
  worldDataArr[region].deaths.push(data.data.latest_data.deaths);
  worldDataArr[region].recovered.push(data.data.latest_data.recovered);
  worldDataArr[region].critical.push(data.data.latest_data.critical);
 
}

function createArrAtWorldData(region){
  worldDataArr[region].country = [];
  worldDataArr[region].confirmed = [];
  worldDataArr[region].deaths = [];
  worldDataArr[region].recovered = [];
  worldDataArr[region].critical = [];
}

function createStatButtons(){
  
  console.log('hey');
  const statContainer = document.createElement('div');
  const confirmed = document.createElement('button');
  confirmed.textContent = 'confirmed';
  confirmed.addEventListener('click',continentChartEventListener);
  const deaths = document.createElement('button');
  deaths.textContent = 'deaths';
  deaths.addEventListener('click',continentChartEventListener);
  const recovered = document.createElement('button');
  recovered.textContent = 'recovered';
  recovered.addEventListener('click',continentChartEventListener);
  const critical = document.createElement('button');
  critical.textContent = 'critical';
  critical.addEventListener('click',continentChartEventListener);
  statContainer.append(confirmed,deaths,recovered,critical);
  statAndContinentContainer.prepend(statContainer);
}

function continentChartEventListener(e){
  updateContinentChart(selectedRegion,e.target.textContent)
  // console.log(e.target.textContent);
}

function updateContinentChart(region,stat){
  continentChart.data.labels = worldDataArr[region].country;
  continentChart.data.datasets = [{
    label: stat,
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: worldDataArr[region][stat],
  }]
 continentChart.update();
}

function updateCountryChart(country,data){
  countryChart.data.labels = ['confirmed','newCases','deaths','newDeaths','recovered','critical'];
  countryChart.data.datasets = [{
    label: country,
    backgroundColor: ['cadetblue','crimson','darkgoldenrod','goldenrod','peru','plum'],
    borderColor: 'rgb(255, 99, 132)',
    data: [data.confirmed,data.newCases,data.deaths,data.newDeaths,data.recovered,data.critical],
  }]
 countryChart.update();
}

function resetCharts(){
  continentChart.data.labels = [];
  continentChart.data.datasets = [{
    label: "",
    data: [],
  }]
  countryChart.data.labels = [];
 countryChart.data.datasets = [{
    label: "",
    data: [],
  }]
 continentChart.update();
 countryChart.update();
}


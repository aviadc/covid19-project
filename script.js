
const data = { //data for the charts
  
};

let continentConfig = { //for continent chart
  type: 'bar',
  data: data,
  options: {
    responsive: true,
  }
};

let countryConfig = {  //for country chart
  type: 'doughnut',
  data: data,
  options: {
    responsive: true,
  }
};

// store Additionally the div element of the countries 
//and a property : 'wasfetched' that indicate if the data of the country was already fetched
const regions = { 
  asia: {name: 'asia'},
  europe: {name: 'europe'},
  americas: {name: 'americas'},
  africa: {name: 'africa'}
};
  
// the object that store the data for country chart, 
//the structure is chain of objects : world.region.country: data 
const worldDataObj = {
  asia: {},
  africa: {},
  europe: {},
  americas: {}
};
// the object that store the data for continent chart, 
//the structure is arrays of data : world.region.(many arrays of data, for exmple data.confirmed)
const worldDataArr = {
  asia: {},
  africa: {},
  europe: {},
  americas: {}
}

let statButtonsWasCalled = false; //indicate if the confirmed/critical.. buttons were created
let selectedRegion = ''; //indicate which continent button was pressed
const colors =  ['cadetblue','crimson','springgreen','goldenrod','navy','plum','orange','khaki']; // for the continent charts

//the continent chart variable
const continentChart = new Chart(
  document.getElementById('continent-chart'),
  continentConfig
);
//the country chart variable
const countryChart = new Chart(
  document.getElementById('country-chart'),
  countryConfig
);


const regionButtons = document.querySelectorAll('.continent-btn');
const statAndContinentContainer = document.querySelector('.stat-and-continent-container');
const chartContainer = document.querySelector('.chart-container');
const countriesAndSmallChartContainer = document.querySelector('.countries-and-small-chart-container');



function createEventlistenerForContinent(){
  regionButtons.forEach((region)=>{
    const theregion = region.textContent;
    region.addEventListener('click',function(e){
      countriesAndSmallChartContainer.removeChild(countriesAndSmallChartContainer.firstChild); //remove the div that store all the countries buttins
     if(!regions[theregion].wasFetched){ //checks if the data already fetched
       getCountrysByRegion(theregion); //fetch the data
     }
     countriesAndSmallChartContainer.prepend(regions[theregion].div);//add the div that store all the countries buttons
     regions[theregion].wasFetched = true;
     if(!statButtonsWasCalled){ //checks if the stat buttons already exist on the screen
       createStatButtons();
       statButtonsWasCalled=true;
     }
    selectedRegion = theregion;
    resetCharts();
    })
  })
}

createEventlistenerForContinent(); 

//the function that fetchs tha data and store it in the relevant objects
async function getCountrysByRegion(region){
  createDivElement(region);
  try{
    const result = await fetch(`https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${region}`);
    // console.log(result);
    const data = await result.json();
    createArrAtWorldData(region);
    addCountriesAndElements(data,region,regions[region].div); //create the countries buttons
  }catch(e){
    console.log(e);
  }
}

 function addCountriesAndElements(data,region,divElement){
   data.forEach((country)=>{
    addCountriesButtons(country.name.common,divElement);
    getDataforCountry(country.cca2,region);
   })
}

async function getDataforCountry(country,region){ //fetches the covid data for each country
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

function createDivElement(region){ //create the div that store the countries buttons and also add event listener to the div only
  const countriesContainer = document.createElement('div');
  countriesContainer.classList.add('countries-container');
  countriesContainer.addEventListener('click',(e)=>{
    let country = e.target.textContent.split(' ').join('');
    updateCountryChart(e.target.textContent,worldDataObj[region][country]);
  })
  regions[region].div = countriesContainer;
}

function storecountryDetailsObj(region,data){
  const name = data.data.name.split(' ').join('');
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

function storecountryDetailsArr(region,data){ //store the data structered with array for the country chart
  worldDataArr[region].country.push(data.data.name);
  worldDataArr[region].confirmed.push(data.data.latest_data.confirmed);
  worldDataArr[region].deaths.push(data.data.latest_data.deaths);
  worldDataArr[region].recovered.push(data.data.latest_data.recovered);
  worldDataArr[region].critical.push(data.data.latest_data.critical);
}

function createArrAtWorldData(region){ //assign an empty array the the propertis for easy life after
  worldDataArr[region].country = [];
  worldDataArr[region].confirmed = [];
  worldDataArr[region].deaths = [];
  worldDataArr[region].recovered = [];
  worldDataArr[region].critical = [];
}

function createStatButtons(){//create the confirm/critical... buttons
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

function continentChartEventListener(e){ //add event listener to continent chart stat buttons
  updateContinentChart(selectedRegion,e.target.textContent)
}

function updateContinentChart(region,stat){ //every click the function updates the chart
  continentChart.data.labels = worldDataArr[region].country;
  continentChart.data.datasets = [{
    label: stat,
    backgroundColor: colors[Math.floor(Math.random()*colors.length)],
    borderColor: 'rgb(255, 99, 132)',
    data: worldDataArr[region][stat],
  }]
 continentChart.update();
}

function updateCountryChart(country,data){ //every click the function updates the chart
  countryChart.data.labels = ['confirmed','newCases','deaths','newDeaths','recovered','critical'];
  countryChart.data.datasets = [{
    label: country,
    backgroundColor: ['cadetblue','crimson','springgreen','goldenrod','navy','plum'],
    borderColor: 'rgb(255, 99, 132)',
    data: [data.confirmed,data.newCases,data.deaths,data.newDeaths,data.recovered,data.critical],
  }]
 countryChart.update();
}

function resetCharts(){ //reset the charts when the user click a continent button
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


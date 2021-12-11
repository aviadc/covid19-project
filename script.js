// create buttons 
// get the countries the each continent 
// get ditails of each country:
// Confirmed Cases
// - Number of Deaths
// - Number of recovered
// - Number of critical condition 
// 
//
//
//
// 
//

let labels = [
  
];

let data = {
  labels: labels,
  datasets: [{
    label: 'My First dataset',
    backgroundColor: 'rgb(255, 99, 132)',
    borderColor: 'rgb(255, 99, 132)',
    data: [0,50, 100,50,0],
  }]
};

const config = {
  type: 'line',
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

const worldDataObjArr = {
  asia: {},
  africa: {},
  europe: {},
  americas: {}
}


let staButtonsWasCalled = false;



const regionButtons = document.querySelectorAll('.continent-btn');
const container = document.querySelector('.container');
const statAndContinentContainer = document.querySelector('.stat-and-continent-container');

// container.addEventListener('click',(e)=>{
//   console.log(e.target.textContent);
// })


 console.log(regionButtons); 
 regionButtons.forEach((region)=>{
   region.addEventListener('click',function(e){
    container.removeChild(container.lastChild);
    if(!regions[region.textContent].wasFetched){
      getCountrysByRegion(region.textContent);
    }
    container.appendChild(regions[region.textContent].div);
    regions[region.textContent].wasFetched = true;
    if(!staButtonsWasCalled){
      createStatButtons();
      staButtonsWasCalled=true;
    }
   })
 })

async function getCountrysByRegion(region){
  createDivElement(region);
  try{
    const result = await fetch(`https://intense-mesa-62220.herokuapp.com/https://restcountries.herokuapp.com/api/v1/region/${region}`);
    // console.log(result);
    const data = await result.json();
    // console.log(data);
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

// function addAllCountriesToAllRegions(){
//   regions.forEach((region)=>{
//     getCountrysByRegion(region.name);
//   })
// }

// addAllCountriesToAllRegions();
// console.log(regionincludeCountryes);

async function getDataforCountry(country,region){
  try{
    const result = await fetch(`https://intense-mesa-62220.herokuapp.com/https://corona-api.com/countries/${country}`);
    // console.log(result);
    const data = await  result.json();
    // console.log(data);
    storecountryDetailsObj(region,data)
  }catch(e){
    console.log(e);
  }
}
// getDataforCountry('AZ');

function addCountriesButtons(country,divElement){
  const btn = document.createElement('button');
  btn.textContent = country;
  divElement.appendChild(btn);
}

function createDivElement(region){
  const countriesContainer = document.createElement('div');
  countriesContainer.classList.add('countries-conrainer');
  countriesContainer.addEventListener('click',(e)=>{
    console.log(e.target.textContent);
  })
  regions[region].div = countriesContainer;
}

function storecountryDetailsObj(region,data){
  const name = data.data.name.split(' ').join('');
  // console.log(region);
  worldDataObj[region][name] = 
  {
    confirmedCases: data.data.latest_data.confirmed,
    NumberOfDeaths: data.data.latest_data.deaths,
    NumberOfRrecovered: data.data.latest_data.recovered,
    NumberOfCriticalCondition: data.data.latest_data.critical,
    newCases: data.data.today.confirmed,
    newDeaths: data.data.today.deaths
  }
}

function regionincludeCountryesArr(region,data){

}

function createStatButtons(){
  console.log('hey');
  const statContainer = document.createElement('div');
  const confirmed = document.createElement('button');
  confirmed.textContent = 'confirmed';
  const deaths = document.createElement('button');
  deaths.textContent = 'deaths';
  const recoverd = document.createElement('button');
  recoverd.textContent = 'recoverd';
  const critical = document.createElement('button');
  critical.textContent = 'critical';
  statContainer.append(confirmed,deaths,recoverd,critical);
  statAndContinentContainer.prepend(statContainer);
}

// getDataforCountry('AZ');

function createChart(stat,region){
  switch(stat){
    case 'confirmed':
      labels = regionincludeCountryes.region;
      data.data = []
      break;
    case 'deaths':
      break;
    case 'recoverd':
      break;
    case 'critical':
      break;
  }
  const myChart = new Chart(
    document.getElementById('myChart'),
    config
  );
}
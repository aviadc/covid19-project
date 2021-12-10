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

const worldData = {};

const regionButtons = document.querySelectorAll('button');
const container = document.querySelector('.container');




 console.log(regionButtons); 
 regionButtons.forEach((region)=>{
   region.addEventListener('click',function(e){
    getCountrysByRegion(region.textContent);
    console.log(regions[region.textContent].div);
    container.appendChild(regions[region.textContent].div);
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
    // getDataforCountry(country);
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

async function getDataforCountry(country){
  try{
    const result = await fetch(`https://intense-mesa-62220.herokuapp.com/https://corona-api.com/countries/${country}`);
    console.log(result);
    const data = await  result.json();
    console.log(data);
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
  console.log(countriesContainer); 
  regions[region].div = countriesContainer;
}
// createDivElement('asia');
// console.log(regions.asia);
// console.log(container);
// container.appendChild(regions.asia.div);


window.onload = () => {
  getCountryData();
  getHistoricalData();
  getWorldCoronaData();
  // document.querySelector(".active-cases-card").addEventListener("click", () => {
  //   console.log("Yooo we clicked!!!"); //Not Working
  // });
};

var map;
var infoWindow;
let coronaGlobalData;
let mapCircles = [];
var casesTypeColors = {
  cases: "#1d2c4d",
  active: "#9d80fe",
  recovered: "#7dd71d",
  deaths: "#fb4443",
};
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 39.8283, lng: -98.5795 },
    zoom: 3,
    styles: mapStyle,
  });
  infoWindow = new google.maps.InfoWindow();
}
const changeDataSelection = (casesType) => {
  // console.log(mapCircles);
  clearTheMap(); //Clear the existing Markers
  showDataOnMap(coronaGlobalData, casesType);

  // var header = document.getElementById("cards-container");
  var btns = document.getElementsByClassName("stat-card-container");
  // // console.log(btns);
  // header.forEach((card) => {
  //   console.log(card);
  // });
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
      var current = document.getElementsByClassName("cases-card");
      current[0].className = current[0].className.replace(" cases-card", "");
      this.className += " cases-card";
    });
    // console.log(btns);
  }
};

const clearTheMap = () => {
  for (let circle of mapCircles) {
    circle.setMap(null);
  }
};
const getCountryData = (casesType) => {
  fetch("https://corona.lmao.ninja/v2/countries")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      coronaGlobalData = data;
      // console.log(data);

      showDataOnMap(data);
      showDataInTable(data);
    });
};
const getWorldCoronaData = () => {
  fetch("https://disease.sh/v2/all")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      buildPieChart(data);
    });
};
const getHistoricalData = () => {
  fetch("https://corona.lmao.ninja/v2/historical/all?lastdays=120")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let chartData = buildChartData(data); //Why when console logged it's giving data?
      // console.log(data.cases);
      // console.log(data);
      for (let title in data) {
        for (let date in data[title]) {
          let dataPoint = {
            x: date,
            y: data[title][date],
          };
          // console.log(dataPoint); //Access all data points at once for cases, recovered and deaths
        }
      }
      buildChart(chartData); //Why when console logged it's undefined? and not giving data?
    });
};

const openInfoWindow = () => {
  infoWindow.open(map);
};

const showDataOnMap = (data, casesType = "cases") => {
  // if (!casesType) {
  //   casesType = "cases"; //Set Default parameter inside parameter
  // }
  data.map((country) => {
    let countryCenter = {
      lat: country.countryInfo.lat,
      lng: country.countryInfo.long,
    };
    // console.log(casesTypeColors["casesType"]);
    // console.log(casesTypeColors.casesType); //Same as above
    // console.log(casesTypeColors[casesType]);

    var countryCircle = new google.maps.Circle({
      strokeColor: casesTypeColors[casesType],
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: casesTypeColors[casesType],
      fillOpacity: 0.35,
      map: map,
      center: countryCenter,
      radius: country[casesType],
    });
    mapCircles.push(countryCircle);
    var html = `
            <div class="info-container">
                <div class="info-flag" style="background-image: url(${country.countryInfo.flag});">
                </div>
                <div class="info-name">
                    ${country.country}
                </div>
                <div class="info-confirmed">
                    Total: ${country.cases}
                </div>
                <div class="info-recovered">
                    Recovered: ${country.recovered}
                </div>
                <div class="info-deaths">   
                    Deaths: ${country.deaths}
                </div>
            </div>
        `;

    var infoWindow = new google.maps.InfoWindow({
      content: html,
      position: countryCircle.center,
    });
    google.maps.event.addListener(countryCircle, "mouseover", function () {
      infoWindow.open(map);
    });

    google.maps.event.addListener(countryCircle, "mouseout", function () {
      infoWindow.close();
    });
  });
};

const showDataInTable = (data) => {
  var html = "";
  data.forEach((country) => {
    html += `
        <tr>
            <td>
    <img src="${country.countryInfo.flag}" alt="Flag">
            
            ${country.country}</td>
            <td>${country.cases}</td>
            <td>${country.recovered}</td>
            <td>${country.deaths}</td>
        </tr>
        `;
  });
  document.getElementById("table-data").innerHTML = html;
};

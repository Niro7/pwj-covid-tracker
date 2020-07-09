let chartData = [];
let chartRecoveredData = [];
let chartDeathData = [];
const buildChartData = (data) => {
  // for (let title in data) {
  //   for (let date in data[title]) {
  //     let newDataPoint = {
  //       x: date,
  //       y: data[title][date],
  //     };
  //     // chartData.push(newDataPoint);
  //     // console.log(newDataPoint);
  //   }
  // }

  for (let date in data.cases) {
    let newDataPoint = {
      x: date,
      y: data.cases[date],
    };
    chartData.push(newDataPoint);
  }

  for (let date in data.deaths) {
    let newDataPoint = {
      x: date,
      y: data.deaths[date],
    };
    chartDeathData.push(newDataPoint);
  }
  for (let date in data.recovered) {
    let newDataPoint = {
      x: date,
      y: data.recovered[date],
    };
    chartRecoveredData.push(newDataPoint);
  }
  console.log(data);
  // console.log(data.recovered);

  // console.log(chartRecoveredData);

  return chartData;
};

const buildPieChart = (data) => {
  // It is where the chart appears in html
  var ctx = document.getElementById("myPieChart").getContext("2d"); //Draws the chart on html
  var myPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      datasets: [
        {
          data: [data.active, data.recovered, data.deaths],
          backgroundColor: ["#9d80fe", "#7dd71d", "#fb4443"],
        },
      ],

      // These labels appear in the legend and in the tooltips when hovering different arcs
      labels: ["Active", "Recovered", "Deaths"],
    },
    options: {
      responsiveness: true,
      maintainAspectRatio: false,
    },
  });
};

const buildChart = (data) => {
  buildChartData(data);
  console.log("All if good");
  var timeFormat = "MM/DD/YY";
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      datasets: [
        {
          label: "Total Cases",
          backgroundColor: "#1d2c4d4b",
          borderColor: "#1d2c4d",
          data: chartData,
        },
        {
          label: "Recovered",
          backgroundColor: "#7dd71d4b",
          borderColor: "#7dd71d",
          data: chartRecoveredData,
        },
        {
          label: "Deaths",
          backgroundColor: "#fb44434b",
          borderColor: "#fb4443",
          data: chartDeathData,
        },
      ],
    },

    // Configuration options go here
    options: {
      maintainAspectRatio: false,
      tooltips: {
        mode: "index",
        intersect: false,
      },
      scales: {
        xAxes: [
          {
            type: "time",
            time: {
              format: timeFormat,
              tooltipFormat: "ll",
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              // Include a dollar sign in the ticks
              callback: function (value, index, values) {
                return numeral(value).format("0a").toUpperCase();
              },
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
    },
  });
};

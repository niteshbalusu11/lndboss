import { Line } from 'react-chartjs-2';
import React from 'react';
import resgisterCharts from '../register_charts';

// Generate Sales Data
function createData(time: string, amount?: number) {
  return { time, amount };
}

// const data = [
//   createData('nitesh', 0),
//   createData('archana', 300),
//   createData('30', 600),
//   createData('40', 800),
//   createData('50', 1500),
//   createData('60', 2000),
//   createData('70', 2400),
//   createData('80', 2400),
// ];

const data = [1, 2, 3, 4, 5, 6, 7];

const Chart = () => {
  resgisterCharts();
  const { chartData, options } = renderChart();
  return (
    <>
      <Line data={chartData} options={options} id="Chart" />
    </>
  );
};

export default Chart;

const renderChart = (): any => {
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Testing Chart',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'black',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'white',
        pointBackgroundColor: '#fff',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data,
      },
    ],
  };

  const options = {
    aspectRatio: 4,
    plugins: {
      // 'legend' now within object 'plugins {}'
      legend: {
        labels: {
          color: 'black', // not 'fontColor:' anymore
          // fontSize: 18  // not 'fontSize:' anymore
          font: {
            size: 18, // 'size' now within object 'font {}'
          },
        },
        height: 100,
        width: 100,
      },
    },
    scales: {
      y: {
        // not 'yAxes: [{' anymore (not an array anymore)
        ticks: {
          color: 'black', // not 'fontColor:' anymore
          // fontSize: 18,
          font: {
            size: 18, // 'size' now within object 'font {}'
          },
          // stepSize: 1,
          beginAtZero: true,
        },
      },
      x: {
        // not 'xAxes: [{' anymore (not an array anymore)
        ticks: {
          color: 'black', // not 'fontColor:' anymore
          font: {
            size: 14, // 'size' now within object 'font {}'
          },
          stepSize: 1,
          beginAtZero: true,
        },
      },
    },
  };

  return { chartData, options };
};

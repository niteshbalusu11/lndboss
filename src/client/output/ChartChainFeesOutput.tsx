import { Line } from 'react-chartjs-2';
import React from 'react';
import resgisterCharts from '../register_charts';

/*
  Renders the bos chart-chain-fees command output in chart format.
*/

type Props = {
  data: {
    data: number[];
    title: string;
    description: string;
  };
};

const styles = {
  div: {
    width: '800px',
  },
};

const ChartChainFeesOutput = ({ data }: Props) => {
  resgisterCharts();
  const { chartData, options } = renderChart({ data });
  return (
    <div style={styles.div}>
      <h3>{data.title}</h3>
      <Line data={chartData} options={options} id="ChartChainFeesOutput" />
    </div>
  );
};

export default ChartChainFeesOutput;

const renderChart = ({ data }: Props): any => {
  const chartData = {
    labels: data.data.map((n: number, i: number) => i),
    datasets: [
      {
        label: data.description,
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
        data: data.data,
      },
    ],
  };

  const options = {
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
          stepSize: 50,
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
          stepSize: 5,
          beginAtZero: true,
        },
      },
    },
  };

  return { chartData, options };
};

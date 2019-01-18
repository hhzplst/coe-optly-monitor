import React from 'react';
import { Line } from 'react-chartjs-2';
import unixTimeZero from '../unixTimeZero';

const parseGivenDay = (i) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  start.setDate(start.getDate() + i);
  end.setDate(end.getDate() + i);

  return {
    start: Date.parse(start),
    end: Date.parse(end),
  };
};

class HistoryChart extends React.Component {
  constructor() {
    super();
    this.state = {
      dates: [],
      campaignHistoryData: [],
      projectHistoryData: [],
      experimentHistoryData: [],
      knownPageHistoryData: [],
      pageHistoryData: [],
    };
  }

  componentDidMount() {
    fetch(`/api/history/campaign?start=${unixTimeZero}&end=${parseGivenDay(0).end}`)
      .then(res => res.json())
      .then((res) => {
        this.setState({
          dates: res.date,
          campaignHistoryData: res.data,
        });
      });

    fetch(`/api/history/project?start=${unixTimeZero}&end=${parseGivenDay(0).end}`)
      .then(res => res.json())
      .then((res) => {
        this.setState({
          projectHistoryData: res.data,
        });
      });

    fetch(`/api/history/experiment?start=${unixTimeZero}&end=${parseGivenDay(0).end}`)
      .then(res => res.json())
      .then((res) => {
        this.setState({
          experimentHistoryData: res.data,
        });
      });

    fetch(`/api/history/knownPage?start=${unixTimeZero}&end=${parseGivenDay(0).end}`)
      .then(res => res.json())
      .then((res) => {
        this.setState({
          knownPageHistoryData: res.data,
        });
      });

    fetch(`/api/history/page?start=${unixTimeZero}&end=${parseGivenDay(0).end}`)
      .then(res => res.json())
      .then((res) => {
        this.setState({
          pageHistoryData: res.data,
        });
      });
  }

  render() {
    const {
      dates, campaignHistoryData, projectHistoryData, experimentHistoryData, knownPageHistoryData, pageHistoryData,
    } = this.state;

    const data = {
      labels: dates,
      datasets: [
        {
          label: 'Campaign History',
          data: campaignHistoryData,
          borderColor: 'rgba(255, 0, 0, 1)',
          fill: false,
        },
        {
          label: 'Project History',
          data: projectHistoryData,
          borderColor: 'rgba(0, 255, 0, 1)',
          fill: false,
        },
        {
          label: 'Experiment History',
          data: experimentHistoryData,
          borderColor: 'rgba(0, 0, 255, 1)',
          fill: false,
        },
        {
          label: 'Known Page History',
          data: knownPageHistoryData,
          borderColor: 'rgba(100, 100, 255, 1)',
          fill: false,
        },
        {
          label: 'Page History',
          data: pageHistoryData,
          borderColor: 'rgba(200, 200, 255, 1)',
          fill: false,
        },
      ],
    };

    const option = {
      barShowStroke: false,
    };

    return <Line data={data} options={option} />;
  }
}

export default HistoryChart;

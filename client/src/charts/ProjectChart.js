import React from 'react';
import PropTypes from 'prop-types';

const BarChart = require('react-chartjs').Bar;

const data = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Current Week',
      fillColor: 'rgba(220,220,220,0.5)',
      strokeColor: 'rgba(220,220,220,0.8)',
      highlightFill: 'rgba(220,220,220,0.75)',
      highlightStroke: 'rgba(220,220,220,1)',
      data: [65, 59, 80, 81, 56, 55, 40],
    },
    {
      label: 'Last Week',
      fillColor: 'rgba(151,187,205,0.5)',
      strokeColor: 'rgba(151,187,205,0.8)',
      highlightFill: 'rgba(151,187,205,0.75)',
      highlightStroke: 'rgba(151,187,205,1)',
      data: [28, 48, 40, 19, 86, 27, 90],
    },
  ],
};

const option = {
  barShowStroke: false,
};

class ProjectChart extends React.Component {
  render() {
    return <BarChart data={data} options={option} />;
  }
}

export default ProjectChart;

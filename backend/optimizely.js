import axios from 'axios';

require('dotenv').config();

const perPage = 100;

const getItemsFromType = (type, prjId = 0, pagination = 1, arr = []) => {
  const url = (type === 'project') ? `https://api.optimizely.com/v2/projects?per_page=${perPage}&page=${pagination}` : `https://api.optimizely.com/v2/${type}s?project_id=${prjId}&per_page=${perPage}&page=${pagination}`;

  return axios.get(url, {
    timeout: 500000,
    headers: {
      Authorization: `Bearer 2:${process.env.OPTLY_API_KEY}`,
    },
    host: '127.0.0.1',
    port: 3000,
  })
    .then((data) => {
      arr = arr.concat(data.data);
      if (data.data.length < 100) { return arr; }
      return getItemsFromType(type, prjId, ++pagination, arr);
    })
    .catch((err) => {
      console.log(`in getAllProjects: ${err}`);
    });
};

export default getItemsFromType;

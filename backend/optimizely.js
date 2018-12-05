require('dotenv').config();
import fetch from 'node-fetch';

const perPage = 100; 

const get = url => {
    return fetch(url, {
        'headers': {
            "Authorization": `Bearer 2:${process.env.OPTLY_API_KEY}`
        }
    });
}

const getJSON = url => {
    return get(url).then(res => res.json());
}

export const getItemsFromType = (type, prjId = 0, pagination = 1, arr = []) => {
    let url = (type === 'project')? `https://api.optimizely.com/v2/projects?per_page=${perPage}&page=${pagination}` : `https://api.optimizely.com/v2/${type}s?project_id=${prjId}&per_page=${perPage}&page=${pagination}`;

    return getJSON(url)
        .then(data => {
            arr? (arr = arr.concat(data)) : arr = data;
            if (data.length < 100)
                return arr;
            else
                return getItemsFromType(type, prjId, ++pagination, arr);
        })
        .catch(err => {
            console.log(`in getAllProjects: ${err}`);
        });
}
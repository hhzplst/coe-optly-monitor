import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';
import getItemsFromType from './optimizely';
import Project from './models/project';
import Campaign from './models/campaign';
import Experiment from './models/experiment';
import KnownPage from './models/knownPage';
import Page from './models/page';

require('dotenv').config();

const app = express();
const router = express.Router();
const API_PORT = process.env.API_PORT || 3001;

const projectIds = [];

app.use(logger('dev'));
app.use('/api', router);

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('connected', () => {
  init()
    .then(() => updateProjectCollection())
    .then(() => {
      console.log('project ids are available to use');
      return Promise.all([
        updateCampaignCollection(),
        updateExperimentCollection(),
        updatePageCollection(),
      ]);
    })
    .then(() => console.log('done'));
});
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

const init = () => {
  console.log('Clearing all models');
  return Promise.all([
    Project.deleteMany({}), Campaign.deleteMany({}), Experiment.deleteMany({}), KnownPage.deleteMany({}), Page.deleteMany({})]);
};

// update collections
const updateProjectCollection = () => getItemsFromType('project')
  .then(data => Project.insertMany(data.map((e) => {
    projectIds.push(e.id);
    return {
      id: e.id,
      name: e.name,
      status: e.status,
      created: e.created,
      last_modified: e.last_modified,
    };
  })))
  .then(() => {
    console.log('project collection update completed');
    return projectIds;
  })
  .catch(err => console.log(err));

const updateCampaignCollection = () => Promise.all(projectIds.map(prjId => getItemsFromType('campaign', prjId)
  .then(data => Campaign.insertMany(data.map(e => ({
    id: e.id,
    project_id: e.project_id,
    name: e.name,
    page_ids: e.page_ids,
    status: e.status,
    created: e.created,
    last_modified: e.last_modified,
  }))))
  .then((docs) => {
    for (let i = 0; i < docs.length; i++) {
      if (docs[i].page_ids) {
        return Promise.all((docs[i].page_ids).map(pageId => new KnownPage({ id: pageId }).save()));
      }
      return new KnownPage({ id: -1 }).save();
    }
  })
  .catch(err => console.log(err))))
  .then(() => { console.log('campaign collection update completed'); });

const updateExperimentCollection = () => Promise.all(projectIds.map(prjId => getItemsFromType('experiment', prjId)
  .then(data => Experiment.insertMany(data.map(e => ({
    id: e.id,
    project_id: e.project_id,
    name: e.name,
    page_ids: e.page_ids,
    status: e.status,
    created: e.created,
    last_modified: e.last_modified,
  }))))
  .then((docs) => {
    for (let i = 0; i < docs.length; i++) {
      if (docs[i].page_ids) {
        return Promise.all((docs[i].page_ids).map(pageId => new KnownPage({ id: pageId }).save()));
      }
      return new KnownPage({ id: -1 }).save();
    }
  })
  .catch(err => console.log(err))))
  .then(() => { console.log('experiment collection update completed'); });

const updatePageCollection = () => Promise.all(projectIds.map(prjId => getItemsFromType('page', prjId)
  .then(data => Page.insertMany(data.map(e => ({
    id: e.id,
    project_id: e.project_id,
    name: e.name,
    archived: e.archived,
    created: e.created,
    last_modified: e.last_modified,
  }))))))
  .then(() => { console.log('page collection update completed'); })
  .catch(err => console.log(err));

router.get('/', (req, res) => {
  res.json({ message: 'Welcome!' });
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

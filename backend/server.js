import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';
import getItemsFromType from './optimizely';
import Project from './models/project';
import Campaign from './models/campaign';
import Experiment from './models/experiment';
import KnownPage from './models/knownPage';
import Page from './models/page';
import ProjectHistory from './models/projectHistory';
import CampaignHistory from './models/campaignHistory';
import ExperimentHistory from './models/experimentHistory';
import KnownPageHistory from './models/knownPageHistory';
import PageHistory from './models/pageHistory';

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
// db.on('connected', () => {
//   init()
//     .then(() => updateProjectCollection())
//     .then(() => {
//       console.log('project ids are available to use');
//       return Promise.all([
//         updateCampaignCollection(),
//         updateExperimentCollection(),
//         updatePageCollection(),
//       ]);
//     })
//     .then(() => Promise.all(addToHistoryModels()))
//     .then(() => console.log('done'))
//     .catch(err => console.log(err));
// });

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

const addToHistoryModels = () => {
  const p1 = Project.countDocuments({})
    .then((res) => {
      ProjectHistory.create({
        time: new Date(),
        number: res,
      }, (err) => {
        if (err) console.log(err);
      });
    });

  const p2 = Campaign.countDocuments({})
    .then((res) => {
      CampaignHistory.create({
        time: new Date(),
        number: res,
      }, (err) => {
        if (err) console.log(err);
      });
    });

  const p3 = Experiment.countDocuments({})
    .then((res) => {
      ExperimentHistory.create({
        time: new Date(),
        number: res,
      }, (err) => {
        if (err) console.log(err);
      });
    });

  const p4 = KnownPage.countDocuments({})
    .then((res) => {
      KnownPageHistory.create({
        time: new Date(),
        number: res,
      }, (err) => {
        if (err) console.log(err);
      });
    });

  const p5 = Page.countDocuments({})
    .then((res) => {
      PageHistory.create({
        time: new Date(),
        number: res,
      }, (err) => {
        if (err) console.log(err);
      });
    });
  return [p1, p2, p3, p4, p5];
};

const getModelCount = (model, str) => model.countDocuments({})
  .then(res => ({
    [str]: res,
  }))
  .catch(err => console.log(err));

router.get('/getModelCount', (req, res) => {
  Promise.all([getModelCount(Project, 'project'), getModelCount(Campaign, 'campaign'), getModelCount(Experiment, 'experiment'), getModelCount(KnownPage, 'knownpage'), getModelCount(Page, 'page')])
    .then((results) => {
      res.send({
        count: results,
      });
    });
});

router.get('/history/:target', (req, res) => {
  const results = {
    date: [],
    data: [],
  };
  const stringModelMapping = {
    campaign: CampaignHistory,
    project: ProjectHistory,
    experiment: ExperimentHistory,
    knownPage: KnownPageHistory,
    page: PageHistory,
  };
  stringModelMapping[req.params.target].find({ createdAt: { $gt: req.query.start, $lt: req.query.end } }, (err, docs) => {
    if (!err) {
      docs.forEach((doc) => {
        let temp = `${doc.time.getMonth() + 1}/${doc.time.getDate()}/${doc.time.getFullYear()}`;
        results.date.push(temp);
        results.data.push(doc.number);
      });
      res.send(results);
    }
  });
});

router.get('/', (req, res) => {
  res.json({ message: 'Welcome!' });
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

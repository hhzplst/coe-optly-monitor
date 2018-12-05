require('dotenv').config();

import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';
import { getItemsFromType } from './optimizely.js';
import Project from './models/project';
import Campaign from './models/campaign';
import Experiment from './models/experiment';
import KnownPage from './models/knownPage';
import Page from './models/page';

const app = express();
const router = express.Router();
const API_PORT = process.env.API_PORT || 3001;

var projectIds = [];

app.use(logger('dev'));
app.use('/api', router);

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('connected', () => {
    init()
    .then(() => {
        return updateProjectCollection();
    })
    .then(() => {
        console.log("project ids are available to use"); 
        updateCampaignCollection();
        updateExperimentCollection();
        updatePageCollection();
    });
});
db.on('error', console.error.bind(console, 'MongoDB connection error: '));

const handleError = (method, err) => {
    console.log(`in ${method}, error: ${err}`);
}

const init = () => {
    console.log("Clearing all models");
    return Promise.all([Project.deleteMany({}), Campaign.deleteMany({}), Experiment.deleteMany({}), KnownPage.deleteMany({}), Page.deleteMany({})]);
}

//update collections
const updateProjectCollection = () => {
    return getItemsFromType('project')
    .then( data => {    
        Project.insertMany(data.map(e => {
            projectIds.push(e.id);
            return {
                id: e.id,
                name: e.name,
                status: e.status,
                created: e.created,
                last_modified: e.last_modified
            }  
        }), err => {
            if(err) handleError('insertMany -> updateProjectCollection', err);
        });    
    })
    .then(() => {
        console.log('project collection update completed');
        return Promise.resolve(projectIds);
    })
    .catch( err => console.log);
}

const updateCampaignCollection = () => {
    Promise.all(projectIds.map(prjId => {
        return getItemsFromType('campaign', prjId)
        .then( data => {
            return Campaign.insertMany(data.map(e => {
                return {
                    id: e.id,
                    project_id: e.project_id,
                    name: e.name,
                    page_ids: e.page_ids,
                    status: e.status,
                    created: e.created,
                    last_modified: e.last_modified
                }
            }))
        })
        .then(docs => {
            //insert into KnownPage collection
            docs.map(doc => {
                if(doc.page_ids) {
                    return Promise.all((doc.page_ids).map(page_id => {
                        return new KnownPage({id: page_id}).save();
                    }));
                } else {
                    return new KnownPage({id: -1}).save();
                }
            });
        })
        .catch(err => console.log);
    }))
    .then(() => {console.log('campaign collection update completed');})
    .catch(err => console.log);
}

const updateExperimentCollection = () => {
    Promise.all(projectIds.map(prjId => {
        return getItemsFromType('experiment', prjId)
        .then( data => {
            return Experiment.insertMany(data.map(e => {
                return {
                    id: e.id,
                    project_id: e.project_id,
                    name: e.name,
                    page_ids: e.page_ids,
                    status: e.status,
                    created: e.created,
                    last_modified: e.last_modified
                }
            }))
        })
        .then(docs => {
            //insert into KnownPage collection
            docs.map(doc => {
                if(doc.page_ids) {
                    return Promise.all((doc.page_ids).map(page_id => {
                        return new KnownPage({id: page_id}).save();
                    }));
                } else {
                    return new KnownPage({id: -1}).save();
                }
            });
        })
        .catch(err => console.log);
    }))
    .then(() => {console.log('experiment collection update completed');})
    .catch(err => console.log);
}

const updatePageCollection = () => {
    Promise.all(projectIds.map(prjId => {
        return getItemsFromType('page', prjId)
        .then( data => {
            return Page.insertMany(data.map(e => {
                return {
                    id: e.id,
                    project_id: e.project_id,
                    name: e.name,
                    archived: e.archived,
                    created: e.created,
                    last_modified: e.last_modified
                }
            }))
        })
    }))
    .then(() => {console.log('page collection update completed');})
    .catch(err => console.log);
}

router.get('/', (req, res) => {
    res.json({ message: 'Welcome!' });
});

app.listen(API_PORT, () => console.log(`Listening on port ${API_PORT}`));

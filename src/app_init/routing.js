const express = require('express');

async function applyRouting(app, apiRouter) {
    //base route
    app.use('/api', apiRouter);

    //loading local apis
    const Authentication = require('../api/AuthenticationApi');
    const User = require('../api/UserApi');
    const Salesman = require('../api/SalesmanApi');
    const EvaluationRecord = require('../api/EvaluationRecordApi');
    const EvaluationRecordEntry = require('../api/EvaluationRecordEntryApi');
    const Settings = require('../api/SettingsApi');

    //extended routes
    const authRouter = express.Router();
    apiRouter.use('/auth', authRouter);
    const userRouter = express.Router();
    apiRouter.use('/user', userRouter);
    const salesmanRouter = express.Router();
    apiRouter.use('/salesman', salesmanRouter);
    const settingsRouter = express.Router();
    apiRouter.use('/settings', settingsRouter);

    // auth
    authRouter.post('', Authentication.authenticate);
    authRouter.delete('', Authentication.deAuthenticate);
    authRouter.get('', Authentication.isAuthenticated);

    // Users
    userRouter.post('', User.create);
    userRouter.get('', User.list);
    userRouter.get('/:username', User.find);
    userRouter.put('', User.update);
    userRouter.put('/:username/pw', User.updatePw)
    userRouter.delete('/:username', User.remove);

    // Settings
    settingsRouter.get('/:name', Settings.getSetting);
    settingsRouter.put('', Settings.setSetting);

    // Salesman
    salesmanRouter.get('', Salesman.list);
    salesmanRouter.get('/:id', Salesman.find);
    salesmanRouter.get('/:id/bonus/:year/refresh_review',Salesman.renewOrder);
    salesmanRouter.get('/:id/bonus/:year/get_review',Salesman.getOrder);
    salesmanRouter.post('/:id/bonus/:year/set_remarks',Salesman.addRemark);
    salesmanRouter.get('/:id/bonus/get_years',Salesman.getYearsOfOrders);
    salesmanRouter.post('/:id/bonus/:year/approve_bonus',Salesman.approve);

    // EvaluationRecord
    salesmanRouter.post('/:id/evaluationrecord', EvaluationRecord.create);
    salesmanRouter.get('/:id/evaluationrecord', EvaluationRecord.list);
    salesmanRouter.get('/:id/evaluationrecord/:year', EvaluationRecord.find);
    salesmanRouter.delete('/:id/evaluationrecord/:year', EvaluationRecord.remove);

    // EvaluationRecordEntry
    salesmanRouter.post('/:id/evaluationrecord/:year/entry', EvaluationRecordEntry.create);
    salesmanRouter.get('/:id/evaluationrecord/:year/entry', EvaluationRecordEntry.list);
    salesmanRouter.get('/:id/evaluationrecord/:year/entry/:name', EvaluationRecordEntry.find);
    salesmanRouter.put('/:id/evaluationrecord/:year/entry', EvaluationRecordEntry.update);
    salesmanRouter.delete('/:id/evaluationrecord/:year/entry/:name', EvaluationRecordEntry.remove);
}

exports.applyRouting = applyRouting;

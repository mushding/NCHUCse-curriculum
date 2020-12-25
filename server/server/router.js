import express from 'express';
import bodyParser from 'body-parser'
import { spawn } from 'child_process';
import curriculum from './db/curriculum';
import DB from './db/curriculum';
import constData from './const';
const fetch = require('node-fetch');

const router = express.Router();
router.use(bodyParser.json());

// try get start date of school and check is summer or winter
let start_month, start_date;
router.get('/api/initStartOfSchoolDate/:month/:date', (req, res) => {
    let month = req.params.month;
    let date = req.params.date;
    start_month = month;
    start_date = date;
    res.json("init success");
})

router.get('/api/test', (req, res) => {
    res.json("TESTTEST");
})

router.get('/api/getAllData', async (req, res) => {
    // try connect DB and select from DB
    let result;
    try {
        result = await DB.select_website_curriculum();
        result.push(...await DB.select_static_curriculum());
        result.push(...await DB.select_temporary_curriculum());
        for (let i = 0; i < result.length; i++){
            result[i]["id"] = i;
        }
    } catch (err) {
        res.sendStatus(500);
    }
    res.json(result);
})

router.get('/api/getWebsite/:classroom/:semester_year/:semester_type', async (req, res) => {
    let curriculum = [], result;
    let classroom = req.params.classroom;
    let semester_year = req.params.semester_year;
    let semester_type = req.params.semester_type;

    // try connect DB and select from DB
    try {
        result = await DB.select_website_curriculum_classroom(classroom, semester_year, semester_type);
    } catch (err) {
        res.sendStatus(500);
    }
    for (let i = 0; i < result.length; i++){
        let start_time = constData.startTimestamps[result[i]["time"][0]];
        let end_time = constData.endTimestamps[result[i]["time"].slice(-1)];
        curriculum.push({
            pkId: result[i]["id"],
            title: result[i]["name"] + "\n" + result[i]["grade"] + "\n" + result[i]["teacher"],
            startDate: new Date('2020-' + start_month + '-' + start_date + 'T' + start_time + ":00"),
            endDate: new Date('2020-' + start_month + '-' + start_date + 'T' + end_time + ":00"),
            rRule: 'RRULE:FREQ=WEEKLY;COUNT=18;WKST=MO;BYDAY=' + constData.weekIndex[result[i]["week"]],
            addtime: new Date(result[i]["timestamp"].getTime() - result[i]["timestamp"].getTimezoneOffset()*60000),
            name: result[i]["name"],
            otherFormat: result[i]["grade"] + " " + result[i]["teacher"],
            curriculumType: 1
        })
    }
    res.json(curriculum);
});

router.get('/api/getStatic/:classroom/:semester_year/:semester_type', async (req, res) => {
    let curriculum = [], result;
    let classroom = req.params.classroom;
    let semester_year = req.params.semester_year;
    let semester_type = req.params.semester_type;
    
    // try connect DB and select from DB
    try {
        result = await DB.select_static_purpose_classroom(classroom, semester_year, semester_type);
    } catch (err) {
        res.sendStatus(500);
    }
    
    for (let i = 0; i < result.length; i++){
        curriculum.push({
            pkId: result[i]["id"],
            title: result[i]["name"] + "\n" + result[i]["office"],
            startDate: new Date('2020-' + start_month + '-' + start_date + 'T' + result[i]["start_time"]),
            endDate: new Date('2020-' + start_month + '-' + start_date + 'T' + result[i]["end_time"]),
            rRule: 'RRULE:FREQ=WEEKLY;COUNT=18;WKST=MO;BYDAY=' + constData.weekIndex[result[i]["week"]],
            addtime: new Date(result[i]["timestamp"].getTime() - result[i]["timestamp"].getTimezoneOffset()*60000),
            name: result[i]["name"],
            otherFormat: result[i]["office"],
            curriculumType: 2
        })
    }
    res.json(curriculum);
})

router.get('/api/getTemporary/:classroom/:semester_year/:semester_type', async (req, res) => {
    let curriculum = [], result;    
    let classroom = req.params.classroom;
    let semester_year = req.params.semester_year;
    let semester_type = req.params.semester_type;

    try {
        result = await DB.select_temporary_purpose_classroom(classroom, semester_year, semester_type);
    } catch (err) {
        res.sendStatus(500);
    }
    for (let i = 0; i < result.length; i++){
        curriculum.push({
            pkId: result[i]["id"],
            title: result[i]["name"] + "\n" + result[i]["office"],
            startDate: new Date(result[i]["date"] + 'T' + result[i]["start_time"]),
            endDate: new Date(result[i]["date"] + 'T' + result[i]["end_time"]),
            addtime: new Date(result[i]["timestamp"].getTime() - result[i]["timestamp"].getTimezoneOffset()*60000),
            name: result[i]["name"],
            otherFormat: result[i]["office"],
            curriculumType: 3
        })
    }
    res.json(curriculum);
})

// add static data
router.post('/api/addStatic', async (req, res) => {
    try {
        result = await DB.insert_static_purpose_classroom(req.body);
    } catch (err) {
        res.sendStatus(500);
    }
    res.json("add static success");
})

// add temporary data
router.post('/api/addTemporary', async (req, res) => {
    try {
        result = await DB.insert_temporary_purpose_classroom(req.body);
    } catch (err) {
        res.sendStatus(500);
    }
    res.json("add temporary success");
})

// drop static data
router.get('/api/dropStatic/:id', async (req, res) => {
    let id = req.params.id;
    try {
        result = await DB.drop_static_purpose_classroom(id);
    } catch (err) {
        res.sendStatus(500);
    }
    res.json("drop static success");
})

// drop temporary data
router.get('/api/dropTemporary/:id', async (req, res) => {
    let id = req.params.id;
    try {
        result = await DB.drop_temporary_purpose_classroom(id);
    } catch (err) {
        res.sendStatus(500);
    }
    res.json("drop temporary success");
})

router.get('/api/change', async (req, res) => {
    try {
        result = await DB.change();
    } catch (err) {
        res.sendStatus(500);
    }
    res.json("result");
})

export default router
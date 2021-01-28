import express from 'express';
import bodyParser from 'body-parser'
import { spawn } from 'child_process';
import curriculum from './db/curriculum';
import DB from './db/curriculum';
import constData from './const';
const fetch = require('node-fetch');

const router = express.Router();
router.use(bodyParser.json());

// add https txt file
router.use('/.well-known', express.static(__dirname + '/.well-known'));

// try get start date of school and check is summer or winter
let startOfSchoolDate;
router.get('/api/initStartOfSchoolDate', async (req, res) => {
    try {
        let response = await fetch('http://flask/api_flask/getStartSchoolDate');
        startOfSchoolDate = await response.json();  
    } catch (err) {
        res.sendStatus(500);
    }
    res.json(startOfSchoolDate)
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
        let start_year, start_month, start_date;
        let start_time = constData.startTimestamps[result[i]["time"][0]];
        let end_time = constData.endTimestamps[result[i]["time"].slice(-1)];
        
        // whether is first or second semester
        if (result[i]["semester_type"] === "上學期") {
            start_year = String(startOfSchoolDate["year"] + 1911);
            start_month = startOfSchoolDate["9"]["month"]; 
            start_date = startOfSchoolDate["9"]["date"];
        } else if (result[i]["semester_type"] === "下學期") {
            start_year = String(startOfSchoolDate["year"] + 1912);
            start_month = startOfSchoolDate["2"]["month"]; 
            start_date = startOfSchoolDate["2"]["date"];
        }
        curriculum.push({
            pkId: result[i]["id"],
            title: result[i]["name"] + "\n" + result[i]["grade"] + "\n" + result[i]["teacher"],
            startDate: new Date(start_year + '-' + start_month + '-' + start_date + 'T' + start_time + ":00"),
            endDate: new Date(start_year + '-' + start_month + '-' + start_date + 'T' + end_time + ":00"),
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
        let start_year, start_month, start_date;

        // whether is first or second semester
        if (result[i]["semester_type"] === "上學期") {
            start_year = String(startOfSchoolDate["year"] + 1911);
            start_month = startOfSchoolDate["9"]["month"]; 
            start_date = startOfSchoolDate["9"]["date"];
        } else if (result[i]["semester_type"] === "下學期") {
            start_year = String(startOfSchoolDate["year"] + 1912);
            start_month = startOfSchoolDate["2"]["month"]; 
            start_date = startOfSchoolDate["2"]["date"];
        }
        curriculum.push({
            pkId: result[i]["id"],
            title: result[i]["name"] + "\n" + result[i]["office"],
            startDate: new Date(start_year + '-' + start_month + '-' + start_date + 'T' + result[i]["start_time"]),
            endDate: new Date(start_year + '-' + start_month + '-' + start_date + 'T' + result[i]["end_time"]),
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

router.get('/api/updateWebsite/:semester_year/:semester_type', async (req, res) => {
    let result, websites = [];
    let semester_year = req.params.semester_year;
    let semester_type = req.params.semester_type;
    try {
        result = await fetch('http://flask/api_flask/getWebsiteCurrculum/' + semester_year + '/' + constData.whichSemester[semester_type]);
        websites = await result.json();
        for (let i = 0; i < websites.length; i++){
            websites[i].semester_year = semester_year;
            websites[i].semester_type = semester_type;
            result = await DB.insert_website_curriculum(websites[i]);
        }
    } catch (err) {
        res.sendStatus(500);
    }
    res.json("update success");
})

router.get('/api/getStaticByID/:id', async (req, res) => {
    let result;
    let id = req.params.id;
    try {
        result = await DB.select_static_purpose_id(id);
    } catch (err) {
        res.sendStatus(500);
    }
    res.json(result);
})

router.get('/api/getTemporaryByID/:id', async (req, res) => {
    let result;
    let id = req.params.id;
    try {
        result = await DB.select_temporary_purpose_id(id);
    } catch (err) {
        res.sendStatus(500);
    }
    res.json(result);
})

// add static data
router.post('/api/addStatic', async (req, res) => {
    let result;
    try {
        result = await DB.insert_static_purpose(req.body);
    } catch (err) {
        res.sendStatus(500);
    }
    res.json("add static success");
})

// add temporary data
router.post('/api/addTemporary', async (req, res) => {
    let result;
    try {
        result = await DB.insert_temporary_purpose(req.body);
    } catch (err) {
        res.sendStatus(500);
    }
    res.json("add temporary success");
})

// drop website data (use get)
router.get('/api/dropWebsite/:semester_year/:semester_type', async (req, res) => {
    let result;
    let semester_year = req.params.semester_year;
    let semester_type = req.params.semester_type;
    try {
        result = await DB.drop_website_curriculum(semester_year, semester_type);
    } catch (err) {
        res.sendStatus(500);
    }
    res.json("drop website success");
})

// drop static data
router.post('/api/dropStatic', async (req, res) => {
    let result;
    try {
        result = await DB.drop_static_purpose(req.body);
    } catch (err) {
        res.sendStatus(500);
    }
    res.json("drop static success");
})

// drop temporary data
router.post('/api/dropTemporary', async (req, res) => {
    let result;
    try {
        result = await DB.drop_temporary_purpose(req.body);
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
    res.json("drop temporary success");
})

// constum database query
router.get('/api/controlDatabase/:query', async (req, res) => {
    let result;
    let query = req.params.query;
    try {
        console.log(req)
        result = await DB.control_database(query);
    } catch (err) {
        console.log(err)
        res.sendStatus(500);
    }
    res.json(result);
})

export default router
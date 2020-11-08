import express from 'express';
import bodyParser from 'body-parser'
import { spawn } from 'child_process';
import curriculum from './db/curriculum';
import DB from './db/curriculum';
import constData from './const';

const router = express.Router();
router.use(bodyParser.json());

// try get start date of school and check is summer or winter
let start_month, start_date;
start_month = constData.isSummerWinter[new Date().getMonth() + 1].padStart(2, "0");
start_date = "01";
// getStartOfSchool().then((startOfSchool) => {
//     let d = new Date();
//     start_month = startOfSchool[constData.isSummerWinter[d.getMonth() + 1]]["month"];
//     start_date = startOfSchool[constData.isSummerWinter[d.getMonth() + 1]]["date"];
// }).catch(e => {
//     console.log("No Internet Connection.");
//     start_month = new Date().getMonth() + 1;
//     start_date = "01";
// });

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

router.get('/api/getWebsite/:classroom', async (req, res) => {
    let curriculum = [], result;
    let classroom = req.params.classroom;

    // try connect DB and select from DB
    try {
        result = await DB.select_website_curriculum_classroom(classroom);
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

router.get('/api/getStatic/:classroom', async (req, res) => {
    let curriculum = [], result;
    let classroom = req.params.classroom;
    
    // try connect DB and select from DB
    try {
        result = await DB.select_static_purpose_classroom(classroom);
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

router.get('/api/getTemporary/:classroom', async (req, res) => {
    let curriculum = [], result;    
    let classroom = req.params.classroom;
    try {
        result = await DB.select_temporary_purpose_classroom(classroom);
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
})

// add temporary data
router.post('/api/addTemporary', async (req, res) => {
    try {
        result = await DB.insert_temporary_purpose_classroom(req.body);
    } catch (err) {
        res.sendStatus(500);
    }
})

// drop static data
router.get('/api/dropStatic/:id', async (req, res) => {
    let id = req.params.id;
    try {
        result = await DB.drop_static_purpose_classroom(id);
    } catch (err) {
        res.sendStatus(500);
    }
})

// drop temporary data
router.get('/api/dropTemporary/:id', async (req, res) => {
    let id = req.params.id;
    try {
        result = await DB.drop_temporary_purpose_classroom(id);
    } catch (err) {
        res.sendStatus(500);
    }
})

// Get the start date of school from python
// function getStartOfSchool() {
//     const python = spawn('python3', ['./python/確認幾號開學/check_start_school_date.py']);
//     let date;
//     return new Promise((resolve, rejects) => {
//         python.stdout.on('data', (data) => {
//             if (data === {}){
//                 reject(data);
//             } else {
//                 resolve(JSON.parse(data))
//             }
//         });
//     })
// }

export default router
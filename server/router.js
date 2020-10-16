import express from 'express';
import curriculum from './db/curriculum';
import DB from './db/curriculum';

const router = express.Router();

const startTimestamps = {
    "1": "08",
    "2": "09",
    "3": "10",
    "4": "11",
    "5": "13",
    "6": "14",
    "7": "15",
    "8": "16",
    "9": "17",
    "A": "18",
    "B": "19",
    "C": "20",
    "D": "21",
    "E": "22",
    "F": "23",
}

const endTimestamps = {
    "1": "09",
    "2": "10",
    "3": "11",
    "4": "12",
    "5": "14",
    "6": "15",
    "7": "16",
    "8": "17",
    "9": "18",
    "A": "19",
    "B": "20",
    "C": "21",
    "D": "22",
    "E": "23",
    "F": "24",
}

const weekIndex = {
    "1": "MO",
    "2": "TU",
    "3": "WE",
    "4": "TH",
    "5": "FR",
    "6": "SA",
    "7": "SU",
}

router.get('/getWebsite/:classroom', async (req, res) => {
    let curriculum = [], result;    
    let classroom = req.params.classroom;
    try {
        result = await DB.select_website_curriculum_classroom(classroom);
    } catch (err) {
        res.sendStatus(500);
    }
    for (let i = 0; i < result.length; i++){
        let start_time = startTimestamps[result[i]["time"][0]];
        let end_time = endTimestamps[result[i]["time"].slice(-1)];
        curriculum.push({
            title: result[i]["name"] + "\n" + result[i]["grade"] + "\n" + result[i]["teacher"],
            startDate: '2020-09-01T' + start_time + ":00",
            endDate: '2020-09-01T' + end_time + ":00",
            rRule: 'RRULE:FREQ=WEEKLY;COUNT=18;WKST=MO;BYDAY=' + weekIndex[result[i]["week"]],
            addtime: result[i]["timestamp"],
            name: result[i]["name"],
            otherFormat: result[i]["grade"] + " " + result[i]["teacher"],
            curriculumType: 1
        })
    }
    res.json(curriculum);
});

router.get('/getStatic/:classroom', async (req, res) => {
    let curriculum = [], result;    
    let classroom = req.params.classroom;
    try {
        result = await DB.select_static_purpose_classroom(classroom);
    } catch (err) {
        res.sendStatus(500);
    }
    for (let i = 0; i < result.length; i++){
        curriculum.push({
            title: result[i]["name"] + "\n" + result[i]["office"],
            startDate: '2020-09-01T' + result[i]["start_time"],
            endDate: '2020-09-01T' + result[i]["end_time"],
            rRule: 'RRULE:FREQ=WEEKLY;COUNT=18;WKST=MO;BYDAY=' + weekIndex[result[i]["week"]],
            addtime: result[i]["timestamp"],
            name: result[i]["name"],
            otherFormat: result[i]["office"],
            curriculumType: 2
        })
    }
    res.json(curriculum);
})

router.get('/getTemporary/:classroom', async (req, res) => {
    let curriculum = [], result;    
    let classroom = req.params.classroom;
    try {
        result = await DB.select_temporary_purpose_classroom(classroom);
    } catch (err) {
        res.sendStatus(500);
    }
    for (let i = 0; i < result.length; i++){
        curriculum.push({
            title: result[i]["name"] + "\n" + result[i]["office"],
            startDate: result[i]["date"] + 'T' + result[i]["start_time"],
            endDate: result[i]["date"] + 'T' + result[i]["end_time"],
            addtime: result[i]["timestamp"],
            name: result[i]["name"],
            otherFormat: result[i]["office"],
            curriculumType: 3
        })
    }
    res.json(curriculum);
})

export default router
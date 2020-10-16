import express from 'express';
import curriculum from './db/curriculum';
import DB from './db/curriculum';

const router = express.Router();

const timestamps = {
    "1": "08",
    "2": "09",
    "3": "10",
    "4": "11",
    "5": "13",
    "6": "14",
    "7": "15",
    "8": "16",
    "9": "17",
    "10": "18",
    "11": "19",
    "12": "20",
    "13": "21",
    "14": "22",
    "A": "18",
    "B": "19",
    "C": "20",
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
        let start_time = timestamps[result[i]["time"][0]];
        let end_time = timestamps[result[i]["time"].slice(-1)];
        if (start_time == end_time)
            end_time = String(Number(end_time) + 1);
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
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

router.get('/getWebsite', async (req, res) => {
    let curriculum = [], result;    
    try {
        result = await DB.select_website_curriculum();
    } catch (err) {
        res.sendStatus(500);
    }
    for (let i = 0; i < result.length; i++){
        let start_time = timestamps[result[i]["time"][0]];
        let end_time = timestamps[result[i]["time"].slice(-1)];
        curriculum.push({
            title: result[i]["name"] + result[i]["grade"] + result[i]["teacher"],
            startDate: '2020-09-01T' + start_time + ":00",
            endDate: '2020-09-01T' + end_time + ":00",
            rRule: 'RRULE:FREQ=WEEKLY;COUNT=18;WKST=MO;BYDAY=' + weekIndex[result[i]["week"]],
            addtime: result[i]["timestamp"],
            name: result[i]["name"],
            grade: result[i]["grade"],
            teacher: result[i]["teacher"]
        })
    }
    res.json(curriculum);
});

router.get('/getStatic', async (req, res) => {
    try {
        let curriculum = await DB.select_static_purpose();
        res.json(curriculum);
    } catch (err) {
        res.sendStatus(500);
    }
})

router.get('/getTemporary', async (req, res) => {
    try {
        let curriculum = await DB.select_temporary_purpose();
        res.json(curriculum);
    } catch {
        res.sendStatus(500);
    }
})

export default router
import express from 'express';
import DB from './db/curriculum';

const router = express.Router();

router.get('/getData', (req, res, next) => {
    const data = [
        {id: 1, text: "text"},
        {id: 2, text: "test"},
    ];
    res.json(data);
});

router.get('/getAll', async (req, res) => {
    try {
        let curriculum = await DB.all();
        res.json(curriculum);
    } catch (err) {
        res.sendStatus(500);
    }
});

export default router
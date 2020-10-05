const express = require('express');

const router = express.Router();

router.get('/api/sup', (req, res, next) => {
    res.json('y\'all');
});

module.exports = router

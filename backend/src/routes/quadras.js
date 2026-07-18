const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(501).json({ status: 'Not implemented yet' });
});

module.exports = router;
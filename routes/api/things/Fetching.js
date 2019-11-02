const express = require('express');
const router = express.Router();

// Load Product Models

router.get('/', (req, res) => res.send([{name: "Lesly", group_alias: "James Brown"}]));


module.exports = router;



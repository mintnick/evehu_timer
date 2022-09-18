var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => res.sendFile('index.html'));
router.get('/api/campaigns', (req, res) => {
  const campaigns = req.app.campaigns;
  if (campaigns) {
    res.statusCode = 200;
    res.json(campaigns);
  } else {
    res.statusCode = 503;
    res.json({
      error: "Campaigns not fetched"
    });
  }
})

module.exports = router;

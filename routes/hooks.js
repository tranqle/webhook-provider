/* eslint-disable no-console */
import express from 'express'

const router = express.Router();

/* GET users listing. */
router.post('/hooks', (req, res) => {
  console.log(' --- res body -- ', req.body)
  res.send('Webhook Received');
});

module.exports = router;

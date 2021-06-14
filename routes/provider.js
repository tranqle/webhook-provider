/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express'
import {Consumer} from 'kafka-node';
import ConsumerWebhook from '../services/kafka/consumer';
import Producerhook from '../services/kafka/producer'

const router = express.Router();
/**

 */

/* GET home page. */
router.post('/', (req, res) => {
  const producer = new Producerhook()
  producer.runProducer(req.body, (data) => {
    const consumer = new ConsumerWebhook(data.webhook['0'])
    consumer.runConsumer(data.webhook['0'])
  })
  res.send('Success!')
});

module.exports = router;

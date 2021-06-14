/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable max-len */
import kafka from 'kafka-node'

const {Producer} = kafka;

export default class ProducerWebhook {
  constructor() {
    this.configs = {
      kafkaHost: '127.0.0.1:9092',
      connectTimeout: 10000,
      requestTimeout: 30000,
      autoConnect: true,
      idleConnection: 30000,
      reconnectOnIdle: true,
      maxAsyncRequests: 10
    }
    this.producerOptions = {
      requireAcks: 1,
      ackTimeoutMs: 1000,
      //Partitioner type (default = 0, random = 1, cyclic = 2, keyed = 3, custom = 4), default 0
      partitionerType: 0
    }
    this.client = new kafka.KafkaClient(this.configs)
    this.producer = new Producer(this.client, this.producerOptions)

    this.producer.on('ready', () => console.info('======== producer is ready to send messages to kafka'));
     
    this.producer.on('error', (err) => console.error(err))

  }

  runProducer(req = {}, callback) {
    console.log('okla', req)
    const payloads = [
      {
        topic: 'webhook',
        messages: JSON.stringify({
          url: req.url,
          events: req.events,
          tls: req.tls
        }),
        /**
           * 0 = bad. shouldn't be named default. always puts in first partition.
            1 = random partition for every payload
            2 = first payload goes into partition 1, 2nd goes into partition 2, repeat until end then loops around, evenly dividing messages up across all partitions
            3 = requires use of keyed messages. when you produce a keyed message, the value passed for the key field then is used to determine which partition to put it in, so every message with same key ends up in same partition
            4 = used with the 3rd parameter of the producer. you pass a function thats called for each payload, and you return a partition to assign it to.
           */
        partition: 0, // TODO: extends for multl partition
        key: 'test1',
        timestamp: Date.now()
      }
    ];
    
    this.producer.send(payloads, (err, data) => {
      if (err) {
        console.error('there is an error: ', err)
      }
      else {
        const value = Object.assign(data)
        console.log('----- send data success -----', value);
        callback(value)
      }
    })
  }
}

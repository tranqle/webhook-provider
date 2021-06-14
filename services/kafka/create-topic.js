/* eslint-disable no-console */
const kafka = require('kafka-node');

const client = new kafka.KafkaClient({
  kafkaHost: '127.0.0.1:9092',
  connectTimeout: 10000,
  requestTimeout: 30000,
  autoConnect: true,
  idleConnection: 30000,
  reconnectOnIdle: true,
  maxAsyncRequests: 10
    
})

const topicsToCreate = [
  {
    topic: 'spike.topic2',
    partitions: 3,
    replicationFactor: 1,
    configEntries: [
      {
        name: 'compression.type',
        value: 'gzip'
      },
      {
        name: 'min.compaction.lag.ms',
        value: '50'
      }
    ]
  }];
  
client.createTopics(topicsToCreate, (error, result) => {
  if (error) {
    console.log('---- error ---', error)
  }
  else {
    console.log('------ result -----', result)
  }
});

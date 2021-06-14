/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable max-len */
import kafka from 'kafka-node'
import axios from 'axios'
import PostgresHook from '../../db/pg'

const {Consumer} = kafka;

export default class ConsumerWebhook {
  constructor(offset) {
    this.configs = {
      kafkaHost: '127.0.0.1:9092',
      connectTimeout: 10000,
      requestTimeout: 30000,
      autoConnect: true,
      idleConnection: 30000,
      reconnectOnIdle: true,
      maxAsyncRequests: 10
    }
    this.offset = offset
    this.client = new kafka.KafkaClient(this.configs)
    this.consumerPayloads = [{
      topic: 'webhook',
      partition: 0,
      offset
    }]
    this.consumerOptions = {
      autoCommit: true,
      fromOffset: true
    }
    this.consumer = new Consumer(this.client, this.consumerPayloads, this.consumerOptions)
  }

  runConsumer(offset) {
    this.consumer.on('message', (message) => {
      console.log('------ offset ----', this.offset)
      if (offset === this.offset) {
        console.log('------ message ----', message)
        const pgHook = new PostgresHook()
        const payload = JSON.parse(message.value)
        pgHook.findHook(payload, (webHookInfo) => {
          if (webHookInfo === null || webHookInfo.length === 0) {
            pgHook.insertHook(payload)
          }
          else { // call payload URL webhook
            console.log(' ---- call ----', webHookInfo[0])
            axios
              .post(webHookInfo[0].url, {
                ...webHookInfo[0]
              }, {
                headers: {
                  authorization: webHookInfo[0].tls
                }
                
              })
              .then(res => {
                console.log(`statusCode: ${res.statusCode}`)
                console.log(res)
              })
              .catch(error => {
                console.error(error)
              })
          }
        })
        //offset += 1
      }
    })
  }
}

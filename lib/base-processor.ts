import * as Consumer from 'sqs-consumer';
import * as AWS from 'aws-sdk';

import ResultRecorder from './result-recorder';

export default class BounceProcessor {
  constructor(private queueUrl: string) { }

  start(): Promise<void> {
    return new Promise<void>(resolve => {
      let timeout: NodeJS.Timer;

      let consumer = Consumer.create({
        queueUrl: this.queueUrl,
        handleMessage: (envelope, done) => {
          clearTimeout(timeout);
          try {
            let notification = JSON.parse(JSON.parse(envelope.Body).Message);
            if (notification.notificationType === "AmazonSnsSubscriptionSucceeded") {
              done();
              return;
            }
            this.processNotification(envelope, notification);
            done();
          } catch (error) {
            ResultRecorder.addError(error);
            done(error);
          }
          timeout = setTimeout(resolve, 5000);
        },
        sqs: new AWS.SQS()
      });


      timeout = setTimeout(() => {
        consumer.stop();
        resolve();
      }, 10000);

      consumer.on('error', function (error) {
        ResultRecorder.addError(error);
      });

      consumer.start();
    });
  }

  processNotification(envelope: AWS.SQS.Message, notification) {
  }
}


import * as Consumer from 'sqs-consumer';
import * as AWS from 'aws-sdk';

import ResultRecorder from './result-recorder';

export default class BounceProcessor {
  constructor(private queueUrl: string) { }

  start() {
    let timeout: NodeJS.Timer;

    let consumer = Consumer.create({
      queueUrl: this.queueUrl,
      waitTimeSeconds: 5,
      handleMessage: (envelope, done) => {
        clearTimeout(timeout);
        try {
          let notification = JSON.parse(JSON.parse(envelope.Body).Message);
          if (notification.notificationType === "AmazonSnsSubscriptionSucceeded") {
            done();
            return;
          }
          this.processNotification(envelope, notification).then(() => done(), err => done(err));
        } catch (error) {
          ResultRecorder.addError(error).then(() => done(error), err => done(err));
        }
        timeout = setTimeout(() => {
          console.log(`${this.getType()} queue was empty. Shutting down consumer...`);
          consumer.stop();
        }, 6000);
      },
      sqs: new AWS.SQS()
    });


    timeout = setTimeout(() => {
      console.log(`${this.getType()} queue was empty. Shutting down consumer...`);
      consumer.stop();
    }, 6000);

    consumer.on('error', function (error) {
      ResultRecorder.addError(error);
    });

    consumer.start();
  }

  processNotification(envelope: AWS.SQS.Message, notification): Promise<void> { throw new Error('processNotification should be overridden'); }

  getType(): string { throw new Error('getType should be overridden'); }
}


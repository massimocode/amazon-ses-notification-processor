import * as Consumer from 'sqs-consumer';
import * as AWS from 'aws-sdk';

import ResultRecorder from './result-recorder';
import BaseProcessor from './base-processor';

export default class BounceProcessor extends BaseProcessor {
  processNotification(envelope: AWS.SQS.Message, notification): Promise<void> {
    let hasBounceDetails = notification.bounce.bouncedRecipients.length > 0;
    let bounce = {
      FromEmail: notification.mail.source,
      MailSentAt: notification.mail.timestamp,
      ToEmail: notification.mail.destination[0],
      BounceType: notification.bounce.bounceType,
      BounceSubType: notification.bounce.bounceSubType,
      ReceivedAt: notification.bounce.timestamp,
      FeedbackId: notification.bounce.feedbackId,
      Action: hasBounceDetails ? notification.bounce.bouncedRecipients[0].action : null,
      Status: hasBounceDetails ? notification.bounce.bouncedRecipients[0].status : null,
      DiagnosticCode: hasBounceDetails ? notification.bounce.bouncedRecipients[0].diagnosticCode : null,
      FullJSON: envelope.Body
    };
    return ResultRecorder.addBounce(bounce);
  }

  getType(): string {
    return "Bounce";
  }
}


import * as Consumer from 'sqs-consumer';
import * as AWS from 'aws-sdk';

import ResultRecorder from './result-recorder';
import BaseProcessor from './base-processor';

export default class ComplaintProcessor extends BaseProcessor {
  processNotification(envelope: AWS.SQS.Message, notification) {
    let complaint = {
      FromEmail: notification.mail.source,
      MailSentAt: notification.mail.timestamp,
      ToEmail: notification.complaint.complainedRecipients[0].emailAddress,
      ComplaintType: notification.complaint.complaintFeedbackType,
      FeedbackId: notification.complaint.feedbackId,
      ReceivedAt: notification.complaint.timestamp,
      UserAgent: notification.complaint.userAgent,
      FullJSON: envelope.Body
    };

    ResultRecorder.addComplaint(complaint);
  }
}


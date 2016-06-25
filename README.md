# Amazon SES Bounce / Complaint Processor

This is a really basic utility to process Amazon SES bounce/complaint messages on an Amazon SQS queue, via the Amazon SNS.

The utility appends all notifications to the output.json file, which can then either be manually inspected or automatically parsed using the provided parse script.

The parse script outputs email addresses of any recipients who have marked the message as spam (complaints) and any permanent bounces, as well as and email addresses who have at least 3 transient bounces. It then removes these from the output.json file.

## Usage

Once you have configured the settings necessary (see Configuration below), usage is quite simple.

To get all the notifications from the queue, simply run `npm run fetch`.

To parse those notifications using the provided script, run `npm run parse`.

## Configuration

You need to create a `config.json` file at the root of the project. You need the following information:
```javascript
{
  "accessKeyId": "Your AWS Access Key ID",
  "secretAccessKey": "Your AWS Secret Access Key",
  "region": "us-east-1",
  "bounce-queue": "https://bounce-queue-url",
  "complaint-queue": "https://complaints-queue-url"
}
```

## Limitations
This has been developed and tested using Node v4.2.2. I am not sure if it would work on earlier versions of Node.
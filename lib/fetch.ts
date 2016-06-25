'use strict';

import * as AWS from 'aws-sdk';
import * as path from 'path';

import BounceProcessor from './bounce-processor';
import ComplaintProcessor from './complaint-processor';
import ResultRecorder from './result-recorder';

let config = require('../config.json');

AWS.config.loadFromPath(path.join(__dirname, '../config.json'));
AWS.config.logger = process.stdout;

new BounceProcessor(config['bounce-queue']).start();
new ComplaintProcessor(config['complaint-queue']).start();
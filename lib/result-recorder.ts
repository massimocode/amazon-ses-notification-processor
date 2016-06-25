'use strict';

import * as fs from 'fs';
import * as path from 'path';

interface Results {
  bounces: any[];
  complaints: any[];
  errors: {
    message: string;
    stack: string;
  }[];
}

let results: Results = require('../output.json');

export default class ResultRecorder {
  static addBounce(bounce): Promise<void> {
    results.bounces.push(bounce);
    return ResultRecorder.save();
  }

  static addComplaint(complaint): Promise<void> {
    results.complaints.push(complaint);
    return ResultRecorder.save();
  }

  static addError(error: Error): Promise<void> {
    results.errors.push({ message: error.message, stack: error.stack });
    return ResultRecorder.save();
  }

  static getResults(): Results {
    return results;
  }

  static save(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(path.join(__dirname, '../output.json'), JSON.stringify(results, null, 2), err => {
        if (err) { reject(err); } else { resolve(); }
      });
    });
  }
}
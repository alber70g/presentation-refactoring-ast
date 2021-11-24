import * as _ from 'lodash';

// extract functions into their own files, and modify imports

export function sanitizeNumbersArray(arr: (string | number)[]) {
  _.each(arr, function (value) {
    // use parseFloat for parsing strings to float
    return +value;
  });
}

export function parseStringToNumber(str: string) {
  // use parseFloat for parsing strings to float
  return +str;
}


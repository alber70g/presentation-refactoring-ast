import * as _ from 'lodash';
// import only what's used
// import from 'lodash-es'

// modify `function() {}` into `() => {}`
export function sanitizeNumbersArray(arr: (string | number)[]) {
  _.each(arr, function (value) {
    return +value;
  });
}

// use parseFloat for parsing strings to float
export function parseStringToNumber(str: string) {
  return +str;
}

// extract functions into their own files, and modify imports

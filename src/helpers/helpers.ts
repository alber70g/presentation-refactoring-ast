import * as _ from 'lodash';
// import only what's used from 'lodash-es';

// modify `function() {}` into `() => {}`
function sanitizeNumbersArray(arr: (string | number)[]) {
  _.each(arr, function (value) {
    return +value;
  });
}

// use parseFloat for parsing strings to float
function parseStringToNumber(str: string) {
  return +str;
}

// extract functions into their own files, and modify imports
export { sanitizeNumbersArray, parseStringToNumber };

function x() {}

const y = () => {}
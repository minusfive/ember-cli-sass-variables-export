'use strict';

const fs = require('fs');
const path = require('path');

let sass;

// Based off the idea from: https://github.com/Punk-UnDeaD/node-sass-export
const getOutput = (val) => {
  let output;

  if (val instanceof sass.types.List) {
    output = [];
    for (let i = 0; i < val.getLength(); i++) {
      output.push(getOutput(val.getValue(i)));
    }
  } else if (val instanceof sass.types.Map) {
    output = {};
    for (let i = 0; i < val.getLength(); i++) {
      output[val.getKey(i).getValue()] = getOutput(val.getValue(i));
    }
  } else if (val instanceof sass.types.Color) {
    output;
    if (val.getA() === 1) {
      output = `rgb(${parseInt(val.getR())}, ${parseInt(val.getG())}, ${parseInt(val.getB())})`;
    } else {
      output = `rgba(${parseInt(val.getR())}, ${parseInt(val.getG())}, ${parseInt(val.getB())}, ${parseFloat(val.getA()).toFixed(2)})`;
    }
  } else if (val instanceof sass.types.Number) {
    output = val.getValue();
    if (val.getUnit()) {
      output += val.getUnit();
    }
  } else {
    output = val.getValue();
  }

  return output;
};

module.exports = (outputPath, implementation) => {
  sass = implementation;

  return {
    'export($fileName, $value:())': (fileName, value) => {
      let utilPath = path.join(outputPath, `${fileName.getValue()}.js`);
      let utilHeader = `/* eslint-disable */
// Auto Generated file from exportSass.
export default `;
      let output = JSON.stringify(getOutput(value), null, " ");

      fs.writeFileSync(utilPath, `${utilHeader} ${output};`);
      return value;
    }
  };
};

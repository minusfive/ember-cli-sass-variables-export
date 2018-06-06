const fs = require('fs');
const path = require('path');
const debug = require('debug')('ember-cli-sass-variables-export');

// Based off the idea from: https://github.com/Punk-UnDeaD/node-sass-export
const getOutput = (val) => {
  let output;
  switch (val.constructor.name) {
    case 'SassList':
      output = [];
      for (let i = 0; i < val.getLength(); i++) {
        output.push(getOutput(val.getValue(i)));
      }
      debug('SassList: ', output);
      return output;
    case 'SassMap':
      output = {};
      for (let i = 0; i < val.getLength(); i++) {
        output[val.getKey(i).getValue()] = getOutput(val.getValue(i));
      }
      debug('SassMap: ', output);
      return output;
    case 'SassColor':
      if (val.getA() === 1) {
        output = `rgb(${parseInt(val.getR())}, ${parseInt(val.getG())}, ${parseInt(val.getB())})`;
      } else {
        output = `rgba(${parseInt(val.getR())}, ${parseInt(val.getG())}, ${parseInt(val.getB())}, ${parseFloat(val.getA()).toFixed(2)})`;
      }
      debug('SassColor: ', output);
      return output;
    case 'SassNumber':
      output = val.getValue();
      if (val.getUnit()) {
        output += val.getUnit();
      }
      debug('SassNumber: ', output);
      return output;
    default:
      debug('Default:', output);
      return val.getValue();
  }
};

module.exports = (outputPath) => ({
  'export($fileName, $value:())': (fileName, value) => {
    const output = getOutput(value);
    fs.writeFileSync(
      path.join(outputPath, `${fileName.getValue()}.js`),
      `/* eslint-disable */
// Auto Generated file from exportSass.
exports.default = ${JSON.stringify(output, null, ' ')};`
    );
    return value;
  }
});

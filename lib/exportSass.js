/* eslint-env node */
const fs = require('fs');
const path = require('path');
const debug = require('debug')('ember-cli-sass-variables-export');

let sass;

// mimic the way ember-cli-sass tries to find the default sass implementation
// only runs when no implementation was passed in
function getDefaultSass() {
  try {
    return require('sass');
  } catch (e) {
    let error = new Error(
      'Could not find the default SASS implementation. Run the default blueprint:\n' +
      '   ember g ember-cli-sass\n' +
      'Or install an implementation such as "node-sass" and add an implementation option. For example:\n' +
      '   sassOptions: {implementation: require("node-sass")}');
    error.type = 'Sass Plugin Error';

    throw error;
  }
}

// Based off the idea from: https://github.com/Punk-UnDeaD/node-sass-export
const getOutput = (val) => {
  let output;

  if (val instanceof sass.types.List) {
    output = [];
    for (let i = 0; i < val.getLength(); i++) {
      output.push(getOutput(val.getValue(i)));
    }
    debug('List: ', output);
  } else if (val instanceof sass.types.Map) {
    output = {};
    for (let i = 0; i < val.getLength(); i++) {
      output[val.getKey(i).getValue()] = getOutput(val.getValue(i));
    }
    debug('Map: ', output);
  } else if (val instanceof sass.types.Color) {
    output;
    if (val.getA() === 1) {
      output = `rgb(${parseInt(val.getR())}, ${parseInt(val.getG())}, ${parseInt(val.getB())})`;
    } else {
      output = `rgba(${parseInt(val.getR())}, ${parseInt(val.getG())}, ${parseInt(val.getB())}, ${parseFloat(val.getA()).toFixed(2)})`;
    }
    debug('Color: ', output);
  } else if (val instanceof sass.types.Number) {
    output = val.getValue();
    if (val.getUnit()) {
      output += val.getUnit();
    }
    debug('Number: ', output);
  } else {
    output = val.getValue();
    debug('Default:', output);
  }

  return output;
};

module.exports = (outputPath, implementation) => {
  sass = implementation || getDefaultSass();

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

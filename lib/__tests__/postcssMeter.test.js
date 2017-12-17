const assert = require('assert');
const { join: pathJoin } = require('path');
const { readFile: _readFile } = require('fs');

const postcss = require('postcss');
const CleanCSS = require('clean-css');

const postcssMeter = require('../');

function readFile(...args) {
  return new Promise((resolve, reject) =>
    _readFile(...args, (err, content) => (err ? reject(err) : resolve(content)))
  );
}

function loadOptions(base) {
  try {
    return Promise.resolve(require(pathJoin(base, 'options.json')));
  } catch (e) {}

  return Promise.resolve();
}

function loadFiles(base) {
  const options = loadOptions(base);

  return Promise.all(
    ['fixture', 'result']
      .map(name => pathJoin(base, `${name}.css`))
      .map(path => readFile(path))
      .concat([options])
  );
}

function cleanBeforeComparison(str) {
  return new CleanCSS().minify(str).styles;
}

function test(fixtureName, options) {
  const base = pathJoin(__dirname, fixtureName);

  return Promise.all([loadFiles(base), options])
    .then(([[fixture, result], options]) => [
      postcss([postcssMeter(options)]).process(fixture),
      result
    ])
    .then(function([fixture, result]) {
      assert.equal(
        cleanBeforeComparison(fixture.css),
        cleanBeforeComparison(String(result))
      );
    });
}

function runTest(desc, name) {
  it(name, done => {
    test(`${desc}/${name}`, loadOptions(pathJoin(__dirname, desc)))
      .then(done)
      .catch(err => done(err));
  });
}

function runTests(desc, names) {
  let descText = desc;
  if (desc === 'no-unprefixed') {
    descText += ' (default)';
  }

  describe(descText, function() {
    for (let name of names) {
      runTest(desc, name);
    }
  });
}

function runTestsMultipleDescs(descs, names) {
  for (let desc of descs) {
    runTests(desc, names);
  }
}

const vendors = ['webkit', 'moz'];
const tests = ['bar', 'optimum', 'sub-optimum', 'sub-sub-optimum'];

describe('all vendors', () => {
  runTestsMultipleDescs(['no-unprefixed', 'all'], tests);
});

runTests('unprefixed', tests);

describe('single vendor', () => {
  runTestsMultipleDescs(vendors, tests);
});

describe('single vendor and unprefixed', () => {
  runTestsMultipleDescs(vendors.map(vendor => `${vendor}-and-unprefixed`), tests);
});

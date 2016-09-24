// import assert from 'assert';
import postcss from 'postcss';
import postcssMeter from '../lib';
import {join as pathJoin} from 'path';
import {readFile} from 'fs-promise';

function loadOptions(base) {
  return readFile(pathJoin(base, 'options.json'))
    .catch(function (err) {
      if (err.code === 'ENOENT') {
        return undefined;
      }

      return Promise.reject(err);
    })
    .then(function (src) {
      if (src !== undefined) {
        return JSON.parse(String(src));
      }
    });
}

function loadFiles(base) {
  const options = loadOptions(base);

  return Promise.all(['fixture', 'result']
    .map(name => pathJoin(base, `${name}.css`))
    .map(path => readFile(path))
    .concat([options]));
}

function test(fixtureName, options) {
  const base = pathJoin(__dirname, fixtureName);

  return Promise.all([loadFiles(base), options])
    .then(([[fixture, result], options]) =>
      [postcss([postcssMeter(options)]).process(fixture), result])
    .then(function ([fixture, result]) {
      if (fixture.css.trim() === String(result).trim()) {
        return Promise.resolve(true);
      }

      throw new Error(`Fixture ${fixtureName} failed`);
    });
}

function runTest(desc, name) {
  it(name, function (done) {
    test(`${desc}/${name}`, loadOptions(pathJoin(__dirname, desc)))
      .then(() => done())
      .catch(err => done(err));
  });
}

function runTests(desc, names) {
  let descText = desc;
  if (desc === 'no-unprefixed') {
    descText += ' (default)';
  }

  describe(descText, function () {
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

describe('all vendors', function () {
  runTestsMultipleDescs(['no-unprefixed', 'all'], tests);
});

runTests('unprefixed', tests);

describe('single vendor', function () {
  runTestsMultipleDescs(vendors, tests);
});

describe('single vendor and unprefixed', function () {
  runTestsMultipleDescs(vendors.map(vendor => `${vendor}-and-unprefixed`), tests);
});

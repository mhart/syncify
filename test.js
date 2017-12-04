const tap = require('tap');
const syncify = require('.');
const util = require('util');
const fs = require('fs');
const setTimeoutAsync = util.promisify(setTimeout);
const readFileAsync = util.promisify(fs.readFile);

tap.plan(4);

tap.type(syncify, 'function', 'is a function');

{
  const start = Date.now();
  syncify(setTimeoutAsync(1000));
  tap.ok(Date.now() - start >= 1000, 'waits for promise to resolve');
}

try {
  const p = Promise.reject(new Error('x'));
  p.catch(() => {}); // eslint-disable-line no-empty-function
  syncify(p);
  tap.fail('did not throw!');
} catch (err) {
  tap.pass('got expected error');
}

/*
tap.throws(() => syncify(Promise.reject(new Error('this is an error'))),
  'this is an error', 'throws when promise rejects');
*/

{
  const expected = fs.readFileSync('./package.json').toString();
  const questionable = syncify(readFileAsync('./package.json')).toString();
  tap.ok(expected === questionable, 'fs test');
}

tap.end();


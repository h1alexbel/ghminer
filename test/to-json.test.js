// Copyright (c) 2024 Aliaksei Bialiauski
// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

const json = require('../src/to-json.js');
const fs = require('fs');
const tmp = require('tmp');
const assert = require('assert');

describe('Test case for to-json.js', () => {
  it('creates .json file and writes results as JSON', function() {
    const file = tmp.fileSync({postfix: '.json'}).name.replace('.json', '');
    const expected = [
      {
        repo: 'test/test',
        branch: 'master'
      },
      {
        repo: 'mltest/mltest',
        branch: 'main'
      }
    ];
    json(
      file,
      expected
    );
    setTimeout(function() {
      assert.ok(fs.existsSync(`${file}.json`), `file ${file}.json does not exist, but should`);
      const objects = JSON.parse(fs.readFileSync(`${file}.json`, 'utf-8'));
      assert.deepEqual(
        objects,
        expected,
        `flushed objects ${objects} don't match with expected: ${expected}`
      );
      done();
    }, 1000);
  });
});

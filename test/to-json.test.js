/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2024 Aliaksei Bialiauski
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const json = require('../src/to-json.js');
const fs = require('fs');
const assert = require('assert');

describe('Test case for to-json.js', () => {
  afterEach(
    () => {
      if (fs.existsSync('test.json')) {
        fs.unlinkSync('test.json');
      }
    }
  );
  it('creates .json file and writes results as JSON', function() {
    const file = 'test';
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

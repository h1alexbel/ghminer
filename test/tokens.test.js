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
const assert = require('assert');
const tokens = require('../src/tokens.js');

describe('Test case for tokens.js', function() {
  it('fetches one token from file', function() {
    const fetched = tokens('test/resources/one.txt');
    const expected = 'justOneToken';
    assert.equal(
      fetched,
      expected,
      `fetched tokens ${fetched} don't match with expected ${expected}`
    )
  });
  it('fetches a few tokens from file', function() {
    const fetched = tokens('test/resources/tokens.txt');
    const expected = ['theFirstToken', 'theSecondToken', 'someOtherToken'];
    assert.deepEqual(
      fetched,
      expected,
      `parsed tokens ${fetched} don't match with expected ${expected}`
    )
  });
  it('fetches one token with one empty line', function() {
    const parsed = tokens('test/resources/one-empty.txt');
    const expected = ['aaa'];
    assert.deepEqual(
      parsed,
      expected,
      `parsed tokens ${parsed} don't match with expected tokens: ${expected}`
    )
  });
});

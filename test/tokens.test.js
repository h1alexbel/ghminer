// Copyright (c) 2024 Aliaksei Bialiauski
// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

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

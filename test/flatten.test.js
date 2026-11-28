// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

const assert = require('assert');
const flatten = require('../src/flatten.js');

describe('Test case for flatten.js', () => {
  it('flattens responses according to the schema', function() {
    const flattened = flatten(
      [
        {nameWithOwner: 'test/test', description: 'first'},
        {nameWithOwner: 'mltest/mltest'}
      ],
      {repo: 'nameWithOwner', description: 'description'}
    );
    const expected = [
      {repo: 'test/test', description: 'first'},
      {repo: 'mltest/mltest', description: ''}
    ];
    assert.deepEqual(
      flattened,
      expected,
      `flattened results ${flattened} don't match with expected: ${expected}`
    );
  });
  it('skips failed responses', function() {
    const flattened = flatten(
      [undefined, null, {nameWithOwner: 'test/test'}],
      {repo: 'nameWithOwner'}
    );
    const expected = [{repo: 'test/test'}];
    assert.deepEqual(
      flattened,
      expected,
      `flattened results ${flattened} don't match with expected: ${expected}`
    );
  });
});

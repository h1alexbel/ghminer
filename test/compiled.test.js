// Copyright (c) 2024 Aliaksei Bialiauski
// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

const assert = require('assert');
const compiled = require('../src/compiled.js');

describe('Test case for compiled.js', function() {
  it('compiles query from parts', function() {
    const query = compiled(
      'stars:1..100', 'pushed', '2023-01-01', '2024-01-01'
    );
    const expected = 'stars:1..100 pushed:2023-01-01..2024-01-01';
    assert.equal(
      query,
      expected,
      `compiled query ${query} does not match with expected ${expected}`
    );
  });
});

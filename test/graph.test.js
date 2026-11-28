// Copyright (c) 2024 Aliaksei Bialiauski
// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

const assert = require('assert');
const graph = require('../src/graph');

describe('Test case for graph.js', function() {
  it('reads GraphQL query from file', function() {
    const query = graph(
      'test/resources/query.graphql'
    );
    const expected = 'query ($searchQuery: String!, $first: Int, $after: String) {}';
    assert.equal(
      query,
      expected,
      `found query ${query} does not match with expected ${expected}`
    );
  });
});

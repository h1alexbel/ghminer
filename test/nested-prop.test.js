// Copyright (c) 2024 Aliaksei Bialiauski
// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

const assert = require('assert');
const nested = require('../src/nested-prop');

describe('Test case for nested-prop.js', function() {
  it('returns prop', function() {
    const obj = {
      test: 'aaa'
    };
    const prop = nested(obj, 'test')
    const expected = 'aaa';
    assert.equal(
      prop,
      expected,
      `parsed ${prop} does not match with expected ${expected}`
    );
  });
  it('returns nested prop', function() {
    const obj = {
      test: {
        aaa: 'bbb'
      }
    };
    const prop = nested(obj, 'test.aaa')
    const expected = 'bbb';
    assert.equal(
      prop,
      expected,
      `parsed ${prop} does not match with expected ${expected}`
    );
  });
  it('returns first nested prop from array', function() {
    const obj = {
      defaultBranchRef: {
        target: {
          history: {
            edges: [
              {
                node: {
                  committedDate: '2024-10-01'
                }
              }
            ]
          }
        }
      }
    };
    const prop = nested(
      obj,
      'defaultBranchRef.target.history.edges[0].node.committedDate'
    );
    const expected = '2024-10-01';
    assert.equal(
      prop,
      expected,
      `parsed ${prop} does not match with expected ${expected}`
    );
  });
  it('returns array of nested props', function() {
    const obj = {
      repositoryTopics: {
        edges: [
          {
            node: {
              topic: {
                name: 'java'
              }
            }
          },
          {
            node: {
              topic: {
                name: 'jvm'
              }
            }
          },
          {
            node: {
              topic: {
                name: 'compilers'
              }
            }
          }
        ]
      }
    };
    const prop = nested(
      obj,
      'repositoryTopics.edges[].node.topic.name'
    );
    const expected = 'java,jvm,compilers';
    assert.equal(
      prop,
      expected,
      `parsed ${prop} does not match with expected ${expected}`
    );
  });
});

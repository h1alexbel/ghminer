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

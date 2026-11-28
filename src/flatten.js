// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

const nestedProp = require('./nested-prop.js');

/**
 * Flatten fetched responses according to the parsing schema.
 * Responses, that failed to fetch, are skipped.
 * @param {Array} responses Responses from GitHub API
 * @param {Object} schema Parsing schema
 * @return {Array} Flattened results
 */
const compiled = function(responses, schema) {
  return responses
    .filter((response) => response !== null && response !== undefined)
    .map((response) => {
      const data = {};
      for (const [key, path] of Object.entries(schema)) {
        const value = nestedProp(response, path);
        data[key] = value !== null && value !== undefined ? value : '';
      }
      return data;
    });
};

module.exports = compiled;

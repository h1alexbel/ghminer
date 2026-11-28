// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

/**
 * Compile full GitHub search query.
 * @param {String} search Search query
 * @param {String} type Date type
 * @param {String} start Start date
 * @param {String} end End date
 * @return {String} Compiled query
 */
const compiled = function(search, type, start, end) {
  return `${search} ${type}:${start}..${end}`
};

module.exports = compiled;

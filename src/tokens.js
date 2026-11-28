// Copyright (c) 2024 Aliaksei Bialiauski
// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

const fs = require('fs');

/**
 * Fetch tokens from file where each token is separated by new line.
 * @param {String} file File
 * @return {String} Tokens
 */
function tokens(file) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    return content
      .split('\n')
      .filter((c) => c !== undefined && c !== '' && !c.startsWith('#'));
  } catch (error) {
    console.error(`Error reading tokens file: ${error.message}`);
    process.exit(1);
  }
}

module.exports = tokens;

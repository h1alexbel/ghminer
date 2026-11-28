// Copyright (c) 2024 Aliaksei Bialiauski
// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

fs = require('fs');

/**
 * Flush results to JSON file.
 * @param {String} file JSON file name
 * @param {String} results Results to flush
 */
function toJson(file, results) {
  fs.writeFile(
    `${file}.json`,
    JSON.stringify(results, null, 2), function(err) {
      if (err) {
        throw err;
      }
      console.log(`${file}.json file saved`);
    }
  );
}

module.exports = toJson;

// Copyright (c) 2024 Aliaksei Bialiauski
// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

const writer = require('csv-writer');

/**
 * Flush results to CSV file.
 * @param {String} filename CSV file name
 * @param {String} results Results to flush
 */
function toCsv(filename, results) {
  const csvWriter = writer.createObjectCsvWriter({
    path: `${filename}.csv`,
    header: Object.keys(results[0]).map((key) => ({id: key, title: key})),
  });
  csvWriter
    .writeRecords(results)
    .then(() => console.log(`Results saved into ${filename}.csv`))
    .catch((err) => console.error(err));
}

module.exports = toCsv;

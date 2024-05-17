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

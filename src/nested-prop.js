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

const nestedProp = (obj, path) => {
  return path.split('.').reduce((acc, key) => {
    if (!acc) return null;
    const match = key.match(/^([a-zA-Z_$][a-zA-Z_$0-9]*)\[(\d*)\]$/);
    if (match) {
      const arrayKey = match[1];
      const index = match[2];
      if (index) {
        return acc[arrayKey] && Array.isArray(acc[arrayKey]) ? acc[arrayKey][parseInt(index, 10)] : null;
      } else {
        return acc[arrayKey] && Array.isArray(acc[arrayKey]) ? acc[arrayKey] : [];
      }
    }
    if (Array.isArray(acc)) {
      return acc.map((item) => item[key] !== undefined ? item[key] : null);
    } else if (acc[key] !== undefined) {
      return acc[key];
    } else {
      return null;
    }
  }, obj);
};

module.exports = nestedProp;

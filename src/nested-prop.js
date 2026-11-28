
// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

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

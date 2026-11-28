// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

const fs = require('fs');
const graph = (path) => {
  return fs.readFileSync(path, 'utf-8')
    .split('\n')
    .filter((c) => !c.startsWith('#'))
    .join('\n')
    .trim();
};

module.exports = graph;


// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

const query = `query {
  rateLimit {
    limit
    cost
    remaining
    used
    resetAt
    nodeCount
  }
}`;

module.exports = query;

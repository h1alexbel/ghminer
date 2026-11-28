// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

const query = `query ($completeSearchQuery: String!) {
  search(query: $completeSearchQuery, type: REPOSITORY, first: 1) {
    repositoryCount
  }
}`;

module.exports = query;

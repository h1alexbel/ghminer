// Copyright (c) 2024 Aliaksei Bialiauski
// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

/**
 * Dynamic import for GraphQLClient, since 'graphql-request' does not support cjs.
 * @returns {Promise<*>} GraphQLClient API client
 */
async function api() {
  const {GraphQLClient} = await import('graphql-request');
  return GraphQLClient;
}

module.exports = api;

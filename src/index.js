#!/usr/bin/env node
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
const minimist = require('minimist');
const toJson = require('./to-json.js');
const toCsv = require('./to-csv.js');
const rq = require('./ratelimit-query.js');
const api = require('./api.js');
const path = require('path');
const filed = require('./tokens.js');
const query = require('./graph.js');
const pkg = require('../package.json');
const fs = require('fs');
const nestedProp = require('./nested-prop.js');

console.log(`Running ghminer@${pkg.version}`);
const argv = minimist(process.argv.slice(2));
const fileName = argv.filename || 'results';
const batchsize = argv.batchsize || 10;
const searchQuery = argv.query || '';
const startDate = argv.start || '2008-01-01';
const endDate = argv.end || now;
const dateType = argv.date || 'created';
const print = argv.json || false;
const gpath = argv.graphql || 'ghminer.graphql';
const schema = argv.schema || 'ghminer.json';

let tokens;
if (argv.tokens) {
  if ('string' === typeof argv.tokens) {
    tokens = filed(path.resolve(argv.tokens));
  } else {
    console.error('Tokens must be a string (file path).');
    process.exit(1);
  }
} else {
  tokens = [];
}

/**
 * The maximum number of results GitHub can provide from a query.
 * If the query returns more than this number, the date range will be split into smaller batches.
 * @type {number}
 */
const MAXRESULTS = 1000;
const TIMEOUT = 0;
let tindex = 0;

/**
 * Use next GitHub token from inputs.
 * @return {String} next GitHub token
 */
function nextToken() {
  const token = tokens[tindex];
  tindex = (tindex + 1) % tokens.length;
  return token;
}

// @todo #1:60min Decompose fetch batch results into smaller pieces.
//  We should decompose this large function into more manageable components in
//  order to maintain it in the future. Let's create a few unit test as well.
//  Don't forget to remove this puzzle.
// async function fetchResultsBatch(
/**
 * Fetch results using batches.
 * @param {String} searchQuery Search query
 * @param {Date} date Date
 * @param {String} cursor Cursor
 * @param {Array} results Accumulated results
 * @return {Promise<*|*[]|undefined>} Batched results
 */
async function fetchResultsBatch(
  searchQuery, date, cursor = null, results = []
) {
  try {
    const GraphQLClient = await api();
    const client = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        Authorization: `Bearer ${nextToken()}`
      }
    });
    const data = await client.request(query(gpath), {
      searchQuery,
      first: batchsize,
      after: cursor
    });
    const {nodes, pageInfo} = data.search;
    results.push(...nodes);
    if (date !== undefined) {
      console.log(`\nExtracted ${results.length} results for ${date}...\n\n`);
    } else {
      console.log(`\nExtracted ${results.length} results so far...`);
    }
    const rateLimitData = await client.request(rq);
    const rateLimit = rateLimitData.rateLimit;
    console.log('Rate Limit:', rateLimit);
    console.log('hasNextPage:', pageInfo.hasNextPage);
    console.log('endCursor:', pageInfo.endCursor);
    if (pageInfo.hasNextPage) {
      await new Promise((resolve) => setTimeout(resolve, TIMEOUT));
      return await fetchResultsBatch(searchQuery, date, pageInfo.endCursor, results);
    } else {
      return results;
    }
  } catch (error) {
    console.error(error);
  }
}

// @todo #1:45min Create integration test case with GitHub GraphQL API.
//  We should create integration test cases for GitHub GraphQL API.
//  Let's try to use open repositories without PAT passing. Besides the
//  test case, let's move this function into `ranged.js`. Don't forget to
//  remove this puzzle.
/**
 * Range results using dates.
 * @param {String} completeSearchQuery Search query
 * @return {Promise<*>} Ranged results
 */
async function resultsInDateRange(completeSearchQuery) {
  console.log('Checking if date range should be split: ' + completeSearchQuery);
  try {
    const GraphQLClient = await api();
    const client = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        Authorization: `Bearer ${nextToken()}`
      }
    });
    const data = await client.request(countQuery, {completeSearchQuery});
    console.log(data);
    const {repositoryCount} = data.search;
    console.log(`Results: ${repositoryCount}`);
    return repositoryCount;
  } catch (error) {
    console.error(error);
  }
}


// Determine whether to fetch all results in a single batch or in multiple batches based on total results and dates.
// @todo #1:45min Decompose fetchAllResults function into more manageable components.
//  We should decompose that large function into smaller pieces that we can
//  easily change or refactor. Let's create a few unit tests as well. Don't
//  forget to remove this puzzle.
/**
 * Fetch all possible results.
 * @return {Promise<*|*[]|undefined|null>} Results
 */
async function fetchAllResults() {
  try {
    const GraphQLClient = await api();
    const client = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        Authorization: `Bearer ${nextToken()}`
      }
    });
    const data = await client.request(countQuery, {completeSearchQuery: compiled});
    const {repositoryCount} = data.search;
    console.log(`Total results: ${repositoryCount}`);
    if (repositoryCount <= MAXRESULTS) {
      return fetchResultsBatch(compiled);
    } else {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);
      const dayInMilliseconds = 24 * 60 * 60 * 1000;
      let dayCount = Math.ceil((endDateObj - startDateObj) / dayInMilliseconds);
      const results = [];
      let currentStartDateObj = startDateObj;
      let currentStartDate = startDate;
      let nextEndDateObj = new Date(currentStartDateObj.getTime() + dayInMilliseconds * dayCount / 2);
      let nextEndDate = nextEndDateObj.toISOString().split('T')[0];
      while (nextEndDate <= endDate) {
        const nextSearchQuery = `${searchQuery} ${dateType}:${currentStartDate}..${nextEndDate}`;
        const nextResultCount = await resultsInDateRange(nextSearchQuery);
        if (nextResultCount === null) {
          console.log('Error: No results found.');
          return null;
        }
        if (nextResultCount <= MAXRESULTS) {
          if (nextResultCount > 0) {
            const result = await fetchResultsBatch(nextSearchQuery, currentStartDate + '..' + nextEndDate);
            results.push(...result);
          }
          console.log(`\nExtracted ${results.length} results for ${currentStartDate}..${nextEndDate}...`);
          currentStartDateObj = new Date(nextEndDateObj.getTime() + dayInMilliseconds);
          currentStartDate = currentStartDateObj.toISOString().split('T')[0];
          if (currentStartDate > endDate) break;
          nextEndDateObj = endDateObj;
          nextEndDate = nextEndDateObj.toISOString().split('T')[0];
        } else {
          dayCount = Math.ceil((nextEndDateObj - currentStartDateObj) / dayInMilliseconds);
          console.log(`\nSplitting ${currentStartDate}..${nextEndDate} into ${dayCount} days...`);
          if (dayCount == 1) {
            nextEndDateObj = new Date(currentStartDateObj.getTime());
          } else {
            nextEndDateObj = new Date(currentStartDateObj.getTime() + dayInMilliseconds * dayCount / 2);
          }
          nextEndDate = nextEndDateObj.toISOString().split('T')[0];
        }
      }
      return results;
    }
  } catch (error) {
    console.error(error);
  }
}

/**
 * Write results to files
 * @param {Object} json Json objects
 */
function writeFiles(json) {
  const format = JSON.parse(fs.readFileSync(schema, 'utf-8'));
  const formattedResults = json.map((result) => {
    const data = {};
    for (const [key, path] of Object.entries(format)) {
      const value = nestedProp(result, path);
      data[key] = value !== null && value !== undefined ? value : '';
    }
    return data;
  });
  toCsv(fileName, formattedResults);
  if (print) {
    toJson(fileName, formattedResults);
  }
}

const countQuery = `query ($completeSearchQuery: String!) {
  search(query: $completeSearchQuery, type: REPOSITORY, first: 1) {
    repositoryCount
  }
}`;

const compiled = `${searchQuery} ${dateType}:${startDate}..${endDate}`;
console.log('Compiled search query:', compiled);

/**
 * Entry point.
 */
fetchAllResults()
  .then((data) => {
    writeFiles(data);
    console.log(`Fetched ${data.length} results.`);
  })
  .catch((error) => console.error(error));

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
const rq = require('./ratelimit-query.js');

/**
 * Dynamic import for GraphQLClient, since 'graphql-request' does not support cjs.
 * @returns {Promise<*>} GraphQLClient API client
 */
async function api() {
  const { GraphQLClient } = await import('graphql-request');
  return GraphQLClient;
}

const argv = minimist(process.argv.slice(2));
const fileName = argv.filename || 'results';
const batchsize = argv.batchsize || 10;
const searchQuery = argv.query || '';
const startDate = argv.start || '2008-01-01';
const endDate = argv.end || now;
const dateType = argv.date || 'created';
// @todo #1:35min Add support for --tokens to pass file with tokens.
//  We should add support for --tokens so, we users of the CLI will pass the
//  file (filename) or an array that contains a few tokens. Don't forget to
//  remove this puzzle.
const tokens = argv.tokens || 'tokens';

/**
 * The maximum number of results GitHub can provide from a query.
 * If the query returns more than this number, the date range will be split into smaller batches.
 * @type {number}
 */
const MAXRESULTS = 1000;
const TIMEOUT = 0;

let tindex = 0;

function nextToken() {
  const token = tokens[tindex];
  tindex = (tindex + 1) % tokens.length;
  return token;
}

// @todo #1:60min Decompose fetch batch results into smaller pieces.
//  We should decompose this large function into more manageable components in
//  order to maintain it in the future. Let's create a few unit test as well.
//  Don't forget to remove this puzzle.
async function fetchResultsBatch(searchQuery, currentDate, cursor = null, results = []) {
  try {
    const GraphQLClient = await api();
    const client = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        Authorization: `Bearer ${nextToken()}`
      }
    });
    const data = await client.request(query, {
      searchQuery,
      first: batchsize,
      after: cursor
    });
    const {nodes, pageInfo} = data.search;
    results.push(...nodes);
    if (currentDate !== undefined) {
      console.log(`\nExtracted ${results.length} results for ${currentDate}...\n\n`);
    } else {
      console.log(`\nExtracted ${results.length} results so far...`);
    }
    const rateLimitData = await client.request(rq);
    const rateLimit = rateLimitData.rateLimit;
    console.log('Rate Limit:', rateLimit);
    console.log('hasNextPage:', pageInfo.hasNextPage);
    console.log('endCursor:', pageInfo.endCursor);
    if (pageInfo.hasNextPage) {
      // Delay between batches to avoid rate limits
      await new Promise((resolve) => setTimeout(resolve, TIMEOUT)); // Adjust the delay time as needed
      return await fetchResultsBatch(searchQuery, currentDate, pageInfo.endCursor, results);
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
async function resultsInDateRange(completeSearchQuery) {
  console.log('Checking if date range should be split: ' + completeSearchQuery);
  try {
    const GraphQLClient = await api();
    const client = new GraphQLClient('https://api.github.com/graphql', {
      headers: {
        Authorization: `Bearer ${nextToken()}`
      }
    });
    let data = await client.request(countQuery, {completeSearchQuery});
    console.log(data);
    const {repositoryCount} = data.search;
    console.log(`Results: ${repositoryCount}`);
    return repositoryCount;
  } catch (error) {
    console.error(error);
  }
  return null;
}


// Determine whether to fetch all results in a single batch or in multiple batches based on total results and dates.
// @todo #1:45min Decompose fetchAllResults function into more manageable components.
//  We should decompose that large function into smaller pieces that we can
//  easily change or refactor. Let's create a few unit tests as well. Don't
//  forget to remove this puzzle.
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
      let startDateObj = new Date(startDate);
      let endDateObj = new Date(endDate);
      const dayInMilliseconds = 24 * 60 * 60 * 1000;
      let dayCount = Math.ceil((endDateObj - startDateObj) / dayInMilliseconds);
      let results = [];
      let currentStartDateObj = startDateObj;
      let currentStartDate = startDate;
      let nextEndDateObj = new Date(currentStartDateObj.getTime() + dayInMilliseconds * dayCount / 2);
      let nextEndDate = nextEndDateObj.toISOString().split('T')[0];
      while (nextEndDate <= endDate) {
        let nextSearchQuery = `${searchQuery} ${dateType}:${currentStartDate}..${nextEndDate}`;
        let nextResultCount = await resultsInDateRange(nextSearchQuery);
        if (nextResultCount === null) {
          console.log('Error: No results found.');
          return null;
        }
        if (nextResultCount <= MAXRESULTS) {
          if (nextResultCount > 0) {
            let result = await fetchResultsBatch(nextSearchQuery, currentStartDate + '..' + nextEndDate);
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

// @todo #1:45min Add support for dynamic field mapping.
//  Let's add support for dynamic field mapping, user will define his own
//  mapping in `.yml` file, we will parse that and apply it when writing
//  results to the files. e.g.: name: result.nameWithOwner, etc. In this
//  case `result` should be bindable only in that `.yml` config.
function writeFiles(json) {
  const formattedResults = json.map((result) => {
    // Modify according to the desired format and extraction fields
    const data = {
      name: result.nameWithOwner.split('/')[1],
      owner: result.nameWithOwner.split('/')[0],
      description: result.description ? result.description : '',
      url: result.url,
      createdAt: result.createdAt.split('T')[0],
      // users: result.assignableUsers.totalCount,
      // watchers: result.watchers.totalCount,
      stars: result.stargazerCount,
      forks: result.forkCount,
      projects: result.projects.totalCount,
      issues: result.issues.totalCount,
      pullRequests: result.pullRequests.totalCount,
      diskUsage: result.diskUsage,
      license: result.licenseInfo ? result.licenseInfo.spdxId : '',
      languages: result.languages.edges.map((edge) => edge.node.name),
      primaryLanguage: result.primaryLanguage ? result.primaryLanguage.name : '',
      environments: result.environments.edges.map((edge) => edge.node.name),
      submodules: result.submodules.edges.map((edge) => edge.node.name),
      topics: result.repositoryTopics.edges.map((edge) => edge.node.topic.name),
    };
    return data;
  });
  toJson(fileName, formattedResults);
  toCsv(fileName, formattedResults);
}

// Set query, count its totals and check rate limits
const query = `query ($searchQuery: String!, $first: Int, $after: String) {
  search(query: $searchQuery, type: REPOSITORY, first: $first, after: $after) {
    repositoryCount
    nodes {
      ... on Repository {
        nameWithOwner
        description
        defaultBranchRef {
          name
        }
        createdAt
        defaultBranchRef {
          name
          target {
            repository {
              object(expression: "master:README.md") {
                ... on Blob {
                  text
                }
              }
            }
            ... on Blob {
              text
            }
            ... on Commit {
              history(first: 1) {
                totalCount
                edges {
                  node {
                    committedDate
                  }
                }
              }
            }
          }
        }
        latestRelease {
          createdAt
        }
        stargazerCount
        forkCount
        pullRequests {
          totalCount
        }
        diskUsage
        licenseInfo {
          spdxId
        }
        repositoryTopics(first: 10) {
          edges {
            node {
              topic {
                name
              }
            }
          }
        }
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}`;

const countQuery = `query ($completeSearchQuery: String!) {
  search(query: $completeSearchQuery, type: REPOSITORY, first: 1) {
    repositoryCount
  }
}`;

const compiled = `${searchQuery} ${dateType}:${startDate}..${endDate}`;
console.log('Compiled search query:', compiled);

// Run and write the extraction
fetchAllResults()
  .then((data) => {
    writeFiles(data);
    //writeJsonFile(data);
    console.log(`Fetched ${data.length} results.`);
  })
  .catch((error) => console.error(error));

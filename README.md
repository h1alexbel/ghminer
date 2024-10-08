# ghminer

[![EO principles respected here](https://www.elegantobjects.org/badge.svg)](https://www.elegantobjects.org)
[![DevOps By Rultor.com](http://www.rultor.com/b/h1alexbel/samples-filter)](http://www.rultor.com/p/h1alexbel/samples-filter)
[![We recommend IntelliJ IDEA](https://www.elegantobjects.org/intellij-idea.svg)](https://www.jetbrains.com/idea/)

[![test](https://github.com/h1alexbel/ghminer/actions/workflows/test.yml/badge.svg)](https://github.com/h1alexbel/ghminer/actions/workflows/test.yml)
![NPM Version](https://img.shields.io/npm/v/ghminer)
[![codecov](https://codecov.io/gh/h1alexbel/ghminer/graph/badge.svg?token=RraKKKENlR)](https://codecov.io/gh/h1alexbel/ghminer)
[![PDD status](http://www.0pdd.com/svg?name=h1alexbel/ghminer)](http://www.0pdd.com/p?name=h1alexbel/ghminer)
[![Hits-of-Code](https://hitsofcode.com/github/h1alexbel/ghminer)](https://hitsofcode.com/view/github/h1alexbel/ghminer)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/h1alexbel/ghminer/blob/master/LICENSE.txt)

ghminer is a command-line dataset miner, that aggregates set of public GitHub
repositories from [GitHub GraphQL API] and flushes the result into CSV and JSON
files. This tool is based on [ksegla/GitHubMiner] prototype.

Read [this][blogpost] blog post about `ghminer`, as a dataset miner from GitHub
to your researches.

**Motivation**. For our researches we require reasonably big datasets in order
to properly analyze GitHub repositories and their metrics. To do so, we need
aggregate them somehow. Default [GitHub Search API] does not help much, since
it has [limitation] of 1000 repositories per query. Our tool uses GitHub
GraphQL API instead, and can offer to utilize multiple [GitHub PATs]
in order to automate the build of the such huge dataset and increase research
productivity.

## How to use

First, install it from [npm](https://www.npmjs.com/package/ghminer) like that:

```bash
npm install -g ghminer
```

then, execute:

```bash
ghminer --query "stars:2..100" --start "2005-01-01" --end "2024-01-01" --tokens pats.txt
```

After it will be done, you should have `result.csv` file with all GitHub
repositories those were created in the provided date range.

## CLI Options

| Option        | Required |                                                                                                        Description                                                                                                         |
|---------------|----------|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------:|
| `--query`     | ✅        |                                                                                                 [GitHub Search API query]                                                                                                  |
| `--graphql`   | ✅        |                                                                              Path to GitHub API GraphQL query, default is `ghminer.graphql`.                                                                               |
| `--schema`    | ✅        |                                                                                     Path to parsing schema, default is `ghminer.json`.                                                                                     |
| `--start`     | ✅        |                                                                       The start date to search the repositories, in [ISO] format; e.g. `2024-01-01`.                                                                       |
| `--end`       | ✅        |                                                                        The end date to search the repositories, in [ISO] format; e.g. `2024-01-01`.                                                                        |
| `--tokens`    | ✅        | Text file name that contains a number of [GitHub PATs]. Those will be used in order to pass GitHub API rate limits. Add as many tokens as needed, considering the amount of data (they should be separated by line break). |
| `--date`      | ❌        |                                               The type of the date field to search on, you can choose from `created`, `updated` and `pushed`, the default one is `created`.                                                |
| `--batchsize` | ❌        |                                                                        Request batch-size value in the range `10..100`. The default value is `10`.                                                                         |
| `--filename`  | ❌        |                                                                The name of the file for the found repos (CSV and JSON files). The default one is `result`.                                                                 |
| `--json`      | ❌        |                                                                                             Save found repos as JSON file too.                                                                                             |

### GraphQL Query

Your query, provided in `--graphql` can have all
[GitHub supported fields][Gh Explorer] you want. However, to keep this query
running to collect all possible repositories, ghminer requires you to have
the following structure:

* `search` with `$searchQuery`, `$first`, `$after` attributes.
* `pageInfo` with `endCursor`, `hasNextPage` attributes.
* `repositoryCount` field.

Here is an example:

```graphql
query ($searchQuery: String!, $first: Int, $after: String) {
  search(query: $searchQuery, type: REPOSITORY, first: $first, after: $after) {
    repositoryCount
    ...
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
```

### Parsing Schema

To parse response generated by [GraphQL Query](#graphql-query), you should
provide the parsing schema. This schema should have all desired metadata field
names as keys and path to the data in response as values.

For instance:

```json
{
  "repo": "nameWithOwner",
  "branch": "defaultBranchRef.name",
  "readme": "defaultBranchRef.target.repository.object.text",
  "topics": "repositoryTopics.edges[].node.topic.name",
  "lastCommitDate": "defaultBranchRef.target.history.edges[0].node.committedDate",
  "commits": "defaultBranchRef.target.history.totalCount",
  "workflows": "object.entries.length"
}
```

## How to contribute

Fork repository, make changes, send us a [pull request](https://www.yegor256.com/2014/04/15/github-guidelines.html).
We will review your changes and apply them to the `master` branch shortly,
provided they don't violate our quality standards. To avoid frustration,
before sending us your pull request please run full npm build:

```bash
npm test
```

You will need [Node 20+] installed.

[ksegla/GitHubMiner]: https://github.com/ksegla/GitHubMiner
[GitHub Search API]: https://api.github.com
[GitHub Search API query]: https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories
[ISO]: https://en.wikipedia.org/wiki/ISO_8601
[GitHub GraphQL API]: https://api.github.com/graphql
[GitHub PAts]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
[limitation]: https://stackoverflow.com/questions/37602893/github-search-limit-results
[Node 20+]: https://nodejs.org/en/download/package-manager
[blogpost]: https://h1alexbel.github.io/2024/05/24/ghminer.html
[Gh Explorer]: https://docs.github.com/en/graphql/overview/explorer

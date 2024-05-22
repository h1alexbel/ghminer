# ghminer

[![EO principles respected here](https://www.elegantobjects.org/badge.svg)](https://www.elegantobjects.org)
[![DevOps By Rultor.com](http://www.rultor.com/b/h1alexbel/samples-filter)](http://www.rultor.com/p/h1alexbel/samples-filter)
[![We recommend IntelliJ IDEA](https://www.elegantobjects.org/intellij-idea.svg)](https://www.jetbrains.com/idea/)

[![test](https://github.com/h1alexbel/ghminer/actions/workflows/test.yml/badge.svg)](https://github.com/h1alexbel/ghminer/actions/workflows/test.yml)
![NPM Version](https://img.shields.io/npm/v/ghminer)
[![PDD status](http://www.0pdd.com/svg?name=h1alexbel/ghminer)](http://www.0pdd.com/p?name=h1alexbel/ghminer)
[![Hits-of-Code](https://hitsofcode.com/github/h1alexbel/ghminer)](https://hitsofcode.com/view/github/h1alexbel/ghminer)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/h1alexbel/ghminer/blob/master/LICENSE.txt)

ghminer is a command-line dataset miner, that aggregates set of public GitHub
repositories from [GitHub GraphQL API] and flushes the result into CSV and JSON
files. This tool is based on [ksegla/GitHubMiner] prototype.

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
npm install ghminer
```

then, execute:

```bash
ghminer --query "stars:2..100" --start "2005-01-01" --end "2024-01-01" --tokens "tokens"
```

For `--query` you provide [GitHub Search API query], start and end date
of the repository search for `--start` and `--end` respectively.
For `--tokens` you should provide a text file that contains a number of
[GitHub PATs] those will be used in order to pass GitHub API rate limits
(they should be separated by line break). Add as many tokens as needed,
considering the amount of data.

For `--date` you should provide the type of date field to search on, you can
choose from `craeted`, `updated` and `pushed`, the default one is `created`.

With `--batchsize 10` you can provide a batch-size value in the range from
10..100. The default value is `10`.

Also, with `--filename` you can provide the name of the file for the output
repos (CSV and JSON files). The default one is `result`. By default, it would
create `.csv` file only. In order to create `.json` too, just pass `--json`
option.

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
[GitHub GraphQL API]: https://api.github.com/graphql
[GitHub PAts]: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
[limitation]: https://stackoverflow.com/questions/37602893/github-search-limit-results
[Node 20+]: https://nodejs.org/en/download/package-manager

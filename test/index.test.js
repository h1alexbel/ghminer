// Copyright (c) 2024-2026 Aliaksei Bialiauski
//
// SPDX-License-Identifier: MIT

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const {spawnSync} = require('child_process');

/**
 * Copy the tool into an isolated directory.
 * @return {String} Isolated directory
 */
function copy() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ghminer-'));
  const root = path.join(__dirname, '..');
  for (const file of ['ghminer.graphql', 'ghminer.json', 'package.json']) {
    fs.copyFileSync(path.join(root, file), path.join(dir, file));
  }
  fs.cpSync(path.join(root, 'src'), path.join(dir, 'src'), {recursive: true});
  fs.cpSync(
    path.join(root, 'node_modules'),
    path.join(dir, 'node_modules'),
    {recursive: true}
  );
  return dir;
}

describe('Test case for index.js', () => {
  it('takes GraphQL query and schema from the package', function() {
    const dir = copy();
    fs.writeFileSync(path.join(dir, 'tokens.txt'), 'fake-token\n');
    const run = spawnSync(
      process.execPath,
      [
        path.join(dir, 'src', 'index.js'),
        '--query', 'stars:2..3',
        '--start', '2005-01-01',
        '--end', '2005-01-02',
        '--tokens', 'tokens.txt'
      ],
      {cwd: dir, encoding: 'utf-8', timeout: 20000}
    );
    assert.match(
      run.stdout,
      /Compiled search query:/,
      `tool failed with ${run.stderr}`
    );
  });
});

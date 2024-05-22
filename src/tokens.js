const fs = require('fs');

/**
 * Fetch tokens from file where each token is separated by new line.
 */
function tokens(file) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    return content.split('\n');
  } catch (error) {
    console.error(`Error reading tokens file: ${error.message}`);
    process.exit(1);
  }
}

module.exports = tokens;

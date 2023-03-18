const fs = require('fs');
const path = require('path');

const buildPath = path.resolve(__dirname, '../build');

if (!fs.existsSync(buildPath)) {
  fs.mkdirSync(buildPath);
}

fs.writeFileSync(
  path.join(buildPath, 'BUILD_COMPLETE.txt'),
  'This file is created to indicate that the build process is complete.'
);
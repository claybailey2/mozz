const { execSync } = require('child_process');

// Ensure we're in the right directory
process.chdir(__dirname);

// Install dependencies if needed
execSync('npm install', { stdio: 'inherit' });

// Run the build
execSync('npm run build', { stdio: 'inherit' });
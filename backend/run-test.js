const { exec } = require('child_process');

console.log('🚀 Starting blacklist functionality test...\n');

exec('node test-blacklist.js', (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Execution error: ${error}`);
    return;
  }
  
  if (stderr) {
    console.error(`⚠️  stderr: ${stderr}`);
  }
  
  console.log(stdout);
});

// Environment check script
console.log('=== Environment Check ===');
console.log('Node.js version:', process.version);
console.log('Platform:', process.platform);
console.log('Current directory:', process.cwd());

// Test basic functionality
try {
  const fs = require('fs');
  const path = require('path');
  
  console.log('\nFile system access:');
  const files = fs.readdirSync('.');
  console.log('Files in current directory:', files);
  
  console.log('\nTest file content:');
  const testContent = 'console.log("Test successful!");';
  const testFilePath = path.join(process.cwd(), 'temp-test-file.js');
  fs.writeFileSync(testFilePath, testContent);
  console.log('Test file created at:', testFilePath);
  
  const readContent = fs.readFileSync(testFilePath, 'utf-8');
  console.log('Test file content matches:', readContent === testContent);
  
  // Clean up
  fs.unlinkSync(testFilePath);
  console.log('Test file removed');
  
} catch (error) {
  console.error('Error during environment check:', error);
}

console.log('\nEnvironment check complete.');

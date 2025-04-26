// Script to update package references from librechat to podplay-build
const fs = require('fs');
const path = require('path');

const directoriesToSearch = [
  path.join(__dirname, 'client', 'src'),
  path.join(__dirname, 'api'),
  path.join(__dirname, 'packages')
];

const oldPackageName = 'librechat-data-provider';
const newPackageName = 'podplay-build-data-provider';

function processFile(filePath) {
  const fileExt = path.extname(filePath);
  const validExtensions = ['.js', '.jsx', '.ts', '.tsx'];
  
  if (!validExtensions.includes(fileExt)) {
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Update import statements
  content = content.replace(
    new RegExp(`from ['"]${oldPackageName}(.*)['"]`, 'g'), 
    `from '${newPackageName}$1'`
  );
  
  content = content.replace(
    new RegExp(`import\\s+['"]${oldPackageName}(.*)['"]`, 'g'), 
    `import '${newPackageName}$1'`
  );
  
  content = content.replace(
    new RegExp(`require\\(['"]${oldPackageName}(.*)['"]\\)`, 'g'), 
    `require('${newPackageName}$1')`
  );
  
  if (content !== originalContent) {
    console.log(`Updating references in ${filePath}`);
    fs.writeFileSync(filePath, content, 'utf-8');
  }
}

function traverseDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  files.forEach(file => {
    const fullPath = path.join(directory, file);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      // Skip node_modules and .git directories
      if (file !== 'node_modules' && file !== '.git' && file !== 'dist') {
        traverseDirectory(fullPath);
      }
    } else {
      processFile(fullPath);
    }
  });
}

console.log('Starting package reference updates...');
directoriesToSearch.forEach(dir => {
  console.log(`Scanning directory: ${dir}`);
  if (fs.existsSync(dir)) {
    traverseDirectory(dir);
  } else {
    console.log(`Directory not found: ${dir}`);
  }
});
console.log('Package reference updates completed.');
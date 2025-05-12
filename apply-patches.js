const fs = require('fs');
const path = require('path');

console.log('Checking if patches need to be applied...');

// Function to ensure a directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Function to create a backup of files
const backupFiles = () => {
  const backupDir = path.join(__dirname, 'patches', 'backups');
  ensureDirectoryExists(backupDir);
  
  // Create backups of original files if they don't exist
  files.forEach(file => {
    const filePath = path.join(__dirname, file.path);
    const backupPath = path.join(backupDir, path.basename(file.path));
    
    if (fs.existsSync(filePath) && !fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`Created backup: ${backupPath}`);
    }
  });
};

// Paths to the files we want to check/modify
const files = [
  {
    path: 'node_modules/react-native-health-connect/android/src/main/java/dev/matinzd/healthconnect/records/ReactHealthRecord.kt',
    originalLine: 'val recordType = reactRecords.getMap(0).getString("recordType")',
    patchedLine: 'val recordType = reactRecords.getMap(0)?.getString("recordType")'
  },
  {
    path: 'node_modules/react-native-health-connect/android/src/main/java/dev/matinzd/healthconnect/utils/HealthConnectUtils.kt',
    originalLine: 'list.add(getMap(i))',
    patchedLine: 'list.add(getMap(i)!!)'
  }
];

// First, back up the original files 
backupFiles();

// Process each file
files.forEach(file => {
  const filePath = path.join(__dirname, file.path);
  
  if (fs.existsSync(filePath)) {
    console.log(`Checking: ${filePath}`);
    
    // Read the file
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the original line exists (meaning patch is needed)
    if (content.includes(file.originalLine)) {
      console.log(`Found line to patch in: ${file.path}`);
      
      // Apply the patch
      content = content.replace(file.originalLine, file.patchedLine);
      
      // Write the file back
      fs.writeFileSync(filePath, content);
      console.log(`✅ Successfully applied patch to: ${file.path}`);
    } 
    // Check if patched line already exists
    else if (content.includes(file.patchedLine)) {
      console.log(`✅ File already patched: ${file.path}`);
    }
    // Neither original nor patched line found
    else {
      console.log(`⚠️ Could not find the expected line in: ${file.path}`);
      console.log(`   Looking for either: "${file.originalLine}" or "${file.patchedLine}"`);
    }
  } else {
    console.log(`⚠️ File not found: ${file.path}`);
    
    // Check if the directory structure exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      console.log(`Directory does not exist: ${dirPath}`);
    }
  }
});

console.log('Patch check completed!');
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function tsvToJson(tsvContent) {
  const lines = tsvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return {};
  
  const headers = lines[0].split('\t').map(h => h.replace('*', '').trim());
  const result = {};
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t');
    const obj = {};
    
    headers.forEach((header, index) => {
      obj[header] = values[index] ? values[index].trim() : '';
    });
    
    const id = obj.id || obj.ID || i;
    result[id] = obj;
  }
  
  return result;
}

const dataTablesPath = path.join(__dirname, '..', 'data', 'source');
const outputPath = path.join(__dirname, '..', 'data', 'export');

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const tsvFiles = [
  'onboarding-questions.tsv',
  'onboarding-options.tsv', 
  'onboarding-modules.tsv',
  'discover-modules.tsv',
  'discover-topics.tsv',
  'discover-questions.tsv',
  'discover-options.tsv',
  'discover-recommendations.tsv',
  'discover-resources.tsv',
  'discover-tags.tsv',
];

console.log('Converting TSV files to JSON for Firebase import...\n');

tsvFiles.forEach(filename => {
  const tsvPath = path.join(dataTablesPath, filename);
  
  if (!fs.existsSync(tsvPath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return;
  }
  
  const tsvContent = fs.readFileSync(tsvPath, 'utf-8');
  const jsonData = tsvToJson(tsvContent);
  
  const jsonFilename = filename.replace('.tsv', '.json').replace('Discover Modules - ', '');
  const jsonPath = path.join(outputPath, jsonFilename);
  
  fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2));
  
  console.log(`✅ Converted ${filename} -> ${jsonFilename} (${Object.keys(jsonData).length} records)`);
});

console.log(`\n✨ All files converted! JSON files are in: ${outputPath}`);
console.log('\nYou can now import these JSON files directly to Firebase using:');
console.log('- Firebase Console Import feature');
console.log('- Firebase CLI: firebase database:set /true-self/onboarding/questions data/export/onboarding-questions.json');

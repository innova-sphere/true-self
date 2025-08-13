#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const exportPath = path.join(__dirname, '..', 'data', 'export');
const outputFile = path.join(exportPath, 'firebase-import.json');

// Define the collection mapping
const collections = {
  'onboarding-questions.json': 'onboardingQuestions',
  'onboarding-options.json': 'onboardingOptions',
  'onboarding-modules.json': 'onboardingModules',
  'discover-modules.json': 'discoverModules',
  'discover-topics.json': 'discoverTopics', 
  'discover-questions.json': 'discoverQuestions',
  'discover-options.json': 'discoverOptions',
  'discover-recommendations.json': 'discoverRecommendations',
  'discover-resources.json': 'discoverResources',
  'discover-tags.json': 'discoverTags'
};

console.log('Creating Firebase import file...\n');

const firebaseData = {};

// Process each JSON file
Object.entries(collections).forEach(([filename, collectionName]) => {
  const filePath = path.join(exportPath, filename);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filename}`);
    return;
  }
  
  try {
    const jsonContent = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonContent);
    
    // Convert object to array format for Firebase
    const arrayData = Object.values(data);
    
    firebaseData[collectionName] = arrayData;
    
    console.log(`✅ Added ${collectionName}: ${arrayData.length} records`);
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
  }
});

// Write the combined Firebase import file
try {
  fs.writeFileSync(outputFile, JSON.stringify(firebaseData, null, 2));
  
  const totalRecords = Object.values(firebaseData).reduce((sum, arr) => sum + arr.length, 0);
  
  console.log(`\n✨ Firebase import file created: ${outputFile}`);
  console.log(`📊 Total collections: ${Object.keys(firebaseData).length}`);
  console.log(`📊 Total records: ${totalRecords}`);
  console.log('\nYou can now import to Firebase using:');
  console.log('firebase database:set /true-self data/export/firebase-import.json');
  
} catch (error) {
  console.error('❌ Error writing Firebase import file:', error.message);
  process.exit(1);
}
// Test script for CDR Scoring Engine
import cdrEngine from '../src/services/cdrScoringEngine.js';

console.log('--- Testing CDR Scoring Engine ---');

// Test 1: Example from prompt
// Memory = 1, Orientation = 0.5, Judgment = 1, Community = 0.5, Home & Hobbies = 1, Personal Care = 0
// Total should be 4.0, Observed Level: "Very mild"
const exampleInput = {
  memoryScore: 1,
  orientationScore: 0.5,
  judgmentScore: 1,
  communityScore: 0.5,
  homeHobbyScore: 1,
  personalCareScore: 0
};

const result = cdrEngine.calculateCDRScore(exampleInput);
console.log('Test 1 Result:', JSON.stringify(result, null, 2));

if (result.total_score === 4.0 && result.observed_level === 'Very mild') {
  console.log('✅ Test 1 Passed: Total is 4.0 and observed level is "Very mild"');
} else {
  console.error('❌ Test 1 Failed!', result);
  process.exit(1);
}

// Test 2: Zero impairment
const zeroResult = cdrEngine.calculateCDRScore({
  memory: 0, orientation: 0, judgment_problem_solving: 0,
  community_affairs: 0, home_hobbies: 0, personal_care: 0
});
if (zeroResult.total_score === 0 && zeroResult.observed_level === 'No observed difficulty') {
  console.log('✅ Test 2 Passed: 0.0 correctly mapped to "No observed difficulty"');
} else {
  console.error('❌ Test 2 Failed!', zeroResult);
  process.exit(1);
}

// Test 3: Mild (e.g. 6.0)
const mildResult = cdrEngine.calculateCDRScore({
  memory: 1, orientation: 1, judgment_problem_solving: 1,
  community_affairs: 1, home_hobbies: 1, personal_care: 1
});
if (mildResult.total_score === 6.0 && mildResult.observed_level === 'Mild') {
  console.log('✅ Test 3 Passed: 6.0 correctly mapped to "Mild"');
} else {
  console.error('❌ Test 3 Failed!', mildResult);
  process.exit(1);
}

// Test 4: Moderate (e.g. 10.0)
const modResult = cdrEngine.calculateCDRScore({
  memory: 2, orientation: 2, judgment_problem_solving: 2,
  community_affairs: 2, home_hobbies: 1, personal_care: 1
});
if (modResult.total_score === 10.0 && modResult.observed_level === 'Moderate') {
  console.log('✅ Test 4 Passed: 10.0 correctly mapped to "Moderate"');
} else {
  console.error('❌ Test 4 Failed!', modResult);
  process.exit(1);
}

// Test 5: Severe (e.g. 17.0)
const severeResult = cdrEngine.calculateCDRScore({
  memory: 3, orientation: 3, judgment_problem_solving: 3,
  community_affairs: 3, home_hobbies: 3, personal_care: 2
});
if (severeResult.total_score === 17.0 && severeResult.observed_level === 'Severe') {
  console.log('✅ Test 5 Passed: 17.0 correctly mapped to "Severe"');
} else {
  console.error('❌ Test 5 Failed!', severeResult);
  process.exit(1);
}

// Test 6: Longitudinal Trend
const sampleHistory = [
  { assessment_date: '2026-06-15', total_score: 3.0 },
  { assessment_date: '2026-07-15', total_score: 3.5 },
  { assessment_date: '2026-08-15', total_score: 4.0 },
  { assessment_date: '2026-09-15', total_score: 4.5 }
];
const trend = cdrEngine.evaluateLongitudinalTrend(sampleHistory);
console.log('Trend result:', trend);
if (trend.status === 'Gradual decline detected') {
  console.log('✅ Test 6 Passed: Longitudinal trend correctly detected "Gradual decline detected"');
} else {
  console.error('❌ Test 6 Failed!', trend);
  process.exit(1);
}

console.log('🎉 ALL CDR SCORING ENGINE TESTS PASSED!');

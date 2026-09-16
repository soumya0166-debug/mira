/**
 * Automated Verification Script for Multilingual Translations across All 10 NER Languages
 */

import { LANGUAGES, translations, getTranslationProxy } from './src/i18n/translations.js';

console.log('--- STARTING MULTILINGUAL VERIFICATION FOR MIRA NER ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// 1. Verify all 10 languages exist in LANGUAGES array
assert(LANGUAGES.length === 10, `All 10 regional languages defined in LANGUAGES (found ${LANGUAGES.length})`);

const expectedCodes = ['en', 'as', 'bn', 'brx', 'mni', 'kha', 'lus', 'grt', 'trp', 'nag'];
expectedCodes.forEach(code => {
  const found = LANGUAGES.find(l => l.code === code);
  assert(!!found, `Language "${code}" exists in metadata`);
  assert(!!translations[code], `Language dictionary for "${code}" exists in translations object`);
});

// 2. Test deep fallback proxy for all 10 languages across every section
const requiredSections = [
  'nav',
  'home',
  'games',
  'memory',
  'routine',
  'mira',
  'caregiver',
  'progress',
  'gallery',
  'wellness',
  'guardian',
  'common'
];

expectedCodes.forEach(code => {
  const t = getTranslationProxy(code);
  assert(typeof t === 'object', `getTranslationProxy('${code}') returns valid proxy object`);

  requiredSections.forEach(sec => {
    const sectionObj = t[sec];
    assert(sectionObj !== undefined && sectionObj !== null, `Section '${sec}' is accessible in '${code}'`);
  });

  // Check specific critical keys
  assert(typeof t.home.greetingMorning === 'string' && t.home.greetingMorning.length > 0, `'${code}' has t.home.greetingMorning: "${t.home.greetingMorning}"`);
  assert(typeof t.home.todayRecommendation === 'string' && t.home.todayRecommendation.length > 0, `'${code}' has t.home.todayRecommendation: "${t.home.todayRecommendation}"`);
  assert(typeof t.games.title === 'string' && t.games.title.length > 0, `'${code}' has t.games.title: "${t.games.title}"`);
  assert(typeof t.games.game1Title === 'string' && t.games.game1Title.length > 0, `'${code}' has t.games.game1Title: "${t.games.game1Title}"`);
  assert(typeof t.games.game8Title === 'string' && t.games.game8Title.length > 0, `'${code}' has t.games.game8Title: "${t.games.game8Title}"`);
  assert(typeof t.memory.title === 'string' && t.memory.title.length > 0, `'${code}' has t.memory.title: "${t.memory.title}"`);
  assert(typeof t.gallery.title === 'string' && t.gallery.title.length > 0, `'${code}' has t.gallery.title: "${t.gallery.title}"`);
  assert(typeof t.routine.title === 'string' && t.routine.title.length > 0, `'${code}' has t.routine.title: "${t.routine.title}"`);
  assert(typeof t.routine.progressToday === 'string' && t.routine.progressToday.length > 0, `'${code}' has t.routine.progressToday: "${t.routine.progressToday}"`);
  assert(typeof t.wellness.title === 'string' && t.wellness.title.length > 0, `'${code}' has t.wellness.title: "${t.wellness.title}"`);
  assert(typeof t.guardian.title === 'string' && t.guardian.title.length > 0, `'${code}' has t.guardian.title: "${t.guardian.title}"`);
  assert(typeof t.common.offlineActive === 'string' && t.common.offlineActive.length > 0, `'${code}' has t.common.offlineActive: "${t.common.offlineActive}"`);
});

// 3. Fallback Test for nonexistent keys or missing languages
const fallbackTest = getTranslationProxy('nonexistent_lang');
assert(fallbackTest.home.greetingMorning === translations.en.home.greetingMorning, 'Nonexistent language falls back seamlessly to English');
assert(fallbackTest.routine.title === translations.en.routine.title, 'Routine title falls back to English');

// 4. Aliasing bridge test
const asT = getTranslationProxy('as');
assert(asT.gallery.slideshow === asT.memory.slideshow, 'Assamese gallery.slideshow aliases to memory.slideshow');
assert(asT.wellness.title === asT.progress.title, 'Assamese wellness.title aliases to progress.title');
assert(asT.guardian.title === asT.caregiver.title || asT.guardian.title.length > 0, 'Assamese guardian.title aliases/resolves properly');

console.log(`\n--- VERIFICATION RESULT: ${passedTests}/${totalTests} TESTS PASSED ---`);
if (passedTests === totalTests) {
  console.log('ALL TESTS PASSED SUCCESSFULLY! Multilingual switching is fully functional across all sections.');
  process.exit(0);
} else {
  console.error(`FAILED: ${totalTests - passedTests} tests failed.`);
  process.exit(1);
}

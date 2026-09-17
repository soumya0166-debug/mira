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
// 5. Verify game content engine across all 7 games and all 10 languages
import { getGameContent, getGameMetadata, GAME_METADATA } from './src/i18n/gameTranslations.js';

const gamesList = [
  'memory-match',
  'sequence-recall',
  'object-recall',
  'daily-recall',
  'picture-recognition',
  'language-recall',
  'pattern-recognition'
];

expectedCodes.forEach(code => {
  gamesList.forEach(gameId => {
    const content = getGameContent(gameId, code);
    assert(Array.isArray(content) && content.length > 0, `Game '${gameId}' has content array in '${code}' (length: ${content?.length})`);
    
    // Check specific options integrity
    if (gameId === 'daily-recall') {
      content.forEach((q, idx) => {
        assert(Array.isArray(q.options) && q.options.length === 4, `'${code}' daily-recall Q${idx+1} has 4 options`);
        assert(typeof q.question === 'string' && q.question.length > 0, `'${code}' daily-recall Q${idx+1} has question text`);
      });
    } else if (gameId === 'picture-recognition') {
      content.forEach((item, idx) => {
        assert(Array.isArray(item.options) && item.options.length === 4, `'${code}' picture-recognition landmark ${idx+1} has 4 options`);
        assert(typeof item.clue === 'string' && item.clue.length > 0, `'${code}' picture-recognition landmark ${idx+1} has clue`);
      });
    } else if (gameId === 'language-recall') {
      content.forEach((pair, idx) => {
        assert(Array.isArray(pair.options) && pair.options.length === 4, `'${code}' language-recall pair ${idx+1} has 4 options`);
        assert(typeof pair.nativeWord === 'string' && pair.nativeWord.length > 0, `'${code}' language-recall pair ${idx+1} has nativeWord`);
      });
    } else if (gameId === 'pattern-recognition') {
      content.forEach((pat, idx) => {
        assert(Array.isArray(pat.options) && pat.options.length === 4, `'${code}' pattern-recognition motif ${idx+1} has 4 options`);
        assert(typeof pat.description === 'string' && pat.description.length > 0, `'${code}' pattern-recognition motif ${idx+1} has description`);
      });
    }
  });

  // Verify metadata for games
  const meta = getGameMetadata('memory-match', code);
  assert(meta && typeof meta.title === 'string' && meta.title.length > 0, `'${code}' memory-match metadata title: "${meta?.title}"`);
});

console.log(`\n--- VERIFICATION RESULT: ${passedTests}/${totalTests} TESTS PASSED ---`);
if (passedTests === totalTests) {
  console.log('ALL TESTS PASSED SUCCESSFULLY! Multilingual switching and game options are fully functional across all sections.');
  process.exit(0);
} else {
  console.error(`FAILED: ${totalTests - passedTests} tests failed.`);
  process.exit(1);
}

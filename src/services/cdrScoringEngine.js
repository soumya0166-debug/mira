/**
 * MIRA - CDR-Inspired Cognitive & Functional Scoring Engine
 * 
 * IMPORTANT NOTICE:
 * This module computes a CDR-inspired screening score based on a Sum of Boxes (CDR-SB) style arithmetic model.
 * It is intended exclusively for non-diagnostic cognitive screening, tracking, and family/caregiver support.
 * It does NOT provide a medical diagnosis or replace clinical examination by a qualified neurologist.
 */

export const ASSESSMENT_DOMAINS = [
  {
    code: 'M',
    key: 'memory',
    name: 'Memory',
    shortDescription: 'Recent events, conversations, familiar names & recall',
    icon: '🧠',
    questions: [
      {
        id: 'm_recall',
        prompt: 'How well does the individual recall recent family events, conversations, or appointments?',
        options: [
          { score: 0.0, label: '0.0 - No impairment', description: 'Consistent recall; no memory loss observed.' },
          { score: 0.5, label: '0.5 - Very mild difficulty', description: 'Occasional forgetfulness; slightly slower recall, benign lapses.' },
          { score: 1.0, label: '1.0 - Mild difficulty', description: 'Moderate memory loss; more marked for recent events, interferes with everyday activities.' },
          { score: 2.0, label: '2.0 - Moderate difficulty', description: 'Severe memory loss; only highly learned material retained, new information rapidly lost.' },
          { score: 3.0, label: '3.0 - Severe difficulty', description: 'Severe memory loss; only fragments remain, struggles with familiar names.' }
        ]
      }
    ]
  },
  {
    code: 'O',
    key: 'orientation',
    name: 'Orientation',
    shortDescription: 'Sense of time, day/date, place & surroundings',
    icon: '🧭',
    questions: [
      {
        id: 'o_awareness',
        prompt: 'How oriented is the individual to the current day, month, year, and familiar physical locations?',
        options: [
          { score: 0.0, label: '0.0 - No impairment', description: 'Fully oriented to time, day, date, and physical surroundings.' },
          { score: 0.5, label: '0.5 - Very mild difficulty', description: 'Slight difficulty with exact dates or calendar schedules, knows general season & location.' },
          { score: 1.0, label: '1.0 - Mild difficulty', description: 'Moderate difficulty with time relationships; oriented for place on examination; may wander.' },
          { score: 2.0, label: '2.0 - Moderate difficulty', description: 'Severe difficulty with time; usually disoriented to time and often to place.' },
          { score: 3.0, label: '3.0 - Severe difficulty', description: 'Oriented to person only; unaware of time or current environment.' }
        ]
      }
    ]
  },
  {
    code: 'JPS',
    key: 'judgment_problem_solving',
    name: 'Judgment & Problem Solving',
    shortDescription: 'Decision making, handling unexpected issues, financial basics',
    icon: '⚖️',
    questions: [
      {
        id: 'jps_decisions',
        prompt: 'How does the individual handle problem solving, safety decisions, and basic financial matters?',
        options: [
          { score: 0.0, label: '0.0 - No impairment', description: 'Solves everyday problems well; sound judgment in personal & financial matters.' },
          { score: 0.5, label: '0.5 - Very mild difficulty', description: 'Slight impairment in solving complex problems or discerning similarities/differences.' },
          { score: 1.0, label: '1.0 - Mild difficulty', description: 'Moderate difficulty in handling complex decisions; social judgment usually maintained.' },
          { score: 2.0, label: '2.0 - Moderate difficulty', description: 'Severely impaired in handling problems, similarities, and differences; social judgment usually impaired.' },
          { score: 3.0, label: '3.0 - Severe difficulty', description: 'Unable to make judgments or solve simple problems; requires constant guidance.' }
        ]
      }
    ]
  },
  {
    code: 'CA',
    key: 'community_affairs',
    name: 'Community Affairs',
    shortDescription: 'Shopping, community gatherings, civic activities & transport',
    icon: '🏘️',
    questions: [
      {
        id: 'ca_social',
        prompt: 'How independently does the individual participate in community activities, shopping, or neighborhood visits?',
        options: [
          { score: 0.0, label: '0.0 - No impairment', description: 'Independent function at usual level in job, shopping, volunteer & social groups.' },
          { score: 0.5, label: '0.5 - Very mild difficulty', description: 'Slight impairment in these activities; may need subtle prompts or accompaniment.' },
          { score: 1.0, label: '1.0 - Mild difficulty', description: 'Unable to function independently in these activities though may still engage in some; appears normal to casual inspection.' },
          { score: 2.0, label: '2.0 - Moderate difficulty', description: 'No pretense of independent function outside home; accompanied to all outings.' },
          { score: 3.0, label: '3.0 - Severe difficulty', description: 'Unable to participate in community activities outside the home.' }
        ]
      }
    ]
  },
  {
    code: 'HH',
    key: 'home_hobbies',
    name: 'Home & Hobbies',
    shortDescription: 'Household chores, cooking, crafts, music & pastimes',
    icon: '🏡',
    questions: [
      {
        id: 'hh_activities',
        prompt: 'How does the individual engage in home activities, routine tasks, and personal hobbies?',
        options: [
          { score: 0.0, label: '0.0 - No impairment', description: 'Life at home, hobbies, and intellectual interests well maintained.' },
          { score: 0.5, label: '0.5 - Very mild difficulty', description: 'Life at home and hobbies slightly impaired; more complex chores abandoned.' },
          { score: 1.0, label: '1.0 - Mild difficulty', description: 'Mild but definite impairment of function at home; more difficult chores abandoned; simpler hobbies sustained.' },
          { score: 2.0, label: '2.0 - Moderate difficulty', description: 'Only simple chores preserved; very restricted interests sustained.' },
          { score: 3.0, label: '3.0 - Severe difficulty', description: 'No significant function in home activities or hobbies.' }
        ]
      }
    ]
  },
  {
    code: 'PC',
    key: 'personal_care',
    name: 'Personal Care',
    shortDescription: 'Dressing, grooming, hygiene & personal meals',
    icon: '🧼',
    questions: [
      {
        id: 'pc_hygiene',
        prompt: 'How independently can the individual manage personal hygiene, dressing, and eating?',
        options: [
          { score: 0.0, label: '0.0 - No impairment', description: 'Fully capable of self-care (bathing, dressing, eating independently).' },
          { score: 0.5, label: '0.5 - Very mild difficulty', description: 'Fully independent with minor prompting needed for cleanliness or clothing choice.' },
          { score: 1.0, label: '1.0 - Mild difficulty', description: 'Needs occasional prompting or assistance with dressing, hygiene, keeping personal effects.' },
          { score: 2.0, label: '2.0 - Moderate difficulty', description: 'Requires assistance in dressing, hygiene, and keeping personal effects.' },
          { score: 3.0, label: '3.0 - Severe difficulty', description: 'Requires extensive help with personal care; frequently incontinent or unable to feed self.' }
        ]
      }
    ]
  }
];

export const MANDATORY_DISCLAIMER =
  'This result is intended for cognitive monitoring and screening support only. It does not constitute a medical diagnosis. Please consult a qualified healthcare professional for clinical assessment.';

export const ALLOWED_SCORES = [0, 0.5, 1, 2, 3];

/**
 * Validates and sanitizes an individual domain score.
 */
export function sanitizeDomainScore(rawScore) {
  const num = parseFloat(rawScore);
  if (isNaN(num)) return 0;
  // Match to closest allowed score [0, 0.5, 1, 2, 3]
  return ALLOWED_SCORES.reduce((prev, curr) => 
    Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev
  );
}

/**
 * Categorize the Sum of Boxes score into prototype screening ranges.
 * Range:
 *   0.0: No observed difficulty
 *   0.5 – 4.0: Very mild
 *   4.5 – 9.0: Mild
 *   9.5 – 15.5: Moderate
 *   16.0 – 18.0: Severe
 */
export function getObservedLevel(totalScore) {
  const score = Math.max(0, Math.min(18, Number(totalScore) || 0));
  if (score === 0) {
    return {
      level: 'No observed difficulty',
      code: 'NONE',
      color: '#16a34a',
      bg: '#f0fdf4',
      border: '#bbf7d0',
      description: 'Typical cognitive and functional abilities observed across all six screening domains.'
    };
  }
  if (score <= 4.0) {
    return {
      level: 'Very mild',
      code: 'VERY_MILD',
      color: '#0284c7',
      bg: '#f0f9ff',
      border: '#bae6fd',
      description: 'Minor inconsistencies observed. Regular stimulation and structured routine are encouraged.'
    };
  }
  if (score <= 9.0) {
    return {
      level: 'Mild',
      code: 'MILD',
      color: '#d97706',
      bg: '#fffbeb',
      border: '#fde68a',
      description: 'Mild functional challenges noted. Supportive reminders, memory aids, and caregiver monitoring recommended.'
    };
  }
  if (score <= 15.5) {
    return {
      level: 'Moderate',
      code: 'MODERATE',
      color: '#ea580c',
      bg: '#fff7ed',
      border: '#ffedd5',
      description: 'Notable functional support required for complex daily activities and orientation.'
    };
  }
  return {
    level: 'Severe',
    code: 'SEVERE',
    color: '#dc2626',
    bg: '#fef2f2',
    border: '#fecaca',
    description: 'Substantial assistance needed for personal care and everyday routines.'
  };
}

/**
 * Calculates the CDR-inspired screening score.
 * 
 * Formula:
 *   CDR_SB = M + O + JPS + CA + HH + PC
 *   0 <= CDR_SB <= 18
 * 
 * @param {Object} input - Domain scores object:
 *   { memory, orientation, judgment_problem_solving, community_affairs, home_hobbies, personal_care }
 * @returns {Object} Structured screening output
 */
export function calculateCDRScore(input = {}) {
  const memory = sanitizeDomainScore(input.memoryScore ?? input.memory ?? 0);
  const orientation = sanitizeDomainScore(input.orientationScore ?? input.orientation ?? 0);
  const judgment = sanitizeDomainScore(
    input.judgmentScore ?? input.judgment_problem_solving ?? input.judgmentProblemSolving ?? 0
  );
  const community = sanitizeDomainScore(
    input.communityScore ?? input.community_affairs ?? input.communityAffairs ?? 0
  );
  const homeHobby = sanitizeDomainScore(
    input.homeHobbyScore ?? input.home_hobbies ?? input.homeHobbies ?? 0
  );
  const personalCare = sanitizeDomainScore(
    input.personalCareScore ?? input.personal_care ?? input.personalCare ?? 0
  );

  // Sum of Boxes (CDR-SB) calculation
  const totalRaw = memory + orientation + judgment + community + homeHobby + personalCare;
  const totalScore = Math.round(totalRaw * 10) / 10; // Clean floating point rounding

  const levelInfo = getObservedLevel(totalScore);

  return {
    memory,
    orientation,
    judgment_problem_solving: judgment,
    community_affairs: community,
    home_hobbies: homeHobby,
    personal_care: personalCare,
    total_score: totalScore,
    max_score: 18.0,
    observed_level: levelInfo.level,
    observed_level_code: levelInfo.code,
    level_info: levelInfo,
    assessment_type: 'screening',
    scoring_title: 'CDR-Inspired Cognitive Functional Screening',
    disclaimer: MANDATORY_DISCLAIMER,
    timestamp: new Date().toISOString()
  };
}

/**
 * Evaluates longitudinal trend across historical assessments.
 * 
 * @param {Array} assessments - Array of assessment objects sorted by date
 * @returns {Object} Trend result: Stable | Improving | Gradual decline detected
 */
export function evaluateLongitudinalTrend(assessments = []) {
  if (!assessments || assessments.length === 0) {
    return {
      status: 'Insufficient data',
      badge: 'New Baseline',
      color: '#64748b',
      delta: 0,
      summary: 'Record regular monthly screenings to establish a longitudinal cognitive trend.'
    };
  }

  if (assessments.length === 1) {
    return {
      status: 'Initial Baseline Set',
      badge: 'Baseline',
      color: '#0284c7',
      delta: 0,
      summary: `Baseline score of ${assessments[0].total_score.toFixed(1)} / 18 recorded.`
    };
  }

  // Sort chronologically ascending
  const sorted = [...assessments].sort((a, b) => new Date(a.assessment_date || a.timestamp) - new Date(b.assessment_date || b.timestamp));
  const oldest = sorted[0];
  const latest = sorted[sorted.length - 1];

  const scoreDiff = latest.total_score - oldest.total_score;
  const roundedDiff = Math.round(scoreDiff * 10) / 10;

  // In CDR-SB scoring, a higher score represents greater difficulty.
  // Lower score = Improvement.
  // Same (+- 0.5) = Stable.
  // Higher score (> +0.5) = Gradual decline detected.
  if (roundedDiff <= -0.5) {
    return {
      status: 'Improving',
      badge: 'Improving (Fewer difficulties noted)',
      color: '#16a34a',
      delta: roundedDiff,
      summary: `Difficulty score reduced by ${Math.abs(roundedDiff).toFixed(1)} points over ${sorted.length} screenings.`
    };
  } else if (roundedDiff >= 0.8) {
    return {
      status: 'Gradual decline detected',
      badge: 'Gradual decline detected',
      color: '#dc2626',
      delta: roundedDiff,
      summary: `Difficulty score increased by +${roundedDiff.toFixed(1)} points across ${sorted.length} recorded intervals. Consider consulting the patient's physician for a review.`
    };
  } else {
    return {
      status: 'Stable',
      badge: 'Stable Trend',
      color: '#2563eb',
      delta: roundedDiff,
      summary: `Screening score has remained steady (${roundedDiff >= 0 ? '+' : ''}${roundedDiff.toFixed(1)} variance) across observed intervals.`
    };
  }
}

export default {
  ASSESSMENT_DOMAINS,
  MANDATORY_DISCLAIMER,
  ALLOWED_SCORES,
  sanitizeDomainScore,
  getObservedLevel,
  calculateCDRScore,
  evaluateLongitudinalTrend
};

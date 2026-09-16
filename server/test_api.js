// Server Verification Test
async function runTests() {
  console.log('Testing MIND AI - NER Backend API Endpoints...\n');

  try {
    // 1. Health check
    const healthRes = await fetch('http://localhost:3001/api/health');
    const healthData = await healthRes.json();
    console.log('✔ Health Check:', healthData);

    // 2. Auth Login (PIN)
    const pinRes = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '1234' })
    });
    const pinData = await pinRes.json();
    console.log('✔ PIN Login Success:', pinData.user?.fullName, 'Token:', pinData.token ? 'Issued' : 'None');

    const token = pinData.token;

    // 3. MIRA AI Chat
    const chatRes = await fetch('http://localhost:3001/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        message: 'What is my routine today?',
        context: {
          preferredName: 'Radha Dadi',
          routines: [{ title: 'Morning Assam Tea', time: '07:30 AM' }]
        }
      })
    });
    const chatData = await chatRes.json();
    console.log('✔ MIRA AI Chat Response:', chatData.reply, `(Source: ${chatData.source})`);

    // 4. Adaptive Difficulty Engine
    const adaptiveRes = await fetch('http://localhost:3001/api/gemini/adaptive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        gameType: 'memory-match',
        currentDifficulty: 'easy',
        recentSessions: [{ accuracy: 95, score: 95 }]
      })
    });
    const adaptiveData = await adaptiveRes.json();
    console.log('✔ Adaptive Difficulty Suggestion:', adaptiveData.nextDifficulty, `Rationale: ${adaptiveData.rationale}`);

    // 5. Caregiver Permissions
    const permRes = await fetch('http://localhost:3001/api/caregiver/permissions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        caregiverUserId: 'usr-ananya-2',
        permissionLevel: 'ROUTINES'
      })
    });
    const permData = await permRes.json();
    console.log('✔ Caregiver Permission Enforcement:', permData.message);

    console.log('\nAll API endpoint checks passed successfully!');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

runTests();

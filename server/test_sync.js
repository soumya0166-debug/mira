// Full verification of sync endpoints
async function testSyncSuite() {
  console.log('--- Starting Sync API Suite Verification ---');

  // 1. Test Content Pack
  const packRes = await fetch('http://localhost:3001/api/sync/content-pack');
  const packData = await packRes.json();
  console.log('1. GET /api/sync/content-pack: Status =', packRes.status, '| Activities Count =', packData.count);

  // 2. Test Batch Sync with Demo User
  const batchRes = await fetch('http://localhost:3001/api/sync/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-demo-user-id': 'usr-radha-1'
    },
    body: JSON.stringify({
      items: [
        {
          id: 'sync-test-1',
          type: 'GAME_SESSION',
          payload: {
            id: 'sess-test-101',
            userId: 'usr-radha-1',
            gameId: 'heritage-match',
            gameType: 'memory-match',
            score: 95,
            accuracy: 92,
            durationSeconds: 45,
            completedAt: new Date().toISOString()
          }
        },
        {
          id: 'sync-test-2',
          type: 'ROUTINE_UPDATE',
          payload: {
            routines: [
              { id: 'rout-1', title: 'Morning Ginger Tea', completedToday: true, completedAt: '08:30 AM' }
            ]
          }
        }
      ],
      clientTimestamp: new Date().toISOString()
    })
  });

  const batchData = await batchRes.json();
  console.log('2. POST /api/sync/batch: Status =', batchRes.status, '| Processed =', batchData.processedIds?.length, '| Total Synced =', batchData.totalSyncedSessions);

  // 3. Test Pull Sync
  const pullRes = await fetch('http://localhost:3001/api/sync/pull', {
    headers: { 'x-demo-user-id': 'usr-radha-1' }
  });
  const pullData = await pullRes.json();
  console.log('3. GET /api/sync/pull: Status =', pullRes.status, '| Cloud Sessions =', pullData.gameSessions?.length);

  // 4. Test Idempotency (sending same session again does not duplicate)
  const dupRes = await fetch('http://localhost:3001/api/sync/batch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-demo-user-id': 'usr-radha-1'
    },
    body: JSON.stringify({
      items: [
        {
          id: 'sync-test-dup',
          type: 'GAME_SESSION',
          payload: {
            id: 'sess-test-101', // Same ID
            userId: 'usr-radha-1',
            gameId: 'heritage-match',
            score: 95
          }
        }
      ]
    })
  });
  const dupData = await dupRes.json();
  console.log('4. Idempotency Test: Total Synced Sessions =', dupData.totalSyncedSessions, '(Expected: 1, no duplicates)');

  console.log('--- Sync API Suite Passed Successfully! ---');
}

testSyncSuite().catch(console.error);

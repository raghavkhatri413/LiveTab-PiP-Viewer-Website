const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.removeInactiveUsers = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
    const now = Date.now();
    const inactivityThreshold = 60000;
    const liveUsersRef = admin.database().ref('liveUsers');
    const snapshot = await liveUsersRef.once('value');
    const users = snapshot.val();

    if (users) {
        for (const userId in users) {
            if (now - users[userId] > inactivityThreshold) {
                await liveUsersRef.child(userId).remove();
                console.log(`Removed inactive user: ${userId}`);
            }
        }
    }
    return null;
});
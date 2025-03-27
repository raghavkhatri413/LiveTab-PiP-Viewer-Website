function updateLiveUsers() {
    const liveUsersRef = ref(database, "liveUsers");
    const userId = generateUniqueId();
    const userRef = ref(database, `liveUsers/${userId}`);

    // Function to update the user's heartbeat
    function updateUserHeartbeat() {
        set(userRef, serverTimestamp())
            .catch(error => console.error("Error updating heartbeat:", error));
    }

    // Initial heartbeat and interval for periodic updates
    updateUserHeartbeat();
    const heartbeatInterval = setInterval(updateUserHeartbeat, 30000); // Update every 30 seconds

    // Listen for changes to live users
    onValue(liveUsersRef, (snapshot) => {
        if (snapshot.exists() && typeof snapshot.val() === 'object') {
            const users = snapshot.val();
            const now = Date.now();
            let activeCount = 0;

            for (const id in users) {
                if (now - users[id] < 60000) { // Consider users active if heartbeat within 60 seconds
                    activeCount++;
                }
            }

            liveUsersElement.innerText = `Live Users: ${activeCount}`;
            console.log("Live users loaded:", activeCount);
        } else {
            liveUsersElement.innerText = "Live Users: 0";
            console.log("No live users data");
        }
    }, (error) => {
        console.error("onValue error:", error);
        liveUsersElement.innerText = "Error loading live users.";
    });

    // Clean up on page unload
    window.addEventListener("beforeunload", () => {
        clearInterval(heartbeatInterval); // Stop heartbeat updates
        set(userRef, null)
            .catch(error => console.error("Error removing user:", error));
    });

    window.addEventListener("unload", () => {
        clearInterval(heartbeatInterval); // Stop heartbeat updates
        set(userRef, null)
            .catch(error => console.error("Error removing user:", error));
    });
}
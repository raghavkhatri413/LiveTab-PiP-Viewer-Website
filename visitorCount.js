import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get, set, onValue, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_DATABASE_URL,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const visitorCountElement = document.getElementById("visitorCount");
const liveUsersElement = document.getElementById("liveUsers");

function generateUniqueId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function updateVisitorCount() {
    const visitorRef = ref(database, "visitorCount");
    let deviceId = localStorage.getItem("deviceId");

    if (!deviceId) {
        deviceId = generateUniqueId();
        localStorage.setItem("deviceId", deviceId);

        get(visitorRef).then((snapshot) => {
            let count = snapshot.exists() ? snapshot.val() : 0;
            set(visitorRef, count + 1);
            console.log("Visitor count incremented:", count + 1);
        }).catch(error => {
            console.error("Error fetching/setting visitor count:", error);
        });
    }

    onValue(visitorRef, (snapshot) => {
        if (snapshot.exists()) {
            visitorCountElement.innerText = `Total Visits: ${snapshot.val()}`;
            console.log("Visitor count updated:", snapshot.val());
        } else {
            visitorCountElement.innerText = "Total Visits: 0";
            console.log("No visitor count data.");
        }
    }, (error) => {
        console.error("onValue error for visitor count:", error);
        visitorCountElement.innerText = "Error loading visits.";
    });
}

function updateLiveUsers() {
    const liveUsersRef = ref(database, "liveUsers");
    const userId = generateUniqueId();

    set(ref(database, `liveUsers/${userId}`), true)
        .catch(error => console.error("Error incrementing live users:", error));

    onValue(liveUsersRef, (snapshot) => {
        if (snapshot.exists() && typeof snapshot.val() === 'object') {
            const count = Object.keys(snapshot.val()).length;
            liveUsersElement.innerText = `Live Users: ${count}`;
            console.log("Live users loaded:", count);
        } else {
            liveUsersElement.innerText = "Live Users: 0";
            console.log("No live users data");
        }
    }, (error) => {
        console.error("onValue error:", error);
        liveUsersElement.innerText = "Error loading live users.";
    });

    window.addEventListener("beforeunload", () => {
        set(ref(database, `liveUsers/${userId}`), null)
            .catch(error => console.error("Error decrementing live users:", error));
    });

    window.addEventListener("unload", () => {
        set(ref(database, `liveUsers/${userId}`), null)
            .catch(error => console.error("Error decrementing live users:", error));
    });
}

updateVisitorCount();
updateLiveUsers();
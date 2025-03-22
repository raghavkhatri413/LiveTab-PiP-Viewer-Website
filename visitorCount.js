// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, get, set, onValue, increment, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCn2-rTUJxnwp9Pi6jqYWu_xDMxbGl7MUg",
  authDomain: "live-tab-pip-viewer.firebaseapp.com",
  databaseURL: "https://live-tab-pip-viewer-default-rtdb.firebaseio.com",
  projectId: "live-tab-pip-viewer",
  storageBucket: "live-tab-pip-viewer.firebasestorage.app",
  messagingSenderId: "769065230447",
  appId: "1:769065230447:web:e0be917155de2935672d9a",
  measurementId: "G-3474L6ND6H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Select HTML elements
const visitorCountElement = document.getElementById("visitorCount");
const liveUsersElement = document.getElementById("liveUsers");

// 🔹 Function to update total visitor count
function updateVisitorCount() {
    const visitorRef = ref(database, "visitorCount");
    
    get(visitorRef).then((snapshot) => {
        let count = snapshot.exists() ? snapshot.val() : 0;
        set(visitorRef, count + 1); // Increment visitor count in Firebase
        visitorCountElement.innerText = `Total Visits: ${count + 1}`;
    }).catch(error => console.error("Error fetching visitor count:", error));
}

// 🔹 Function to update live users count
function updateLiveUsers() {
    const liveUsersRef = ref(database, "liveUsers");

    // Add current user to the liveUsers count
    set(liveUsersRef, increment(1));

    // Listen for live users count in real-time
    onValue(liveUsersRef, (snapshot) => {
        let count = snapshot.exists() ? snapshot.val() : 0;
        liveUsersElement.innerText = `Live Users: ${count}`;
    });

    // Remove user when they leave
    window.addEventListener("beforeunload", () => {
        set(liveUsersRef, increment(-1));
    });
}

// Run functions on page load
updateVisitorCount();
updateLiveUsers();

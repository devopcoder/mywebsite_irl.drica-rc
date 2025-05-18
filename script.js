// Firebase App (the core Firebase SDK) is always required and must be listed first
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABD2hqvtKvgiySmnC4TUgsnngU9_1m4ao",
  authDomain: "dricao-alliancenorl.firebaseapp.com",
  projectId: "dricao-alliancenorl",
  storageBucket: "dricao-alliancenorl.firebasestorage.app",
  messagingSenderId: "742658706466",
  appId: "1:742658706466:web:86d870940e27a18f4c4e7b",
  databaseURL: "https://dricao-alliancenorl-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM Elements
const postForm = document.getElementById("postForm");
const nameInput = document.getElementById("name");
const photoInput = document.getElementById("photo");
const messageInput = document.getElementById("message");
const postsContainer = document.getElementById("posts");

// Submit Post
postForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const photo = photoInput.value.trim();
  const message = messageInput.value.trim();

  if (name && message) {
    push(ref(database, "posts"), {
      name: name,
      photo: photo,
      message: message,
      timestamp: Date.now()
    });

    messageInput.value = "";
  }
});

// Display Posts in Real-time
onChildAdded(ref(database, "posts"), function (snapshot) {
  const data = snapshot.val();
  const postElement = document.createElement("div");
  postElement.classList.add("post");

  postElement.innerHTML = `
    <div class="name"><strong>${data.name}</strong></div>
    ${data.photo ? `<img src="${data.photo}" alt="photo" class="photo">` : ""}
    <div class="message">${data.message}</div>
    <hr>
  `;

  postsContainer.prepend(postElement);
});

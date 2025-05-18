import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getDatabase, ref, push, onValue, update
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyABD2hqvtKvgiySmnC4TUgsnngU9_1m4ao",
  authDomain: "dricao-alliancenorl.firebaseapp.com",
  projectId: "dricao-alliancenorl",
  storageBucket: "dricao-alliancenorl.firebasestorage.app",
  messagingSenderId: "742658706466",
  appId: "1:742658706466:web:86d870940e27a18f4c4e7b"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const postsRef = ref(db, 'posts');

function submitPost() {
  const name = document.getElementById('nameInput').value;
  const photo = document.getElementById('photoInput').value;
  const text = document.getElementById('postInput').value;

  if (!name || !photo || !text) return alert("Please fill in all fields!");

  push(postsRef, {
    name,
    photo,
    text,
    likes: 0,
    replies: []
  });

  document.getElementById('nameInput').value = '';
  document.getElementById('photoInput').value = '';
  document.getElementById('postInput').value = '';
}

function submitReply(postKey, replyText) {
  const replyRef = ref(db, `posts/${postKey}/replies`);
  push(replyRef, replyText);
}

function likePost(postKey, currentLikes) {
  const postRef = ref(db, `posts/${postKey}`);
  update(postRef, { likes: currentLikes + 1 });
}

onValue(postsRef, (snapshot) => {
  const container = document.getElementById('postsContainer');
  container.innerHTML = '';
  const data = snapshot.val();
  let count = 0;

  for (let key in data) {
    count++;
    const post = data[key];
    const div = document.createElement('div');
    div.className = 'post';

    div.innerHTML = `
      <div class="name">${post.name}</div>
      <img src="${post.photo}" alt="photo" />
      <p>${post.text}</p>
      <button class="like-btn" onclick="likePost('${key}', ${post.likes})">❤️ ${post.likes}</button>
      <div class="reply-form">
        <input type="text" id="reply-${key}" placeholder="Reply..." />
        <button onclick="submitReply('${key}', document.getElementById('reply-${key}').value)">Reply</button>
      </div>
      <div class="replies">
        ${(post.replies ? Object.values(post.replies).map(reply => `<div class="reply">${reply}</div>`).join('') : '')}
      </div>
    `;

    container.prepend(div);
  }

  document.getElementById('postCount').innerText = `Total posts: ${count}`;
});

// Expose functions globally
window.submitPost = submitPost;
window.submitReply = submitReply;
window.likePost = likePost;

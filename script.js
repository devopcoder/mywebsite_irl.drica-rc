// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getFirestore, collection, addDoc, onSnapshot, updateDoc, doc, arrayUnion
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyABD2hqvtKvgiySmnC4TUgsnngU9_1m4ao",
  authDomain: "dricao-alliancenorl.firebaseapp.com",
  projectId: "dricao-alliancenorl",
  storageBucket: "dricao-alliancenorl.appspot.com",
  messagingSenderId: "742658706466",
  appId: "1:742658706466:web:86d870940e27a18f4c4e7b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

const postsRef = collection(db, "posts");

// POST FUNCTION
async function submitPost() {
  const name = document.getElementById("nameInput").value;
  const message = document.getElementById("messageInput").value;
  const photoFile = document.getElementById("photoInput").files[0];

  if (!name || !message || !photoFile) {
    alert("Please fill out all fields and upload a photo.");
    return;
  }

  // Upload photo to Firebase Storage
  const storageRef = ref(storage, `photos/${Date.now()}_${photoFile.name}`);
  await uploadBytes(storageRef, photoFile);
  const photoURL = await getDownloadURL(storageRef);

  // Save post to Firestore
  await addDoc(postsRef, {
    name,
    message,
    photoURL,
    likes: 0,
    replies: [],
    createdAt: Date.now()
  });

  document.getElementById("nameInput").value = "";
  document.getElementById("messageInput").value = "";
  document.getElementById("photoInput").value = "";
}

// LISTEN TO POSTS
onSnapshot(postsRef, snapshot => {
  const postList = document.getElementById("postList");
  postList.innerHTML = "";
  document.getElementById("postCount").textContent = snapshot.size;

  snapshot.docs
    .sort((a, b) => b.data().createdAt - a.data().createdAt)
    .forEach(docSnap => {
      const post = docSnap.data();
      const postId = docSnap.id;

      const div = document.createElement("div");
      div.classList.add("post");

      div.innerHTML = `
        <div class="post-name">${post.name}</div>
        <img src="${post.photoURL}" alt="User photo" />
        <p>${post.message}</p>
        <p><span class="like-button" onclick="likePost('${postId}')">❤️ Like (${post.likes})</span></p>
        <input type="text" placeholder="Reply..." onkeydown="if(event.key==='Enter'){replyPost('${postId}', this)}" />
        ${post.replies.map(r => `<div class="reply">↳ ${r}</div>`).join("")}
      `;

      postList.appendChild(div);
    });
});

// LIKE FUNCTION
async function likePost(postId) {
  const postDoc = doc(db, "posts", postId);
  const postSnap = await postDoc.get();

  if (postSnap.exists()) {
    const currentLikes = postSnap.data().likes || 0;
    await updateDoc(postDoc, { likes: currentLikes + 1 });
  }
}

// REPLY FUNCTION
async function replyPost(postId, inputElement) {
  const reply = inputElement.value;
  if (!reply) return;

  const postDoc = doc(db, "posts", postId);
  await updateDoc(postDoc, {
    replies: arrayUnion(reply)
  });

  inputElement.value = "";
}

// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js";

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

const postForm = document.getElementById('postForm');
const postsContainer = document.getElementById('posts');
const countDisplay = document.getElementById('count');

postForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const message = document.getElementById('message').value;
  const photoFile = document.getElementById('photo').files[0];

  if (!photoFile) return alert("Select a photo!");

  const photoRef = ref(storage, 'photos/' + photoFile.name);
  await uploadBytes(photoRef, photoFile);
  const photoURL = await getDownloadURL(photoRef);

  await addDoc(collection(db, 'posts'), {
    name,
    message,
    photoURL,
    created: new Date()
  });

  postForm.reset();
});

// Realtime display
const q = query(collection(db, 'posts'), orderBy('created', 'desc'));
onSnapshot(q, (snapshot) => {
  postsContainer.innerHTML = '';
  countDisplay.textContent = snapshot.size;

  snapshot.forEach((doc) => {
    const data = doc.data();
    const post = document.createElement('div');
    post.className = 'post';
    post.innerHTML = `
      <p class="name">${data.name}</p>
      <img src="${data.photoURL}" alt="Photo" />
      <p>${data.message}</p>
    `;
    postsContainer.appendChild(post);
  });
});
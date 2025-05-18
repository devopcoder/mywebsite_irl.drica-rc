import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

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

const postRef = collection(db, "posts");

async function submitPost() {
  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;
  const file = document.getElementById("photo").files[0];

  if (!name || !message) return alert("Please enter name and message.");

  let photoURL = "";

  if (file) {
    const storageRef = ref(storage, `photos/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    photoURL = await getDownloadURL(storageRef);
  }

  await addDoc(postRef, {
    name,
    message,
    photoURL,
    created: Date.now()
  });

  document.getElementById("name").value = "";
  document.getElementById("message").value = "";
  document.getElementById("photo").value = "";
}

function displayPosts() {
  const q = query(postRef, orderBy("created", "desc"));

  onSnapshot(q, (snapshot) => {
    const postContainer = document.getElementById("posts");
    postContainer.innerHTML = "";

    snapshot.forEach((doc) => {
      const post = doc.data();
      const postDiv = document.createElement("div");
      postDiv.className = "post";

      postDiv.innerHTML = `
        <strong>${post.name}</strong><br>
        ${post.message}<br>
        ${post.photoURL ? `<img src="${post.photoURL}" />` : ""}
      `;

      postContainer.appendChild(postDiv);
    });
  });
}

displayPosts();

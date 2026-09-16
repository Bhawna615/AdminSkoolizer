import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjAvQo6T-dRoDPzhe6bF21YJQ75V8gmNI",
  authDomain: "pushnotificationkkblossom.firebaseapp.com",
  projectId: "pushnotificationkkblossom",
  storageBucket: "pushnotificationkkblossom.firebasestorage.app",
  messagingSenderId: "564937832290",
  appId: "1:564937832290:web:4f44081adf03dffd4b1e3b",
  measurementId: "G-D51BYKNQZY"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);




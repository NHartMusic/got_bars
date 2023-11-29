import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  onSnapshot,
  query
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAadWgTsEC79fvCYPOJ2nT8-NCSXzhzAkw",
  authDomain: "d3-tests-2023.firebaseapp.com",
  databaseURL: "https://d3-tests-2023-default-rtdb.firebaseio.com",
  projectId: "d3-tests-2023",
  storageBucket: "d3-tests-2023.appspot.com",
  messagingSenderId: "263618067657",
  appId: "1:263618067657:web:342877dc90e5b4d307a118",
  measurementId: "G-BL7M12SYWC"
};

initializeApp(firebaseConfig);

// init services
export const db = getFirestore();
export const CollectionRef = collection(db, 'Expenses');
export const CollectionQuery = query(CollectionRef);

export const GetData = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(CollectionQuery, (snapshot) => {
      let countriesData = [];

      snapshot.docs.forEach((doc) => {
        countriesData.push({ ...doc.data(), id: doc.id });
      });

      resolve(countriesData);
    }, (error) => {
      reject(error);
    });

    // You can also return the unsubscribe function if needed
    // return unsubscribe;
  });
};

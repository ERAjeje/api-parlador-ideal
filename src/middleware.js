// import admin from './firebase.js';
// import firebase from 'firebase';
// import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
// import firebaseui from 'firebaseui';
// import dotenv from "dotenv";

// dotenv.config();

// const config = {
//     apiKey: process.env.apiKey,
//     authDomain: process.env.authDomain,
//     databaseURL: process.env.databaseURL,
//     projectId: process.env.projectId,
//     storageBucket: process.env.storageBucket,
//     messagingSenderId: process.env.messagingSenderId
// }

// export const createUser = (email, password) => {
//     let ui = new firebaseui.auth.AuthUI(firebase.auth());
//     ui.start(_, {
//         signInOptions: [ firebase.auth.EmailAuthProvider.PROVIDER_ID ]
//     })
//     const auth = getAuth();
//     createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//         // Signed in 
//         const user = userCredential.user;
//         return user;
//         // ...
//     })
//     .catch((error) => {
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         // ..

//         return { errorCode, errorMessage }
//     });
// }
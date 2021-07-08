import admin from './firebase.js';

const db = admin.firestore();

export const usersDB = db.collection('users');
export const messagesDB = db.collection('messages');

export default db;


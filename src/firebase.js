import admin from 'firebase-admin';
import { serviceAccountKey } from './serviceAccountKey.js'

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey),
    databaseURL: "https://server-auth-41acc.firebaseio.com"
})

export default admin;


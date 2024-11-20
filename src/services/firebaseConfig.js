import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'AIzaSyB-tPc_pLJT_PkflInBMIctE-ZW9TlL3gQ',
    authDomain: 'luckybeauty-395609.firebaseapp.com',
    projectId: 'luckybeauty-395609',
    storageBucket: 'luckybeauty-395609.appspot.com',
    messagingSenderId: '1018575209790',
    appId: '1:1018575209790:web:f348574d61850b7e8e186f',
    measurementId: 'G-28H59X3Y9Z'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

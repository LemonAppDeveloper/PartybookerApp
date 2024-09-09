import { initializeApp } from '@react-native-firebase/app';
import { getAuth } from '@react-native-firebase/auth';

const firebaseConfig = {
    apikey: 'AIzaSyBf1vAyvdU4cklsnVSRjZu3AUpmoFR3NiU',
    authDomain: 'partybookr-8b9fc.firebaseapp.com',
    projectId: 'partybookr-8b9fc',
    storageBucket: 'partybookr-8b9fc.appspot.com',
    messagingSenderId: '',
    appId: '1:917731395508:android:a4bd49b4f03491f80dd4e1'
};

const app = initializeApp(firebaseConfig)
export const authentication = getAuth(app);

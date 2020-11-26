import firebase from 'firebase';
import admin from 'firebase-admin';
import { FIREBASE_CONFIG } from '../../environments/firebase/client_config/firebase.config';
const serviceAccount = require('../../environments/firebase/admin_services_account/adminsdk.json');

firebase.initializeApp(FIREBASE_CONFIG);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: FIREBASE_CONFIG.databaseURL
});

class AuthService {
    setUserRole(uid: string, role: string) {
        return admin.auth().setCustomUserClaims(uid, { role });
    }

    signUpUser(email: string, password: string): Promise<admin.auth.UserRecord> {
        return admin.auth().createUser({
            email,
            password
        });
    }

    deleteUser(uid: string): Promise<boolean> {
        return admin.auth().deleteUser(uid).then(s => true).catch(e => false);
    }

    setUserCustomData(uid: string, metadata: { [key : string] : string }) {
        return admin.auth().setCustomUserClaims(uid, { ...metadata });
    }

    signInWithEmailAndPassword(email: string, password: string): Promise<firebase.auth.UserCredential> {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    getUserByEmail(email: string) {
        return admin.auth().getUserByEmail(email);
    }

    generatePasswordResetLink(email: string) {
        return admin.auth().generatePasswordResetLink(email);
    }


}

export default new AuthService();
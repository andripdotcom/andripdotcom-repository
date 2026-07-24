import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Workspace Drive Scopes requested by user
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Cached token might be lost on hard reload
        if (onAuthSuccess) onAuthSuccess(user, '');
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    cachedAccessToken = credential?.accessToken || null;
    return { user: result.user, accessToken: cachedAccessToken || '' };
  } catch (error: any) {
    console.error('Sign in error details:', error);
    let friendlyMessage = 'Gagal menghubungkan Google Drive.';
    if (error?.code === 'auth/popup-blocked') {
      friendlyMessage = 'Pop-up diblokir oleh peramban. Izinkan pop-up di peramban Anda atau buka aplikasi di tab baru.';
    } else if (error?.code === 'auth/popup-closed-by-user') {
      friendlyMessage = 'Jendela masuk Google ditutup sebelum selesai.';
    } else if (error?.code === 'auth/unauthorized-domain') {
      friendlyMessage = 'Domain aplikasi belum terdaftar di otentikasi. Buka aplikasi di tab baru.';
    } else if (error?.message) {
      friendlyMessage = `Gagal menghubungkan: ${error.message}`;
    }
    const customErr = new Error(friendlyMessage);
    (customErr as any).code = error?.code;
    throw customErr;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const logoutGoogle = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

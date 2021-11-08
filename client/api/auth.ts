import {initializeApp} from 'firebase/app'
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth'

const app = initializeApp({
  apiKey: "AIzaSyBICkyQIt-9lTsxHvRS1MOlZ-UdFVj8rsA",
  authDomain: "tomecraft-87ce5.firebaseapp.com",
  projectId: "tomecraft-87ce5",
  storageBucket: "tomecraft-87ce5.appspot.com",
  messagingSenderId: "1021868917316",
  appId: "1:1021868917316:web:6c58534dd0ed491beab211",
})

const auth = getAuth(app)

// auto-login
export function subscribeToAuthState(handleUser: (user: {uid: string; displayName: string} | null) => void) {
  return onAuthStateChanged(auth, handleUser)
}

///
/// Email/password
///

export async function registerBasic(email: string, password: string) {
  const user = await createUserWithEmailAndPassword(auth, email, password)
}

export async function loginBasic(email: string, password: string): Promise<string | null> {
  const credentials = await signInWithEmailAndPassword(auth, email, password)
  return credentials.user?.uid ?? null
}

///
/// Google
///

export async function loginGoogle(): Promise<string> {
  // @ts-ignore deno does not recognize firebase.auth the way it is imported, but it exists
  const provider = new GoogleAuthProvider(auth);
  const {accessToken, credential, user} = await signInWithPopup(auth, provider)
  return user.uid
}

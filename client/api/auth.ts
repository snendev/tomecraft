// import firebase from 'firebase'
// import 'firebase/auth'

// const app = firebase.initializeApp({
// // your-config-here
// })

// const auth = app.auth()

// auto-login
// export function subscribeToAuthState(handleUser: (user: {uid: string; displayName: string} | null) => void) {
//   return auth.onAuthStateChanged(handleUser)
// }

///
/// Email/password
///

// export async function registerBasic(email: string, password: string) {
//   const user = await auth.createUserWithEmailAndPassword(email, password)
// }

// export async function loginBasic(email: string, password: string): Promise<string | null> {
//   const credentials = await auth.signInWithEmailAndPassword(email, password)
//   return credentials.user?.uid ?? null
// }

///
/// Google
///

// export async function loginGoogle(): Promise<string> {
//   // @ts-ignore deno does not recognize firebase.auth the way it is imported, but it exists
//   const provider = new firebase.auth.GoogleAuthProvider();
//   const {accessToken, credential, user} = await auth.signInWithPopup(provider)
//   return user.uid
// }

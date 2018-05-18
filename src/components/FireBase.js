var Rebase = require('re-base');
var firebase = require('firebase');
var fBase = firebase.initializeApp({
  apiKey: "AIzaSyDwGpsPXQh4sYjmCZC21Yo9lru5ojad6wM",
  authDomain: "stackuc-be19e.firebaseapp.com",
  databaseURL: "https://stackuc-be19e.firebaseio.com",
  projectId: "stackuc-be19e",
  storageBucket: "stackuc-be19e.appspot.com",
  messagingSenderId: "226156644772"
});
var base = Rebase.createClass(fBase.database());
var auth = firebase.auth();

var fRegister = (email, password) => auth.createUserWithEmailAndPassword(email, password)
var fLogin = (email, password) => auth.signInWithEmailAndPassword(email, password)
var fLogout = (email, password) => auth.signOut()

export { base, fBase, fRegister, fLogout, fLogin, auth };

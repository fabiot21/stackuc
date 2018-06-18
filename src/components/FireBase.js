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

var fLogin = (email, password) => auth.signInWithEmailAndPassword(email, password)
var fLogout = (email, password) => auth.signOut()

export function getUserNameFromEmail(email){
  base.fetch('users/', {
      context: this,
      asArray: false,
      queries: {
        orderByChild: 'userEmail',
        equalTo: email
        }
    });
}



export { base, fBase, fLogout, fLogin, auth };

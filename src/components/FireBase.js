var Rebase = require('re-base');
var firebase = require('firebase');
var fbase = firebase.initializeApp({
  apiKey: "AIzaSyDwGpsPXQh4sYjmCZC21Yo9lru5ojad6wM",
  authDomain: "stackuc-be19e.firebaseapp.com",
  databaseURL: "https://stackuc-be19e.firebaseio.com",
  projectId: "stackuc-be19e",
  storageBucket: "stackuc-be19e.appspot.com",
  messagingSenderId: "226156644772"
});
var base = Rebase.createClass(fbase.database());

export { base, fbase };

// this is the 'index.js' file. It contains all the logic associated with the 'index.html' web page

// This line of code can be found in firebase database project settings under GENERAL section.
// It is responsible to connect our firebase project with this web app
var firebaseConfig = {
  apiKey: "AIzaSyCXPzj0JjDtM4P_9RNjkcC1gdrJwd7U33E",
  authDomain: "human-health-care.firebaseapp.com",
  databaseURL: "https://human-health-care.firebaseio.com",
  projectId: "human-health-care",
  storageBucket: "human-health-care.appspot.com",
  messagingSenderId: "1015603584551",
  appId: "1:1015603584551:web:4cce5d92de611050ba3802"
};
firebase.initializeApp(firebaseConfig);
database = firebase.database();  // Initialize Firebase database


// This function is executed when overlay is opened, 
// It makes sure that as overlay is opened, the foreground text is invisible
function openNav() {
    document.getElementById("myLinks").style.height = "100%";  // show the overlay
    $('#text-hero').toggle('hide');  // hide the foreground text
  }


// This code makes sure, when overlay is closed, the foreground text is visible
  function closeNav() {
    document.getElementById("myLinks").style.height = "0%";  // hide the overlay
    $('#text-hero').toggle('show');  // show the foreground text
  }
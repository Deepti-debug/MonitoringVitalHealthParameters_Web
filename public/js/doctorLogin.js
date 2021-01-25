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
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const auth = firebase.auth();


// Existing and future Auth states are now persisted in the current session only. 
// It means, closing the window would clear any existing state even if a user forgets to sign out.

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(function () {
        return firebase.auth().signInWithEmailAndPassword(document.getElementById('txtEmail').value, document.getElementById('txtPassword').value);  // unless user closes the window, keep user authenticated with the given email and password
    })
    .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
    });


// this function is called when 'signIn' button is pressed    
function login() {

    var email = document.getElementById('txtEmail').value;

    // check if the entered email ID belongs to the doctor, if yes, authenticate him and open a new page
    firebase.database().ref('Doctors').orderByChild("email").equalTo(email).on('value', (snapshot) => {
        if (snapshot.exists()) {
            // console.log("exists!")
            document.getElementById("load_spin").className = "fa fa-spinner fa-spin";  // spinner element starts loading
            firebase.auth().signInWithEmailAndPassword(document.getElementById('txtEmail').value, document.getElementById('txtPassword').value).catch(function (error) {  // firebase auth function accepts the email and password entered by user, checks if the user details exist in the firebase cloud

                // If any error occurs during authentication, execute the following 4 lines
                var errorCode = error.code;  // store the error code
                var errorMessage = error.message;  // store the error message
                document.getElementById("load_spin").className = "";  // stop loading spin element
                window.alert("Error: " + errorMessage)  // give the alert message via a alert box
            });
        } else {
            // console.log("Doesn't exists!")
            window.alert("Sorry, you're not a Doctor! Only Doctors are allowed to Login.");
            document.getElementById("load_spin").className = "";  // stop loading spin element
        }
    });

   

    
}

// The following block of code listens for any change in auth state 
// (i.e. the following code is triggered if the user signs in)
firebase.auth().onAuthStateChanged(user => {
    if (user) {  // if user logs in,
        document.getElementById("load_spin").className = "fa fa-spinner fa-spin";
        window.location.href = "userData_multiSensor.html"; //After successful login, user will be redirected to 'userData_multiSensor.html' page
    }
    else { // if user is not logged in,
        document.getElementById("load_spin").className = "";  // stop loading spin element
    }
});
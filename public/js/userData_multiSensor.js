// This is the 'userData_multiSensor.js' javascript file containing main logic associated with the 'userData_multiSensor.html' page

var id_;  // to store the current user (whosoever is being clicked from sidebar)
var name_id;  // this variable stores the 'name' child of id_ (by retrieving it from database)
var email_id;  // this variable stores the 'email address' child of id_ (by retrieving it from database)
var age_id;  // this variable stores the 'age' child of id_ (by retrieving it from database)
var blood_group;  // this variable stores the 'blood group' child of id_ (by retrieving it from database)
var picUrl;  // this variable stores the 'image url' child of id_ (by retrieving it from database)
var refInfo, gotDataInfo;  // 'ref_Info' stores the database path 'User_Info' (by retrieving it from database) // 'gotDataInfo' function is executed when 'ref_Info' is called

var latitude, lonitude, lat, lon;  // latitude and lat stores the 'latitude' info of patient stored in database; longitude and lon stores the 'longitude' info of patient  (by retrieving it from database)
var firstTimeTimeIconPress = 1;  // this variable keeps track of the first time when time button is pressed

var myMenuItems, aTag;  // 'myMenuItems' stores the sidebar elements containing patients' list & 'aTag' creates the dropdown menu items dynamically
var items, listItems=[], index = -1;  // items store the ID of sidebar menu containing patient list //listItems is an array of patients // index stores the index of the patient clicked from the sidebar (when no patient is clicked, index = -1)

var i; 
var div_date_dropdown_selection, aTag_date, div_time_dropdown_selection, aTag_time;  // responsible for storing various date and time list in the dropdown menus

var firstLevelKeys, arrFirstLevelKeys;   // arrFirstLevelKeys contain the array of all first level parent keys in the 'User_Info' path of database
var secondLevelKeys, arrSecondLevelKeys;  // arrSecondLevelKeys contain the array of all second level parent keys (i.e. date values) in the 'User_Timestamp_MultiSensor' path of database
var thirdLevelKeys, arrThirdLevelKeys;  // arrThirdLevelKeys contain the array of all third level parent keys (i.e. time values) in the 'User_Timestamp_MultiSensor' path of database

var refTop_1;  // refTop_1 stores the 'User_Timestamp_MultiSensor' path
var refTop_2, secondLevelKeys_2, arrSecondLevelKeys_2;  // refTop_2 stores the  date path 'User_Timestamp_MultiSensor' path  // 'secondLevelKeys_2' stores all the time-keys in a specific-date path
var thirdLevelKeys_3, arrThirdLevelKeys_3;  // 'thirdLevelKeys_3' also stores all the time-keys in a specific-date path
var x_, y_;  // 'x_' stores a date value (from the text of date dropdown menu)  // 'y_' stores a time value (from the text of time dropdown menu)

// the next 4 lines are concerned with plotting of map
var listOfPositions = [];  // this array contains the retrieved latitude and longitude values
var newArr = [];  // this array copies the contents of listOfPositions
var polylines;  // this is responsible for showing trace lines on map
var marker = {};  // this is responsible for showing the location marker on map

var chart;  // variable to declare 'multi-sensor/ multi-line chart/graph'
var dataPoints = [];  // this array stores the (x,y) coordinates on the multi-sensor graph

// ecg graph declarations
var ecg_chart;  // variable to declare ecg graph'
var ecg_datum = [];  // this array stores the (x,y) coordinates on the multi-sensor graph
var ecg_x_label = [];  // this array stores the time values corresponding to the selected date
var ecg_x_points = [];  // this array stores the integer 1, 2, 3, ... , upto the number of x coordinates
var ecg_y_points = [];   // this array stores the y-coordinate values (i.e. ecg values corresponding to time values )
var ecg_dataSeries;  // ecg_dataSeries defines the kind of graph to be shown, i.e. line chart, bar chart, etc

// emg graph declarations
var emg_chart;
var emg_datum=[];
var emg_x_label = [];
var emg_x_points = [];
var emg_y_points = [];
var emg_dataSeries;

// gsr graph declarations
var gsr_chart;
var gsr_datum = [];
var gsr_x_label = [];
var gsr_x_points = [];
var gsr_y_points = [];
var gsr_dataSeries;

// pulse graph declarations
var hb_chart;
var hb_datum=[];
var hb_x_label = [];
var hb_x_points = [];
var hb_y_points = [];
var hb_dataSeries;

// temp graph declarations
var temp_chart;
var temp_datum = [];
var temp_x_label = [];
var temp_x_points = [];
var temp_y_points = [];
var temp_dataSeries;
var ecgSer, emgSer, gsrSer, hbSer, tempSer;  // these variables are used while rendering the graph on screen

// Declarations related to prescription column
var UID, name, goToLocForID, newDate, newTime, prescription_refTop2, prescription_x_, prescription_refTop3, prescription_y, prescription_refTop_1;

// associating IDs from html files to the variables here
myPatientPhoto = document.getElementById('patientPhoto');  // variable 'myPatientPhoto' stores the ID 'patientPhoto' associated with an html document ...
myPatientName = document.getElementById('patientName');
myPatientAge = document.getElementById('patientAge');
myPatientBloodGroup = document.getElementById('patientBloodGroup')
myPatientLatitude = document.getElementById('patientLatitude'); 
myPatientLongitude = document.getElementById('patientLongitude'); 
myPatientECG = document.getElementById('patientECG');
myPatientEMG = document.getElementById('patientEMG');
myPatientGSR = document.getElementById('patientGSR');
myPatientHeartBeat = document.getElementById('patientHeartBeat');
myPatientTemp = document.getElementById('patientTemp');


window.onload = function () {  // as the html window loads, execute the following

    // Initialisations related to the map (to show patient location)
    var mymap = L.map('mapid').setView([20.5937, 78.9629], 3);  // 'mapid' is the ID of the map (defined in the html file)  // the command sets the initial view of the map to be
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=qkZaIzTTIAgLWN60LRyq', {
        attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
        maxZoom: 18,
    }).addTo(mymap);

    // This line of code can be found in firebase database project settings under GENERAL section.
    // It is responsible to connect our firebase project with this web app
    var firebaseConfig = {  //As the page loads, zero and first executes
        apiKey: "AIzaSyCXPzj0JjDtM4P_9RNjkcC1gdrJwd7U33E",
        authDomain: "human-health-care.firebaseapp.com",
        databaseURL: "https://human-health-care.firebaseio.com",
        projectId: "human-health-care",
        storageBucket: "human-health-care.appspot.com",
        messagingSenderId: "1015603584551",
        appId: "1:1015603584551:web:9ec96851d70ee5e0"
    };
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();  // Initialize Firebase database
    const auth = firebase.auth();  // Initialize Firebase authentication

    refTop1 = database.ref('User_Info');  // refTop1 stores the 'User_Info' database path
    refTop1.on('value', gotData1, errData1);  // 'gotData1' is the first function to be executed when this web page loads

    // the following function is responsible for showing the name of the patients on the sidebar 
    // and if doctor clicks on any of the patient, then the basic credentials of the patient are displayed on the web page
    function gotData1(data) {
        $("#myMenuItems a").remove();  // 'myMenuItems' is the ID of the sidebar patient list; keep it empty at first
        firstLevelKeys = data.val();
        arrFirstLevelKeys = Object.keys(firstLevelKeys);  //array of all parent-keys of the 'User_Info'
        for(i = 0; i < arrFirstLevelKeys.length; i++) {  // loop via all these parent-keys
            var id=arrFirstLevelKeys[i];  // store each parent-key in the variable 'id'
            var id_name=firstLevelKeys[id]["name"];  //store the child of the 'name' key in the variable 'id_name'
            
            myMenuItems = document.getElementById("myMenuItems");  // associating ID 'myMenuItems' to the variable 'ul'
            aTag = document.createElement('a');  // create a new list node
            aTag.appendChild(document.createTextNode(id_name));  // associate the name 'id_name' with this new list node
            myMenuItems.appendChild(aTag);  // append this list node in the ul component
        }

        items = document.querySelectorAll("#myMenuItems a"); // 'items' variable directly deal with sidebar
        for(var a = 0; a < items.length; a++) { // using this loop, add values to the array
            listItems.push(items[a].innerHTML); // listItems is an [] to store all sidebar elements
        }

        // if any of the anchor tag belonging to the #myMenuItems component is clicked (i.e. if any of the patient from the sidebar is clicked), execute the following block
        $('#myMenuItems a').click(function() {
            document.getElementById("prescriptionBoxID").disabled = false;  // since a patient has been clicked from the sideBar, now 'enable' the prescriptionBox so that doctor can write prescription
            $('#myMenuItems a').removeClass('active'); // Remove active class from previously active sidebar item
            $(this).addClass('active'); // Add active class to the clicked list node
            dateDrop.innerHTML = "Select Date";  // keep the text of date dropdown button to be 'Select Date'
            timeDrop.innerHTML = "Select Time";  // keep the text of time dropdown button to be 'Select Time'
            prescription_dateDrop.innerHTML = "Select Date";  // keep the text of date dropdown button (of prescription column) to be 'Select Date'
            prescription_timeDrop.innerHTML = "Select Time";  // keep the text of time dropdown button (of prescription column) to be 'Select Time'
        });
          
        // this function loops through the sidebar items (i.e. the patients' list )
        for(var a = 0; a < items.length; a++) {
            items[a].onclick = function() {  // if any of the sidebar element (i.e. patient) is clicked
                index = listItems.indexOf(this.innerHTML);  // store the clicked item's index in the variable 'index'

                // the following two lines will be responsible for updating clicked patient's basic credentials (i.e. profile photo, name, age and blood group) on this web page
                refInfo = database.ref('User_Info');  // 'ref_Info' stores the database path of 'User_Info'
                refInfo.on('value', gotDataInfo, errDataInfo);  // now execute 'gotDataInfo' function
                
                // on clicking the sidebar list element, delete all graphs
                if (hb_chart != null && emg_chart != null && ecg_chart != null && gsr_chart != null && temp_chart != null) {
                    hb_chart.destroy()
                    hb_chart = null;
                    emg_chart.destroy()
                    emg_chart = null;
                    ecg_chart.destroy()
                    ecg_chart = null;
                    gsr_chart.destroy()
                    gsr_chart = null;
                    temp_chart.destroy()
                    temp_chart = null;
                    chart.destroy()
                    chart = null;
                }

                // update basic user Information like, profile photo, name, age, bood group
                myPatientPhoto.src = picUrl;
                myPatientName.innerHTML = "Patient's Name: " + name_id;
                myPatientAge.innerHTML = "Patient's Age: " + age_id;
                myPatientBloodGroup.innerHTML = "Patient's Blood Group: " + blood_group;

                // keep the remaining user info like ecg, emg, gsr, pulse and temp, lat & lon, empty. They will be updated when we select a date and time from the dropdown menus
                myPatientLatitude.innerHTML = "Patient's Latitude: ";
                myPatientLongitude.innerHTML = "Patient's Longitude: ";
                myPatientECG.innerHTML = "Patient's ECG: ";
                myPatientEMG.innerHTML = "Patient's EMG: ";
                myPatientGSR.innerHTML = "Patient's GSR: ";
                myPatientHeartBeat.innerHTML = "Patient's Pulse: ";
                myPatientTemp.innerHTML = "Patient's Temp: ";

                // the following two lines will be responsible for populating the date dropdown menu of Top Nav Bar (by fetching 'dates' from the database)
                refTop2 = database.ref().child('User_Timestamp_MultiSensor/' + arrFirstLevelKeys[index]);  // now go to the 'user UID' location of the database by calling this path
                refTop2.on('value', gotData2, errData2);  // 'gotData2' is called if any change is witnessed in the above path (i.e. if any of the date keys of the specific-user-UID is updated)

                // the following two lines will be responsible for populating the date dropdown menu of prescription column (by fetching 'dates' from the database)
                prescription_refTop2 = database.ref().child('Prescriptions/' + arrFirstLevelKeys[index]);  // now go to the 'user UID' location of the database by calling this path
                prescription_refTop2.on('value', prescription_gotData2, prescription_errData2);  // 'prescription_gotData2' is called if any change is witnessed in the above path (i.e. if any of the date keys of the specific-user-UID is updated)
            };
        } 
    }

    // The following function retreives basic user info (like user UID, name, age, pic url and blood group) from the database and those retrieved values are used in the gotData1 function to update the basic user info on webpage
    function gotDataInfo(data) {    // this function is executed, when sidebar list element (patient list) is clicked
        var infoLevelKeys = data.val();
        arrInfoLevelKeys = Object.keys(infoLevelKeys);  // 'arrInfoLevelKeys' contains the array of all patient UIDs
        id_ = arrInfoLevelKeys[index]; // 'id_' stores the UID of the clicked patient
        name_id=infoLevelKeys[id_]["name"];  // this command retrieves the child corresponding to the 'name' key
        age_id = infoLevelKeys[id_]["age"];  // this command retrieves the child corresponding to the 'age' key
        picUrl = infoLevelKeys[id_]["imageUrl"];  // this command retrieves the child corresponding to the 'imageUrl' key
        blood_group = infoLevelKeys[id_]["bloodGroup"];  // this command retrieves the child corresponding to the 'bloodGroup' key
    }

    // The following function is called from the gotData1 function (which is the very first function to be executed)
    // The following function retreives all the date-keys of a specific-user-UID (clicked user) from the 'User_Timestamp_MultiSensor' path of the database and stores them in the date dropdown list of the Top Nav Bar
    function gotData2(data) {   // this function is executed, when sidebar list element is clicked
        if (data.val() === null) {  // if the firebase path containing specific (clicked) user UID doesn't exist, or, the date keys are not available, then,
            $("#date-dropdown-selection a").remove();  // empty the date dropdown list
            $("#time-dropdown-selection a").remove();  // empty the time dropdown list
            dateDrop.innerHTML = "Date is N/A ";  // keep the date dropdown text as 'Date is N/A '
            timeDrop.innerHTML = "Time is N/A ";  // keep the time dropdown text as 'Time is N/A '
            $('#dateButton').append('<i class="fa fa-calendar"></i >');  // also, make a 'calendar icon' alongside date dropdown text
            $('#timeButton').append('<i class="fa fa-clock-o"></i >');  // also, make a 'time icon' alongside time dropdown text
        } else {  // if the firebase path exists
            $("#date-dropdown-selection a").remove();  // empty the date dropdown list
            $("#time-dropdown-selection a").remove();  // empty the time dropdown list 

            // now since the path exists, retrieve all the parent keys of the given path (here the parent keys will be all the date keys of the specific-user-UID in the 'User_Timestamp_MultiSensor' path)
            secondLevelKeys = data.val();
            arrSecondLevelKeys = Object.keys(secondLevelKeys); 

            // after retrieveing all the date keys, store this list in the date dropdown menu
            for (var count = 0; count < arrSecondLevelKeys.length; count++) {  // loop via each date key
                div_date_dropdown_selection = document.getElementById('date-dropdown-selection');   // associating ID 'date-dropdown-selection' to the variable 'div_date_dropdown_selection'
                aTag_date = document.createElement('a');  // create a new anchor (to store a date)
                aTag_date.appendChild(document.createTextNode(arrSecondLevelKeys[count]));  // append this new date in the newly created 'anchor tag' component
                div_date_dropdown_selection.appendChild(aTag_date);  // finally append this newly created 'anchor tag' to the 'div_date_dropdown_selection' variable
            }
        }
    }

    // The following function is called from within the gotData1 function (which is the very first function to be executed)
    // The following function retreives all the date-keys of a specific-user-UID (clicked user) from the 'Prescriptions' path and stores them in the date dropdown list of the prescription column
    function prescription_gotData2(data) {
        if (data.val() === null) {  // check whether the 'prescriptions' bucket contains this user's UID; if not?
            $("#prescription-date-dropdown-selection a").remove();  // empty the date dropdown list
            $("#prescription-time-dropdown-selection a").remove();  // empty the time dropdown list
            prescription_dateDrop.innerHTML = "Date is N/A ";  // keep the date dropdown text as 'Date is N/A '
            prescription_timeDrop.innerHTML = "Time is N/A ";  // keep the time dropdown text as 'Time is N/A '
            $('#prescription-dateButton').append('<i class="fa fa-calendar"></i >');  // also, make a 'calendar icon' alongside date dropdown text
            $('#prescription-timeButton').append('<i class="fa fa-clock-o"></i >');  // also, make a 'calendar icon' alongside date dropdown text
        }
        else {  // if the firebase path exists
            $("#prescription-date-dropdown-selection a").remove();  // empty the date dropdown list
            $("#prescription-time-dropdown-selection a").remove();  // empty the time dropdown list
            
            // now since the path exists, retrieve all the parent keys of the given path (here the parent keys will be all the date keys of the specific-user-UID in the 'Prescriptions' path)
            secondLevelKeys = data.val();
            arrSecondLevelKeys = Object.keys(secondLevelKeys);

            // after retrieveing all the date keys, store this list in the date dropdown menu
            for (var count = 0; count < arrSecondLevelKeys.length; count++) {  // loop via each date key
                div_date_dropdown_selection = document.getElementById('prescription-date-dropdown-selection');  // associating ID 'date-dropdown-selection' to the variable 'div_date_dropdown_selection'
                aTag_date = document.createElement('a');  // create a new anchor (to store a date)
                aTag_date.appendChild(document.createTextNode(arrSecondLevelKeys[count]));  // append this new date in the newly created 'anchor tag' component
                div_date_dropdown_selection.appendChild(aTag_date);  // finally append this newly created 'anchor tag' to the 'div_date_dropdown_selection' variable
            }
        }
    }

    // Till now, we wrote the logic responsible for showing the patient list on the sidebar, showing the basic user info like profile photo, name, age, and blood group 
    // and we also wrote the logic of populating the date and time dropdown menu corresponding to a clicked patient 
    // ........................................................................................................................................................................................................................................
    // Now the following code will be responsible for updating the patient info (i.e., vital data, map, graph and prescription) on clicking a specific date and time from the populated date and time dropdowns

    // Next 2 lines contain Initialisations related to the date and time dropdown menu of top Nav Bar
    var dateDrop = document.getElementById('dateButton');  // ID of 'Date' dropdown button is stored in variable 'dateDrop'
    var timeDrop = document.getElementById('timeButton');  // ID of 'Time' dropdown button is stored in variable 'timeDrop'
    
    // from the populated date dropdown menu of the top nav bar, when a date item is clicked, execute the following
    $('#date-dropdown-selection').on('click', 'a', function () {
        $('#date-dropdown-selection a').removeClass('active'); // Remove active class from any previously active item
        $(this).addClass('active'); // Add active class to this newly clicked date item
        dateDrop.innerHTML = this.innerHTML;  // also, whatever date item is clicked, make its text as the text of the date dropdown button
        if (dateDrop.innerHTML != "Select Date" && dateDrop.innerHTML != "Date is N/A ") {  // if the text in date dropdown button is neither of 'Select Date' or 'Date is N/A', then it must be some real 'date' value,
            x_ = dateDrop.innerHTML;  // store that real 'date' value (which is available in date dropdown button text), in the variable 'x_'

            // the following 2 lines of code is responsible for populating the time dropdown menu of the Top Nav Bar corresponding to the clicked 'Date' item
            refTop3 = database.ref().child('User_Timestamp_MultiSensor/' + arrFirstLevelKeys[index] + '/' + x_);  // now go to the given database path
            refTop3.on('value', gotData3, errData3);  // call 'gotData3' function for the 'refTop3' path
        }
    });

    // the following block of code does the same thing as the upper block of code but don't remove it as this is equally important
    // from the populated date dropdown menu of the top nav bar, when a date item is 'mouseleft' (The mouseleave event occurs when the mouse pointer leaves the selected element), execute the following
    $('#date-dropdown-selection').on('mouseleave', 'a', function () {
        if (dateDrop.innerHTML != "Select Date" && dateDrop.innerHTML != "Date is N/A ") {  // if the text in date dropdown button is neither of 'Select Date' or 'Date is N/A', then it must be some real 'date' value,
            x_ = dateDrop.innerHTML;  // store that real 'date' value (which is available in date dropdown button text), in the variable 'x_'

            // the following 2 lines of code is responsible for populating the time dropdown menu of the Top Nav Bar corresponding to the clicked 'Date' item
            refTop3 = database.ref().child('User_Timestamp_MultiSensor/' + arrFirstLevelKeys[index] + '/' + x_);  // now go to the given database path
            refTop3.on('value', gotData3, errData3);  // call 'gotData3' function for the 'refTop3' path
        }
    });

    // Next 2 lines contain Initialisations related to the date and time dropdown menu of prescription column
    var prescription_dateDrop = document.getElementById('prescription-dateButton');  // ID of 'Date' dropdown button is stored in variable 'prescription-dateDrop'
    var prescription_timeDrop = document.getElementById('prescription-timeButton');  // ID of 'Time' dropdown button is stored in variable 'prescription-timeDrop'

    // from the populated date dropdown menu of the prescription column, when a date item is clicked, execute the following
    $('#prescription-date-dropdown-selection').on('click', 'a', function () {
        $('#prescription-date-dropdown-selection a').removeClass('active'); // Remove active class from any previously active item
        $(this).addClass('active'); // Add active class to this newly clicked date item
        prescription_dateDrop.innerHTML = this.innerHTML;  // also, whatever date item is clicked, make its text as the text of the date dropdown button
        if (prescription_dateDrop.innerHTML != "Select Date" && prescription_dateDrop.innerHTML != "Date is N/A ") {  // if the text in date dropdown button is neither of 'Select Date' or 'Date is N/A', then it must be some real 'date' value,
            prescription_x_ = prescription_dateDrop.innerHTML;  // store that real 'date' value (which is available in date dropdown button text), in the variable 'prescription_x_'
            
            // the following 2 lines of code is responsible for populating the time dropdown menu of the Prescriptions columns corresponding to the clicked 'Date' item
            prescription_refTop3 = database.ref().child('Prescriptions/' + arrFirstLevelKeys[index] + '/' + prescription_x_);  // now go to the given database path
            prescription_refTop3.on('value', prescription_gotData3, prescription_errData3);  // call 'prescription_gotData3' function for the 'prescription_refTop3' path
        }
    });

    // the following block of code does the same thing as the upper block of code but don't remove it as this is equally important
    // from the populated date dropdown menu of the prescription column, when a date item is 'mouseleft' (The mouseleave event occurs when the mouse pointer leaves the selected element), execute the following
    $('#prescription-date-dropdown-selection').on('mouseleave', 'a', function () {
        if (prescription_dateDrop.innerHTML != "Select Date" && prescription_dateDrop.innerHTML != "Date is N/A ") {  // if the text in date dropdown button is neither of 'Select Date' or 'Date is N/A', then it must be some real 'date' value,
            prescription_x_ = prescription_dateDrop.innerHTML;  // store that real 'date' value (which is available in date dropdown button text), in the variable 'prescription_x_'
            
            // the following 2 lines of code is responsible for populating the time dropdown menu of the prescription column corresponding to the clicked 'Date' item
            prescription_refTop3 = database.ref().child('Prescriptions/' + arrFirstLevelKeys[index] + '/' + prescription_x_);  // now go to the given database path
            prescription_refTop3.on('value', prescription_gotData3, prescription_errData3);  // call 'prescription_gotData3' function for the 'prescription_refTop3' path
        }
    });


    // this function is called when a date item is selected from the date dropdown menu of the Top Nav Bar
    // This function retreives all the time-keys corresponding to the clicked date and populate the time dropdown menu of the Top Nav Bar
    function gotData3(data) {
        if (data.val() === null) {  // if firebase path doesn't exist
            $("#time-dropdown-selection a").remove();  // empty the time dropdown list
            timeDrop.innerHTML = "Time is N/A ";  // keep the time dropdown text as 'Time is N/A'
            $('#prescription-timeButton').append('<i class="fa fa-clock-o"></i >');  // also, make a 'clock icon' alongside time dropdown text
        } else {  // if the firebase path exists
            $("#time-dropdown-selection a").remove();  // empty the time dropdown list

            // now retrieve all the parent keys of the given path (here the parent keys will be all the time keys corresponding to the clicked date item in the 'User_Timestamp_MultiSensor' database path)
            thirdLevelKeys = data.val();
            arrThirdLevelKeys = Object.keys(thirdLevelKeys);   
            thirdLevelKeys_3 = data.val();
            arrThirdLevelKeys_3 = Object.keys(thirdLevelKeys_3);

            // after retrieveing all the time keys, store them in the time dropdown menu of the Top Nav Bar
            for (var count = 0; count < arrThirdLevelKeys.length; count++) {  // loop via all time keys
                div_time_dropdown_selection = document.getElementById('time-dropdown-selection');  // associating ID 'time-dropdown-selection' to the variable 'div_time_dropdown_selection'
                aTag_time = document.createElement('a');  // create a new anchor (to store a time)
                aTag_time.appendChild(document.createTextNode(arrThirdLevelKeys[count])); // append this new time in the newly created 'anchor tag' component
                div_time_dropdown_selection.appendChild(aTag_time);  // finally append this newly created 'anchor tag' to the 'div_time_dropdown_selection' variable
            }
        }
    }

    // this function is called when a date item is selected from the date dropdown menu of the Prescription column
    // This function retreives all the time-keys corresponding to the clicked date and populate the time dropdown menu of the Prescription column
    function prescription_gotData3(data) {
        if (data.val() === null) {  // if firebase path doesn't exist
            $("#prescription-time-dropdown-selection a").remove();  // empty the time dropdown list
            prescription_timeDrop.innerHTML = "Time is N/A ";  // keep the time dropdown text as 'Time is N/A'
            $('#prescription-timeButton').append('<i class="fa fa-clock-o"></i >');  // also, make a 'clock icon' alongside time dropdown text
        } else {  // if the firebase path exists
            $("#prescription-time-dropdown-selection a").remove();  // empty the time dropdown list

            // now retrieve all the parent keys of the given path (here the parent keys will be all the time keys corresponding to the clicked date item in the 'Prescriptions' database path)
            thirdLevelKeys = data.val();
            arrThirdLevelKeys = Object.keys(thirdLevelKeys);
            thirdLevelKeys_3 = data.val();
            arrThirdLevelKeys_3 = Object.keys(thirdLevelKeys_3);

            // after retrieveing all the time keys, store them in the time dropdown menu of the Prescription column
            for (var count = 0; count < arrThirdLevelKeys.length; count++) {  // loop via all time keys
                div_time_dropdown_selection = document.getElementById('prescription-time-dropdown-selection');  // associating ID 'time-dropdown-selection' to the variable 'div_time_dropdown_selection'
                aTag_time = document.createElement('a');  // create a new anchor (to store a time)
                aTag_time.appendChild(document.createTextNode(arrThirdLevelKeys[count]));  // append this new time in the newly created 'anchor tag' component
                div_time_dropdown_selection.appendChild(aTag_time);  // finally append this newly created 'anchor tag' to the 'div_time_dropdown_selection' variable
            }
        }
    }

    // from the populated time dropdown menu of the Top Nav Bar column, when a time item is clicked, execute the following
    // the following code updates the page with user info (vital data, graphs, map, etc.)
    $('#time-dropdown-selection').on('click', 'a', function () {
        $('#time-dropdown-selection a').removeClass('active');  // Remove active class from any previously active item
        $(this).addClass('active');  // Add active class to this newly clicked time item
        timeDrop.innerHTML = this.innerHTML;  // also, whatever time item is clicked, make its text as the text of the time dropdown button
        if (timeDrop.innerHTML != "Select Time" && timeDrop.innerHTML != "Time is N/A ") {  // if the text in time dropdown button is neither of 'Select Time' or 'Time is N/A', then it must be some real 'time' value,
            y_ = timeDrop.innerHTML;  // store that real 'time' value (which is available in time dropdown button text), in the variable 'y_'
            
            // the following 2 lines of code are responsible for updating the user info (vital data, graphs, map, etc) corresponding to the clicked 'Date' item
            refTop_1 = database.ref().child('User_Timestamp_MultiSensor/');  // now go to the 'User_Timestamp_MultiSensor' location of database by calling this path
            refTop_1.on('value', gotData_1, errData_1);  // call 'gotData_1' function for the 'refTop_1' path
        }
    });

    // the following block of code does the same thing as the upper block of code but don't remove it as this is equally important
    // from the populated time dropdown menu of the Top Nav Bar, when a time item is 'mouseleft' (The mouseleave event occurs when the mouse pointer leaves the selected element), execute the following
    $('#time-dropdown-selection').on('mouseleave', 'a', function () {
        if (timeDrop.innerHTML != "Select Time" && timeDrop.innerHTML != "Time is N/A ") {  // if the text in time dropdown button is neither of 'Select Time' or 'Time is N/A', then it must be some real 'time' value,
            y_ = timeDrop.innerHTML;  // store that real 'time' value (which is available in time dropdown button text), in the variable 'y_'

            // the following 2 lines of code is responsible for updating the user info (vital data, graphs, map, etc.) corresponding to the clicked 'time' item
            refTop_1 = database.ref().child('User_Timestamp_MultiSensor/');  // now go to that 'User_Timestamp_MultiSensor/' location of database by calling this path
            refTop_1.on('value', gotData_1, errData_1);  // call 'gotData_1' function for the 'refTop_1' path
        }
    });


    // from the populated time dropdown menu of the prescription column, when a time item is clicked, execute the following
    // the following code updates the prescription text corresponding to the selected date and time
    $('#prescription-time-dropdown-selection').on('click', 'a', function () {
        $('#prescription-time-dropdown-selection a').removeClass('active');  // Remove active class from any previously active item
        $(this).addClass('active');  // Add active class to this newly clicked time item
        prescription_timeDrop.innerHTML = this.innerHTML;  // also, whatever time item is clicked, make its text as the text of the time dropdown button
        if (prescription_timeDrop.innerHTML != "Select Time" && prescription_timeDrop.innerHTML != "Time is N/A ") {  // if the text in time dropdown button is neither of 'Select Time' or 'Time is N/A', then it must be some real 'time' value,
            prescription_y_ = prescription_timeDrop.innerHTML;  // store that real 'time' value (which is available in time dropdown button text), in the variable 'prescription_y_'
            
            // the following 2 lines of code is responsible for updating the prescription text of the prescription column based on the selected date and time
            prescription_refTop_1 = database.ref().child('Prescriptions/' + id_ + '/' + prescription_x_);  // now go to the given database path
            prescription_refTop_1.on('value', prescription_gotData_1, prescription_errData_1);  // call 'gotData_1' function for the 'refTop_1' path
        }
    });

    // the following block of code does the same thing as the upper block of code but don't remove it as this is equally important
    // from the populated time dropdown menu of the Prescription column, when a time item is 'mouseleft' (The mouseleave event occurs when the mouse pointer leaves the selected element), execute the following
    $('#prescription-time-dropdown-selection').on('mouseleave', 'a', function () {
        if (prescription_timeDrop.innerHTML != "Select Time" && prescription_timeDrop.innerHTML != "Time is N/A ") {  // if the text in time dropdown button is neither of 'Select Time' or 'Time is N/A', then it must be some real 'time' value,
            prescription_y_ = prescription_timeDrop.innerHTML;   // store that real 'time' value (which is available in time dropdown button text), in the variable 'prescription_y_'
            
            // the following 2 lines of code is responsible for updating the prescription text of the prescription column based on the selected date and time
            prescription_refTop_1 = database.ref().child('Prescriptions/' + id_ + '/' + prescription_x_);  // now go to the given database path
            prescription_refTop_1.on('value', prescription_gotData_1, prescription_errData_1);  // call 'gotData_1' function for the 'refTop_1' path
        }
    });

    // this function is called when a time item is selected from the time dropdown menu of the Prescription column
    // This function updates the prescription text in the prescription column corresponding to the selected date and time values
    function prescription_gotData_1(data) {
        secondLevelKeys_2 = data.val();
        arrSecondLevelKeys_2 = Object.keys(secondLevelKeys_2);

        var prescr = secondLevelKeys_2[prescription_y_]["presc"];  // store the user prescription in the variable 'prescr'
        document.getElementById('patientPrescription').innerHTML = "Patient's Prescription: " + prescr;  // update the prescription text in the UI
    }

    // this function is called when a time item from the time dropdown button of the Top Nav Bar is clicked
    // This function calls another function called 'gotdata_2' which updates user info in the UI (i.e., vital data, graphs and map)
    function gotData_1(data) {
        refTop_2 = database.ref().child('User_Timestamp_MultiSensor/' + id_ + '/' + x_);  // now go to the given database path
        refTop_2.on('value', gotData_2, errData_2);   // 'gotData_2' is called if any change is witnessed in the above path (i.e. if any of the 'time-keys' of the specif user-uid of the given path are updated)
    }

    //..........................................................................................................................................................................................................................................................

    // this function is called when a time item from the time dropdown key of the Top Nav Bar is clicked
    // it is responsible for updating all the user info, location map, and all the graphs
    function gotData_2(data) {
        
        // initialisations for the various graphs like gsr, ecg, emg, pulse, temp
        gsr_x_label = [];
        gsr_x_points = [];
        gsr_y_points = [];
        gsr_datum = [];

        ecg_x_label = [];
        ecg_x_points = [];
        ecg_y_points = [];
        ecg_datum = [];

        emg_x_label = [];
        emg_x_points = [];
        emg_y_points = [];
        emg_datum = [];

        hb_x_label = [];
        hb_x_points = [];
        hb_y_points = [];
        hb_datum = [];        

        temp_x_label = [];
        temp_x_points = [];
        temp_y_points = [];
        temp_datum = [];  

        secondLevelKeys_2 = data.val();  
        arrSecondLevelKeys_2 = Object.keys(secondLevelKeys_2);  // array of all the time keys

        // >>>>>>>>>>>>>>>>>>>>>>>>>>>> Code for plotting GSR graph <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        for (var gsr_aag = 0; gsr_aag < arrSecondLevelKeys_2.length; gsr_aag++) {  // loop through all time values
            var gsr_aau = arrSecondLevelKeys_2[gsr_aag];  // store each time value in 'gsr_aau' variable
            gsr_x_label.push(gsr_aau);  // store all the the time values as x-coordinates in the array 'gsr_x_label'
            var tt = secondLevelKeys_2[gsr_aau]["GSR"]  // y-coordinate points (gsr values)
            gsr_y_points.push(parseFloat(tt));  // store all the y-coordinates in the array 'gsr_y_points'
        }
        
        for(var gsr_z=1; gsr_z<gsr_x_label.length+1; gsr_z++) { 
            gsr_x_points.push(gsr_z);  // x-coordinate points in an array 'gsr_x_points'
        }
        dataPoints = [];
        
        // the following loop, stores both (x,y) coordinates in the array dataPoints
        for (var gsr_i = 0; gsr_i < gsr_x_points.length; gsr_i++) {
            var y = 0;
            y = y + gsr_y_points[gsr_i];
            dataPoints.push({
                x: gsr_x_points[gsr_i],  // x values = 1,2,3... upto no. of time values
                y: gsr_y_points[gsr_i],  // y values = real gsr values
                label: gsr_x_label[gsr_i]
            });
        }
        gsr_dataSeries = { type: "line" };  // type of graph -> line graph
        gsr_dataSeries.dataPoints = dataPoints;
        gsr_datum.push(gsr_dataSeries);  

        // the (x,y) coordinates is passed in the following block to render the line graph of GSR
        gsr_chart = new CanvasJS.Chart("GSRChartContainer", {  // CanvasJS is the library we are using to render graph
            animationEnabled: true,
            zoomEnabled: true,
            axisX:{  // x-axis properties
                title: "Time",
                labelAngle: -50,
                display: true
            },
            axisY: {  // y-axis properties
                title: "GSR",
                display: true,
                includeZero:false,
            },
            data: gsr_datum
        });
        gsr_chart.render();  // this line is responsible for rendering graph on the webpage

        gsrSer = gsr_dataSeries.dataPoints; // the variabel 'gsrSer' stores all the datapoints (i.e. x,y coordinates of the gsr graph). This variable will later be used in the multiLine graph
            
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>> Code for plotting ECG graph <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        for (var ecg_aag=0; ecg_aag<arrSecondLevelKeys_2.length; ecg_aag++) {
            var ecg_aau = arrSecondLevelKeys_2[ecg_aag];
            ecg_x_label.push(ecg_aau);
            var ee = secondLevelKeys_2[ecg_aau]["ECG"];
            ecg_y_points.push(parseFloat(ee));
        }
        for(var ecg_z=1; ecg_z < ecg_x_label.length+1; ecg_z++) { 
            ecg_x_points.push(ecg_z);
        }
        dataPoints = [];
        for (var ecg_i = 0; ecg_i<ecg_x_points.length; ecg_i++) {
            var y=0;
            y= y+ ecg_y_points[ecg_i];
            dataPoints.push({
                x: ecg_x_points[ecg_i],
                y: ecg_y_points[ecg_i],
                label: ecg_x_label[ecg_i]
            });
        }
        ecg_dataSeries = { type: "line" };
        ecg_dataSeries.dataPoints = dataPoints;
        ecg_datum.push(ecg_dataSeries);    
        ecg_chart = new CanvasJS.Chart("EcgChartContainer", {
            animationEnabled: true,
            zoomEnabled: true,
            axisX:{
                title: "Time",
                labelAngle: -50
            },
            axisY:{
                title: "ECG",
                includeZero:false
            },
            data: ecg_datum  
        });
        ecg_chart.render();   
        ecgSer = ecg_dataSeries.dataPoints;
            
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>> Code for plotting EMG graph <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        for (var emg_aag=0; emg_aag<arrSecondLevelKeys_2.length; emg_aag++) {
            var emg_aau = arrSecondLevelKeys_2[emg_aag];
            emg_x_label.push(emg_aau);
            var em = secondLevelKeys_2[emg_aau]["EMG"];
            emg_y_points.push(parseFloat(em));
        }
        for(var emg_z=1; emg_z < emg_x_label.length+1; emg_z++) { 
            emg_x_points.push(emg_z);
        }
        dataPoints = [];
        for (var emg_i = 0; emg_i<emg_x_points.length; emg_i++) {
            var y=0;
            y= y+ emg_y_points[emg_i];
            dataPoints.push({
                x: emg_x_points[emg_i],
                y: emg_y_points[emg_i],
                label: emg_x_label[emg_i]
            });
        }
        emg_dataSeries = { type: "line" };
        emg_dataSeries.dataPoints = dataPoints;
        emg_datum.push(emg_dataSeries);    
        emg_chart = new CanvasJS.Chart("EmgChartContainer", {
            animationEnabled: true,
            zoomEnabled: true,
            axisX:{
                title: "Time",
                labelAngle: -50
            },
            axisY:{
            title: "EMG",
                includeZero:false
            },
            data: emg_datum  
        });
        emg_chart.render();
        emgSer = emg_dataSeries.dataPoints;
            
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>> Code for plotting Pulse graph <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        for (var hb_aag=0; hb_aag<arrSecondLevelKeys_2.length; hb_aag++) {
            var hb_aau = arrSecondLevelKeys_2[hb_aag];
            hb_x_label.push(hb_aau);
            var hbb = secondLevelKeys_2[hb_aau]["Pulse"];
            hb_y_points.push(parseFloat(hbb));
        }
        for(var hb_z=1; hb_z < hb_x_label.length+1; hb_z++) { 
            hb_x_points.push(hb_z);
        }
        dataPoints = [];
        for (var hb_i = 0; hb_i<hb_x_points.length; hb_i++) {
            var y=0;
            y= y+ hb_y_points[hb_i];
            dataPoints.push({
            x: hb_x_points[hb_i],
            y: hb_y_points[hb_i],
            label: hb_x_label[hb_i]
            });
        }
        hb_dataSeries = { type: "line" };
        hb_dataSeries.dataPoints = dataPoints;
        hb_datum.push(hb_dataSeries);    
        console.log("pulse datum: "+ hb_datum);
        hb_chart = new CanvasJS.Chart("HeartBeatChartContainer", {
            animationEnabled: true,
            zoomEnabled: true,
            title:{
                // text: "Try Zooming and Panning" 
            },
            axisX:{
                title: "Time",
                labelAngle: -50
            },
            axisY:{
                title: "Heart Beat",
                suffix: "bpm",
                includeZero:false
            },
            data: hb_datum  
        });
        hb_chart.render();
        hbSer = hb_dataSeries.dataPoints;
            
        // >>>>>>>>>>>>>>>>>>>>>>>>>>>> Code for plotting Temperature graph <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        for (var temp_aag = 0; temp_aag < arrSecondLevelKeys_2.length; temp_aag++) {
            var temp_aau = arrSecondLevelKeys_2[temp_aag];
            temp_x_label.push(temp_aau);
            var te = secondLevelKeys_2[temp_aau]["Temp"];
            temp_y_points.push(parseFloat(te));
        }
        for (var temp_z = 1; temp_z < temp_x_label.length+1; temp_z++) {
            temp_x_points.push(temp_z);
        }
        dataPoints = [];
        for (var temp_i = 0; temp_i < temp_x_points.length; temp_i++) {
            var y = 0;
            y = y + temp_y_points[temp_i];
            dataPoints.push({
                x: temp_x_points[temp_i],
                y: temp_y_points[temp_i],
                label: temp_x_label[temp_i]
            });
        }
        temp_dataSeries = { type: "line" };
        temp_dataSeries.dataPoints = dataPoints;
        temp_datum.push(temp_dataSeries);
        console.log("temp datum: " + temp_datum);
        temp_chart = new CanvasJS.Chart("TempChartContainer", {
            animationEnabled: true,
            zoomEnabled: true,
            axisX: {
                title: "Time",
                labelAngle: -50
            },
            axisY: {
                title: "Temp",
                suffix: "˚F",
                includeZero: false
            },
            data: temp_datum  // random generator below
        });
        temp_chart.render();
        tempSer = temp_dataSeries.dataPoints;

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>> Graph plotting finished! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<


    // .............. to retrieve the latitude and longitude values contained in the specific time-key
    for(var ag = 0; ag < arrSecondLevelKeys_2.length; ag++) {
        var au = arrSecondLevelKeys_2[ag];
        lat = secondLevelKeys_2[au]["Latitude"];
        lon = secondLevelKeys_2[au]["Longitude"];
        listOfPositions.push(lat);
        listOfPositions.push(lon);
    }

    // ........ to retrieve all user info contained in the specific time-key and display it on the web page
    while(listOfPositions.length) newArr.push(listOfPositions.splice(0,2)); // Changing 1D array to 2D
    if(firstTimeTimeIconPress != 1) {
        
        var name_ = name_id;
        var age_ = age_id;
        var bloodGroup_ = blood_group;
        
        // retrieving values from the database
        latitude = secondLevelKeys_2[y_]["Latitude"];  // retrieve 'Latitude' child of the specific clicked time key and store that value in the variable 'latitude'
        longitude = secondLevelKeys_2[y_]["Longitude"];  // retrieve 'Longitude' child of the specific clicked time key and store that value in the variable 'latitude'
        var ecg_ = secondLevelKeys_2[y_]["ECG"];  // retrieve 'ECG' child of the specific clicked time key and store that value in the variable 'ecg_'
        var emg_ = secondLevelKeys_2[y_]["EMG"];  // retrieve 'EMG' child of the specific clicked time key and store that value in the variable 'emg_'
        var gsr_ = secondLevelKeys_2[y_]["GSR"];  // retrieve 'GSR' child of the specific clicked time key and store that value in the variable 'gsr_'
        var heartBeat_ = secondLevelKeys_2[y_]["Pulse"];  // retrieve 'Pulse' child of the specific clicked time key and store that value in the variable 'heartBeat_'
        var temp_ = secondLevelKeys_2[y_]["Temp"];  // retrieve 'Temp' child of the specific clicked time key and store that value in the variable 'temp_'
        
        // displaying values in the web page UI
        myPatientPhoto.src = picUrl;  // display the profile pic in the id 'myPatientPhoto' by storing the 'picUrl' in its source
        myPatientName.innerHTML = "Patient's Name: " + name_;  // display the name of the patient by storing 'name_' in the html text text of 'myPatientName'
        myPatientAge.innerHTML = "Patient's Age: " + age_;  // display the age of the patient by storing 'age_' in the html text text of 'myPatientAge'
        myPatientBloodGroup.innerHTML = "Patient's Blood Group: " + bloodGroup_;  // display the blood group of the patient by storing 'bloodGroup_' in the html text text of 'myPatientBloodGroup'
        myPatientLatitude.innerHTML = "Patient's Latitude: " + latitude;  // display the latitude of the patient by storing 'latitude' in the html text text of 'myPatientLatitude'
        myPatientLongitude.innerHTML = "Patient's Longitude: " + longitude;  // display the longitude of the patient by storing 'longitude' in the html text text of 'myPatientLongitude'
        myPatientECG.innerHTML = "Patient's ECG: " + ecg_;  // display the ecg of the patient by storing 'ecg_' in the html text text of 'myPatientECG'
        myPatientEMG.innerHTML = "Patient's EMG: " + emg_;  // display the emg of the patient by storing 'emg_' in the html text text of 'myPatientEMG'
        myPatientGSR.innerHTML = "Patient's GSR: " + gsr_;  // display the gsr of the patient by storing 'gsr_' in the html text text of 'myPatientGSR'
        myPatientHeartBeat.innerHTML = "Patient's Pulse: " + heartBeat_;  // display the heart beat of the patient by storing 'heartBeat_' in the html text text of 'myPatientHeartBeat'
        myPatientTemp.innerHTML = "Patient's Temp: " + temp_;  // display the temperature of the patient by storing 'temp_' in the html text text of 'myPatientTemp'
    }
    firstTimeTimeIconPress=2

    ////////////////// following block of code is responsible to display location on map /////////////////
    if(mymap.hasLayer(polylines)) {  // deleting old polylines
        for(polylines in mymap._layers) {
            if(mymap._layers[polylines]._path != undefined) {
                try {
                    mymap.removeLayer(mymap._layers[polylines]);
                }
                catch(e) {
                }
            }
        }
    }
    var item = newArr;  // item stores the latitude and longitude values
    var markerArray = newArr[newArr.length-1];
    polylines = L.polyline(item).addTo(mymap);
    if (marker != undefined) {
        mymap.removeLayer(marker);
    };
    marker = L.marker(markerArray).addTo(mymap);
    marker.bindPopup("<b>Last Location on the selected Date!</b><br> latitude: " + lat + "<br> longitude: " + lon).openPopup();  // Popups are usually used when you want to attach some information to a particular object on a map. Leaflet command for displaying the popup is:
    var popup = L.popup();
    function onMapClick(e) {  // if the map is clicked, it shows the latitude and longitude values of the clicked location
        popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
    }
    mymap.on('click', onMapClick);
    mymap.fitBounds(polylines.getBounds());
    /////////////////////////////////////////////////////////////////////////////////////////////////////////


    //............................. To Display Multi-Line Graph .............................
	chart = new CanvasJS.Chart("chartContainer", {                                         //
        zoomEnabled: true,                                                                 //
        title:{                                                                            //
            text: "All Info at one place"                                                  //
        },                                                                                 //  
        axisY:[{                                                                           //
            title: "HeartBeat",             //index=0                                      //
            lineColor: "#C24642",                                                          //
            tickColor: "#C24642",                                                          //
            labelFontColor: "#C24642",                                                     //
            titleFontColor: "#C24642",                                                     //
            suffix: "bpm"                                                                  //
        },                                                                                 //                                                                               //
        {                                                                                  //
            title: "ECG",                    //index=1                                     //
            lineColor: "#000080",                                                          //
            tickColor: "#000080",                                                          //
            labelFontColor: "#000080",                                                     //
            titleFontColor: "#000080",                                                     //
        },                                                                                 //
        {                                                                                  //
            title: "EMG",                    //index=2                                     //
            lineColor: "#FFA500",                                                          //
            tickColor: "#FFA500",                                                          //
            labelFontColor: "#FFA500",                                                     //
            titleFontColor: "#FFA500",                                                     //
        },                                                                                 //
        {                                                                                  //
            title: "Temp",                   //index=3                                     //
            lineColor: "#008000",                                                          //
            tickColor: "#008000",                                                          //
            labelFontColor: "#008000",                                                     //
            titleFontColor: "#008000",                                                     //
            suffix: "˚F"                                                                   //
        }],                                                                                //
        axisY2: {                                                                          //
            title: "GSR",                                                                  //
            lineColor: "#7F6084",                                                          //
            tickColor: "#7F6084",                                                          //
            labelFontColor: "#7F6084",                                                     //
            titleFontColor: "#7F6084",                                                     //
            // prefix: "$",                                                                //
        },                                                                                 //
        toolTip: {                                                                         //
            shared: true                                                                   //
        },                                                                                 //
        legend: {                                                                          //     
            cursor: "pointer",                                                             //
            itemclick: toggleDataSeries                                                    //
            // horizontalAlign: "right",                                                   //
            // verticalAlign: "center"                                                     // 
        },                                                                                 //
        data: [                                                                            //
        {                                                                                  //
            type: "line",                                                                  //
            name: "Temp",                                                                  //
            color: "#008000",                                                              //
            showInLegend: true,                                                            //
            axisYIndex: 3,                                                                 //
            dataPoints: tempSer                                                            //
        },                                                                                 //
        {                                                                                  //
            type: "line",                                                                  //
            name: "EMG",                                                                   //
            color: "#FFA500",                                                              //
            showInLegend: true,                                                            //
            axisYIndex: 2,                                                                 //
            dataPoints: emgSer                                                             //
        },                                                                                 //
        {                                                                                  //
            type: "line",                                                                  //
            name: "ECG",                                                                   //
            color: "#000080",                                                              //
            showInLegend: true,                                                            //
            axisYIndex: 1,                                                                 //
            dataPoints: ecgSer                                                             //
        },                                                                                 //
        {                                                                                  //
            type: "line",                                                                  //
            name: "HeartBeat",                                                             //
            color: "#C24642",                                                              //
            axisYIndex: 0,                                                                 //
            showInLegend: true,                                                            //
            dataPoints: hbSer                                                              //
        },                                                                                 //
        {                                                                                  //
            type: "line",                                                                  //
            name: "GSR",                                                                   //
            color: "#7F6084",                                                              //
            axisYType: "secondary",                                                        //
            showInLegend: true,                                                            //
            dataPoints: gsrSer                                                             //
        }]                                                                                 //
    });                                                                                    //
    chart.render();                                                                        //
                                                                                           //
    function toggleDataSeries(e) {                                                         //
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {       //
            e.dataSeries.visible = false;                                                  //
        } else {                                                                           //
            e.dataSeries.visible = true;                                                   //
        }                                                                                  //
        e.chart.render();                                                                  //
    }                                                                                      //
    //.....................................................................................//
    }
}  // window.onload() function ends here


// ....... these are error functions .......
function errDataInfo(err) {
    console.log('Error!');
    console.log(err);
} 
function errDataHis(err) {
    console.log('Error!');
    console.log(err);
} 
function errData1(err) {
    console.log('Error!');
    console.log(err);
} 
function errData2(err) {
    console.log('Error!');
    console.log(err);
}
function errData3(err) {
    console.log('Error!');
    console.log(err);
} 
function errData_1(err) {
    console.log('Error!');
    console.log(err);
}
function errData_2(err) {
    console.log('Error!');
    console.log(err);
}

function errUserUID(err) {
    console.log('Error!');
    console.log(err);
} 

function prescription_errData2(err) {
    console.log('Error!');
    console.log(err);
} 

function prescription_errData3(err) {
    console.log('Error!');
    console.log(err);
} 

function prescription_errData_1(err) {
    console.log('Error!');
    console.log(err);
} 


// .............. when user logs out, he is taken to 'index.html' page
function logout() {
    firebase.auth().signOut().then(function (){
        //signout successful
        window.location.href = "index.html"
    }).catch(function(error){
        //An error happened
    
    });
}

//.....................To Post Prescriptions on database .....................//
function postPrescription() {
    if ($('#prescriptionBoxID').prop('disabled')) {
        alert('first choose a patient to write prescription to!')
    }
    else {
        if (document.forms['frm'].presc.value === "") {
            alert("'Write some prescription!'");
        }
        else {  // POST THE PRESCRIPTION IN THE DATABASE
            goToLocForID = firebase.database().ref('User_Info'); 
            goToLocForID.on('value', getUserUID, errUserUID); 

            // The following function retreives the clicked user UID from the database and that retrieved value will be used to post prescription data in a new database location
            function getUserUID(data) {
                var infoKeys = data.val();
                var arrInfoKeys = Object.keys(infoKeys);  // 'arrInfoLevelKeys' contains the array of all patient UIDs
                UID = arrInfoKeys[index]; // 'UID' stores the UID of the clicked patient
                name = firstLevelKeys[UID]["name"];
            }

            // get current date and time
            var today = new Date();
            newDate = today.toString().substring(4, 15);
            newTime = today.toString().slice(16, 25);

            // The following block of code, post this prescription in the database in 'Prescriptions' bucket
            firebase.database().ref('Prescriptions/' + UID + "/" + newDate).child(newTime.trim()).set({ 
                name: name,
                presc: document.forms['frm'].presc.value
            });

            //Once prescription is successfully posted, show a small notification on the screen and empty the text field
            $('#prescriptionMessage').fadeIn('slow', function () {
                $('#prescriptionMessage').delay(1000).fadeOut();
            });

            document.forms['frm'].presc.value = ""
        }
    }
}
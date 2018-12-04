// Steps to complete:

// 1. Create Firebase link
// 2. Create initial train data in database
// 3. Create button for adding new trains - then update the html + update the database
// 4. Create a way to retrieve trains from the trainlist.
// 5. Create a way to calculate the time way. Using difference between start and current time.
//    Then take the difference and modulus by frequency. (This step can be completed in either 3 or 4)

// Initialize Firebase. This allows the connection to firebase?? 
var config = {
    apiKey: "AIzaSyCcPFcbAjIsgXGQwE-A3AcOXkeD40qypE8",
    authDomain: "train-times-93583.firebaseapp.com",
    databaseURL: "https://train-times-93583.firebaseio.com",
    storageBucket: "train-times-93583.appspot.com"
  };
  
  firebase.initializeApp(config);
  
  var trainData = firebase.database();
  
  // 2. Populate Firebase Database with initial data (in this case, I did this via Firebase GUI)
  // 3. Button for adding trains
  $("#add-train-btn").on("click", function(event) {
    // Prevent the default form submit behavior
    event.preventDefault();
  
    // Grabs user input/ This takes in the user information when they enter a new train?? 
    var trainName = $("#train-name-input")
      .val()
      .trim();
    var destination = $("#destination-input")
      .val()
      .trim();
    var firstTrain = $("#first-train-input")
      .val()
      .trim();
    var frequency = $("#frequency-input")
      .val()
      .trim();
  
    // Creates local "temporary" object for holding train data. Wehen a new train is entered there needs to be a temporary object to hold that information together.. This is for that and is done in an object format. 
    var newTrain = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };
  
    // Uploads train data to the database. This take the new train data and pushes it up to firebase??
    trainData.ref().push(newTrain);
  
    // Logs everything to console. This makes the new train info visable in the console log?? 
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
  
    // Alert - This is a pop up box that gives an alert to the user to let them know train was sucessfully added 
    alert("Train successfully added");
  
    // Clears all of the text-boxes. After a user inputs a new train and the alert shows it was sucessfully added it is necessary for those fields to clear out so another train can be entered. Below is the code that allows that. 
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  // 4. Create Firebase event for adding trains to the database and a row in the html when a user adds an entry. This code the new train train information subitted and sends it to the database to be stored. It also populates on the browswer the new trains information. 
  trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable. This code creates the variables where the new train inforamtion will be stored. It clarifies where the data saved will be located in terms of the variable.. not the html. 
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;
  
    var timeArr = tFirstTrain.split(":");
    var trainTime = moment()
      .hours(timeArr[0])
      .minutes(timeArr[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;
  
    // If the first train is later than the current time, sent arrival to the first train time. Not sure how to further explain this?? 
    if (maxMoment === trainTime) {
      tArrival = trainTime.format("hh:mm A");
      tMinutes = trainTime.diff(moment(), "minutes");
    } else {
      // Calculate the minutes until arrival using hardcore math
      // To calculate the minutes till arrival, take the current time in unix subtract the FirstTrain time
      // and find the modulus between the difference and the frequency.
      var differenceTimes = moment().diff(trainTime, "minutes");
      var tRemainder = differenceTimes % tFrequency;
      tMinutes = tFrequency - tRemainder;
      // To calculate the arrival time, add the tMinutes to the current time
      tArrival = moment()
        .add(tMinutes, "m")
        .format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);
  
    // Add each train's data into the table. This is hte final code that makes the actual update take place of new train information being added. 
    $("#train-table > tbody").append(
      $("<tr>").append(
        $("<td>").text(tName),
        $("<td>").text(tDestination),
        $("<td>").text(tFrequency),
        $("<td>").text(tArrival),
        $("<td>").text(tMinutes)
      )
    );
  });
  
  
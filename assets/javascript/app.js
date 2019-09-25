$(function() {

  var config = {
    apiKey: "AIzaSyCBr5iW7O6E_kM8nD1uwF5qcl3X6xhD13o",
    authDomain: "train-scheduler-a565d.firebaseapp.com",
    databaseURL: "https://train-scheduler-a565d.firebaseio.com",
    projectId: "train-scheduler-a565d",
    storageBucket: "",
    messagingSenderId: "1077306052554",
    appId: "1:1077306052554:web:2dd47906a316d943c90933"
  };

  firebase.initializeApp(config);
  var database = firebase.database();

  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = "";
  var formValid = false;


  $("#submit").on("click", function(event) {
    event.preventDefault();

    trainName = $("#tname")
      .val()
      .trim();
    destination = $("#dest")
      .val()
      .trim();
    firstTrainTime = $("#ftt")
      .val()
      .trim();
    frequency = $("#freq")
      .val()
      .trim();

    function formValid() {
      var ftt = $("#ftt")
        .val()
        .trim();
      var freq = parseInt(
        $("#freq")
          .val()
          .trim()
      );
      if (typeof ftt == String) {
        $("#ftt").attr("placeholder", "Please Enter a Valid Number.");
        $("#ftt").css("border", "red solid 2px");
        $("#ftt").val("");
        formValid = false;
      } else {
        $("#ftt").css("border", "#ced4da solid 2px");
        $("#ftt").attr("placeholder", "14:00");
        formValid = true;
      }
      if (isNaN(freq)) {
        $("#freq").attr("placeholder", "Please Enter a Valid Number.");
        $("#freq").css("border", "red solid 2px");
        $("#freq").val("");
        formValid = false;
      } else {
        $("#freq").css("border", "#ced4da solid 2px");
        $("#freq").attr("placeholder", "120");
      }
      console.log(moment(ftt, "hh:mm").format("hh:mm"));
      console.log(freq);
      firstTrainTime = moment(ftt, "hh:mm").format("HH:mm");
    }

    formValid();
    var totalMinutes = frequency;
    var h = Math.floor(totalMinutes / 60);
    var m = totalMinutes % 60;
    
    var minAway = h + ":" + m;
    console.log(minAway);
    var time = firstTrainTime;
    time = time.split(":"); // convert to array
    // fetch
    var hours = Number(time[0]);
    var minutes = Number(time[1]);
    // calculate
    var timeValue;
    if (hours > 0 && hours <= 12) {
      timeValue = "" + hours;
    } else if (hours > 12) {
      timeValue = "" + (hours - 12);
    } else if (hours == 0) {
      timeValue = "12";
    }
    timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes; // get minutes
    timeValue += hours >= 12 ? " P.M." : " A.M."; // get AM/PM

    if (formValid === true) {
      database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: timeValue,
        frequency: frequency,
        minAway: minAway
      });
      $("#tname").val("");
      $("#dest").val("");
      $("#ftt").val("");
      $("#freq").val("");
    }
  });
  database.ref().on("value", function(snapshot) {
    console.log(snapshot.val())
    // console.log(destination)
    // console.log(firstTrainTime)
    
  });

  database.ref().on("child_added", function(childSnapshot) {
    var childSnap = childSnapshot.val();

    // console.log(childSnap);

    var newtd = $("<tr>");
    $("#tbody").prepend(newtd);
    newtd.append("<td>" + childSnap.trainName + "</td>");
    newtd.append("<td>" + childSnap.destination + "</td>");
    newtd.append("<td>" + childSnap.frequency + "</td>");
    newtd.append("<td>" + childSnap.firstTrainTime + "</td>");
    newtd.append("<td>" + childSnap.minAway + "</td>");
  });
  setInterval(() => {
      
      $("#theTime").html(moment().format("HH:mm:ss a"))
      $("#theTime").css("opacity", "1")
  }, 1000);

});

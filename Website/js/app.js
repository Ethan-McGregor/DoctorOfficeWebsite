'use strict';

//TODO: MAKE generic call to find which med or diagnosis button is clicked and get proper info.<SEE TEST CLICK METHOD>
//TODO: Create real forms for remove and add patients
//TODO: figure out updating
//TODO: Maybe make user find patient in search and records can be changed there?
//TODO: in each card can be a update button

function ifClicked() {

    var dEvent = $("#Doctor");
    var pEvent = $("#Patient");
    var aEvent = $("#Appointment");
    var searchPatients = $("#SearchPatients")
    var addPatient = $("#addPatient")

    //waits for a button to be clciked
    dEvent.click(function (event) {
        refreshPage();
        createDoctorForm();

    });

    pEvent.click(function (event) {
        refreshPage();
        createPatientForm();

    });

    aEvent.click(function (event) {
        refreshPage();
        createAppointmentForm();

    });

    searchPatients.click(function (event) {

        getPatients();

    });

    //Test method to see if Info can be pulled from Element. WORKS
    addPatient.click(function (event) {

        console.log(event.target.id)

    });
    
}

function createDoctorForm() {
    console.log("doc");
    $("#doc").show();
    $("#pat").hide();
    $("#app").hide();
}


function createPatientForm() {
    console.log("pat");

    $("#pat").show();
    $("#doc").hide();
    $("#app").hide();
}

function createAppointmentForm() {
    console.log("pat");
    $("#app").show();
    $("#pat").hide();
    $("#doc").hide();
}


function getPatients() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var patients = JSON.parse(this.responseText);

            createPatientCards(patients);
        }
    };
    xmlhttp.open("GET", "https://api.myjson.com/bins/qsdy6", true);
    xmlhttp.send();

}

function getMedicationDiagnosis(){

}

function getAppointments(){

}

function createPatientCards(patients) {
    refreshPage();
    var i;
    var row = $("<div class=row id=row>")
    $("#cardContainer").append(row)

    for (i = 0; i < Object.keys(patients).length; i++) {

        console.log(patients[i].Name);
        console.log(patients[i].DOB);
        console.log(patients[i].Gender);
        console.log(patients[i].Address);
        console.log(patients[i].Phone);
        console.log(patients[i].InsuranceNumber);
        console.log(patients[i].PrimaryDoctor);

        var col = $("<div class=col-4 id=col" + i + ">");
        $("#row").append(col);
        var card = $("<div class=card id=card" + i + ">");
        $("#card" + i).css("width", "18em");
        $("#col" + i).append(card);
        var card1 = $("<div class=card-body id=card-body" + i + ">");
        $("#card" + i).append(card1);
        var card2 = $("<h5 class=card-title id=card-title" + i + ">" + patients[i].Name + "</h5>");
        $("#card-body" + i).append(card2);



        var liOne = $("<ul class=list-group list-group-flush id=liOne"+i+">");
        $("#card-body" + i).append(liOne);

        var liTwo = $("<li class=list-group-item>" + "<Strong>DOB</Strong>: " + patients[i].DOB + "</li>");
        $("#liOne"+i).append(liTwo);
        var liThree = $("<li class=list-group-item>" + "<Strong>Gender</Strong>: " + patients[i].Gender + "</li>");
        $("#liOne"+i).append(liThree);
        var liFour = $("<li class=list-group-item>" +  "<Strong>Phone</Strong>: " + patients[i].Phone + "</li>");
        $("#liOne"+i).append(liFour);
        var liFive = $("<li class=list-group-item>" +  "<Strong>Insurance Number</Strong>: " + patients[i].InsuranceNumber + "</li>");
        $("#liOne"+i).append(liFive);
        var liSix = $("<li class=list-group-item>" +  "<Strong>Primary Doctor</Strong>: " + patients[i].PrimaryDoctor + "</li>");
        $("#liOne"+i).append(liSix);


        var body = $("<div class=card-body id=card-body2" + i + ">");
        $("#card" + i).append(body);
        var card4 = $("<a href=# class=card-link id=card-link" + i + ">Diagnosis and Medication</a></div></div></div></div></div>");
        $("#card-body2" + i).append(card4);
    }
}

function createMedicationDiagnosisCards(){


}

function createAppointmentCards(){

}

function refreshPage() {
    $("#row").remove();
}


ifClicked();
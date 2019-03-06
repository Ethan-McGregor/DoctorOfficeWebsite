'use strict';

//TODO: MAKE generic call to find which med or diagnosis button is clicked and get proper info.<SEE TEST CLICK METHOD>
//TODO: Create real forms for remove and add patients
//TODO: figure out updating
//TODO: Maybe make user find patient in search and records can be changed there?
//TODO: in each card can be a update button

//used to reference patient data for updating
var patientsInfo = "";

//Used to refresh page with current patient info
var usedRoute = "";

function ifClicked() {

    var dEvent = $("#Doctor");
    var pEvent = $("#Patient");
    var aEvent = $("#Appointment");
    var searchPatients = $("#SearchPatients");
    

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
        var valueFirst = $("#searchPatientFirst")[0].value;
        var valueLast = $("#searchPatientLast")[0].value;
        var valueIns = $("#searchPatientIns")[0].value;
        if (valueFirst == ""){
            valueFirst = 'None';
        };
        if (valueLast == ""){
            valueLast = 'None';
        };

        if (valueIns == ""){
            valueIns = 'None';
            var route = "/findPatient/"+valueFirst+"/None/"+valueLast+"/None";
        }else{
            var route = "/findPatient/None/None/None/"+valueIns;
        };
        console.log("start");
        console.log(valueFirst);
        console.log(valueLast);
        console.log(valueIns);
        console.log("End");
        
        getData(route);

    });

    var addPatient = $("#addPatient");
    addPatient.click(function (event) {

        console.log(event.target.id)

    });

    //updatePatient/<firstName>/<middleName>/<lastName>/<gender>/<DOB>/<address>/<phone>/<newInsuranceNum>/<oldInsuranceNum>
    //findPatient/<firstName>/<middleName>/<lastName>/<insuranceNum>
    //getPatientInfo/<insuranceNum>
    //addPatient/<firstName>/<middleName>/<lastName>/<gender>/<DOB>/<address>/<phone>/<insuranceNum>
    //removePatient/<insuranceNum>
    //getFutureAppointments
    var dobFormSubmit = $("[id^='dobFormSubmit']");
    dobFormSubmit.click(function (event) {
       console.log(patientsInfo[Number(event.target.id.substring(event.target.id.length - 1, event.target.id.length))].InsuranceNumber);
       var index = event.target.id.substring(event.target.id.length - 1, event.target.id.length);
       var insNum = patientsInfo[Number(index)].InsuranceNumber;
       var value = $("#collapseDOB"+index)[0].value;
       var route = "/updatePatient/None/None/None/None/"+value+"/None/None/None/" + insNum ;
       
       postData(route);


    });

    var genderFormSubmit = $("[id^='genderFormSubmit']");
    genderFormSubmit.click(function (event) {
        var index = event.target.id.substring(event.target.id.length - 1, event.target.id.length);
        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        var value = $("#collapseGender"+index)[0].value;
        var route = "/updatePatient/None/None/None/"+value+"/None/None/None/None/" + insNum ;
        
        postData(route);
    });

    var phoneFormSubmit = $("[id^='phoneFormSubmit']");
    phoneFormSubmit.click(function (event) {
        var index = event.target.id.substring(event.target.id.length - 1, event.target.id.length);
        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        var value = $("#collapsePhone"+index)[0].value;
        var route = "/updatePatient/None/None/None/None/None/None/"+value+"/None/" + insNum ;
       
        postData(route);

    });

    var insFormSubmit = $("[id^='insFormSubmit']");
    insFormSubmit.click(function (event) {
        var index = event.target.id.substring(event.target.id.length - 1, event.target.id.length);
        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        var value = $("#collapseIns"+index)[0].value;
        var route = "/updatePatient/None/None/None/None/None/None/None/"+value+"/" + insNum ;
       
        postData(route);

    });

    var medDiag = $("[id^='card-link']");
    medDiag.click(function (event) {
        var index = event.target.id.substring(event.target.id.length - 1, event.target.id.length);
        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        createMedicationDiagnosisCards(insNum);

    });
}

function getData(route) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var patients = JSON.parse(this.responseText);
            usedRoute = route;
            createPatientCards(patients);
        }

    };
    
    xmlhttp.open("GET", "http://127.0.0.1:5000" + route, true);
    xmlhttp.setRequestHeader("Content-Type", "text/xml");
    xmlhttp.send();
}

function postData(route) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var patients = JSON.parse(this.responseText);

        }
        getData(usedRoute);

    };
    
    xmlhttp.open("POST", "http://127.0.0.1:5000"+route, true);
    xmlhttp.setRequestHeader("Content-Type", "text/xml");
    xmlhttp.send();
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
    xmlhttp.open("GET", "http://127.0.0.1:5000/findPatient/None/None/None/None", true);
    xmlhttp.send();

}

function getMedicationDiagnosis() {

}

function getAppointments() {

}

function createPatientCards(patients) {
    refreshPage();
    var i;
    var row = $("<div class=row id=row>")
    $("#cardContainer").append(row)
    patientsInfo = patients;

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



        var liOne = $("<ul class=list-group list-group-flush id=liOne" + i + ">");
        $("#card-body" + i).append(liOne);

        var test = $("<div class=accordion id=accordionExample" + i + ">");
        $("#card-body" + i).append(test);



        var dobBut = $("<button class=list-group-item type=button data-toggle=collapse data-target=#dobDiv" + i + " aria-expanded=true aria-controls=collapseOne id=button" + i + " > " + "<Strong>DOB</Strong>: " + patients[i].DOB + " </button>");
        $("#accordionExample" + i).append(dobBut);
        var collapseDOBDiv = $("<div id=dobDiv" + i + " class=collapse aria-labelledby=headingOne data-parent=#accordionExample></div>");
        $("#accordionExample" + i).append(collapseDOBDiv);
        var dobForm = $("<input type=text id=collapseDOB" + i + " class=form-conrol></input>");
        $("#dobDiv" + i).append(dobForm);
        var dobFormSub = $("<button type=button class=btn btn-primary id=dobFormSubmit" + i + " >Update</button>");
        $("#dobDiv" + i).append(dobFormSub);

        var genderBut = $("<button class=list-group-item type=button data-toggle=collapse data-target=#genderDiv" + i + " aria-expanded=true aria-controls=collapseOne id=button" + i + " > " + "<Strong>Gender</Strong>: " + patients[i].Gender + " </button>");
        $("#accordionExample" + i).append(genderBut);
        var collapseGenderDiv = $("<div id=genderDiv" + i + " class=collapse aria-labelledby=headingOne data-parent=#accordionExample></div>");
        $("#accordionExample" + i).append(collapseGenderDiv);
        var genderForm = $("<input type=text id=collapseGender" + i + " class=form-conrol></input>");
        $("#genderDiv" + i).append(genderForm);
        var genderFormSub = $("<button type=button class=btn btn-primary id=genderFormSubmit" + i + " >Update</button>");
        $("#genderDiv" + i).append(genderFormSub);

        var phoneBut = $("<button class=list-group-item type=button data-toggle=collapse data-target=#phoneDiv" + i + " aria-expanded=true aria-controls=collapseOne id=button" + i + " > " + "<Strong>Phone</Strong>: " + patients[i].Phone + " </button>");
        $("#accordionExample" + i).append(phoneBut);
        var collapsePhoneDiv = $("<div id=phoneDiv" + i + " class=collapse aria-labelledby=headingOne data-parent=#accordionExample></div>");
        $("#accordionExample" + i).append(collapsePhoneDiv);
        var phoneForm = $("<input type=text id=collapsePhone" + i + " class=form-conrol></input>");
        $("#phoneDiv" + i).append(phoneForm);
        var phoneFormSub = $("<button type=button class=btn btn-primary id=phoneFormSubmit" + i + " >Update</button>");
        $("#phoneDiv" + i).append(phoneFormSub);

        var insBut = $("<button class=list-group-item type=button data-toggle=collapse data-target=#insDiv" + i + " aria-expanded=true aria-controls=collapseOne id=button" + i + " > " + "<Strong>Insurance Number</Strong>: " + patients[i].InsuranceNumber + " </button>");
        $("#accordionExample" + i).append(insBut);
        var collapseInsDiv = $("<div id=insDiv" + i + " class=collapse aria-labelledby=headingOne data-parent=#accordionExample></div>");
        $("#accordionExample" + i).append(collapseInsDiv);
        var insForm = $("<input type=text id=collapseIns" + i + " class=form-conrol></input>");
        $("#insDiv" + i).append(insForm);
        var insFormSub = $("<button type=button class=btn btn-primary id=insFormSubmit" + i + " >Update</button>");
        $("#insDiv" + i).append(insFormSub);

        var docBut = $("<button class=list-group-item type=button data-toggle=collapse data-target=#docDiv" + i + " aria-expanded=true aria-controls=collapseOne id=button" + i + " > " + "<Strong>Primary Doctor</Strong>: " + patients[i].PrimaryDoctor + " </button>");
        $("#accordionExample" + i).append(docBut);
        var collapseDocDiv = $("<div id=docDiv" + i + " class=collapse aria-labelledby=headingOne data-parent=#accordionExample></div>");
        $("#accordionExample" + i).append(collapseDocDiv);
        var docForm = $("<input type=text id=collapseDoc" + i + " class=form-conrol></input>");
        $("#docDiv" + i).append(docForm);
        var docFormSub = $("<button type=button class=btn btn-primary id=docFormSubmit" + i + " >Update</button>");
        $("#docDiv" + i).append(docFormSub);

        // var liFour = $("<li class=list-group-item>" +  "<Strong>Phone</Strong>: " + patients[i].Phone + "</li>");
        // $("#liOne"+i).append(liFour);
        // var liFive = $("<li class=list-group-item>" +  "<Strong>Insurance Number</Strong>: " + patients[i].InsuranceNumber + "</li>");
        // $("#liOne"+i).append(liFive);
        // var liSix = $("<li class=list-group-item>" +  "<Strong>Primary Doctor</Strong>: " + patients[i].PrimaryDoctor + "</li></ul>");
        // $("#liOne"+i).append(liSix);


        var body = $("<div class=card-body id=card-body2" + i + ">");
        $("#card" + i).append(body);
        var card4 = $("<button type=button class=list-group-item id=card-link" + i + ">Diagnosis - Medication - Appointments</button></div></div></div></div>");
        $("#card-body2" + i).append(card4);
    }
    //All accoridan buttons have this
    $("[id^='button']").css("width", "100%");
    $("[id^='button']").css("text-align", "left");
    ifClicked();
}

function createMedicationDiagnosisCards(insNum) {
    var route = "/getPatientInfo/"+insNum;
    console.log(route);
    var diagMedData = getData(route);

    var index = event.target.id.substring(event.target.id.length - 1, event.target.id.length);
    var insNum = patientsInfo[Number(index)].InsuranceNumber;
    console.log(diagMedData.Diagnoses);

}

function createAppointmentCards() {

}

function refreshPage() {
    $("#row").remove();
}


ifClicked();
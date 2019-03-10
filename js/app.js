'use strict';

//TODO: MAKE generic call to find which med or diagnosis button is clicked and get proper info.<SEE TEST CLICK METHOD>
//TODO: Create real forms for remove and add patients
//TODO: figure out updating
//TODO: Maybe make user find patient in search and records can be changed there?
//TODO: in each card can be a update button

//used to reference patient data for updating
var patientsInfo = "";
var patientDiagInfo = "";
var patientName = "";
//Used to refresh page with current patient info
var usedRoute = "";

function ifClicked() {

    var pEvent = $("#Patient");
    var searchPatients = $("#SearchPatients");
    var addPatient = $("#addPatient");
    var removePatient = $("#removePatient");
    var about = $("#About");

    pEvent.click(function (event) {
        refreshPage();
        createPatientForm();

    });
    about.click(function (event) {
        refreshPage();
        createAboutForm();

    });

    searchPatients.click(function (event) {
        var valueFirst = $("#searchPatientFirst")[0].value;
        var valueLast = $("#searchPatientLast")[0].value;
        var valueIns = $("#searchPatientIns")[0].value;
        if (valueFirst == "") {
            valueFirst = 'None';
        };
        if (valueLast == "") {
            valueLast = 'None';
        };

        if (valueIns == "") {
            valueIns = 'None';
            var route = "/findPatient/" + valueFirst + "/None/" + valueLast + "/None";
        } else {
            var route = "/findPatient/None/None/None/" + valueIns;
        };


        getPatientData(route);

    });

    
    addPatient.click(function (event) {
        console.log($("#addPatientFirstName"));
        $("#insAleart").remove();
        $("#firstAleart").remove();
        $("#lastAleart").remove();
        $("#sAlert").remove();
        var firstName =  $("#addPatientFirstName")[0].value;
        var lastName =  $("#addPatientLastName")[0].value;
        var middleName =  $("#addPatientMiddleName")[0].value;
        var dateofBirth =  $("#addPatientDOB")[0].value;
        var gender = $("#addPatientGender")[0].value;
        var phone = $("#addPatientPhone")[0].value;
        var insNum =  $("#addPatientInsurance")[0].value;
        var address =  $("#addPatientAddress")[0].value;
        var addInsAlert = $("<div class=alert role=alert id=insAleart >Please input a valid Insurance number I.E 9 digets</div>");
        var addFirstAlert = $("<div class=alert role=alert id=firstAleart >Please input a First Name</div>");
        var addLastAlert = $("<div class=alert role=alert id=lastAleart >Please input a Last Name</div>");
        var addAddedPatientAlert = $("<div class=alert role=alert id=sAlert ><Strong>Sucess!</strong> You have added: " +firstName+  " "+ lastName+" as a patient.</div>");
        var errorCount = 0;
        if(firstName == ""){
            $("#addPatient").before(addFirstAlert);
            $("#firstAleart").addClass("alert-warning");
            errorCount += 1;
        };
        if(lastName == ""){
            $("#addPatient").before(addLastAlert);
            $("#lastAleart").addClass("alert-warning");
            errorCount += 1;
        };
        if(middleName == ""){
            middleName = "None";
        };
        if(dateofBirth == ""){
            dateofBirth = "None";
        };
        if(gender == ""){
            gender = "None";
        };
        if(phone == ""){
            phone = "None";
        };
        if(insNum == "" || insNum.length != 9 || isNaN(insNum)){ 
            $("#addPatient").before(addInsAlert);
            $("#insAleart").addClass("alert-warning");
            errorCount += 1;
        };
        if(address == ""){
            address = "None";
        };
        
        if (errorCount == 0){
            var route = "/addPatient/" + firstName + "/"+middleName+"/"+lastName+"/"+gender+"/"+dateofBirth+"/"+address+"/"+phone+"/"+insNum;
            console.log(route);
            postData(route);
            $("#addPatient").before(addAddedPatientAlert);
            $("#sAlert").addClass("alert-success");
        }
        
       
    });

    removePatient.click(function (event) {
        $("#sAlertR").remove();
        $("#lastAleartB").remove();
        var insNum =  $("#removePatientinsurance")[0].value;
        var removeAddedPatientAlert = $("<div class=alert role=alert id=sAlertR ><Strong>Sucess!</strong> You have added: " +insNum+" as a patient.</div>");
        var bad = $("<div class=alert role=alert id=lastAleartB >Please input valid Insurance Number</div>");
       
        if (insNum.length != 9 || isNaN(insNum)){
            $("#removePatient").before(bad);
            $("#lastAleartB").addClass("alert-warning");
        }else{
            $("#removePatient").before(removeAddedPatientAlert);
            $("#sAlertR").addClass("alert-success");
            var route = "/removePatient/"+insNum;
            postData(route);
        }

    });


    //updatePatient/<firstName>/<middleName>/<lastName>/<gender>/<DOB>/<address>/<phone>/<newInsuranceNum>/<oldInsuranceNum>
    //findPatient/<firstName>/<middleName>/<lastName>/<insuranceNum>
    //getPatientInfo/<insuranceNum>
    //addPatient/<firstName>/<middleName>/<lastName>/<gender>/<DOB>/<address>/<phone>/<insuranceNum>
    //removePatient/<insuranceNum>
    //getFutureAppointments
    var dobFormSubmit = $("[id^='dobFormSubmit']");
    dobFormSubmit.click(function (event) {
        var index = event.target.id.substring(event.target.id.length - 1, event.target.id.length);
        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        var value = $("#collapseDOB" + index)[0].value;
        var route = "/updatePatient/None/None/None/None/" + value + "/None/None/None/" + insNum;

        postData(route);


    });

    var genderFormSubmit = $("[id^='genderFormSubmit']");
    genderFormSubmit.click(function (event) {
        var index = event.target.id.substring(event.target.id.length - 1, event.target.id.length);
        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        var value = $("#collapseGender" + index)[0].value;
        var route = "/updatePatient/None/None/None/" + value + "/None/None/None/None/" + insNum;

        postData(route);
    });

    var phoneFormSubmit = $("[id^='phoneFormSubmit']");
    phoneFormSubmit.click(function (event) {
        var index = event.target.id.substring(event.target.id.length - 1, event.target.id.length);
        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        var value = $("#collapsePhone" + index)[0].value;
        var route = "/updatePatient/None/None/None/None/None/None/" + value + "/None/" + insNum;

        postData(route);

    });

    var insFormSubmit = $("[id^='insFormSubmit']");
    insFormSubmit.click(function (event) {
        $("#sAlertRT").remove();
        $("#lastAleartBT").remove();
        var index = event.target.id.substring(event.target.id.length - 1, event.target.id.length);
        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        var value = $("#collapseIns" + index)[0].value;
        var route = "/updatePatient/None/None/None/None/None/None/None/" + value + "/" + insNum;
        var insAlertBad = $("<div class=alert role=alert id=lastAleartBT >Please input valid Insurance Number</div>");
        if (value.length != 9 || isNaN(value)){
            $("#collapseIns" + index).before(insAlertBad);
            $("#lastAleartBT").addClass("alert-warning");
        }else{

            postData(route);
        ;}
        

    });

    var medDiag = $("[id^='card-link']");
    medDiag.click(function (event) {
        var index = event.target.id.substring(event.target.id.length - 1, event.target.id.length);
        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        var route = "/getPatientInfo/" + insNum;
        patientName = patientsInfo[Number(index)].Name;
        getMedData(route);

    });
}

function getPatientData(route) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var patients = JSON.parse(this.responseText);
            usedRoute = route;
            createPatientCards(patients);

        }

    };

    xmlhttp.open("GET", "http://23.152.224.38" + route, true);
    xmlhttp.setRequestHeader("Content-Type", "text/xml");
    xmlhttp.send();
}
function getMedData(route) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var patients = JSON.parse(this.responseText);
            // usedRoute = route;
            createMedicationDiagnosisCards(patients);

        }

    };

    xmlhttp.open("GET", "http://23.152.224.38" + route, true);
    xmlhttp.setRequestHeader("Content-Type", "text/xml");
    xmlhttp.send();
}

function postData(route) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var patients = JSON.parse(this.responseText);

        }
        getPatientData(usedRoute);

    };

    xmlhttp.open("PUT", "http://23.152.224.38" + route, true);
    xmlhttp.setRequestHeader("Content-Type", "text/xml");
    xmlhttp.send();
}




function createPatientForm() {
    $("#pat").show();
    $("#about").hide();
    $("#app").hide();
}
function createAboutForm(){
    $("#pat").hide();
    $("#about").show();
    $("#app").hide();
}

function createAppointmentForm() {

    $("#app").show();
    $("#pat").hide();
    $("#about").hide();
}


// function getPatients() {
//     var xmlhttp = new XMLHttpRequest();
//     xmlhttp.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             var patients = JSON.parse(this.responseText);

//             createPatientCards(patients);
//         }
//     };
//     xmlhttp.open("GET", "http://127.0.0.1:5000/findPatient/None/None/None/None", true);
//     xmlhttp.send();

// }



function createPatientCards(patients) {
    refreshPage();
    var i;
    var row = $("<div class=row id=row>")
    $("#cardContainer").append(row)
    patientsInfo = patients;

    for (i = 0; i < Object.keys(patients).length; i++) {


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

        var docBut = $("<button class=list-group-item type=button data-toggle=collapse aria-expanded=true aria-controls=collapseOne id=button" + i + " > " + "<Strong>Primary Doctor</Strong>: " + patients[i].PrimaryDoctor + " </button>");
        $("#accordionExample" + i).append(docBut);
        var collapseDocDiv = $("<div id=docDiv" + i + " class=collapse aria-labelledby=headingOne data-parent=#accordionExample></div>");
        $("#accordionExample" + i).append(collapseDocDiv);
        var docForm = $("<input type=text id=collapseDoc" + i + " class=form-conrol></input>");
        $("#docDiv" + i).append(docForm);

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

function createMedicationDiagnosisCards(patients) {
    var i = 0;
    var j = 0;
    var h = 0;
    refreshPage();
    var row = $("<div class=row id=row>")
    $("#cardContainer").append(row)
    patientDiagInfo = patients;

         var col = $("<div class=col-4 id=colMed>");
        $("#row").append(col);
        var card = $("<div class=card id=cardMed>");
        $("#cardMed").css("width", "18em");
        $("#colMed").append(card);
        var card1 = $("<div class=card-body id=card-bodyMed>");
        $("#cardMed").append(card1);
        var card2 = $("<h5 class=card-title id=card-titleMed >"+ patientName +"</h5>");
        $("#card-bodyMed").append(card2);
        var liOne = $("<ul class=list-group list-group-flush id=liOneMed >");
        $("#card-bodyMed").append(liOne);
        var test = $("<div class=accordion id=accordionExampleMed >");
        $("#card-bodyMed").append(test);
      

    for (i = 0; i < Object.keys(patients.Appointments).length; i++) {

        console.log(Object.keys(patients.Appointments)[i]);
        console.log(patients.Appointments[Object.keys(patients.Appointments)[i]]);

        var appBut = $("<button class=list-group-item type=button data-toggle=collapse data-target=#appDiv" + i + " aria-expanded=true aria-controls=collapseOne id=buttonApp" + i + " > " + "<Strong>Appointmnet</Strong>: " + Object.keys(patients.Appointments)[i] + " </button>");
        $("#accordionExampleMed").append(appBut);
        var collapseAppDiv = $("<div id=appDiv" + i + " class=collapse aria-labelledby=headingOne data-parent=#accordionExampleMed></div>");
        $("#accordionExampleMed").append(collapseAppDiv);
        var appForm = $("<input type=text id=collapseApp" + i + " class=form-conrol></input>");
        $("#appDiv" + i).append(appForm);
        var appFormSub = $("<button type=button class=btn btn-primary id=appFormSubmit" + i + " >Update</button></div></div></div>");
        $("#appDiv" + i).append(appFormSub);
    };

    for (j = 0; j < Object.keys(patients.Diagnoses).length; j++) {
        console.log(Object.keys(patients.Diagnoses)[j]);
        console.log(patients.Diagnoses[Object.keys(patients.Diagnoses)[j]]);

        var diagBut = $("<button class=list-group-item type=button data-toggle=collapse data-target=#diagDiv" + i + " aria-expanded=true aria-controls=collapseOne id=buttonDiag" + i + " > " + "<Strong>Diagnosis</Strong>: " + Object.keys(patients.Diagnoses)[j] + " </button>");
        $("#accordionExampleMed").append(diagBut);
        var collapseDiagDiv = $("<div id=diagDiv" + i + " class=collapse aria-labelledby=headingOne data-parent=#accordionExampleMed></div>");
        $("#accordionExampleMed").append(collapseDiagDiv);
        var diagForm = $("<input type=text id=collapseDiag" + i + " class=form-conrol></input>");
        $("#diagDiv" + i).append(diagForm);
        var diagFormSub = $("<button type=button class=btn btn-primary id=diagFormSubmit" + i + " >Update</button></div></div></div>");
        $("#diagDiv" + i).append(diagFormSub);
    };

    for (h = 0; h < Object.keys(patients.PrescribedMedication).length; h++) {
        console.log(Object.keys(patients.PrescribedMedication)[h]);
        console.log(patients.PrescribedMedication[Object.keys(patients.PrescribedMedication)[h]]);

        var pmBut = $("<button class=list-group-item type=button data-toggle=collapse data-target=#pmDiv" + i + " aria-expanded=true aria-controls=collapseOne id=buttonPm" + i + " > " + "<Strong>Prescirbed Medication</Strong>: " + Object.keys(patients.PrescribedMedication)[h] + " </button>");
        $("#accordionExampleMed").append(pmBut);
        var collapsePmDiv = $("<div id=pmDiv" + i + " class=collapse aria-labelledby=headingOne data-parent=#accordionExampleMed></div>");
        $("#accordionExampleMed").append(collapsePmDiv);
        var pmForm = $("<input type=text id=collapsePm" + i + " class=form-conrol></input>");
        $("#pmDiv" + i).append(pmForm);
        var pmFormSub = $("<button type=button class=btn btn-primary id=pmFormSub" + i + " >Update</button></div></div></div>");
        $("#pmDiv" + i).append(pmFormSub);
    };



   //All accoridan buttons have this
   $("[id^='button']").css("width", "100%");
   $("[id^='button']").css("text-align", "left");
   ifClicked();
}


function refreshPage() {
    $("#row").remove();
}


ifClicked();
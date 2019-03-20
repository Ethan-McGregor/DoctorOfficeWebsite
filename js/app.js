'use strict';

//API routes
//updatePatient/<firstName>/<middleName>/<lastName>/<gender>/<DOB>/<address>/<phone>/<newInsuranceNum>/<oldInsuranceNum>
//findPatient/<firstName>/<middleName>/<lastName>/<insuranceNum>
//getPatientInfo/<insuranceNum>
//addPatient/<firstName>/<middleName>/<lastName>/<gender>/<DOB>/<address>/<phone>/<insuranceNum>
//removePatient/<insuranceNum>
//getFutureAppointments

//used to reference patient data for updating
var patientsInfo = "";
var patientDiagInfo = "";
var patientName = "";
var patientInsNum = "";
var patientIndex = "";
var allApps = "";
var isMed = false;
var isShowAll = false;
//Used to refresh page with current patient info
var usedRoute = "";

function ifClicked() {

    var pEvent = $("#Patient");
    var searchPatients = $("#SearchPatients");
    var addPatient = $("#addPatient");
    var removePatient = $("#removePatient");
    var about = $("#About");
    var allAppoinments = $("#allAppoinments");
    var upCardContainer = $("#upcomingAppoinment");

    pEvent.click(function (event) {
        isMed = false;
        isShowAll = false;
        refreshPage();
        createPatientForm();

    });
    about.click(function (event) {
        isMed = false;
        isShowAll = false;
        refreshPage();
        createAboutForm();

    });

    allAppoinments.click(function (event) {
        isMed = false;
        isShowAll = true;
        refreshPage();
        createAppointmentForm(false);

    });
    upCardContainer.click(function (event) {
        isMed = false;
        isShowAll = true;
        refreshPage();
        createAppointmentForm(true);

    });


    searchPatients.click(function (event) {
         patientsInfo = "";
         patientDiagInfo = "";
         patientName = "";
         patientInsNum = "";
         patientIndex = "";
         allApps = "";
         isMed = false;
         isShowAll = false;
         usedRoute = "";

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
        $("#zeroAlert").remove();
        var firstName = $("#addPatientFirstName")[0].value;
        var lastName = $("#addPatientLastName")[0].value;
        var middleName = $("#addPatientMiddleName")[0].value;
        var dateofBirth = $("#addPatientDOB")[0].value;
        var gender = $("#addPatientGender")[0].value;
        var phone = $("#addPatientPhone")[0].value;
        var insNum = $("#addPatientInsurance")[0].value;
        var address = $("#addPatientAddress")[0].value;
        var addInsAlert = $("<div class=alert role=alert id=insAleart >Please input a valid Insurance number I.E 9 digets</div>");
        var addFirstAlert = $("<div class=alert role=alert id=firstAleart >Please input a First Name</div>");
        var addLastAlert = $("<div class=alert role=alert id=lastAleart >Please input a Last Name</div>");
        var zero = $("<div class=alert role=alert id=zeroAleart >Please do not start the insurance num as a 0</div>");
        var addAddedPatientAlert = $("<div class=alert role=alert id=sAlert ><Strong>Sucess!</strong> You have added: " + firstName + " " + lastName + " as a patient.</div>");
        var errorCount = 0;
        if (firstName == "") {
            $("#addPatient").before(addFirstAlert);
            $("#firstAleart").addClass("alert-warning");
            errorCount += 1;
        };
        if (lastName == "") {
            $("#addPatient").before(addLastAlert);
            $("#lastAleart").addClass("alert-warning");
            errorCount += 1;
        };
        if (middleName == "") {
            middleName = "None";
        };
        if (dateofBirth == "") {
            dateofBirth = "None";
        };
        if (gender == "") {
            gender = "None";
        };
        if (phone == "") {
            phone = "None";
        };
        if (insNum == "" || insNum.length != 9 || isNaN(insNum)) {
            $("#addPatient").before(addInsAlert);
            $("#insAleart").addClass("alert-warning");
            errorCount += 1;
        };
        if (insNum[0] == 0) {
            console.log("Started with 0");
            $("#addPatient").before(zero);
            $("#zeroAleart").addClass("alert-warning");
            errorCount += 1;
        };
        if (address == "") {
            address = "None";
        };

        if (errorCount == 0) {
            var route = "/addPatient/" + firstName + "/" + middleName + "/" + lastName + "/" + gender + "/" + dateofBirth + "/" + address + "/" + phone + "/" + insNum;
            console.log(route);
            postData(route);
            $("#addPatient").before(addAddedPatientAlert);
            $("#sAlert").addClass("alert-success");
        }


    });

    removePatient.click(function (event) {
        $("#sAlertR").remove();
        $("#lastAleartB").remove();
        var insNum = $("#removePatientinsurance")[0].value;
        var removeAddedPatientAlert = $("<div class=alert role=alert id=sAlertR ><Strong>Sucess!</strong> You have removed: " + insNum + " as a patient.</div>");
        var bad = $("<div class=alert role=alert id=lastAleartB >Please input valid Insurance Number</div>");

        if (insNum.length != 9 || isNaN(insNum)) {
            $("#removePatient").before(bad);
            $("#lastAleartB").addClass("alert-warning");
        } else {
            $("#removePatient").before(removeAddedPatientAlert);
            $("#sAlertR").addClass("alert-success");
            var route = "/removePatient/" + insNum;
            postData(route);
        }

    });

    var dobFormSubmit = $("[id^='dobFormSubmit']");
    dobFormSubmit.click(function (event) {
        var index = event.target.parentElement.parentElement.parentElement.id.substring(9, event.target.parentElement.parentElement.parentElement.id.length);
        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        var value = $("#collapseDOB" + index)[0].value;
        var route = "/updatePatient/None/None/None/None/" + value + "/None/None/None/" + insNum;

        postData(route);


    });

    var genderFormSubmit = $("[id^='genderFormSubmit']");
    genderFormSubmit.click(function (event) {
        // var test = event.parent.id;
        console.log(event);
        var index = event.target.parentElement.parentElement.parentElement.id.substring(9, event.target.parentElement.parentElement.parentElement.id.length);
        console.log("index");

        console.log(index);
        console.log("index");


        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        var value = $("#collapseGender" + index)[0].value;
        var route = "/updatePatient/None/None/None/" + value + "/None/None/None/None/" + insNum;
        console.log(value);
        console.log(patientsInfo);
        postData(route);
    });

    var phoneFormSubmit = $("[id^='phoneFormSubmit']");
    phoneFormSubmit.click(function (event) {
        var index = event.target.parentElement.parentElement.parentElement.id.substring(9, event.target.parentElement.parentElement.parentElement.id.length);
        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        var value = $("#collapsePhone" + index)[0].value;
        var route = "/updatePatient/None/None/None/None/None/None/" + value + "/None/" + insNum;

        postData(route);

    });

    var insFormSubmit = $("[id^='insFormSubmit']");
    insFormSubmit.click(function (event) {
        $("#sAlertRT").remove();
        $("#lastAleartBT").remove();
        var index = event.target.parentElement.parentElement.parentElement.id.substring(9, event.target.parentElement.parentElement.parentElement.id.length);
        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        var value = $("#collapseIns" + index)[0].value;
        var route = "/updatePatient/None/None/None/None/None/None/None/" + value + "/" + insNum;
        var insAlertBad = $("<div class=alert role=alert id=lastAleartBT >Please input valid Insurance Number</div>");
        if (value.length != 9 || isNaN(value)) {
            $("#collapseIns" + index).before(insAlertBad);
            $("#lastAleartBT").addClass("alert-warning");
        } else {

            postData(route);
        }

    });

    var medDiag = $("[id^='card-link']");
    medDiag.click(function (event) {
        var index = event.target.id.substring(9, event.target.id.length);
        var insNum = patientsInfo[Number(index)].InsuranceNumber;
        patientInsNum = insNum;
        patientIndex = index;
        var route = "/getPatientInfo/" + insNum;
        patientName = patientsInfo[Number(index)].Name;
        getMedData(route);

    });

    var appUpdate = $("[id^='appFormSubmit']");
    appUpdate.click(function (event) {

        var index = event.target.id.substring(13, event.target.id.length);
        var value = $("#collapseApp" + index)[0].value;
        console.log(patientDiagInfo);
        var route = "/updateAppointment/" + Object.keys(patientDiagInfo.Appointments)[index] + "/" + value;
        isMed = true;
        isShowAll = false;
        postData(route);

    });
    var appAllUpdate = $("[id^='appAllFormSubmit']");
    appAllUpdate.click(function (event) {
        isMed = false;
        isShowAll = true;
        var index = event.target.id.substring(16, event.target.id.length);
        console.log(index);
        var value = $("#collapseApp" + index)[0].value;

        //     console.log( Object.keys(data)[0]);
        // console.log(data[Object.keys(data)[0]]);
        var route = "/updateAppointment/" + Object.keys(allApps)[index] + "/" + value;
        postData(route);

    });

    //'/addAppointment/<patientid>/<roomnumber>/<starttime>/<duration>/<description>'
    var appAddButton = $("[id^='addAppFormSub']");
    appAddButton.click(function (event) {
        $("#lastAleartBT").remove();
        $("#lastAleartDateBad").remove();
        $("#lastAleartDurBad").remove();
        $("#lastAleartGood").remove();
        var insNum = $("#insNumAddApp")[0].value;
        var starttime = $("#addAppFormTime")[0].value;
        var dur = $("#addAppFormDur")[0].value;
        var dis = $("#addAppFormType")[0].value;

        var route = "/addAppointment/" + insNum + "/101/" + starttime + "/" + dur + "/" + dis;

        var insAlertBad = $("<div class=alert role=alert id=lastAleartBT >Please input valid Insurance Number</div>");
        var alertGood = $("<div class=alert role=alert id=lastAleartGood >You have succesfully added an appointment!</div>");
        var dateAlertBad = $("<div class=alert role=alert id=lastAleartDateBad >Please input valid date</div>");
        var durAlertBad = $("<div class=alert role=alert id=lastAleartDurBad >Please input valid duration</div>");


        if (insNum.length != 9 || isNaN(insNum)) {
            $("#addAppFormSub").before(insAlertBad);
            $("#lastAleartBT").addClass("alert-warning");
        } else if (starttime.length != 19) {
            $("#addAppFormSub").before(dateAlertBad);
            $("#lastAleartDateBad").addClass("alert-warning");
        } else if (Number(dur) != 60 && Number(dur) != 90) {
            $("#addAppFormSub").before(durAlertBad);
            $("#lastAleartDurBad").addClass("alert-warning");
        } else {
            $("#addAppFormSub").before(alertGood);
            $("#lastAleartGood").addClass("alert-success");
            postData(route);
        }
    });

    //'/removeAppointment/<starttime>''
    var appRemoveButton = $("[id^='appRemove']");
    appRemoveButton.click(function (event) {

        var index = event.target.id.substring(9, event.target.id.length);
        var starttime = Object.keys(patientDiagInfo.Appointments)[index];
        var route = "/removeAppointment/" + starttime;
        isMed = true;
        isShowAll = false;

        postData(route);
    });

    //'/removeAppointment/<starttime>''
    var appRemoveAllButton = $("[id^='appAllRemove']");
    appRemoveAllButton.click(function (event) {

        var index = event.target.id.substring(12, event.target.id.length);
        console.log(index);
        var starttime = Object.keys(allApps)[index];
        var route = "/removeAppointment/" + starttime;
        isMed = false;
        isShowAll = true;

        postData(route);
    });
}

function getPatientData(route) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var patients = JSON.parse(this.responseText);
            usedRoute = route;
            if (isMed) {
                createMedicationDiagnosisCards(patients);
            } else if (isShowAll) {
                createAllAppointmentCards(patients);
            } else {
                createPatientCards(patients);
            }



        }

    };

    xmlhttp.open("GET", "http://23.152.224.38" + route, true);
    xmlhttp.setRequestHeader("Content-Type", "text/xml");
    xmlhttp.send();
}
function getMedData(route, isMed) {
    isMed = true;
    isShowAll = false;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var patients = JSON.parse(this.responseText);
            usedRoute = route;
            createMedicationDiagnosisCards(patients);

        }

    };

    xmlhttp.open("GET", "http://23.152.224.38" + route, true);
    xmlhttp.setRequestHeader("Content-Type", "text/xml");
    xmlhttp.send();
}

function getAllAppointment(route) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var patients = JSON.parse(this.responseText);
            usedRoute = route;
            allApps = patients;
            createAllAppointmentCards(patients);

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

    xmlhttp.open("POST", "http://23.152.224.38" + route, true);
    xmlhttp.setRequestHeader("Content-Type", "text/xml");
    xmlhttp.send();
}

function createPatientForm() {
    $("#pat").show();
    $("#about").hide();
    $("#allAppoinment").hide();
}
function createAboutForm() {
    $("#pat").hide();
    $("#about").show();
    $("#allAppoinment").hide();
}

function createAppointmentForm(allOrNone) {

    $("#allAppoinment").show();
    $("#pat").hide();
    $("#about").hide();
    var route = "";
    if (allOrNone) {
        route = "/getAppointments/All";

    } else {
        route = "/getAppointments/None";
    }
    console.log(route);
    getAllAppointment(route);
}


function createPatientCards(patients) {
    refreshPage();
    isMed = false;
    isShowAll = false;
    var i;
    var row = $("<div class=row id=row>")
    $("#cardContainer").append(row)
    patientsInfo = patients;
    console.log("IN CREATE OATENT CARD");
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

        var body = $("<div class=card-body id=card-bodysec" + i + ">");
        $("#card" + i).append(body);
        var card4 = $("<button type=button class=list-group-item id=card-link" + i + ">Diagnosis - Medication - Appointments</button></div></div></div></div>");
        $("#card-bodysec" + i).append(card4);
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
    isShowAll = false;
    isMed = true;
    refreshPage();

    patientDiagInfo = patients;
    var testRow = $("<div class=row id=row>")
    $("#cardContainer").append(testRow)
    var col = $("<div class=col-4 id=colM>");
    $("#row").append(col);
    $('#colM')
    var nameCared = $("<h5 class=card-title id=card-titleMeda" + i + " >" + patientName + "</h5>");
    $("#colM").append(nameCared);

    if (patients.Appointments) {
        var row = $("<div class=row id=rowa>")
        $("#cardContainer").append(row)
        for (i = 0; i < Object.keys(patients.Appointments).length; i++) {

            var col = $("<div class=col-4 id=colMeda" + i + ">");
            $("#rowa").append(col);
            var card = $("<div class=card id=cardMeda" + i + ">");
            $("#cardMeda" + i).css("width", "18em");
            $("#colMeda" + i).append(card);
            var card1 = $("<div class=card-body id=card-bodyMeda" + i + ">");
            $("#cardMeda" + i).append(card1);
            // var card2 = $("<h5 class=card-title id=card-titleMeda"+i+" >" + patientName + "</h5>");
            // $("#card-bodyMeda"+i).append(card2);
            var liOne = $("<ul class=list-group list-group-flush id=liOneMeda" + i + ">");
            $("#card-bodyMeda" + i).append(liOne);
            var test = $("<div class=accordion id=accordionExampleMeda" + i + ">");
            $("#card-bodyMeda" + i).append(test);
            // console.log(Object.keys(patients.Appointments)[i]);
            // console.log(patients.Appointments[Object.keys(patients.Appointments)[i]]);

            var appBut = $("<button class=list-group-item type=button data-toggle=collapse data-target=#addRemoveDiv" + i + " aria-expanded=true aria-controls=collapseTwo id=buttonApp" + i + " > " + "<Strong>Appointmnet</Strong>: " + Object.keys(patients.Appointments)[i] + " </button>");
            $("#accordionExampleMeda" + i).append(appBut);
            var addRemoveDiv = $("<div id=addRemoveDiv" + i + " class=collapse aria-labelledby=headingTwo data-parent=#accordionExampleMeda" + i + "></div>");
            $("#accordionExampleMeda" + i).append(addRemoveDiv)

            var remove = $("<button type=button class=btn id=appRemove" + i + " >Remove this Appointment</button>");
            $(remove).addClass("btn-danger");
            $("#addRemoveDiv" + i).append(remove);


            var dis = $("<li class=list-group-item type=button data-toggle=collapse data-target=#appDiv" + i + " aria-expanded=true aria-controls=collapseOne id=buttonApp" + i + " > <Strong>Description</Strong>: " + patients.Appointments[Object.keys(patients.Appointments)[i]].Description + " </li>");
            $("#accordionExampleMeda" + i).append(dis);
            var collapseAppDiv = $("<div id=appDiv" + i + " class=collapse aria-labelledby=headingOne data-parent=#accordionExampleMeda" + i + "></div>");
            $("#accordionExampleMeda" + i).append(collapseAppDiv);
            var appForm = $("<input type=text id=collapseApp" + i + " class=form-conrol></input>");
            $("#appDiv" + i).append(appForm);
            var appFormSub = $("<button type=button class=btn btn-primary id=appFormSubmit" + i + " >Update</button></div></div></div>");
            $("#appDiv" + i).append(appFormSub);
            var dur = $("<li class=list-group-item> <Strong>Duration</Strong>(Min): " + patients.Appointments[Object.keys(patients.Appointments)[i]].Duration + " </li>");
            $("#accordionExampleMeda" + i).append(dur);

        };
    };
    var row = $("<div class=row id=rowd>")
    $("#cardContainer").append(row)
    if (patients.Diagnoses) {
        for (j = 0; j < Object.keys(patients.Diagnoses).length; j++) {

            var col = $("<div class=col-4 id=colMedd" + j + ">");
            $("#rowd").append(col);
            var card = $("<div class=card id=cardMedd" + j + ">");
            $("#cardMedd" + j).css("width", "18em");
            $("#colMedd" + j).append(card);
            var card1 = $("<div class=card-body id=card-bodyMedd" + j + ">");
            $("#cardMedd" + j).append(card1);
            // var card2 = $("<h5 class=card-title id=card-titleMedd"+j+" >" + patientName + "</h5>");
            // $("#card-bodyMedd"+j).append(card2);
            var liOne = $("<ul class=list-group list-group-flush id=liOneMedd" + j + ">");
            $("#card-bodyMedd" + j).append(liOne);
            var test = $("<div class=accordion id=accordionExampleMedd" + j + ">");
            $("#card-bodyMedd" + j).append(test);

            // console.log(Object.keys(patients.Diagnoses)[j]);
            // console.log(patients.Diagnoses[Object.keys(patients.Diagnoses)[j]]);

            var diagBut = $("<button class=list-group-item type=button data-toggle=collapse  aria-expanded=true aria-controls=collapseOne id=buttonDiag" + j + " > " + "<Strong>Diagnosis</Strong>: " + Object.keys(patients.Diagnoses)[j] + " </button>");
            $("#accordionExampleMedd" + j).append(diagBut);
            var collapseDiagDiv = $("<div id=diagDiv" + i + " class=collapse aria-labelledby=headingOne data-parent=#accordionExampleMedd" + j + "></div>");
            $("#accordionExampleMedd" + j).append(collapseDiagDiv);
            var time = $("<li class=list-group-item> <Strong>Notes</Strong>: " + patients.Diagnoses[Object.keys(patients.Diagnoses)[j]].Remarks + " </li>");
            $("#buttonDiag" + j).append(time);

        };
    };
    var row = $("<div class=row id=rowg>")
    $("#cardContainer").append(row)
    if (patients.PrescribedMedication) {
        for (h = 0; h < Object.keys(patients.PrescribedMedication).length; h++) {
            // console.log(Object.keys(patients.PrescribedMedication)[h]);
            // console.log(patients.PrescribedMedication[Object.keys(patients.PrescribedMedication)[h]]);

            var col = $("<div class=col-4 id=colMedg" + h + ">");
            $("#rowg").append(col);
            var card = $("<div class=card id=cardMedg" + h + ">");
            $("#cardMedg" + h).css("width", "18em");
            $("#colMedg" + h).append(card);
            var card1 = $("<div class=card-body id=card-bodyMedg" + h + ">");
            $("#cardMedg" + h).append(card1);
            // var card2 = $("<h5 class=card-title id=card-titleMedg"+h+" >" + patientName + "</h5>");
            // $("#card-bodyMedg"+h).append(card2);
            var liOne = $("<ul class=list-group list-group-flush id=liOneMedg" + h + ">");
            $("#card-bodyMedg" + h).append(liOne);
            var test = $("<div class=accordion id=accordionExampleMedg" + h + ">");
            $("#card-bodyMedg" + h).append(test);


            var pmBut = $("<button class=list-group-item type=button data-toggle=collapse aria-expanded=true aria-controls=collapseOne id=buttonPm" + h + " > " + "<Strong>Prescirbed Medication</Strong>: " + Object.keys(patients.PrescribedMedication)[h] + " </button>");
            $("#accordionExampleMedg" + h).append(pmBut);
            var collapsePmDiv = $("<div id=pmDiv" + h + " class=collapse aria-labelledby=headingOne data-parent=#accordionExampleMed></div>");
            $("#accordionExampleMedg" + h).append(collapsePmDiv);
            var max = $("<li class=list-group-item> <Strong>Max Dosage</Strong>: " + patients.PrescribedMedication[Object.keys(patients.PrescribedMedication)[h]].MaxDosage + " </li>");
            $("#buttonPm" + h).append(max);
            var amount = $("<li class=list-group-item> <Strong>Prescribed Amount</Strong>: " + patients.PrescribedMedication[Object.keys(patients.PrescribedMedication)[h]].PrescribedAmount + " </li>");
            $("#buttonPm" + h).append(amount);
            var refill = $("<li class=list-group-item> <Strong>Refill</Strong>: " + patients.PrescribedMedication[Object.keys(patients.PrescribedMedication)[h]].Refill + " </li>");
            $("#buttonPm" + h).append(refill);

        };
    };

    //All accoridan buttons have this
    $("[id^='button']").css("width", "100%");
    $("[id^='button']").css("text-align", "left");
    ifClicked();
}

//'/getAppointments/<upcomingOnly>'
function createAllAppointmentCards(data) {
    isShowAll = true;
    isMed = false;
    refreshPage();
    var row = $("<div class=row id=row>")
    $("#appCardContainer").append(row)
    var i = 0;

    console.log(Object.keys(data)[0]);
    console.log(data[Object.keys(data)[0]]);
    jQuery.each(data, function (j, val) {

        var col = $("<div class=col-4 id=colMed" + i + ">");
        $("#row").append(col);
        var card = $("<div class=card id=cardMed" + i + ">");
        $("#cardMed" + i).css("width", "18em");
        $("#colMed" + i).append(card);
        var card1 = $("<div class=card-body id=card-bodyMed" + i + ">");
        $("#cardMed" + i).append(card1);
        var liOne = $("<ul class=list-group list-group-flush id=liOneMed" + i + " >");
        $("#card-bodyMed" + i).append(liOne);
        var test = $("<div class=accordion id=accordionExampleMed" + i + ">");
        $("#card-bodyMed" + i).append(test);

        var name = $("<li class=list-group-item type=button data-toggle=collapse data-target=#appDiv" + i + " aria-expanded=true aria-controls=collapseOne id=buttonApp" + i + " > <Strong>Patient</Strong>: " + val.Patient + " </li>");
        $("#accordionExampleMed" + i).append(name);
        var appBut = $("<button class=list-group-item type=button data-toggle=collapse data-target=#addRemoveDiv" + i + " aria-expanded=true aria-controls=collapseTwo id=buttonApp" + i + " > " + "<Strong>Appointmnet</Strong>: " + j + " </button>");
        $("#accordionExampleMed" + i).append(appBut);
        var addRemoveDiv = $("<div id=addRemoveDiv" + i + " class=collapse aria-labelledby=headingTwo data-parent=#accordionExampleMed" + i + "></div>");
        $("#accordionExampleMed" + i).append(addRemoveDiv)

        var remove = $("<button type=button class=btn id=appAllRemove" + i + " >Remove this Appointment</button>");
        $(remove).addClass("btn-danger");
        $("#addRemoveDiv" + i).append(remove);


        var dis = $("<li class=list-group-item type=button data-toggle=collapse data-target=#appDiv" + i + " aria-expanded=true aria-controls=collapseOne id=buttonApp" + i + " > <Strong>Description</Strong>: " + val.Description + " </li>");
        $("#accordionExampleMed" + i).append(dis);
        var collapseAppDiv = $("<div id=appDiv" + i + " class=collapse aria-labelledby=headingOne data-parent=#accordionExampleMed" + i + " ></div>");
        $("#accordionExampleMed" + i).append(collapseAppDiv);
        var appForm = $("<input type=text id=collapseApp" + i + " class=form-conrol></input>");
        $("#appDiv" + i).append(appForm);
        var appFormSub = $("<button type=button class=btn btn-primary id=appAllFormSubmit" + i + " >Update</button></div></div></div>");
        $("#appDiv" + i).append(appFormSub);
        var dur = $("<li class=list-group-item> <Strong>Duration</Strong>(Min): " + val.Duration + " </li>");
        $("#accordionExampleMed" + i).append(dur);
        i += 1;
    });
    ifClicked();
}

function refreshPage() {
    $("[id^='row']").remove();
}


ifClicked();
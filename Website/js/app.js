'use strict';
function ifClicked() {

    var dEvent = $("#Doctor");
    var pEvent = $("#Patient");
    var addDoc = $("#addDoc");
    var removeDoc = $("#removeDoc");
    var addDocQual = $("#addDocQual");
    var removeDocQual = $("#removeDocQual");
    //waits for a button to be clciked
    dEvent.click(function (event) {
      
        createDoctorForm();
       
    });

    pEvent.click(function (event) {
      
        createPatientForm();
        
    });

    addDoc.click(function (event) {
      
        createAddDoctorForm()
        
    });

    removeDoc.click(function (event) {
      
        createRemoveDoctorForm()
        
    });

    addDocQual.click(function (event) {
      
        createAddDoctorQualForm()
        
    });

    removeDocQual.click(function (event) {
      
        createRemoveDoctorQualForm()
        
    });
}

function createDoctorForm(){
    console.log("doc");
    $("#doc").show();
    $("#pat").hide();
}

function createAddDoctorForm(){
    console.log("doc");
 
}

function createRemoveDoctorForm(){
    console.log("doc");
 
}

function createAddDoctorQualForm(){
    console.log("doc");
 
}

function createRemoveDoctorQualForm(){
    console.log("doc");
 
}

function createPatientForm(){
    console.log("pat");

    $("#pat").show();
    $("#doc").hide();
}


ifClicked();
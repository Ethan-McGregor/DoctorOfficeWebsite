'use strict';
function ifClicked() {

    var dEvent = $("#Doctor");
    var pEvent = $("#Patient");
    //waits for a button to be clciked
    dEvent.click(function (event) {
      
        createDoctorForm();
       
    });

    pEvent.click(function (event) {
      
        createPatientForm();
        
    });
}

function createDoctorForm(){
    console.log("doc");
    $("#doc").show();
    $("#pat").hide();
}


function createPatientForm(){
    console.log("pat");

    $("#pat").show();
    $("#doc").hide();
}

function createGrid() {
   // $(".form-group").hide();



}

ifClicked();
const socket = io();

//Call to database
socket.emit('refreshlist');
var patient_select = [];
var therapist_select = [];
var datapatients ={};
var datatherapists={};

var use_swalker_boolean;


socket.on('patientdata',function(datapatient){
    for (i = 0; i < datapatient.length; i++){
        let patient = datapatient[i].NombrePaciente + " " + datapatient[i].ApellidoPaciente;
        patient_select.push(patient);  
    }

    for(var i in patient_select)
    { 
        document.getElementById("patients-list").innerHTML += "<option value='"+patient_select[i]+"'>"+patient_select[i]+"</option>"; 
    }
    datapatients=datapatient;
})

socket.on('therapistdata',function(datatherapist){
    //console.log(datatherapist);
    for (i = 0; i < datatherapist.length; i++){
        let therapist = datatherapist[i].NombreTerapeuta +" " +datatherapist[i].ApellidoTerapeuta;
        therapist_select.push(therapist);
    }
 
    for(var i in therapist_select)
    { 
        document.getElementById("therapists-list").innerHTML += "<option value='"+therapist_select[i]+"'>"+therapist_select[i]+"</option>"; 
    }
    datatherapists=datatherapist;
})

socket.on('set_patient_info', (patient_info) =>  {
	console.log(patient_info)
    var patient_age = patient_info.patient_age;
    var patient_weight = patient_info.patient_weight;
    var patient_leg_length = patient_info.patient_leg_length;
    var patient_hip_joint = patient_info.patient_hip_joint;
    var patient_surgery = patient_info.patient_surgery;
    var patient_estado_fisico = patient_info.estado_fisico;
    var patient_estado_cognitivo = patient_info.estado_cognitivo;
    document.getElementById("patient_age").value = patient_age.toString();
    document.getElementById("weight").value = patient_weight.toString();
    document.getElementById("leg_length").value = patient_leg_length.toString();
    document.getElementById("hip_joint").value = patient_hip_joint.toString();
    document.getElementById("surgery").value = patient_surgery.toString();
    document.getElementById("estado_fisico").value = patient_estado_fisico.toString();
    document.getElementById("estado_cognitivo").value = patient_estado_cognitivo.toString();

})

// Trigger modal
$( document ).ready( function() {
    $("#myModal").modal('show');
    $('.modal-backdrop').appendTo('.modal_area');
}); 

// Prevent disapearing 
$('#myModal').modal({
    backdrop: 'static',
    keyboard: false
})

window.onload = function(){ 
    // Updates the therapist and patient name according to the selected names in the "login" popup.
    
    document.getElementById("login_therapist_patient").onclick = function() {
        if  (document.getElementById("therapists-list").value == "no_choose" ||
             document.getElementById("patients-list").value == "no_choose") {   
                if  (document.getElementById("therapists-list").value == "no_choose") {
                    document.getElementById("empty_therapist").innerHTML = "Selecciona un terapeuta o registra uno nuevo."
                } else if  (document.getElementById("therapists-list").value != "no_choose") {
                    document.getElementById("empty_therapist").innerHTML = ""
                }                 
                if (document.getElementById("patients-list").value == "no_choose") {    
                    document.getElementById("empty_patient").innerHTML = "Selecciona un paciente o registra uno nuevo."
                } else if (document.getElementById("patients-list").value != "no_choose") {    
                    document.getElementById("empty_patient").innerHTML = ""
                } 
        } else {
            var therapist_name = document.getElementById("therapists-list");
            var patient_name = document.getElementById("patients-list");
            document.getElementById("therapist-name").innerHTML = therapist_name.value;
            document.getElementById("patient-name").innerHTML = patient_name.value;

            $('#myModal').modal('hide');
            console.log(document.getElementById("patients-list").value);
            socket.emit('get_patient_info', {
                patient_name: document.getElementById("patients-list").value
            })
        }        
    };

    /*
    document.getElementById("leg_length").onchange = function() {
        setGaitVelocity()
    };
    */
    
    // Updates the value of the "rom" range input
    /*
    document.getElementById("rom").onchange = function() {
        var rom = document.getElementById("rom").value;
        setGaitVelocity()
        document.getElementById("rom_value").innerHTML = rom + "%";
    };
    */

	
    // Updates the value of the "pbws" range input
    document.getElementById("pbws").onchange = function() {
        var pbws = document.getElementById("pbws").value;
        document.getElementById("pbws_value").innerHTML = pbws + "%";
    };
	
    // When the "save_settings" button is clicked, send all the configured parameters to the server 
    document.getElementById("save_settings").onclick = function() {
        // First click change colour
        if (document.getElementById("save_settings").value == "save_settings") {
			console.log("save settings clicked")
			// Añado esta variable para que en caso de que no haya observaciones se podrá acceder igual a la terapia.
			/*if (document.getElementById("observations").value == '' ){
				var no_observations = true;
			}
            if (!no_observations | no_observations) { 
                document.getElementById("save_settings").value = "continue";
                document.getElementById("save_settings").innerHTML = "Continuar";
                document.getElementById("save_settings").style.background = "#4CAF50"; 
            } else {
				var error = "Por favor, completa los siguientes campos: ";               
				error = error + " \n Observaciones";
                document.getElementById("fild-undefined").innerHTML = error;
                $("#modal-fild-undefined").modal('show');
                                
            }*/
            document.getElementById("save_settings").value = "continue";
			document.getElementById("save_settings").innerHTML = "Continuar";
			document.getElementById("save_settings").style.background = "#4CAF50";    
        // Second click send data
        } else if (document.getElementById("save_settings").value == "continue") {            
            // Send data to server
            var d = new Date();
            console.log("lets save settings");
            console.log(document.getElementById("velocity_value").value);
            socket.emit("settings:save_settings", {
                date: d.getTime(),
                therapist_name: document.getElementById("therapists-list").value,
                patient_name: document.getElementById("patients-list").value,
                patient_age: document.getElementById("patient_age").value,
                patient_weight: document.getElementById("weight").value,
                leg_length: document.getElementById("leg_length").value,
                use_swalker: use_swalker_boolean,
                gait_velocity: document.getElementById("velocity_value").value,
                pbws: document.getElementById("PBWS_value").value,
                //pbws: "0",
                //observations: document.getElementById("observations").value,
            });
            if (use_swalker_boolean){
                $("#modaltransferpatient").modal('show');
            } else {
				// Redirect to the therapy monitoring window
				location.replace("therapy_monitoring.html")
			}
        }
    };
    $('#b_ok').on('click', function() {
      // Redirect to the therapy monitoring window
        location.replace("therapy_monitoring.html")
    });
};

function setGaitVelocity(selectObject) {
    var gait_velocity = selectObject.value; 
    console.log(gait_velocity) 
    if (gait_velocity == "slow"){
        document.getElementById("velocity_ms_value").innerHTML = "0.08 (m/s)";
    } else if (gait_velocity == "normal"){
        document.getElementById("velocity_ms_value").innerHTML = "0.2 (m/s)";
    } else if (gait_velocity == "high"){
        document.getElementById("velocity_ms_value").innerHTML = "0.3 (m/s)";
    } else if (gait_velocity == "none"){
        document.getElementById("velocity_ms_value").innerHTML = " - ";
    }
 
}
function setPBWS(selectObject) {
    var pbws= selectObject.value;
    console.log(pbws);
    if (pbws == "0") {
        document.getElementById("pbws_value").innerHTML = "0%";
    } else if (pbws == "25") {
        document.getElementById("pbws_value").innerHTML = "25%";
    } else if (pbws == "50") {
        document.getElementById("pbws_value").innerHTML = "50%";
    } else if (pbws == "75") {
        document.getElementById("pbws_value").innerHTML = "75%";
    } else if (pbws == "100") {
        document.getElementById("pbws_value").innerHTML = "100%";
    }
}

socket.on("monitoring:connection_status", (data) => {
  let device = data.device;
  let status = data.status;
  console.log(data);
  if (device == "sw") {
    if (status == 0) {
      console.log("is con");
      //change button color and text;
      document.getElementById("connect_swalker").value = "on";
      document.getElementById("connect_swalker").innerHTML =
        "Desconectar SWalker";
      document.getElementById("connect_swalker").style.background = "#4eb14e";
      is_swalker_connected = true;
    } else {
      console.log("error connection");
      //change button color and text;
      document.getElementById("connect_swalker").value = "off";
      document.getElementById("connect_swalker").innerHTML =
        "Reconectar SWALKER";
      document.getElementById("connect_swalker").style.background = "#eb0a0a";
      is_swalker_connected = false;
    }
  } else if (device == "emg") {
    if (status == 0) {
      console.log("is con");
      //change button color and text;
      document.getElementById("enable_emg").value = "on";
      document.getElementById("enable_emg").innerHTML = "Desconectar EMG";
      document.getElementById("enable_emg").style.background = "#4eb14e";
      emg_enabled = true;
    } else if (status == 1) {
      console.log("emg disconnected");
      //change button color and text;
      document.getElementById("enable_emg").value = "off";
      document.getElementById("enable_emg").innerHTML = "Conectar EMG";
      document.getElementById("enable_emg").style.background = "#eb0a0a";
      emg_enabled = false;
    } else if (status <= 4) {
      console.log("error connection");
      //change button color and text;
      document.getElementById("enable_emg").value = "off";
      document.getElementById("enable_emg").innerHTML = "Reconectar EMG ";
      document.getElementById("enable_emg").style.background = "#eb0a0a";
      emg_enabled = false;
    }
  } else if (device == "vr") {
    if (status == 0) {
      console.log("is con");
      //change button color and text;
      document.getElementById("enable_vr").value = "on";
      document.getElementById("enable_vr").innerHTML = "VR Conectado";
      document.getElementById("enable_vr").style.background = "#4eb14e";
      // show game buttons
      document.getElementById("juego1").style.display = "block";
      document.getElementById("juego2").style.display = "block";
    } else {
      console.log("error connection");
      //change button color and text;
      document.getElementById("enable_vr").value = "off";
      document.getElementById("enable_vr").innerHTML = "VR Desconectado";
      document.getElementById("enable_vr").style.background = "#eb0a0a";
      // hide game buttons
      document.getElementById("juego1").style.display = "none";
      document.getElementById("juego2").style.display = "none";
    }
  } else if (device == "ble") {
    if (status == 0) {
      console.log("is con");
      //change button color and text;
      document.getElementById("connect_ble").value = "on";
      document.getElementById("connect_ble").innerHTML = "BLE Conectado";
      document.getElementById("connect_ble").style.background = "#4eb14e";
    } else {
      console.log("error connection");
      //change button color and text;
      document.getElementById("connect_ble").value = "off";
      document.getElementById("connect_ble").innerHTML = "BLE Desconectado";
      document.getElementById("connect_ble").style.background = "#eb0a0a";
    }
  }
});

function setUseSwalkerBoolean(selectObject) {
    var gait_velocity = selectObject.value; 
    console.log(gait_velocity) 
    if (gait_velocity == "yes"){
        use_swalker_boolean = true;
    } else if (gait_velocity == "no"){
        use_swalker_boolean = false;
        const $select = document.querySelector('#velocity_value');
        $select.value = 'none';
    } 
}

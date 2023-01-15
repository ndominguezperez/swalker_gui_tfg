const socket = io();

//Call to database
socket.emit('refreshlist');
var patient_select = [];
var therapist_select = [];
var datapatients ={};
var datatherapists={};

var use_swalker_boolean;

//** Global variables **//
var THERAPY_MONITOR_GOTO_LINK;

// SWalker variables 
var rom_right;
var rom_left;
var load;
var is_swalker_connected = false;
var patient_weight = 1;



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
    /*
    document.getElementById("pbws").onchange = function() {
        var pbws = document.getElementById("pbws").value;
        document.getElementById("pbws_value").innerHTML = pbws + "%";
    };
	*/

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

    socket.on("monitoring:jointData", (data) => {
      is_swalker_connected = data.swalker_connection_status;
      load = parseFloat(data.load);
      rom_right = data.rom_right;
      rom_left = data.rom_left;
      emg_enabled = data.emg_connection_status;
      emg_data = data.emg; // json
      // Avoid errors in case EMG is not connected
      if (
        emg_data.length == 0 ||
        JSON.parse(emg_data).filtered_emg == undefined ||
        !emg_enabled
      ) {
        filtered_emg = [0, 0, 0, 0, 0, 0, 0, 0];
        envelope_emg = [0, 0, 0, 0, 0, 0, 0, 0];
      } else {
        if (document.getElementById("enable_emg").value == "connecting") {
          document.getElementById("enable_emg").value = "on";
          document.getElementById("enable_emg").innerHTML = "Desconectar EMG";
          document.getElementById("enable_emg").style.background = "#fd4e4e";
        }
        filtered_emg = JSON.parse(emg_data).filtered_emg;
        envelope_emg = JSON.parse(emg_data).envelope_emg;
        //console.log(envelope_emg)
      }

      if (therapy_reestart) {
        // Initialize values when therapy reestarts
        therapy_reestart = false;
        emptyJointGraphs(); /////////////////////////////////////////////////////////////////////////////////// incomplete
        empty_envelope_graphs();
      }

      // Hide/show legend and data.
      if (
        document.getElementById("connect_swalker").value == "on" &&
        ctxrhipInstance.data.datasets[0].hidden == true
      ) {
        showDataset(ctxrhipInstance.data.datasets[0]);
        showDataset(ctxlhipInstance.data.datasets[0]);
        emptyJointGraphs();
      }

      // Keep the swalker button green and on while swalker is connected.
      if (
        (document.getElementById("connect_swalker").style.background !=
          "#4eb14e") &
        is_swalker_connected
      ) {
        document.getElementById("connect_swalker").value = "on";
        document.getElementById("connect_swalker").innerHTML =
          "Desconectar SWalker";
        document.getElementById("connect_swalker").style.background = "#4eb14e";
      }

      if (is_swalker_connected) {
        // show y axis label and ticks
        //update supported weight
        if (load < 0) {
          load = 0.0;
        } else if (load > 100) {
          load = 100.0;
        } else {
          document.getElementById("supported_weight").innerHTML =
            load.toFixed(2);
        }

        // update dataset rom values
        ctxrhipInstance.data.datasets[0].data.push(rom_right);
        ctxlhipInstance.data.datasets[0].data.push(rom_left);

        // update labels
        var segundos = Math.trunc(updateCounter_rom / 10);
        var milisegundos = Math.trunc(
          (updateCounter_rom / 10 - segundos) * 1000
        );
        var minutos = Math.trunc(segundos / 60);
        segundos = segundos - minutos * 60;
        if (Math.trunc(milisegundos).toString().length == 1) {
          milisegundos = "00" + milisegundos;
        } else if (Math.trunc(milisegundos).toString().length == 2) {
          milisegundos = "0" + milisegundos;
        } else if (Math.trunc(milisegundos).toString().length == 0) {
          milisegundos = "000";
        }
        var label = minutos + "-" + segundos + "-" + milisegundos;

        ctxlhipInstance.data.labels.push(label);
        ctxrhipInstance.data.labels.push(label);

        // delete first element to keep the graph in movement. PlotSampling data reception: 20Hz --> 2 segundos: 40muestras
        if (updateCounter_rom > 49) {
          ctxrhipInstance.data.labels.shift();
          ctxlhipInstance.data.labels.shift();

          // y_value
          ctxrhipInstance.data.datasets[0].data.shift();
          ctxlhipInstance.data.datasets[0].data.shift();
        }
      } else {
        // ROM
        ctxlhipInstance.data.labels = ["00:00", "00:01"];
        ctxrhipInstance.data.labels = ["00:00", "00:01"];
      }

      // add data to envelope plots. This data will be shown either the therapy is started or not
      if (rendered) {
        //tab EMG envelope
        if (emg_enabled) {
          //console.log(updateCounter_right_envelope);
          //update labels envelop
          var segundos = Math.trunc(updateCounter_emg / 10);
          var milisegundos = (updateCounter_emg / 10) * 1000 - segundos * 1000;
          var minutos = Math.trunc(segundos / 60);
          segundos = segundos - minutos * 60;

          if (Math.trunc(milisegundos).toString().length == 1) {
            milisegundos = "00" + milisegundos;
          } else if (Math.trunc(milisegundos).toString().length == 2) {
            milisegundos = "0" + milisegundos;
          } else if (Math.trunc(milisegundos).toString().length == 0) {
            milisegundos = "000";
          }
          var label = minutos + "-" + segundos + "-" + milisegundos;

          ctxrfleftInstance.data.labels.push(label);
          ctxrfrightInstance.data.labels.push(label);
          ctxbfleftInstance.data.labels.push(label);
          ctxbfrightInstance.data.labels.push(label);
          ctxtarightInstance.data.labels.push(label);
          ctxtaleftInstance.data.labels.push(label);
          ctxgmleftInstance.data.labels.push(label);
          ctxgmrightInstance.data.labels.push(label);

          ctxrfrightInstance.data.datasets[0].data.push(envelope_emg[0] * 1000);
          ctxbfrightInstance.data.datasets[0].data.push(envelope_emg[1] * 1000);
          ctxtarightInstance.data.datasets[0].data.push(envelope_emg[2] * 1000);
          ctxgmrightInstance.data.datasets[0].data.push(envelope_emg[3] * 1000);
          ctxrfleftInstance.data.datasets[0].data.push(envelope_emg[4] * 1000);
          ctxbfleftInstance.data.datasets[0].data.push(envelope_emg[5] * 1000);
          ctxtaleftInstance.data.datasets[0].data.push(envelope_emg[6] * 1000);
          ctxgmleftInstance.data.datasets[0].data.push(envelope_emg[7] * 1000);

          if (updateCounter_emg > 49) {
            ctxrfleftInstance.data.labels.shift();
            ctxrfrightInstance.data.labels.shift();
            ctxbfrightInstance.data.labels.shift();
            ctxbfleftInstance.data.labels.shift();
            ctxtaleftInstance.data.labels.shift();
            ctxtarightInstance.data.labels.shift();
            ctxgmrightInstance.data.labels.shift();
            ctxgmleftInstance.data.labels.shift();

            ctxrfleftInstance.data.datasets[0].data.shift();
            ctxrfrightInstance.data.datasets[0].data.shift();
            ctxbfleftInstance.data.datasets[0].data.shift();
            ctxbfrightInstance.data.datasets[0].data.shift();
            ctxtarightInstance.data.datasets[0].data.shift();
            ctxtaleftInstance.data.datasets[0].data.shift();
            ctxgmleftInstance.data.datasets[0].data.shift();
            ctxgmrightInstance.data.datasets[0].data.shift();
          }
        } else {
          ctxrfleftInstance.data.labels = ["00:00", "00:01"];
          ctxrfrightInstance.data.labels = ["00:00", "00:01"];
          ctxbfleftInstance.data.labels = ["00:00", "00:01"];
          ctxbfrightInstance.data.labels = ["00:00", "00:01"];
          ctxtaleftInstance.data.labels = ["00:00", "00:01"];
          ctxtarightInstance.data.labels = ["00:00", "00:01"];
          ctxgmleftInstance.data.labels = ["00:00", "00:01"];
          ctxgmrightInstance.data.labels = ["00:00", "00:01"];
        }
      }

      //// update counters and refresh graphs
      ///////////////////////////////////////
      updateCounter_rom++;

      // ROM
      ctxrhipInstance.update();
      ctxlhipInstance.update();

      //EMG
      if (rendered) {
        updateCounter_emg++;

        ctxrfleftInstance.update();
        ctxrfrightInstance.update();
        ctxbfleftInstance.update();
        ctxbfrightInstance.update();
        ctxtaleftInstance.update();
        ctxtarightInstance.update();
        ctxgmleftInstance.update();
        ctxgmrightInstance.update();
      }
    });

    document.getElementById("connect_swalker").onclick = function () {
      // Start emg connection
      console.log(document.getElementById("connect_swalker").value);
      if (document.getElementById("connect_swalker").value == "off") {
        document.getElementById("connect_swalker").value = "connecting";
        document.getElementById("connect_swalker").style.background = "#808080";
        document.getElementById("connect_swalker").innerHTML = "Conectando...";
        socket.emit("monitoring:connect_swalker");

        // Stop emg_connection
      } else if (document.getElementById("connect_swalker").value == "on") {
        console.log("clicked and swalker value on, should be disconnected");
        document.getElementById("connect_swalker").value = "off";
        document.getElementById("connect_swalker").innerHTML =
          "Conectar SWalker";
        document.getElementById("connect_swalker").style.background = "#808080";
        socket.emit("monitoring:disconnect_swalker");
        emptyJointGraphs();
        empty_envelope_graphs();
      } else if (
        document.getElementById("connect_swalker").value == "connecting"
      ) {
        document.getElementById("connect_swalker").value = "off";
        document.getElementById("connect_swalker").innerHTML =
          "Conectar SWalker";
        document.getElementById("connect_swalker").style.background = "#eb0a0a";
        socket.emit("monitoring:disconnect_swalker");
        emptyJointGraphs();
        empty_envelope_graphs();
      }
    };
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



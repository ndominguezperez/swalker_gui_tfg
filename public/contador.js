var empezado=false;

document.getElementById("etiempo").onclick = function () {
    empezado = true;
    setTimer(empezado);
};
document.getElementById("ttiempo").onclick = function () {
    empezado = false;
    setTimer(empezado);
};

// CONTADOR
var minutos = 0;
var segundos = 0;
function setTimer(empezado) {
    if (empezado == true) {
        segundos = 0;
        minutos = 0;
    cargarSegundo(empezado);
    }else{
    cargarSegundo(empezado);
    }
}

  //Segundos
function cargarSegundo() {
    let txtSegundos;
        if (segundos > 59) {
        segundos = 0;
        }
        //mostar los segundos por pantalla
        if (segundos < 10) {
        txtSegundos = `0${segundos}`;
        } else {
        txtSegundos = segundos;
        }
        if(empezado==true){
        document.getElementById("segundos").innerHTML = " : " + txtSegundos;
        segundos++;
        cargarMinutos(segundos);
        }else{
            return;
        }
        
    
}

  //Minutos
function cargarMinutos(segundos) {
    let txtMinutos;

    if (segundos == 60 && minutos !== 59) {
        setTimeout(() => {
        minutos++;
    }, 500);
    } else if (segundos == 60 && minutos == 59) {
        setTimeout(() => {
        minutos = 0;
        }, 500);
    }
    //mostrar minutos en pantalla
    if (minutos < 10) {
    txtMinutos = `0${minutos}`;
    } else {
    txtMinutos = minutos;
    }
    document.getElementById("minutos").innerHTML = txtMinutos;
}

//Ejecutamos cada segundo
setInterval(cargarSegundo, 1000);


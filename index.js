const texto = document.getElementById('texto');
const correccion = document.getElementById('correccion');
const respuesta = document.getElementById('respuesta');
const boton = document.getElementById('boton1');
const desplegable = document.getElementById('desplegable');
const tabla = document.getElementById('tabla');

let estado = 0; 
let nombrePiloto = "";
let nombrePiloto2 = "";
let apellidoPiloto = "";
let apellidoPiloto2 = "";
let posicionPiloto = "";
let puntosPiloto = "";
let nacionalidadPiloto = "";
let dorsal = 0;

const mostrarPregunta = function(nombre, apellido) {
    correccion.textContent = "";
    texto.textContent = `¿Qué dorsal lleva en su monoplaza ${nombre} ${apellido}?`; //importante el uso de `` en vez de ''
}

const actualizarPiloto = function(nombre, apellido){
    nombrePiloto = nombre;
    apellidoPiloto = apellido;
}

const actualizarDorsal = function(numero){
    dorsal = numero;
}

const nuevaPregunta = function() { //llamada API then/catch
        fetch(`https://ergast.com/api/f1/2023/drivers.json`).then(respuesta => { 
          if (respuesta.ok) {
            return respuesta.json(); 
          }
        }).then(objeto => {
          const num = Math.floor(Math.random() * 22);
          nombrePiloto = objeto.MRData.DriverTable.Drivers[num].givenName;
          apellidoPiloto = objeto.MRData.DriverTable.Drivers[num].familyName;
          dorsal = objeto.MRData.DriverTable.Drivers[num].permanentNumber;
          mostrarPregunta(nombrePiloto, apellidoPiloto);
        }).catch(error => mostrarPregunta('Error'));
      }

const actualizarDesplegable = async function(valor){ //llamada API async/wait
    try{
        const respuesta = await fetch(`https://ergast.com/api/f1/${valor}/driverStandings.json`);
        if (respuesta.ok){ //verifica si la respuesta es correcta
            const objeto2 = await respuesta.json(); //convierte la respuesta a formato JSON

            while (tabla.rows.length > 1) {
                tabla.deleteRow(1);
            }

            let long = objeto2.MRData.StandingsTable.StandingsLists[0].DriverStandings.length;
            let index2 = 0;
            while(index2<long){
                posicionPiloto = objeto2.MRData.StandingsTable.StandingsLists[0].DriverStandings[index2].position;
                nombrePiloto2 = objeto2.MRData.StandingsTable.StandingsLists[0].DriverStandings[index2].Driver.givenName;
                apellidoPiloto2 = objeto2.MRData.StandingsTable.StandingsLists[0].DriverStandings[index2].Driver.familyName;
                puntosPiloto = objeto2.MRData.StandingsTable.StandingsLists[0].DriverStandings[index2].points;
                nacionalidadPiloto = objeto2.MRData.StandingsTable.StandingsLists[0].DriverStandings[index2].Driver.nationality;
                let nombreCompleto = `${nombrePiloto2} ${apellidoPiloto2}`;

                var nuevaFila = tabla.insertRow();
                var celdaPosicion = nuevaFila.insertCell(0);
                var celdaNombre = nuevaFila.insertCell(1);
                var celdaNacionalidad = nuevaFila.insertCell(2);
                var celdaPuntos = nuevaFila.insertCell(3);

                celdaPosicion.textContent = posicionPiloto;
                celdaNombre.textContent = nombreCompleto;
                celdaNacionalidad.textContent = nacionalidadPiloto;
                celdaPuntos.textContent = puntosPiloto;
                index2++;
            }
            return objeto2;
        }
    }
    catch (error) { 

    }
    
}

const verificar = function(){
    if(!estado){
        if(dorsal == respuesta.value){
            correccion.textContent = "Respuesta correcta";
            correccion.style.color = 'green';
        }
        else{
            correccion.textContent = `Respuesta incorrecta, lleva el dorsal ${dorsal}`;
            correccion.style.color = 'red';
        }
        boton.textContent = 'Siguiente pregunta'
        estado = 1;
    } else{
        correccion.textContent = "";
        boton.textContent = "Verificar";
        respuesta.value = "";
        nuevaPregunta();
        estado = 0;
    }
}

const iniciarDesplegable = function(){
    let index = 2023;
    while(index>=1950){
        var nuevaOpcion = document.createElement('option');
        nuevaOpcion.textContent = index;
        nuevaOpcion.value = index;
        desplegable.add(nuevaOpcion);
        index = index - 1;
    }
    const valor = desplegable.value;
    actualizarDesplegable(valor);
}

desplegable.onchange = function(){
    const valor2 = desplegable.value;
    actualizarDesplegable(valor2);
}

window.onload = function(){
    nuevaPregunta();
    iniciarDesplegable();
}
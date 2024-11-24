
let preguntas = [];
let preguntaActual = 0;
let puntaje = 0;
let tiempoRestante = 10; 
let intervalo; 

async function cargarPreguntas() {
    const response = await fetch("data/preguntas.json");
    const data = await response.json();
    preguntas = data.preguntas;
    mostrarPregunta();
    iniciarTemporizador();
    actualizarProgreso();
}

function mostrarPregunta() {
    const pregunta = preguntas[preguntaActual];
    const contenedorPregunta = document.querySelector("#pregunta");
    const contenedorOpciones = document.querySelector("#opciones");
    const mensajeTiempo = document.querySelector("#mensaje-tiempo");

    contenedorPregunta.textContent = `${preguntaActual + 1}. ${pregunta.texto}`;
    contenedorOpciones.innerHTML = "";
    mensajeTiempo.textContent = ""; 

    pregunta.opciones.forEach((opcion, index) => {
        const div = document.createElement("div");
        div.classList.add("opcion");

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "opcion";
        input.value = index;

        input.addEventListener("change", () => {
            document.querySelector("#siguiente").disabled = false;
        });

        const label = document.createElement("label");
        label.textContent = opcion;

        div.appendChild(input);
        div.appendChild(label);
        contenedorOpciones.appendChild(div);
    });

    document.querySelector("#siguiente").disabled = true;

    
    actualizarProgreso();
}


function evaluarRespuesta() {
    const opciones = document.getElementsByName("opcion");
    let seleccion = -1;
    opciones.forEach((opcion, index) => {
        if (opcion.checked) {
            seleccion = index;
        }
    });

    if (seleccion === preguntas[preguntaActual].respuestaCorrecta) {
        puntaje++;
    }
}


function manejarTiempoAgotado() {
    const mensajeTiempo = document.querySelector("#mensaje-tiempo");
    mensajeTiempo.textContent = "¡Tiempo agotado! Pasando a la siguiente pregunta...";
    evaluarRespuesta(); 
    setTimeout(() => {
        avanzarPregunta(); 
    }, 1500); 
}


function avanzarPregunta() {
    preguntaActual++;
    if (preguntaActual < preguntas.length) {
        mostrarPregunta();
        iniciarTemporizador(); 
    } else {
        mostrarResultados();
        clearInterval(intervalo); 
    }
}


function mostrarResultados() {
    const quiz = document.querySelector("#quiz");
    const resultado = document.querySelector("#resultado");
    const calificacion = document.querySelector("#calificacion");

    quiz.style.display = "none";
    resultado.style.display = "block";

   
    document.querySelector("#progreso-llenado").style.width = "100%";

    calificacion.textContent = `Tu puntuación es ${puntaje}/${preguntas.length}`;
}


function iniciarTemporizador() {
    tiempoRestante = 10; 
    document.querySelector("#tiempo").textContent = tiempoRestante;

    
    clearInterval(intervalo);

    intervalo = setInterval(() => {
        tiempoRestante--;
        document.querySelector("#tiempo").textContent = tiempoRestante;

        if (tiempoRestante === 0) {
            clearInterval(intervalo); 
            manejarTiempoAgotado();
        }
    }, 1000);
}


function actualizarProgreso() {
    const progreso = (preguntaActual / preguntas.length) * 100;
    document.querySelector("#progreso-llenado").style.width = `${progreso}%`;
}


document.querySelector("#siguiente").addEventListener("click", () => {
    evaluarRespuesta();
    avanzarPregunta();
});


document.addEventListener("DOMContentLoaded", () => {
    cargarPreguntas();
});

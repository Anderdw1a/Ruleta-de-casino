const iniciar = document.querySelector("#btnIniciar")
const apustasBtnContainer = document.querySelector("#apuestasContainer")
iniciar.addEventListener("click", () => {
    apustasBtnContainer.classList.toggle("hidden")
    iniciar.classList.toggle("hidden")
})

const btnApuestas = document.querySelectorAll("apuestas-btn")
const negros = [15, 4, 2, 17, 6, 13, 11, 8, 10, 24, 33, 20, 31, 22, 29, 28, 35, 26]
const rojos = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]

const ordenRuleta = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
    5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
];
const lanzarNumeroRamdom = () => {

    let numeroRandom = Math.floor(Math.random() * 37);

    return numeroRandom
}


const roulette = document.getElementById('roulette');
const totalNumeros = ordenRuleta.length;
const anguloPorNumero = 360 / totalNumeros;
ordenRuleta.forEach((numero, index) => {
    const sector = document.createElement('div');
    sector.className = 'sector';
    if (rojos.includes(numero)) {
        let color = "rojo";
        sector.classList.add(color);

    } else if (negros.includes(numero)) {
        let color = "negro";
        sector.classList.add(color);
    } else {
        let color = "verde";
        sector.classList.add(color);
    }

    const rotacion = anguloPorNumero * index;
    sector.style.transform = `rotate(${rotacion}deg) skewY(-${90 - anguloPorNumero}deg)`;
    const numeroElement = document.createElement('span');
    numeroElement.textContent = numero;
    numeroElement.className = 'numero';
    numeroElement.style.transform = `skewY(${90 - anguloPorNumero}deg) rotate(${anguloPorNumero / 2}deg)`;

    sector.appendChild(numeroElement);
    roulette.appendChild(sector);
});

let girando = false;
let rotacionActual = 0
function girarRuleta(numeroRandom) {
    if (girando) return;
    girando = true;

    // Resetear ruleta inmediatamente sin transición
    roulette.style.transition = 'none';
    roulette.style.transform = 'rotate(0deg)';

    // Forzar el reflow del navegador
    roulette.offsetHeight;

    // Restaurar la transición
    setTimeout(() => {
        roulette.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';

        // Encontrar el índice del número ganador en ordenRuleta
        const indiceGanador = ordenRuleta.indexOf(numeroRandom);

        // Calcular el ángulo del número ganador
        const anguloGanador = anguloPorNumero * indiceGanador;

        // Añadir vueltas completas (entre 5 y 7 vueltas)
        const vueltasCompletas = 5 + Math.floor(Math.random() * 3);
        const rotacionTotal = (360 * vueltasCompletas) + (360 - anguloGanador) - anguloPorNumero / 2;

        // Aplicar la rotación desde 0
        roulette.style.transform = `rotate(${rotacionTotal}deg)`;
    }, 50);

    // Esperar a que termine la animación
    return new Promise(resolve => {
        setTimeout(() => {
            girando = false;
            resolve();
        }, 4000); // 4 segundos (coincide con el transition del CSS)
    });
}

const jugador = {
    dinero: 0,
    fichas: 0,
    decidirDinero: function () {
        this.dinero = Number(prompt("Cuanto dinero quieres intercambiar"))
        while (isNaN(this.dinero) || !Number.isInteger(this.dinero)) {
            alert("Numero invalido")
            this.dinero = Number(prompt("Mete un numero para intercambiar el dinero por fichas"))
        }
        while (this.dinero <= 0) {
            this.dinero = 0
            alert("No se admite dinero negativo o 0")
            this.dinero = Number(prompt("Mete un numero para intercambiar el dinero por fichas"))
        }
        const saldo = document.querySelector("#saldoActual")
        saldo.textContent = jugador.dinero

    },
    decidirFichas: function () {
        if (this.dinero <= 0) {
            return false
        }
        this.fichas = Number(prompt("Cuantas fichas quieres apostar"))
        while (isNaN(this.fichas) || !Number.isInteger(this.fichas)) {
            alert("Numero invalido")
            this.fichas = Number(prompt("Mete un numero para apostar fichas"))
        }
        if (this.fichas <= this.dinero && this.fichas > 0) {
            return true
        } else {
            this.fichas = this.dinero
            alert("No tienes dinero como para apostar tantas fichas")
        }
    }
}

function elegirApuesta(tipo) {
    if (!girando) {
        jugarRuleta(tipo);
    }
}
async function jugarRuleta(tipo) {
    let numeroRuleta = lanzarNumeroRamdom();
    switch (tipo) {
        case "pleno":
            let numJugador = pedirNumJugadorPleno()
            await girarRuleta(numeroRuleta);
            resultadoPleno(numeroRuleta, numJugador)
            break;
        case "zero":
            let es0 = validar0(numeroRuleta)
            await girarRuleta(numeroRuleta);
            resultado0(es0)
            break;
        case "docena":
            let docena = pedirValidarDocena()
            await girarRuleta(numeroRuleta);
            resultadoDocena(numeroRuleta,docena)
            break;
        case "color":
            let color = pedirValidarColor()
            await girarRuleta(numeroRuleta);
            resultadoColor(numeroRuleta,color)
            break;
        case "par":
            let esPar = pedirValidarPar()
            await girarRuleta(numeroRuleta);
            resultadoPar(numeroRuleta,esPar)
            break;
        case "bajo":
            let esBajo = pedirNumBajoAlto()
            await girarRuleta(numeroRuleta);
            resultadobajoAlto(numeroRuleta,esBajo)
            break;
        default:
            alert("No has metido una opcion valida")
    }

}

function pedirNumJugadorPleno() {
    let numeroJugador = Number(prompt("Elige número del 1 al 36"))
    while (isNaN(numeroJugador) || !Number.isInteger(numeroJugador) ||
        numeroJugador < 1 || numeroJugador > 36) {
        alert("Número inválido. Debe ser un entero entre 1 y 36");
        numeroJugador = Number(prompt("Elige número del 1 al 36"));
    }
    return numeroJugador;
}
function resultadoPleno(numeroRandom, numero) {
    const BONIFICACION_PLENO = 35
    alert("Tu número es: " + numero + " y el número de la ruleta es: " + numeroRandom)
    if (numeroRandom == numero) {
        alert("¡PLENO! Has ganado");
        darDinero(BONIFICACION_PLENO);
    } else {
        alert("Perdiste. Era el " + numeroRandom);
        quitarDinero();
    }
    tieneDinero()
}

function validar0(numero) {
    let zero 
    if (numero == 0) {
      zero= true;
    } else {
      zero= false;
    }
   return zero
}
function resultado0(boolean) {
    const bonificacion_0 = 37
    if (boolean==true) {
        alert("Has ganado , que suerte!!!")
        darDinero(bonificacion_0)
    } else {
        quitarDinero()
        alert("Perdiste")
    }
    tieneDinero()
}

function pedirValidarDocena() {
    let docena = Number(prompt("Elige una docena (1,2 o 3)"))
    while (isNaN(docena)) {
        alert("Numero invalido")
        docena = Number(prompt("Elige entre 1 y 3"))
    }
    while (docena > 3 || docena < 1) {
        docena = Number(prompt("Error.Elige una docena valida (1,2 o 3)"))
    }
    return docena
}
function resultadoDocena(numeroRandom,numero) {
    const bonificacion_docena = 3
    if (numero == 1) {
        if (numeroRandom >= 1 && numeroRandom <= 12) {
            alert("La docena es 1 y la docena que has elegido es " + numero)
            darDinero(bonificacion_docena)
        } else {
            alert("La docena no es la correcta")
            quitarDinero()
        }
    } else if (numero == 2) {
        if (numeroRandom >= 13 && numeroRandom <= 24) {
            alert("La docena es 2 y la docena que has elegido es " + numero)
            darDinero(bonificacion_docena)
        } else {
            alert("La docena no es la correcta")
            quitarDinero()
        }
    } else {
        if (numeroRandom >= 25 && numeroRandom <= 36) {
            alert("La docena es 3 y la docena que has elegido es " + numero)
            darDinero(bonificacion_docena)
        } else {
            alert("La docena no es la correcta")
            quitarDinero()
        }
    }
    tieneDinero()
}
function pedirValidarColor(numeroRandom) {
    if (numeroRandom === 0) {
        alert("Ha salido 0. Pierdes automáticamente");
        quitarDinero();
        return;
    }
    let numcolor = prompt("Dime un color").toLowerCase()
    return numcolor
}
function resultadoColor(numeroRandom,numcolor) {
    let bonificacion_color = 2
    switch (numcolor) {
        case "rojo":
            if (rojos.includes(numeroRandom)) {
                alert("El numero que ha salido es " + numeroRandom + " es rojo")
                darDinero(bonificacion_color)
            } else {
                alert("Color equivocado el numero fue " + numeroRandom + " el color es negro")
                quitarDinero()
            }
            break;
        case "negro":
            if (negros.includes(numeroRandom)) {
                alert("El numero que ha salido es " + numeroRandom + " es negro")
                darDinero(bonificacion_color)
            } else {
                alert("Color equivocado el numero fue " + numeroRandom + " el color es rojo")
                quitarDinero()
            }
            break;
        default:
            alert("Error.Color invalido")
            break;
    }
    tieneDinero()
}
function pedirValidarPar() {
    let esP = prompt("Dime par o impar").toLowerCase()
    return esP
}
function resultadoPar(numeroRandom,esP) {
    switch (esP) {
        case "par":
            esPar(numeroRandom)
            break;
        case "impar":
            esImpar(numeroRandom)
            break;
        default:
            alert("Error.Solo se admiten par o impar")
            par(numeroRandom)
            break;
    }
}
function esPar(numeroRandom) {
    let bonificacion_par = 2
    if (numeroRandom % 2 == 0 && numeroRandom > 0) {
        alert("El numero " + numeroRandom + " es par")
        darDinero(bonificacion_par)
    }
    else {
        alert("No es par el numero que ha salido")
        quitarDinero()
    }
}
function esImpar(numeroRandom) {
    let bonificacion_impar = 2
    if (numeroRandom % 2 !== 0 && numeroRandom > 0) {
        alert("El numero " + numeroRandom + " es impar")
        darDinero(bonificacion_impar)
    }
    else {
        alert("No es impar el numero que ha salido")
        quitarDinero()
    }
}

function pedirNumBajoAlto(numeroRandom) {
    let tipo = prompt("Dime bajo o alto").toLowerCase()
    if (numeroRandom === 0) {
        alert("Ha salido 0. Pierdes automáticamente");
        quitarDinero();
        return;
    }
    return tipo
}
function resultadobajoAlto(numeroRandom,tipo) {
    let bonificacion_bajoAlto = 2
    switch (tipo) {
        case "bajo":
            if (numeroRandom >= 1 && numeroRandom <= 18 && tipo == "bajo") {
                alert("El numero que ha salido es " + numeroRandom + " es bajo")
                darDinero(bonificacion_bajoAlto)
            }
            else {
                alert("Perdiste, el numero que ha salido es alto")
                quitarDinero()
            }
            break;
        case "alto":
            if (numeroRandom >= 19 && numeroRandom <= 36 && tipo == "alto") {
                alert("El numero que ha salido es " + numeroRandom + " es alto")
                darDinero(bonificacion_bajoAlto)
            }
            else {
                alert("Perdiste, el numero que ha salido es bajo")
                quitarDinero()
            }
            break;
        default:
            alert("Solo existe bajo o alto")
            pedirNumBajoAlto(numeroRandom)
            resultadobajoAlto(numeroRandom,tipo)
            break;
    }
}

function darDinero(bonificacionJuego) {
    jugador.dinero += (jugador.fichas * bonificacionJuego)
    document.getElementById('saldoActual').textContent = jugador.dinero;

}
function quitarDinero() {
    jugador.dinero -= jugador.fichas
    document.getElementById('saldoActual').textContent = jugador.dinero;
}
function tieneDinero() {
    if (jugador.dinero == 0) {
        const volverAJugar = document.querySelector(".containerSinDinero")
        volverAJugar.classList.toggle("hidden")
        apustasBtnContainer.classList.toggle("hidden")

    }
}
function mensajeCagon() {
    alert("Eres un cagon")
}
function volverJugar() {
    const volverAJugar = document.querySelector(".containerSinDinero")
    volverAJugar.classList.toggle("hidden")
    iniciar.classList.toggle("hidden")
}
    
// let jugadorQuiereJugar = "si"

// jugador.decidirDinero()
// while (jugadorQuiereJugar.toLowerCase().trim() == "si" && jugador.dinero > 0) {
//     const puedeJugar = jugador.decidirFichas()
//     if (puedeJugar) {
//         jugarRuleta()
//     }
//     if (jugador.dinero == 0) {
//         let quiereVolverAJugar = prompt("Quieres meter dinero").toLowerCase()
//         if (quiereVolverAJugar == "si") {
//             jugador.decidirDinero()
//         }
//         else {
//             break
//         }
//     } else {

//         jugadorQuiereJugar = prompt("¿Quieres volver a jugar? si o no").toLowerCase()
//     }
// }
// alert("Gracias por jugar. Saldo final: " + jugador.dinero + "€");




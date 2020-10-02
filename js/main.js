/*Cuando se hace click en el botón, muestra el submenu*/
function mostrarMenu() {
    //Añade una clase al elemento que tenga el id myDropdown
    document.getElementById("myDropdown").classList.toggle("show");
}

let gif = []
let urls = []
const apiKey = "vwa202UgsldTniHMENLopLs5Qv2gWv1V"
let divbuscar = false
let tema = true


// Se carga el tema de la pagina dependiendo de lo guardado en localStorage
cargarTema()

function cargarTema() {
    let valor = localStorage.getItem("tema")
    if (valor !== null) {
        tema = JSON.parse(valor)
        if (tema === true) {
            cambiarClaro()
            mostrarMenu()
        } else {
            cambiarOscuro()
            mostrarMenu()
        }
    }
}

/// Se realiza la parte de Hoy te sugerimos en la cual se llama el API,
/// y se crea el contorno de cada GIF con la funcion crearContornoGif()
getSearchResults("Los Simpson")

function getSearchResults(search) {


    const found = fetch('http://api.giphy.com/v1/gifs/search?q=' + search + '&api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(data => {
            crearContornoGif(data.data)
            return data
        })
        .catch(error => {
            return error;

        });
    return found;
}


function crearContornoGif(imagenes) {

    for (let i = 0; i < 4; i++) {
        let contorno = document.getElementById("sugerencia")
        let div = document.createElement("div")
        div.style.background = "#E6E6E6"
        div.style.boxShadow = "inset -2px -2px 0 0 #B4B4B4, inset 2px 2px 0 0 #FFFFFF"
        contorno.appendChild(div)
        let div1 = document.createElement("div")
        div1.className = " titulo"
        div.appendChild(div1)
        let label = document.createElement("label")
        label.innerHTML = "#" + imagenes[i].title.replace(/ /g, "")
        div1.appendChild(label)
        let a = document.createElement("a")
        a.setAttribute("href", "#tendencia")
        div1.appendChild(a)
        let div2 = document.createElement("div")
        div2.className = " imagen"
        div.appendChild(div2)
        let image = document.createElement("img")
        image.setAttribute("src", imagenes[i].images.downsized.url)
        image.setAttribute("alt", imagenes[i].title)
        div2.appendChild(image)
        let vermas = document.createElement("button")
        vermas.innerHTML = "Ver mas..."
        div2.appendChild(vermas)
    }

}

///Se hace el llamado de la API para la obtencion de los gif Tendencia
///Luego con la funcion crearTendencia, por cada 4 imagenes se insertan en un div


function obtenerTendencias() {
    const found = fetch('http://api.giphy.com/v1/gifs/trending?api_key=' + apiKey + '&limit=' + "24")
        .then(response => {

            return response.json();
        })
        .then(data => {
            for (let i = 0; i < 24; i++) {
                urls.push(data.data[i])
                if ((i + 1) % 4 === 0) {
                    crearTendencia(urls, "tendencia")
                    urls = []
                }
            }

            return data
        })
        .catch(error => {
            return error;

        });
    return found;
}
//Por cada 4 imagenes enviadas se crea el contorno de cada imagen y se inserta en el body
//Se realiza un hover cada vez que se pasa el raton sobre la imagen que trae los tags relacionados 
function crearTendencia(imagenes, id) {


    let contorno = document.getElementById(id)

    let div = document.createElement("div")
    div.className = "tendencia"
    contorno.appendChild(div)
    for (let i = 0; i < 4; i++) {
        let div2 = document.createElement("div")
        div2.style.gridColumn = toString(i + 1)
        div2.setAttribute("onmouseover", "ponerTags(this)")
        div2.setAttribute("onmouseout", "quitarTags(this)")
        let imagen = document.createElement("img")
        imagen.style.width = "100%"
        imagen.style.height = "13em"
        imagen.setAttribute("src", imagenes[i].images.downsized.url)
        imagen.setAttribute("alt", imagenes[i].title)
        div2.appendChild(imagen)
        div.appendChild(div2)
    }
}

obtenerTendencias()


//Funciones para hover en la imagen, se buscan los tags relacionados
function ponerTags(seleccion) {
    if (seleccion.childElementCount === 1) {
        let p = document.createElement("p")
        let titulo = seleccion.childNodes[0].alt
        obtenerRelacionados(titulo, p)
        seleccion.appendChild(p)
    }
}

function quitarTags(seleccion) {
    let p = seleccion.childNodes[1]
    seleccion.removeChild(p)
}




//Se obtiene valores relacionados con la palabra enviada, se utiliza el endpoint de giphy
//Se insertan los valores para que sean mostrados en el buscador
function obtenerAutocompletado(palabra) {

    const found = fetch('http://api.giphy.com/v1/gifs/search/tags?api_key=' + apiKey + '&q=' + palabra)
        .then(response => {

            return response.json();
        })
        .then(data => {

            if (data.data.length === 0) {
                let mostrar = document.getElementById("buscar")
                mostrar.style.display = "none"
            }
            borrarAuto("resultado")
            for (let i = 0; i < 3; i++) {
                if (i === 0) {
                    insertarAuto(data.data[i].name, true)
                } else {
                    insertarAuto(data.data[i].name, false)
                }

            }
            return data
        })
        .catch(error => {
            return error;

        });
    return found;
}

//Borra todos los elementos de un div
function borrarAuto(id) {
    let contorno = document.getElementById(id)
    while (contorno.hasChildNodes()) {
        contorno.removeChild(contorno.firstChild)
    }
}
// Se inserta cada palabra que se genera con el autocompletado
// Al primer elemento se le nombra una clase para su estilo
function insertarAuto(palabra, valor) {
    let mostrar = document.getElementById("buscar")
    mostrar.style.display = "block"
    let contorno = document.getElementById("resultado")
    let boton = document.createElement("button")
    boton.setAttribute("onclick", "mostrarAuto(this)")
    boton.innerText = palabra
    if (valor === true) {
        boton.className = "primero"
    }
    contorno.appendChild(boton)
}
//Por cada sugerencia del autocompletado se inserta al input del usuario
function mostrarAuto(boton) {
    let input = document.getElementById("fbuscar")
    input.value = boton.textContent
    buscar(input)
}

//Funcionalidades de los botones Superiores
function volveraInicio() {
    location.href = "../index.html"
}

function crearguifos() {
    location.href = "./pages/crearguifo.html"
}

function crearMguifos() {
    location.href = "./crearguifo.html"
}

//Funciones para el cambio de tema de la pagina
function cambiarClaro() {
    tema = true
    let temaJson = JSON.stringify(tema)
    localStorage.setItem("tema", tema)
    document.getElementById("style").href = "./styles/home_theme1.css"
    mostrarMenu()

}

function cambiarOscuro() {
    tema = false
    let temaJson = JSON.stringify(tema)
    localStorage.setItem("tema", tema)
    document.getElementById("style").href = "./styles/home_theme2.css"
    mostrarMenu()

}


//Funcion del input en la cual por cada presion de tecla se realiza la busqueda en el
//autocompletado
function buscar(palabra) {
    let boton = document.getElementById("bBuscar")

    if (palabra.value === "") {
        let mostrar = document.getElementById("buscar")
        mostrar.style.display = "none"
        boton.className = ""
        boton.removeAttribute("class")
        boton.removeAttribute("onclick")

    } else {

        obtenerAutocompletado(palabra.value)
        boton.className = " input"
        boton.setAttribute("onclick", "setBusqueda()")
        let resultado = document.getElementById("resultado")
        resultado.style.display = "block"
        let mostrar = document.getElementById("buscar")
        mostrar.style.display = "block"


    }
}

//Funcion del boton Buscar en la cual trae los resultados de la busqueda , y agrega un boton
// en forma de historial
function setBusqueda() {

    borrarAuto("gifBusqueda")
    borrarAuto("resultado")

    let resultado = document.getElementById("resultado")
    resultado.style.display = "none"
    let input = document.getElementById("fbuscar")
    let palabra = input.value
    let barras = document.getElementsByClassName("barra")
    let sugerencia = document.getElementById("sugerencia")
    let tendencia = document.getElementById("tendencia")
        // for (let i = 0; i < barras.length; i++) {
        //     barras[i].style.display = "none"
        // }
        // sugerencia.style.display = "none"
        // tendencia.style.display = "none"

    let divBarra = document.getElementById("busqueda")
    divBarra.className = "barra"
    let pResultado
    if (divbuscar === false) {

        pResultado = document.createElement("p")
        pResultado.innerText = palabra
        divbuscar = true
    } else {
        pResultado = document.querySelector("#busqueda p")
        pResultado.innerText = palabra
    }

    input.value = ""
    divBarra.appendChild(pResultado)
    buscar(input)
    obtenerResultados(palabra)


    let btnHistorial = document.createElement("button")
    btnHistorial.innerHTML = "#" + palabra
    let historial = document.getElementById("historial")
    if (historial.childElementCount === 0) {
        historial.appendChild(btnHistorial)
    }
    if (historial.childElementCount > 0 && historial.childElementCount < 7) {
        let btnP = historial.childNodes[0]
        historial.insertBefore(btnHistorial, btnP)
    }

    if (historial.childElementCount === 7) {
        let btnE = historial.childNodes[6]
        let btnP = historial.childNodes[0]
        historial.removeChild(btnE)
        historial.insertBefore(btnHistorial, btnP)
    }





}

//Funcion que permite a las imagenes hacer al hover, al momento de que pasan sobre ellas 
// se traen los tags relacionados
function obtenerRelacionados(palabra, elemento) {

    const found = fetch('http://api.giphy.com/v1/tags/related/{' + palabra + '}=?' + 'api_key=' + apiKey)
        .then(response => {
            return response.json();
        })
        .then(data => {
            let texto = ""
            for (let i = 0; i < 2; i++) {
                texto = texto + "#" + data.data[i].name.replace(/ /g, "#") + " "
            }
            elemento.innerText = texto
            return data
        })
        .catch(error => {
            return error;

        });
    return found;
}

//Funcion que trae imagenes respecto a una imagen, se utiliza el endpoint de giphy

function obtenerResultados(palabra) {


    const found = fetch('http://api.giphy.com/v1/gifs/search?q=' + palabra + '&api_key=' + apiKey + '&limit=' + '24')
        .then(response => {
            return response.json();
        })
        .then(data => {
            gif = data.data
            for (let i = 0; i < 24; i++) {
                urls.push(data.data[i])
                if ((i + 1) % 4 === 0) {
                    crearTendencia(urls, "gifBusqueda")
                    urls = []
                }
            }
            return data
        })
        .catch(error => {
            return error;

        });
    return found;
}
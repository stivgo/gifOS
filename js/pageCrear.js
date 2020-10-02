const apiKey = "vwa202UgsldTniHMENLopLs5Qv2gWv1V"
let recorder
let misGIFs = []
let tema = true


//Se carga el tema de la pagina dependiendo de la informacion del localStorage
cargarTema()

function cargarTema() {
    let valor = localStorage.getItem("tema")
    if (valor !== null) {
        tema = JSON.parse(valor)
        if (document.getElementById("style2") === null) {
            if (tema === true) {
                cambiarClaro()
            } else {
                cambiarOscuro()
            }
        } else {
            if (tema === true) {
                cambiarMClaro()
                mostrarMenu()
            } else {
                cambiarMOscuro()
                mostrarMenu()
            }
        }

    }
}

//Se cargan los gifs guardados en el localStorage
cargarLocalStorage()

function cargarLocalStorage() {
    let info = localStorage.getItem("gifs")
    let aux = []
    if (info !== null) {
        misGIFs = JSON.parse(info)
        for (let i = 0; i < misGIFs.length; i++) {
            aux.push(misGIFs[i])
            if ((i + 1) % 4 === 0) {
                crearMisGuifos(aux, 4)
                aux = []
            }
        }
        crearMisGuifos(aux, misGIFs.length % 4)
    }
}

//Se insertan los gifs localizados en localStorage, se insertan cada 4 gifs
function crearMisGuifos(imagenes, num) {

    let contorno = document.getElementById("misGuifos")
    let div = document.createElement("div")
    div.className = "gifs"
    contorno.appendChild(div)
    for (let i = 0; i < num; i++) {
        let div2 = document.createElement("div")
        div2.style.gridColumn = toString(i + 1)
        let imagen = document.createElement("img")
        imagen.style.width = "100%"
        imagen.style.height = "13em"
        imagen.setAttribute("src", imagenes[i])
        div2.appendChild(imagen)
        div.appendChild(div2)
    }
}
//Funcionalidad flecha de la parte superior 
function volveraInicio() {
    location.href = "../index.html"
}

//Funcionalidad boton comenzar
function comenzar() {
    let vistaCrear = document.getElementById("crear")
    let vistaCheck = document.getElementById("check")
    vistaCrear.style.display = "none"
    vistaCheck.style.display = "block"
    getStreamAndRecord()

}

//Pedir permisos al navegador para obtener video

function getStreamAndRecord() {

    navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        })
        .then(function(stream) {

            let video = document.createElement("video")
            let contorno = document.getElementsByClassName("videoCon")[0]
            contorno.appendChild(video)
            video.srcObject = stream;
            video.play()
        }).catch(function(reason) {
            alert(reason)
        })
}

//Funcionalidad boton capturar, la cual se comienza a grabar el video del gif, se hacen cambios
//de estilos en los botones
function capturar() {
    if (document.getElementsByClassName("videoCon")[0].childElementCount > 0) {


        let elemento = document.querySelector(".check .inferior")
        let titulo = document.querySelector(".check .titulo")
        let tiempo = document.querySelector(".check .tiempo")
        let btnCamara = elemento.childNodes[3].childNodes[1]
        let imgCamara = elemento.childNodes[3].childNodes[1].childNodes[0]
        let btnCapturar = elemento.childNodes[3].childNodes[3]

        titulo.textContent = "Capturando Tu Guifo"
        tiempo.style.visibility = "visible"
        imgCamara.setAttribute("src", "../images/recording.svg")
        if (tema === false) {
            imgCamara.style.filter = "invert(0%)"
        }
        btnCapturar.innerHTML = "Listo"
        btnCapturar.className = " captura"

        btnCamara.style.background = "#FF6161"
        btnCamara.style.boxShadow = "inset -1px -1px 0 0 #993A3A, inset 1px 1px 0 0 #FFFFFF"
        btnCamara.setAttribute("onclick", "listo()")
        btnCapturar.setAttribute("onclick", "listo()")
        grabarGif()
    } else {
        getStreamAndRecord()
    }
}

//Se llama a la libreria RecordRTC para que el grabado del video
function grabarGif() {

    let video = document.querySelector(".videoCon video")
    let stream = video.srcObject
    recorder = RecordRTC(stream, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        onGifRecordingStarted: function() {
            console.log('started')
        },
    });
    recorder.startRecording()

    recorder.camera = stream


}

//Se detiene la grabacion del video y se genera un preview del gif
function detenerGif() {
    recorder.stopRecording(function() {

        let src = URL.createObjectURL(recorder.getBlob())
        let video = document.querySelector(".videoCon video")
        let contorno = video.parentNode
        let preview = document.createElement("img")
        preview.setAttribute("src", src)

        contorno.removeChild(video)
        contorno.appendChild(preview)

    })
}

function reproducirVideo() {
    let video = document.querySelector(".videoCon video")
    video.play()
}


//Funcionalidad boton listo, se hacen cambios de estilos en botones, asi como su comportamiento
function listo() {

    detenerGif()
    let elemento = document.querySelector(".check .inferior")
    let btnGrabacion = elemento.childNodes[3].childNodes[1]
    let imgGrabacion = elemento.childNodes[3].childNodes[1].childNodes[0]
    let btnListo = elemento.childNodes[3].childNodes[3]
    let btnCerrar = document.querySelector(".check .superior a")
    let titulo = document.querySelector(".check .superior p")
    let progreso = document.querySelector(".check .reproduccion")

    progreso.style.visibility = "visible"

    titulo.innerText = "Vista Previa"

    btnCerrar.style.visibility = "hidden"

    btnGrabacion.removeChild(imgGrabacion)
    btnGrabacion.innerHTML = "Repetir Captura"
    btnGrabacion.setAttribute("onclick", "repetirCaptura()")

    if (tema === false) {
        btnGrabacion.style.background = "#110038"
        btnGrabacion.style.boxShadow = "inset -1px -1px 0 0 #5C5C5C, inset 1px 1px 0 0 #FFF4FD"
    } else {
        btnGrabacion.style.background = "#FFF4FD"
        btnGrabacion.style.boxShadow = "inset -1px -1px 0 0 #997D97, inset 1px 1px 0 0 #FFFFFF"
    }

    btnGrabacion.className = " blanco"

    btnListo.innerHTML = "Subir Guifo"
    btnListo.className = " rosado"
    btnListo.setAttribute("onclick", "subirGuifo()")


}

//copia la direccion URL del gif al portapapeles
function copiarPorta(url) {
    let aux = document.createElement("input")
    aux.setAttribute("value", url)
    document.body.appendChild(aux)
    aux.select()
    document.execCommand('copy')
    document.body.removeChild(aux)
    alert("Se ha copiado el enlace al portapapeles")
}

//Se obtiene un gif dependiendo de su id
function obtenerGuifo(id) {
    const found = fetch('http://api.giphy.com/v1/gifs?api_key=' + apiKey + '&ids=' + id)
        .then(response => {

            return response.json();
        })
        .then(data => {

            let url = data.data[0].url
            let boton = document.querySelector(".subido .botones button")
            boton.setAttribute("onclick", "copiarPorta('" + url + "')")
            let urlImage = data.data[0].images.downsized.url
            misGIFs.unshift(urlImage)
            let subirJson = JSON.stringify(misGIFs)
            localStorage.setItem("gifs", subirJson)
            return data
        })
        .catch(error => {
            return error;

        });
    return found;
}

//Se utiliza el metodo POST para subir el gif a giphy, utilizando su endpoint
function subirVideo() {
    let form = new FormData();
    form.append('api_key', apiKey)
    form.append('file', recorder.getBlob(), 'myGif.gif');


    fetch("http://upload.giphy.com/v1/gifs", {
            method: 'POST',
            body: form
        }).then(function(response) {

            if (response.ok) {
                let check = document.querySelector(".check")
                let subido = document.querySelector(".subido")
                check.style.display = "none"
                subido.style.display = "block"
                let contorno = document.querySelector(".subido .videoCon")
                let img = document.createElement("img")
                let src = URL.createObjectURL(recorder.getBlob())
                img.setAttribute("src", src)
                contorno.appendChild(img)

            }
            return response.json()
        }).then(function(data) {
            let id = data.data.id
            obtenerGuifo(id)
        })
        .catch(function(error) {
            console.log(error)
        })


}


//Se crea la vista de subiendo guifo
function subirGuifo() {


    let contorno = document.querySelector(".check .videoCon")
    let video = document.querySelector(".check .videoCon img")
    let inferior = document.querySelector(".check .vista")
    let elemento = document.querySelector(".check .inferior")
    let btnRepetir = elemento.childNodes[3].childNodes[1]
    let btnSubir = elemento.childNodes[3].childNodes[3]
    let titulo = document.querySelector(".check .superior p")
    let botones = document.getElementById("botones")

    contorno.removeChild(video)

    btnRepetir.style.display = "none"
    inferior.style.display = "none"
    botones.style.width = "100%"
    btnSubir.className = "blanco"
    btnSubir.innerHTML = "Cancelar"
    btnSubir.setAttribute("onclick", "cancelar()")
    btnSubir.style.justifySelf = "right"
    btnSubir.style.marginRight = "0.3em"
    titulo.innerText = "Subiendo Guifo"

    let img = document.createElement("img")
    let h2 = document.createElement("h2")
    let div = document.createElement("div")
    let p = document.createElement("p")


    img.setAttribute("src", "../images/globe_img.png")
    h2.innerText = "Estamos subiendo tu guifo..."
    p.innerHTML = "Tiempo restante: <span>38 años</span> algunos minutos"

    contorno.className = " videoCon subiendo"
    contorno.appendChild(img)
    contorno.appendChild(h2)
    contorno.appendChild(div)
    contorno.appendChild(p)

    let infoSubir = subirVideo()




}

// funcionalidad del boton repetir captura, la cual hace los cambios en botones, para volver
// a comenzar nuevamente el proceso de grabar
function repetirCaptura() {
    let titulo = document.querySelector(".check .superior p")
    let btnCerrar = document.querySelector(".check .superior a")
    let tiempo = document.querySelector(".check .tiempo")
    let progreso = document.querySelector(".check .reproduccion")
    let elemento = document.querySelector(".check .inferior")
    let btnRepetir = elemento.childNodes[3].childNodes[1]
    let btnSubir = elemento.childNodes[3].childNodes[3]
    let imgCamara = document.createElement("img")
    let video = document.querySelector(".videoCon img")
    let contorno = video.parentNode

    contorno.removeChild(video)

    titulo.innerText = "Un Chequeo Antes de Empezar"
    btnCerrar.style.visibility = "visible"
    tiempo.style.visibility = "hidden"
    progreso.style.visibility = "hidden"

    imgCamara.setAttribute("src", "../images/camera.svg ")

    btnRepetir.removeChild(btnRepetir.childNodes[0])
    if (tema === false) {
        btnRepetir.style.background = "#EE3EFE"
    } else {
        btnRepetir.style.background = "#F7C9F3"
    }

    btnRepetir.className = "camara rosado"
    btnRepetir.appendChild(imgCamara)
    btnRepetir.setAttribute("onclick", "capturar()")



    btnSubir.innerHTML = "Capturar"
    btnSubir.setAttribute("onclick", "capturar()")

    getStreamAndRecord()


}
//Funcion que recarga la pagina en que se encuentra
function cancelar() {
    location.reload()

}

//funcion para descargar el gif creado
function descargarGuifo() {
    invokeSaveAsDialog(recorder.getBlob())
}

//Funciones para los botones de la parte superior de cambio de tema
function mostrarMenu() {
    //Añade una clase al elemento que tenga el id myDropdown
    document.getElementById("myDropdown").classList.toggle("show");
}

function volveraInicio() {
    location.href = "../index.html"
}

function crearMguifos() {
    location.href = "crearguifo.html"
}

function cambiarClaro() {
    document.getElementById("style3").href = "../styles/crear_theme1.css"
        //mostrarMenu()

}

function cambiarOscuro() {
    document.getElementById("style3").href = "../styles/crear_theme2.css"
        //mostrarMenu()

}

function cambiarMClaro() {
    tema = true
    let temaJson = JSON.stringify(tema)
    localStorage.setItem("tema", tema)
    document.getElementById("style2").href = "../styles/home_theme1.css"
    mostrarMenu()

}

function cambiarMOscuro() {
    tema = false
    let temaJson = JSON.stringify(tema)
    localStorage.setItem("tema", tema)
    document.getElementById("style2").href = "../styles/home_theme2.css"
    mostrarMenu()

}
//busqueda
const form = document.querySelector("#form-busqueda")
const inputBusqueda = document.querySelector("#input-busqueda")

//contenedores
const contenedorTarjeta = document.querySelector("#contenedor-tarjetas")
const contenedorDetalle = document.querySelector("#contenedor-detalle")
const contenedorFiltros = document.querySelector("#contenedor-filtros")
const contenedorCarga = document.querySelector("contenedor-carga")

//seccion
const sectionTarjetas = document.querySelector("#section-tarjetas")
const sectionBusqueda = document.querySelector("#section-busqueda")
const sectionDetalle = document.querySelector("#section-detalle")

//filtros
const selectUbicacion = document.querySelector("#select-ubicacion")
const selectEnvios = document.querySelector("#select-envios")
const selectCondicion = document.querySelector("#select-condicion")

const slider = document.querySelector("#slider")


// variables
let paginaActual = 1
let ultimaPagina = 0

//fetch
const buscarProductos = (producto, direccion, envios,condicion) =>{
    fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${producto}&state=${direccion}&shipping=${envios}&ITEM_CONDITION=${condicion}&q=gifquebusxadte&offset=${paginaActual}&limit=20`)
    .then(res => res.json())
    .then(data =>{
        ultimaPagina = data.paging.total
        mostrarTarjetas(data.results, direccion, envios,condicion, paginaActual,data)
    })
}

const verProducto = (id)=>{
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(res => res.json())
    .then(data=>{
        fetch (`https://api.mercadolibre.com/items/${id}/description`)
        .then (res => res.json ())
        .then (descripcion => {
            detalleTarjeta(data, descripcion)
        })
    })
}

form.onsubmit=(e)=>{
    e.preventDefault()
    buscarProductos(inputBusqueda.value, selectUbicacion.value, selectEnvios.value, selectCondicion.value)
}

// Tarjetas en HTML
const mostrarTarjetas = (producto, direccion, envios, condicion, paginaActual, data) =>{
    contenedorTarjeta.style.display = "flex"
    contenedorFiltros.style.display= "flex"
    contenedorDetalle.style.display= "none"
    slider.style.display="none"

        contenedorTarjeta.innerHTML= producto.reduce((acc, curr)=>{
            return acc + `
            <section id="section-tarjetas">
                <div class="tarjetas" data-id="${curr.id}">
                    <img class="img-tarjeta" src="${curr.thumbnail}">
                    <div class="text-tarjetas">
                        <h2>${curr.title}</h2>
                        <p class="precio">$${curr.price}</p>
                        <p>${curr.address.state_name}</p>
    
                    </div>
                </div>
            </section>
            `
        },`
        <div id="contenedor-botones">
            <button id="boton-prev">Pagina Anterior ${paginaActual--}</button>
            <button id="boton-next">Pagina Siguiente ${paginaActual++}</button>
        </div>
        <p class="total-paginas">Total de paginas: ${data.paging.total / 20}</p>`)
        
    clickATarjetas()
    clickPaginaSiguiente()
}


const clickATarjetas = () =>{
    const tarjetas = document.querySelectorAll(".tarjetas")
    for (let i = 0; i < tarjetas.length; i++) {
        tarjetas[i].onclick = () => {
          const id = tarjetas[i].dataset.id
          verProducto(id)
        }  
    }
}
// aplicando filtros
selectUbicacion.onchange = ()=>{
    buscarProductos(inputBusqueda.value, selectUbicacion.value, selectEnvios.value, selectCondicion.value)
    mostrarTarjetas()
}
selectEnvios.onchange = ()=>{
    buscarProductos(inputBusqueda.value, selectUbicacion.value, selectEnvios.value, selectCondicion.value)
    mostrarTarjetas()
}
selectCondicion.onchange = ()=>{
    buscarProductos(inputBusqueda.value, selectUbicacion.value, selectEnvios.value, selectCondicion.value)
    mostrarTarjetas()
}


// Tarjetas en detalle
const detalleTarjeta = (data, descripcion)=>{
    contenedorTarjeta.style.display = "none"
    contenedorDetalle.style.display = "flex"
    sectionDetalle.style.display = "flex"        
    

    sectionDetalle.innerHTML = `
    <article class="detalle-producto">
        <h2>${data.title}</h2>
        <div class="flex-column">
            <p>${mostrarCondicion(data.condition)}</p> 
            <div class="detalle-img">
                <img class="detalle-img" src="${data.thumbnail}">
            </div>
            <p class="detalle-precio">$${data.base_price}</p>
            <p>Vendido por <span class="vendedor">${data.domain_id}</span> | ${mostrarStock(data.initial_quantity, data.sold_quantity)}</p>
            <p>${mostrarEnvioGratis(data.shipping.free_shipping)}</p>
            <p>${descripcion.plain_text}</p>
            <p>${data.warranty}</p>
            <button class="boton-comprar">COMPRAR</button>
        </div>
        <div class="detalle-contenedor-img">
            ${productoSinImagen(data.pictures)}
        </div>
        <button class="boton-atras" id="${data.id}">Atrás</button>
    </article>`

    const botonComprar = document.querySelector(".boton-comprar")
    const botonAtras = document.querySelector(".boton-atras")

    botonAtras.onclick = () => {
        contenedorDetalle.style.display="none"
        contenedorTarjeta.style.display="flex"
    }
    
    botonComprar.onclick=()=>{
        const modal = document.querySelector(".modal")
        modal.style.display="flex"
        mostrarImagenNotFound ()
    }
}

// Funciones
const mostrarEnvioGratis = (tipoEnvio)=>{
    if (tipoEnvio === true) {
        return `
        <div class="img-detalle-flex">
            <i class="fas fa-truck"></i>
            <p class='envio-gratis'> Envio GRATIS</p>
        </div>
        
        `
    }else{
        return `
        <div class="img-detalle-flex">
            <p class='envio-no-gratis'> Envio a cargo del comprador</p>
        </div>
        ` 
    }
}

const mostrarCondicion = (tipoCondicion)=>{
    if (tipoCondicion === "new") {
        return `
        <p>Producto Nuevo<span><i class="far fa-smile-beam"></i></span></p>`
    }else{
        return `
        <p>Producto Usado <span><i class="fas fa-recycle"></i></span></p>`
    }
}
const mostrarStock = (stockInicial, stockFinal)=>{
    if ((stockInicial - stockFinal) > 0 ) {
        return `${(stockInicial - stockFinal)} productos en stock`
    }else{
        return "No hay stock disponible :("
    }
}

const mostrarImagenNotFound=()=>{
    const modal = document.querySelector(".modal")

    modal.innerHTML= `
    <div class="modal-container">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Esta pagina es parte de un proyecto utilizando la API de mercado libre, para poder comprar por la misma redirigite al siguiente 
            <span>    
                <a href="https://www.mercadolibre.com/" target="blanck">link</a>
            </span>
        </p>
        <button class="cerrar-modal">Cerrar</button>
    </div>
    
    `
    const cerrarModal = document.querySelector(".cerrar-modal")
    cerrarModal.onclick=()=>{
        modal.style.display="none"
    }
}
const productoSinImagen = (arrayImagenes)=>{
    for (let i = 0; i < arrayImagenes.length; i++) {
        if (arrayImagenes[0] && arrayImagenes[1] && arrayImagenes[2]) {
            return `
             <img class="detalle-otras-img" src="${arrayImagenes[0].secure_url}">
             <img class="detalle-otras-img" src="${arrayImagenes[1].secure_url}"></img>
             <img class="detalle-otras-img" src="${arrayImagenes[1].secure_url}"></img>
             `
        }
        if (arrayImagenes[0] && !arrayImagenes[1] ||
            arrayImagenes[0] && !arrayImagenes[1] && !arrayImagenes[2]) {
            return `
             <img class="detalle-otras-img" src="${arrayImagenes[0].secure_url}">
             `
        }
    }
}

// paginado
const clickPaginaSiguiente =()=>{
    //botones paginas
    const prev = document.querySelector("#boton-prev")
    const next = document.querySelector("#boton-next")

    next.onclick = () => {
        paginaActual++
        if (paginaActual === ultimaPagina) {
        next.disabled = true
        }
        buscarProductos(inputBusqueda.value, selectUbicacion.value, selectEnvios.value, selectCondicion.value)
    }

    prev.onclick = () => {
        paginaActual--
        if (paginaActual === 1) {
            prev.disabled = true
        }
        buscarProductos(inputBusqueda.value, selectUbicacion.value, selectEnvios.value, selectCondicion.value)
    }
}

// modo oscuro
const modo = document.querySelector("#modo");

modo.onclick=()=>{
    const body = document.querySelector("body")
    const input = document.querySelector("input")


    body.classList.toggle("modo-oscuro");
    input.classList.toggle("modo-oscuro");


}

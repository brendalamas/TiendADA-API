//busqueda
const form = document.querySelector("#form-busqueda")
const inputBusqueda = document.querySelector("#input-busqueda")

//contenedores
const contenedorTarjeta = document.querySelector("#contenedor-tarjetas")
const contenedorDetalle = document.querySelector("#contenedor-detalle")

//seccion
const sectionTarjetas = document.querySelector("#section-tarjetas")
const sectionBusqueda = document.querySelector("#section-busqueda")
const sectionDetalle = document.querySelector("#section-detalle")

//filtros
const selectUbicacion = document.querySelector("#select-ubicacion")
const selectEnvios = document.querySelector("#select-envios")
const selectCondicion = document.querySelector("#select-condicion")




// variables
let paginaActual = 1
let ultimaPagina = 0

//fetch
const buscarProductos = (producto, direccion, envios,condicion) =>{
    fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${producto}&state=${direccion}&shipping=${envios}&ITEM_CONDITION=${condicion}&q=gifquebusxadte&offset=${paginaActual}&limit=20`)
    .then(res => res.json())
    .then(data =>{
        console.log(paginaActual);
        ultimaPagina = data.paging.total
        mostrarTarjetas(data.results, direccion, envios,condicion, paginaActual,data)
        console.log(data);
    })
}

const verProducto = (id)=>{
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(res => res.json())
    .then(data=>{
        detalleTarjeta(data)
    })

}

form.onsubmit=(e)=>{
    e.preventDefault()
    buscarProductos(inputBusqueda.value, selectUbicacion.value, selectEnvios.value, selectCondicion.value)
}

// Tarjetas en HTML
const mostrarTarjetas = (producto, direccion, envios, condicion, paginaActual, data) =>{
    contenedorTarjeta.style.display = "flex"
    contenedorDetalle.style.display= "none"

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
        <p class="totalPaginas">Total de paginas: ${data.paging.total / 20}</p>`)
        
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

////// Tarjetas en detalle
const detalleTarjeta = (data)=>{
    contenedorTarjeta.style.display = "none"
    contenedorDetalle.style.display = "flex"
    sectionDetalle.style.display = "flex"

    sectionDetalle.innerHTML = `
    <article class="detalle-producto">
        <h2>${data.title}</h2>
        <div class="detalle-flex">
            <img class="detalle-img" src="${data.thumbnail}">
            <div class="flex-column">
                <p>${mostrarCondicion(data.condition)}</p> 
                <p class="detalle-precio">$${data.base_price}</p>
                <p>Vendido por ${data.domain_id}</p>
                <p>Cantidad: ${mostrarStock(data.initial_quantity, data.sold_quantity)}</p>
                <p>${mostrarEnvioGratis(data.shipping.free_shipping)}</p>
                <p>${data.warranty}</p>
                <button class="boton-comprar">COMPRAR</button>
            </div>
            
        </div>
        <div class="detalle-contenedor-img">
            ${productoSinImagen(data.pictures)}
        </div>
        <button class="boton-atras" id="${data.id}">Atrás</button>
    </article>`

    const botonComprar = document.querySelector(".boton-comprar")
    const botonAtras = document.querySelector(".boton-atras")
    const detalleContenedorImg = document.querySelector(".detalle-contenedor-img")

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
            <p class='envio-gratis'> Envio FULL</p>
        </div>
        
        `
    }else{
        return `
        <div class="img-detalle-flex">
            <i class="fas fa-truck"></i>
            <p class='envio-gratis'> Envio a cargo del comprador</p>
        </div>
        ` 
    }
}

const mostrarCondicion = (tipoCondicion)=>{
    if (tipoCondicion === "new") {
        return `
        <p>Este producto es nuevo! 
            <span><i class="far fa-smile-beam"></i></span>
        </p>`
    }else{
        return `
        <p>Este producto es usado 
            <span><i class="fas fa-recycle"></i></span>
        </p>`
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

// //total paginas
// const totalPaginas = (pagina)=>{
//     return pagina.total / 20 
// }
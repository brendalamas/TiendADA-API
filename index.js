// DOM
const form = document.querySelector("#form-busqueda")
const inputBusqueda = document.querySelector("#input-busqueda")
const contenedorTarjeta = document.querySelector("#contenedor-tarjetas")
const contenedorDetalle = document.querySelector("#contenedor-detalle")

const sectionTarjetas = document.querySelector("#section-tarjetas")
const sectionBusqueda = document.querySelector("#section-busqueda")
const sectionDetalle = document.querySelector("#section-detalle")
const selectUbicacion = document.querySelector("#select-ubicacion")
const selectEnvios = document.querySelector("#select-envios")
const selectCondicion = document.querySelector("#select-condicion")


// const filtrarCondicion = (data) =>{
//     if (data.condition === "new") {
//         console.log("es nuevo");
//     }
// }

//FETCH
const buscarProductos = (producto,direccion, envios,condicion) =>{
    fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${producto}&state=${direccion}&shipping=${envios}&ITEM_CONDITION=${condicion}`)
    .then(res => res.json())
    .then(data =>{
        console.log(data);
        mostrarTarjetas(data.results, direccion, envios,condicion)
        console.log(condicion);
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

// tarjetas en HTML
const mostrarTarjetas = (producto, direccion, envios, condicion) =>{
    contenedorTarjeta.style.display = "flex"
    contenedorDetalle.style.display= "none"

    contenedorTarjeta.innerHTML= producto.reduce((acc, curr)=>{
        return acc + `
        <section id="section-tarjetas">
            <div class="tarjetas" data-id="${curr.id}">
                <img class="img-tarjeta" src="${curr.thumbnail}">
                <div class="text-tarjetas">
                    <h2>${curr.title}</h2>
                    <p>$${curr.price}</p>
                    <p>${curr.address.state_name}</p>

                </div>
            </div>
        </section>
        `
    },`
    <div id="contenedor-botones">
        <button id="prev">Pagina Anterior</button>
        <button id="next">Pagina Siguiente</button>
    </div>`)
    clickATarjetas()

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


////// TARJETAS EN DETALLE
const detalleTarjeta = (data)=>{
    contenedorTarjeta.style.display = "none"
    contenedorDetalle.style.display = "flex"
    console.log(data);
    sectionDetalle.innerHTML = `
    <article class="detalle-producto">
        <h2>${data.title}</h2>
        <div class="detalle-flex">
            <img class="detalle-img" src="${data.thumbnail}">
            <div class="flex-column">
                <p>${mostrarCondicion(data.condition)}</p> 
                <p class="detalle-precio">$${data.base_price}</p>
                <p>Cantidad: ${mostrarStock(data.initial_quantity, data.sold_quantity)}</p>
                <p>${mostrarEnvioGratis(data.shipping.free_shipping)}</p>
                <p>${data.warranty}</p>
                <p>${data.descriptions}</p>
            </div>
            
        </div>
        <div class="detalle-contenedor-img">
            <img class="detalle-otras-img" src="${data.pictures[0].secure_url}">
            <img class="detalle-otras-img" src="${data.pictures[1].secure_url}">
            <img class="detalle-otras-img" src="${data.pictures[2].secure_url}">
        </div>
        

        <button class="boton-atras" id="${data.id}">Atrás</button>
    </article>`

    const botonAtras = document.querySelector(".boton-atras")

    botonAtras.onclick = () => {
        contenedorDetalle.style.display="none"
        contenedorTarjeta.style.display="flex"
    }

}
// FUNCIONES
const mostrarEnvioGratis = (tipoEnvio)=>{
    if (tipoEnvio === true) {
        return `
        <div class="img-detalle-flex">
            <img class="img-detalle" src="./imagenes/camion-full.png">
            <p class='envio-gratis'> Envio FULL / Envio gratis</p>
        </div>
        
        `
    }else{
        return `
        <div class="img-detalle-flex">
            <img class="img-detalle" src="./imagenes/camion-normal.png">
            <p class='envio-gratis'> Envio a cargo del comprador</p>
        </div>
        ` 
    }
}

const mostrarCondicion = (tipoCondicion)=>{
    if (tipoCondicion === "new") {
        return "Nuevo"
    }else{
        return "Usado"
    }
}
const mostrarStock = (stockInicial, stockFinal)=>{
    if ((stockInicial - stockFinal) > 0 ) {
        return `${(stockInicial - stockFinal)} productos en stock`
    }else{
        return "No hay stock disponible :("
    }
}


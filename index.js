// DOM
const form = document.querySelector("#form-busqueda")
const inputBusqueda = document.querySelector("#input-busqueda")
const sectionTarjetas = document.querySelector("#section-tarjetas")
const sectionBusqueda = document.querySelector("#section-busqueda")
const sectionDetalle = document.querySelector("#section-detalle")
const selectUbicacion = document.querySelector("#select-ubicacion")


//FETCH
const buscarProductos = (producto,direccion) =>{
    fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${producto}&state=${direccion}`)
    .then(res => res.json())
    .then(data =>{
        console.log(data);
        mostrarTarjetas(data.results, data.available_filters.state)
        console.log(data.available_filters.state);
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
    buscarProductos(inputBusqueda.value, selectUbicacion.value)
}

const mostrarTarjetas = (producto, direccion) =>{
    sectionTarjetas.style.display = "flex"
    sectionTarjetas.innerHTML= producto.reduce((acc, curr)=>{
        return acc + `
        
        <div class="tarjetas" data-id="${curr.id}">
            <img class="img-tarjeta" src="${curr.thumbnail}">
            <div class="text-tarjetas">
                <h2>${curr.title}</h2>
                <p>$${curr.price}</p>
                <p>${curr.address.state_name}</p>

            </div>
            
        </div>`
    },`<button id="prev">Pagina Anterior</button>
    <button id="next">Pagina Siguiente</button>`)
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
    sectionTarjetas.style.display = "none"
    sectionDetalle.style.display = "flex"
    console.log(data);
    sectionDetalle.innerHTML = `
    <article class="detalle-producto">
        <h2>${data.title}</h2>
        <img src="${data.thumbnail}">
        <p>$${data.base_price}</p>
        <p>${mostrarEnvioGratis(data.shipping.free_shipping)}</p>
    </article>
    <button class="boton-atras" id="${data.id}">Atrás</button>`

    const botonAtras = document.querySelector(".boton-atras")

    botonAtras.onclick = () => {
        sectionDetalle.style.display="none"
        sectionTarjetas.style.display="flex"
        console.log("click");
    }

}
const mostrarEnvioGratis = (tipoEnvio)=>{
    if (tipoEnvio === true) {
        return "Envio Gratuito"
    }else{
        return "Envio normal"
    }
}


// const next = document.querySelector("#next")
// let paginaActual = 1

// next.onclick=()=>{
//     paginaActual ++
//     buscarProductos()
// }
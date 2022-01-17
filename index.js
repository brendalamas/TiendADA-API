// DOM
const form = document.querySelector("#form-busqueda")
const inputBusqueda = document.querySelector("#input-busqueda")
const sectionTarjetas = document.querySelector("#section-tarjetas")
const sectionBusqueda = document.querySelector("#section-busqueda")
const sectionDetalle = document.querySelector("#section-detalle")

const filtrarCondicion = (data) =>{
    if (data.condition === "new") {
        console.log("es nuevo");
    }
}

const buscarProductos = (producto) =>{
    fetch(`https://api.mercadolibre.com/sites/MLA/search?q=${producto}`)
    .then(res => res.json())
    .then(data =>{
        console.log(data.results);
        mostrarTarjetas(data.results)
        filtrarCondicion(data.results)
    })
}
const verProducto = (id)=>{
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then(res => res.json())
    .then(data=>{
        detalleTarjeta(data)
    })

}

const mostrarTarjetas = (producto) =>{
    sectionTarjetas.style.display = "flex"
    sectionTarjetas.innerHTML= producto.reduce((acc, curr)=>{
        return acc + ` 
        <div class="tarjetas" data-id="${curr.id}">
            <img class="img-tarjeta" src="${curr.thumbnail}">
            <div class="text-tarjetas">
                <h2>${curr.title}</h2>
                <p>$${curr.price}</p>
            </div>
            
        </div>`
    },"")
    clickATarjetas()
}

form.onsubmit=(e)=>{
  e.preventDefault()
  buscarProductos(inputBusqueda.value)
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
    </article>
    <button class="boton-atras" id="${data.id}">Atrás</button>

    `
    const botonAtras = document.querySelector(".boton-atras")

    botonAtras.onclick = () => {
        sectionDetalle.style.display="none"
        sectionTarjetas.style.display="flex"
        console.log("click");
    }

}

// FILTRAR POR CONDICION

// si la condicion es nuevo --> mostrame estos
// si la condicion es no es nuevo --> mostrame el resto
const selectOrden = document.querySelector("#select-orden")
selectOrden.onchange=()=>{
    buscarProductos()
}


  
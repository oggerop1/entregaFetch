class Producto{
    constructor(nombre, precio , stock){
        this.nombre = nombre;
        this.precio = precio;
        this.stock  = stock;
    };

    // set and get de las propiedades
    setNombre(nombre){
        this.nombre = nombre;
    };

    setPrecio(precio){
        this.precio = precio;
    };

    setStock(stock){
        this.stock = stock;
    };

    getNombre(){
        return this.nombre;
    };

    getPrecio(){
        return this.precio;
    };

    getStock(){
        return this.stock;
    };

    eliminarProducto(elemento){

    }
};

document.getElementById("form-productos").addEventListener("submit", function(e){
    // obtengo los valores del formulario ingresados por el usuario
    let obtenerNombreProducto   = document.getElementById("nombre").value;
    let obtenerPrecio           = document.getElementById("precio").value;
    let obtenerStock            = document.getElementById("stock").value;

    //operadores avanzado OR ||
    if(obtenerNombreProducto==='' || obtenerPrecio==='' || obtenerStock ==='' ){
        //mostrarMensaje("ingrese los datos solicitados", "danger")
        
        //us0 lib
        Swal.fire({
            icon:"error",
            title:"ERROR",
            text:"Ingresar los datos solicitados"
        
        });
        
        
    
    }else if(document.getElementById("abm").value ==="Agregar"){
        // alta
        // instancia de la clase producto
        const producto = new Producto ();
        producto.setNombre(obtenerNombreProducto);
        producto.setPrecio(obtenerPrecio);
        producto.setStock (obtenerStock);
        
        // llamo funcion para agregar en un array el producto
        agregarProductosBase(producto);
        // con e cancelo el evento que refresca la pagina automaticamente.
        e.preventDefault();
    }else{
        //editar
        baseProductos[elementIndex].nombre = obtenerNombreProducto;
        baseProductos[elementIndex].precio = obtenerPrecio;
        baseProductos[elementIndex].stock  = obtenerStock;
       
        document.getElementById("tablaProductos").onload;
        document.getElementById("abm").value = 'Agregar';
        document.getElementById("form-productos").reset();
    }
});

let baseProductos = []; //creo array vacio
let elementIndex = 0;

function agregarProductosBase(producto){
    // con filter verifica si lo que ingresó esta en el arrary 
    let duplicado = baseProductos.filter(prod =>prod.getNombre() === producto.getNombre())

    //con el if controlo que no se agregue el mismo nombre del producto. 1= true
    if (duplicado.length ===1){
        mostrarMensaje("Producto ya creado con ese nombre, por favor ingrese otro Nombre!!,","danger");
    }else{
        // agrego al arrary con push
        baseProductos.push(producto); 
        mostrarMensaje("producto ingresado correctamente","success");
        agregarProductosTabla(producto);
        document.getElementById("form-productos").reset();
    }
}

function agregarProductosTabla(producto){      
    let fila = document.createElement("tr");
    //Desestructuración
    const {nombre, stock, precio}= producto;
    fila.innerHTML = `<td class="nomProd">${nombre}</td>
                      <td class="stockProd">${stock}</td>
                      <td class ="precioProd">${precio}</td>
                      <td><button class="btn-danger borrarElemento">Borrar</button></td>
                      <td><button class="btn btn-success editarElemento">Editar</button></td>
                      <td><button class="btn btn-success btnComprar">Comprar</button></td>`;

                      
    let tabla = document.getElementById("tbody");

    tabla.append(fila);
    
    let botonesBorrar = document.querySelectorAll(".borrarElemento");
    for( let boton of botonesBorrar){
        boton.addEventListener("click" , borrarProducto);
    }

    let botonesEditar = document.querySelectorAll(".editarElemento");
    for (let btn_edit of botonesEditar ){
        btn_edit.addEventListener("click",editarProducto);
    }

    let btnCompra = document.querySelectorAll(".btnComprar");
    for( let boton of btnCompra){
        boton.addEventListener("click" , altaCarrito);
    }
}

function mostrarMensaje(mensaje, claseBT){
    const div = document.createElement('div');              // creo el div
    div.className= 'alert alert-' +claseBT+ ' mt-2';        // le creo la clase BT 
    div.appendChild(document.createTextNode(mensaje));      // creo el nodo
    const container = document.querySelector('.container'); // obtengo el conteiner
    const row = document.querySelector('.row');             // obtengo el row
    container.insertBefore(div, row);                       // le indico que inserte el div entre el container y el row

    // seteo el tiempo que tiene que mostrarse el mensaje
    setTimeout(function(){
        document.querySelector('.alert').remove();
    },3000);
}


function borrarProducto(e){
    let filaDelete = e.target.parentNode.parentNode;
    let tdValorNombre = filaDelete.firstElementChild.innerHTML;
    let duplicado = baseProductos.filter(prod =>prod.getNombre() === tdValorNombre);

    //con el if controlo que no se agregue el mismo nombre del producto. 1= true
    if (duplicado.length ===1){
        // con el for busco la coincidencia para borrar con el metodo splice
        for(var i = baseProductos.length - 1; i >= 0; i--) { 
            if(baseProductos[i].getNombre() === tdValorNombre) 
            { baseProductos.splice(i, 1); } }

        mostrarMensaje("eliminado de la base,","danger");
        document.getElementById("form-productos").reset();
        
    }
    filaDelete.remove();
}

function editarProducto(e){
    let filaEditar = e.target.parentNode.parentNode;
    let tdValorNombre = filaEditar.firstElementChild.innerHTML;
    
    
    let duplicado = baseProductos.filter(prod =>prod.getNombre() === tdValorNombre);
    
    //obtengo los valores a traves de la clase de cada uno de los td.
    let nombreProducto = filaEditar.querySelector(".nomProd").textContent;
    let precioProducto = filaEditar.querySelector(".precioProd").textContent;
    let stockProducto = filaEditar.querySelector(".stockProd").textContent;
  
    if (duplicado.length ===1){
        document.getElementById("nombre").value = nombreProducto;
        document.getElementById("precio").value = precioProducto;
        document.getElementById("stock").value = stockProducto;
        document.getElementById("abm").value = 'Editar';
        elementIndex = baseProductos.findIndex((obj => obj.getNombre() === tdValorNombre));
    }
}


///Carrito
//operadores avanzado OR ||
const carrito = JSON.parse(localStorage.getItem('carrito')) || []
let cantidadProdCompra = 0;

function altaCarrito(e){


    //obtengo los valores a traves de la clase de cada uno de los td.
    let filaComprar = e.target.parentNode.parentNode;
    let nombreProducto = filaComprar.querySelector(".nomProd").textContent;
    let precioProducto = filaComprar.querySelector(".precioProd").textContent;
    let stockProducto = filaComprar.querySelector(".stockProd").textContent;
    //operadores avanzados
    stockProducto --;
    cantidadProdCompra ++;
    
    let productoCarrito = {
        nombre: nombreProducto,
        precio: precioProducto,
        cantidad: cantidadProdCompra
    };
    
    carrito.push(productoCarrito);
    let arregloJSON = JSON.stringify(carrito);
    localStorage.setItem("carrito" , arregloJSON);
    mostrarCarrito( productoCarrito);

}

function mostrarCarrito( productoCarrito){
    let fila = document.createElement("tr");

    //Desestructuración:
    const{nombre,precio,cantidad} = productoCarrito;

    fila.innerHTML = `<td>${nombre}</td>
                      <td>${precio}</td>
                      <td>${cantidad}</td>
                      <td><button class="btn-danger borrarElementoCarrito">Borrar</button></td>`;

    
    let tabla = document.getElementById("tablaCarrito");
    tabla.append(fila);


    let botonesBorrar = document.querySelectorAll(".borrarElementoCarrito");
    for( let boton of botonesBorrar){
        boton.addEventListener("click" , borrarProductoCarrito);
    }
}

function borrarProductoCarrito(e){
    let trCarrito = e.target.parentNode.parentNode;
    trCarrito.remove();
}


//const now = DateTime.now();

// document.getElementById("date").value = now.toString() ;


const url= "https://www.dolarsi.com/api/api.php?type=valoresprincipales";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    let fila = document.createElement("tr");
    fila.innerHTML = `<td>${data[0].casa.compra}</td>
                      <td>${data[0].casa.venta}</td>
                      <td>${data[1].casa.compra}</td>
                      <td>${data[1].casa.venta}</td>`;

    let tabla = document.getElementById("tablaDolar");
    tabla.append(fila);
  })
  .catch(err=> mostrarMensaje("Error","danger"))
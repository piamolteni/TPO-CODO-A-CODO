
const productos = [
    { id: 1, producto: "Camino Nilo", price: 1700, img: "../imagenes/productos/camino-tussor-crudo.jpg", category: "caminos", stock: 25 },
    { id: 2, producto: "Camino Ron", price: 1700, img: "../imagenes/productos/camino-tussor.png", category: "caminos", stock: 25 },
    { id: 3, producto: "Mantel Roma", price: 2900, img: "../imagenes/productos/manteltusor2.jpg", category: "manteles", stock: 25 },
    { id: 4, producto: "Mantel Vera", price: 2500, img: "../imagenes/productos/mantel-tusor-crudo.jpg", category: "manteles", stock: 20 },
    { id: 5, producto: "Alfombra Lupe", price: 3700, img: "../imagenes/productos/alfombra-algodon.jpg", category: "alfombras", stock: 4 },
    { id: 6, producto: "Alfombra Mia", price: 7300, img: "../imagenes/productos/alfombra-yute.jpg", category: "alfombras", stock: 18 },
    { id: 7, producto: "Alfombra Jose", price: 4200, img: "../imagenes/productos/alfombra-pasillo.jpg", category: "alfombras", stock: 20 },
    { id: 8, producto: "Alfombra Mora", price: 6500, img: "../imagenes/productos/alfombra-yute-2.jpg", category: "alfombras", stock: 20 },
    { id: 9, producto: "Funda Flor", price: 1200, img: "../imagenes/productos/almohadon-tusor-rayado.jpeg", category: "fundas", stock: 25 },
    { id: 10, producto: "Funda Isabel", price: 1500, img: "../imagenes/productos/funda-almohadon-pelos.jpg", category: "fundas", stock: 25 },
    { id: 11, producto: "Funda Marga", price: 1300, img: "../imagenes/productos/funda-almohadon2.jpg", category: "fundas", stock: 25 },
    { id: 12, producto: "Funda Calma", price: 1100, img: "../imagenes/productos/funda-almohadon-calma.png", category: "fundas", stock: 25 },
    { id: 13, producto: "Cortina baño Ona", price: 2300, img: "../imagenes/productos/cortina-baño-crema.jpg", category: "cortinas", stock: 20 },
    { id: 14, producto: "Cortina baño Lisa", price: 2300, img: "../imagenes/productos/cortina-baño-lisa.jpg", category: "cortinas", stock: 20 },
    { id: 15, producto: "Cortina baño Galia", price: 2700, img: "../imagenes/productos/cortina-baño.jpg", category: "cortinas", stock: 20 },
    { id: 16, producto: "Cortina baño Pedro", price: 2300, img: "../imagenes/productos/cortina-baño-gris.jpg", category: "cortinas", stock: 20 },
];


//presento mis productos
function renderProducts(producto) {
    $('.containerProductos .row ').append(`
    <div class="card" category="${producto.category}">
        <img src="${producto.img}" class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${producto.producto}</h5>
          <p class="card-text">$${producto.price}</p>
          <button class="btn btn-primary button">Agregar al carrito</button>
        </div>
  </div>`)
}

for (const producto of productos) {
    renderProducts(producto)
}

//accedo a clase tbody en la tabla para agregar al carrito
const tbody = document.querySelector('.tbody')
//creo array carrito 
let carrito = []

//agrego evento que indique qué realizar cuando se hace click en los botones 'agregar al carrito'
$('.button').on('click', addToCart);

//creo funcion de añadir al carrito. accedo a las clases de los productos: precio, titulo, imagen
function addToCart(e) {
    const button = e.target
    const item = button.closest('.card')  //quiero el elemento más cercado a la clase card 

    const itemTitle = item.querySelector('.card-title').textContent;
    const itemPrice = item.querySelector('.card-text').textContent;
    const itemImg = item.querySelector('.card-img-top').src;

    //creo objeto
    const newItem = {
        title: itemTitle,
        price: itemPrice,
        img: itemImg,
        cantidad: 1,

    }

    addItemCarrito(newItem)
}

//creo funcion para añadir los objetos al array carrito
function addItemCarrito(newItem) {

    //ANIMACION con alert para agregar al carrito 

    $('.alert').fadeIn("slow", function () {
        $('.alert').fadeOut(4000);
    })


    //const InputElement = tbody.getElementsByClassName('input__element')
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].title.trim() === newItem.title.trim()) {
            carrito[i].cantidad++;
            const inputValue = $('tbody .input_element')[i]
            inputValue.value++;
            carritoTotal()
            return null;
        }
    }
    //agrego al carrito
    carrito.push(newItem)
    renderCarrito()


}

//funcion que agrega items para que se vean en el carrito html
function renderCarrito() {
    tbody.innerHTML = '';
    carrito.map(item => {
        const tr = document.createElement('tr')
        tr.classList.add('ItemCarrito')
        const Content =
            `
        <td class="tableProducts">
            <img class="imgCart" src= ${item.img}>
            <h6 class="title"> ${item.title}</h6>
        </td>
        <td class="tablePrice"><p>${item.price}</td>
        <td class="tableCant">
            <input type="number" min="1" value=${item.cantidad} class= "input__element">
            <button class="delete btn btn-primary" id="btnCarrito">X</button>
        </td>
`
        //agrego al TR creado, el contenido de la const Content
        tr.innerHTML = Content;
        tbody.append(tr)

        //creo evento para remover un item del  carrito cuando ya no lo quiero mas
        $('tr .delete').on('click', removeItemCart)
        //tr.querySelector(".delete").addEventListener('click', removeItemCart);
        //evento para cuando cambio cantidad en el carrito
        $('tr .input__element').on('change', sumaCantidad)
        //tr.querySelector(".input__element").addEventListener('change', sumaCantidad);

    })
    carritoTotal()
}


//creo funcion para saber total a abonar segun lo que haya seleccionado en carrito

function carritoTotal() {
    let Total = 0;
    const itemCartTotal = document.querySelector('.itemCartTotal')

    //a cada item en el carrito sólo quiero que muestre su precio
    carrito.forEach((item) => {
        const precio = Number(item.price.replace("$", ''))
        Total += precio * item.cantidad //calculo total 
    })


    itemCartTotal.innerHTML = `Total $${Total}`

    //quiero q cada vez que se cumpla la funcion, se guarde en el localstorage
    addLocalStorage()

}

//creo funcion para eliminar item de carrito
function removeItemCart(e) {
    const buttonDelete = e.target
    const tr = buttonDelete.closest('.ItemCarrito')
    const title = tr.querySelector('.title').textContent;
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].title.trim() === title.trim()) {
            carrito.splice(i, 1)   //elimino 1 solo elemento del carrito
        }
    }
    tr.remove()
    carritoTotal()

}

//creo funcion para que calcule la suma de los precios si aumenta cantidad desde carrito
function sumaCantidad(e) {
    const sumaInput = e.target
    const tr = sumaInput.closest('.ItemCarrito')
    const title = tr.querySelector(".title").textContent;
    carrito.forEach((item) => {
        if (item.title.trim() === title.trim()) {
            sumaInput.value < 1 ? (sumaInput.value = 1) : sumaInput.value;
            item.cantidad = sumaInput.value;
            carritoTotal()
        }

    })
}

//LOCALSTORAGE JSON


function addLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito))
}

window.onload = function () {
    const storage = JSON.parse(localStorage.getItem('carrito'));
    if (storage) {
        carrito = storage;
        renderCarrito()
    }
}


////// ANIMACION CUANDO HAGO CLICK EN EL CARRITO 

$('#btnCarrito').click(() => {
    $('#miModal').slideDown("slow")
});




// PRODUCTOS FILTRADOS  


$('.filtro').click(function(){
    let catProduct = $(this).attr('category');
    console.log(catProduct);

    //ocultando productos
   $('.card').hide();

    //mostrando productos correctos
    $('.card[category="'+catProduct+'"]').show();
    
});

//mostrar todos los productos 
$('.filtro[category="all"]').click(function(){
    $('.card').show();
});



//FORMULARIO AJAX PARA LA PAGE CONTACTANOS 
/*
var form = document.getElementById("myForm");

async function handleSubmit(event) {
    event.preventDefault();
    let status = document.getElementById("myFormStatus");
    let data = new FormData(event.target);
    fetch(event.target.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then( () => {
        status.innerHTML = "Gracias por su mensaje!";
        form.reset()
    }).catch( () => {
        status.innerHTML = "Hubo un error al enviar su mensaje. Intente nuevamente"
    });


    form.addEventListener("submit", handleSubmit)
}*/

const email = document.getElementById("correo_electronico");

email.addEventListener("input", function (event) {
  if (email.validity.typeMismatch) {
    email.setCustomValidity("¡Se esperaba una dirección de correo electrónico!");
  } else {
    email.setCustomValidity("");
  }
});


///// PROCESO PAGO 

$('.pago').click(() => {
    swal({
        title: "Estas seguro?",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
          swal("Gracias por tu compra!");
        });

});


//////////////////////////////////////////////////
/*


//eleccion de medio de pago
let medioDePago = 0;
function pago() {
    medioDePago = prompt("Ingrese su medio de pago entre tarjeta debito, credito o transferencia ");
    switch (medioDePago.toLowerCase()) {
        case "debito":
            document.write(`<p>El usuario ingresó como medio de pago ${medioDePago}. Tendrá 10% de descuento!</p>`)
            break;

        case "credito":
            document.write(`<p>El usuario ingresó como medio de pago ${medioDePago}. Tenemos 3, 6 y 12 cuotas sin interes</p>`)
            break;
        case "transferencia":
            document.write(`<p>El usuario ingresó como medio de pago ${medioDePago}. Tendrá 10% de descuento!</p>`)
            break;

        default:
            alert(`<p>No contamos con el medio de pago indicado</p>`);
    }
}


//funcion para calculo del total a abonar con descuento
const descuento = (a, b) => a - a * b;
totalDescuento = (descuento(Total, 0.10));

//funcion para calcular monto de cada cuota
const calculoCuotas = (a, b) => a / b;


//se informa total a abonar con descuento o en su defecto la posibilidad de cuotas sin interes
let eleccionCuotas = 0;
if ((medioDePago.toLowerCase() == "efectivo") || (medioDePago.toLowerCase() == "debito") || (medioDePago.toLowerCase() == "transferencia")) {
    document.write(`<h3>El total a abonar con descuento es de $ ${totalDescuento}</h3>`);
} else {
    eleccionCuotas = parseInt(prompt("Seleccione entre 3, 6 y 12 cuotas sin interes: "));
    document.write(`<p>El usuario eligio ${eleccionCuotas} cuotas sin interes</p>`);

}


//eleccion de cuotas por parte de usuario
if (medioDePago.toLowerCase() == "credito") {
    switch (eleccionCuotas) {
        case 3:
            document.write(`<h3>Cada cuota será de $${(calculoCuotas(total, 3)).toFixed(2)}</h3>`)
            break;
        case 6:
            document.write(`<h3>Cada cuota será de $${(calculoCuotas(total, 6)).toFixed(2)}</h3>`)
            break;
        case 12:
            document.write(`<h3>Cada cuota será de $${(calculoCuotas(total, 12)).toFixed(2)}</h3>`)
            break;
        default:
            document.write(`<p>No contamos con esa cantidad de cuotas sin interes.</p>`)
    }

} else {
    document.write(`<p>Gracias por su compra!</p></div>`)
}

*/



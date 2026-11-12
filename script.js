const botonesAgregar = document.querySelectorAll(".agregar");
const listaCarrito = document.getElementById("lista-carrito");
const cantidad = document.getElementById("cantidad");
const total = document.getElementById("total");
const botonVaciar = document.getElementById("vaciar-carrito");
const botonPedido = document.getElementById("hacer-pedido");

let carrito = [];

function actualizarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        listaCarrito.innerHTML = "<p>Tu carrito está vacío.</p>";
    }

    let suma = 0;
    let unidades = 0;

    carrito.forEach((producto, indice) => {
        suma += producto.precio * producto.cantidad;
        unidades += producto.cantidad;

        const elemento = document.createElement("p");
        elemento.textContent =
            `${producto.nombre} x${producto.cantidad} - $${(producto.precio * producto.cantidad).toLocaleString("es-CO")} `;

        const quitar = document.createElement("button");
        quitar.textContent = "Quitar";
        quitar.onclick = () => {
            carrito.splice(indice, 1);
            actualizarCarrito();
        };

        elemento.appendChild(quitar);
        listaCarrito.appendChild(elemento);
    });

    cantidad.textContent = unidades;
    total.textContent = "$" + suma.toLocaleString("es-CO");
}

botonesAgregar.forEach(boton => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);

        const existente = carrito.find(p => p.nombre === nombre);

        if (existente) {
            existente.cantidad++;
        } else {
            carrito.push({
                nombre,
                precio,
                cantidad: 1
            });
        }

        actualizarCarrito();
    });
});

botonVaciar.addEventListener("click", () => {
    carrito = [];
    actualizarCarrito();
});

botonPedido.addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Primero agrega productos a tu carrito.");
        return;
    }

    const resumen = carrito.map(p =>
        `${p.nombre} x${p.cantidad}`
    ).join("\n");

    alert("Tu pedido:\n" + resumen +
        "\nTotal: " + total.textContent +
        "\n\n¡Gracias por elegir Mini Dreamcom de Sabores!");
});

actualizarCarrito();

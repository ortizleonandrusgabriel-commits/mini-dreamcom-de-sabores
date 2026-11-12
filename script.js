const botonesAgregar = document.querySelectorAll(".agregar");
const listaCarrito = document.getElementById("lista-carrito");
const cantidad = document.getElementById("cantidad");
const total = document.getElementById("total");

const botonVaciar = document.getElementById("vaciar-carrito");
const botonPedido = document.getElementById("hacer-pedido");
const botonVerCarrito = document.getElementById("ver-carrito");

// Número de WhatsApp de Mini Dreamcom de Sabores
const WHATSAPP = "573023561621";

// Recuperar el carrito guardado
let carrito = [];

try {
    carrito = JSON.parse(localStorage.getItem("miniDreamcomCarrito")) || [];
    if (!Array.isArray(carrito)) carrito = [];
} catch {
    carrito = [];
}

// Guardar el carrito
function guardarCarrito() {
    localStorage.setItem(
        "miniDreamcomCarrito",
        JSON.stringify(carrito)
    );
}

// Formato de precios colombianos
function formatoPrecio(valor) {
    return "$" + valor.toLocaleString("es-CO");
}

// Actualizar la pantalla del carrito
function actualizarCarrito() {
    listaCarrito.innerHTML = "";

    let suma = 0;
    let unidades = 0;

    if (carrito.length === 0) {
        listaCarrito.textContent = "Tu carrito está vacío.";
    }

    carrito.forEach((producto, indice) => {
        suma += producto.precio * producto.cantidad;
        unidades += producto.cantidad;

        const elemento = document.createElement("div");

        const nombre = document.createElement("p");
        nombre.textContent = producto.nombre;

        const precio = document.createElement("p");
        precio.textContent = formatoPrecio(
            producto.precio * producto.cantidad
        );

        // Botón para restar
        const restar = document.createElement("button");
        restar.textContent = "−";
        restar.setAttribute("aria-label", "Restar una unidad");

        restar.addEventListener("click", () => {
            producto.cantidad--;

            if (producto.cantidad <= 0) {
                carrito.splice(indice, 1);
            }

            actualizarCarrito();
        });

        // Mostrar cantidad
        const unidadesProducto = document.createElement("span");
        unidadesProducto.textContent = " " + producto.cantidad + " ";

        // Botón para sumar
        const sumar = document.createElement("button");
        sumar.textContent = "+";
        sumar.setAttribute("aria-label", "Agregar una unidad");

        sumar.addEventListener("click", () => {
            producto.cantidad++;
            actualizarCarrito();
        });

        // Botón para eliminar
        const quitar = document.createElement("button");
        quitar.textContent = "Eliminar";

        quitar.addEventListener("click", () => {
            carrito.splice(indice, 1);
            actualizarCarrito();
        });

        elemento.appendChild(nombre);
        elemento.appendChild(precio);
        elemento.appendChild(restar);
        elemento.appendChild(unidadesProducto);
        elemento.appendChild(sumar);
        elemento.appendChild(quitar);

        listaCarrito.appendChild(elemento);
    });

    cantidad.textContent = unidades;
    total.textContent = formatoPrecio(suma);

    guardarCarrito();
}

// Agregar productos
botonesAgregar.forEach(boton => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.nombre;
        const precio = Number(boton.dataset.precio);

        if (!nombre || !Number.isFinite(precio) || precio <= 0) {
            alert("Este producto tiene información incorrecta.");
            return;
        }

        const existente = carrito.find(
            producto => producto.nombre === nombre
        );

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

// Vaciar carrito
botonVaciar.addEventListener("click", () => {
    if (carrito.length === 0) return;

    if (confirm("¿Quieres vaciar todo el carrito?")) {
        carrito = [];
        actualizarCarrito();
    }
});

// Abrir el carrito desde el encabezado
botonVerCarrito.addEventListener("click", () => {
    document.getElementById("carrito").scrollIntoView({
        behavior: "smooth"
    });
});

// Enviar pedido por WhatsApp
botonPedido.addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Primero agrega productos a tu carrito.");
        return;
    }

    let suma = 0;

    const resumen = carrito.map(producto => {
        const subtotal = producto.precio * producto.cantidad;
        suma += subtotal;

        return `• ${producto.nombre} x${producto.cantidad}: ${formatoPrecio(subtotal)}`;
    }).join("\n");

    const mensaje =
        "¡Hola! Quiero realizar un pedido en Mini Dreamcom de Sabores.\n\n" +
        resumen +
        "\n\nTOTAL: " + formatoPrecio(suma) +
        "\n\n¡Gracias!";

    const enlace =
        "https://wa.me/" + WHATSAPP +
        "?text=" + encodeURIComponent(mensaje);

    window.location.href = enlace;
});

// Mostrar el carrito al cargar la página
actualizarCarrito();

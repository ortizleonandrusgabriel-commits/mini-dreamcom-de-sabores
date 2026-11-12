/* MINI DREAMCOM DE SABORES - VERSION 2.0 */

console.log("MINI DREAMCOM - SCRIPT NUEVO 2.0");

document.addEventListener("DOMContentLoaded", () => {

    const botonesAgregar = document.querySelectorAll(".agregar");
    const listaCarrito = document.getElementById("lista-carrito");
    const cantidad = document.getElementById("cantidad");
    const total = document.getElementById("total");

    const botonVaciar = document.getElementById("vaciar-carrito");
    const botonPedido = document.getElementById("hacer-pedido");
    const botonVerCarrito = document.getElementById("ver-carrito");

    const WHATSAPP = "573023561621";
    const CLAVE = "miniDreamcomCarritoV2";

    let carrito = [];

    // Recuperar compras guardadas
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE));
        if (Array.isArray(guardado)) {
            carrito = guardado.filter(p =>
                p &&
                typeof p.nombre === "string" &&
                Number.isFinite(p.precio) &&
                Number.isInteger(p.cantidad) &&
                p.precio > 0 &&
                p.cantidad > 0
            );
        }
    } catch (error) {
        carrito = [];
    }

    function dinero(valor) {
        return "$" + valor.toLocaleString("es-CO");
    }

    function guardar() {
        localStorage.setItem(CLAVE, JSON.stringify(carrito));
    }

    function actualizar() {
        listaCarrito.innerHTML = "";

        let unidades = 0;
        let suma = 0;

        if (carrito.length === 0) {
            const mensaje = document.createElement("p");
            mensaje.textContent = "Tu carrito está vacío.";
            listaCarrito.appendChild(mensaje);
        }

        carrito.forEach((producto, indice) => {
            unidades += producto.cantidad;
            suma += producto.precio * producto.cantidad;

            const fila = document.createElement("div");

            const nombre = document.createElement("p");
            nombre.textContent = producto.nombre;

            const precio = document.createElement("p");
            precio.textContent = dinero(
                producto.precio * producto.cantidad
            );

            const controles = document.createElement("div");

            const restar = document.createElement("button");
            restar.textContent = "−";
            restar.onclick = () => {
                producto.cantidad--;

                if (producto.cantidad <= 0) {
                    carrito.splice(indice, 1);
                }

                actualizar();
            };

            const numero = document.createElement("span");
            numero.textContent = " " + producto.cantidad + " ";

            const sumar = document.createElement("button");
            sumar.textContent = "+";
            sumar.onclick = () => {
                producto.cantidad++;
                actualizar();
            };

            const eliminar = document.createElement("button");
            eliminar.textContent = "Eliminar";
            eliminar.onclick = () => {
                carrito.splice(indice, 1);
                actualizar();
            };

            controles.appendChild(restar);
            controles.appendChild(numero);
            controles.appendChild(sumar);
            controles.appendChild(eliminar);

            fila.appendChild(nombre);
            fila.appendChild(precio);
            fila.appendChild(controles);

            listaCarrito.appendChild(fila);
        });

        cantidad.textContent = unidades;
        total.textContent = dinero(suma);

        guardar();
    }

    // Agregar productos
    botonesAgregar.forEach(boton => {
        boton.onclick = () => {
            const nombre = boton.dataset.nombre;
            const precio = Number(boton.dataset.precio);

            if (!nombre || !Number.isFinite(precio) || precio <= 0) {
                alert("Este producto tiene información incorrecta.");
                return;
            }

            const existente = carrito.find(p => p.nombre === nombre);

            if (existente) {
                existente.cantidad++;
            } else {
                carrito.push({
                    nombre: nombre,
                    precio: precio,
                    cantidad: 1
                });
            }

            actualizar();
        };
    });

    // Vaciar carrito
    botonVaciar.onclick = () => {
        if (carrito.length === 0) return;

        if (confirm("¿Deseas vaciar tu carrito?")) {
            carrito = [];
            actualizar();
        }
    };

    // Ver carrito
    botonVerCarrito.onclick = () => {
        document.getElementById("carrito").scrollIntoView({
            behavior: "smooth"
        });
    };

    // Realizar pedido por WhatsApp
    botonPedido.onclick = () => {

        if (carrito.length === 0) {
            alert("Primero agrega productos a tu carrito.");
            return;
        }

        let suma = 0;

        const productos = carrito.map(p => {
            const subtotal = p.precio * p.cantidad;
            suma += subtotal;

            return "• " + p.nombre +
                " x" + p.cantidad +
                " = " + dinero(subtotal);
        }).join("\n");

        const mensaje =
            "¡Hola! Quiero realizar un pedido en MINI DREAMCOM DE SABORES.\n\n" +
            productos +
            "\n\nTOTAL: " + dinero(suma) +
            "\n\n¡Muchas gracias!";

        const enlace = "https://wa.me/" + WHATSAPP +
            "?text=" + encodeURIComponent(mensaje);

        window.open(enlace, "_blank");
    };

    actualizar();

    console.log("Carrito y pedidos listos - VERSION 2.0");

});

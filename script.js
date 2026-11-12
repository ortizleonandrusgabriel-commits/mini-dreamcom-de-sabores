/* MINI DREAMCOM DE SABORES
   CARRITO Y PEDIDOS - VERSION 3.0
*/

document.addEventListener("DOMContentLoaded", () => {

    const botonesAgregar = document.querySelectorAll(".agregar");
    const listaCarrito = document.getElementById("lista-carrito");
    const cantidad = document.getElementById("cantidad");
    const total = document.getElementById("total");

    const botonVaciar = document.getElementById("vaciar-carrito");
    const botonPedido = document.getElementById("hacer-pedido");
    const botonVerCarrito = document.getElementById("ver-carrito");

    const tipoEntrega = document.getElementById("tipo-entrega");
    const datosDomicilio = document.getElementById("datos-domicilio");
    const barrioCliente = document.getElementById("barrio-cliente");
    const puntoRecogida = document.getElementById("punto-recogida");

    const valorProductos = document.getElementById("valor-productos");
    const valorDomicilio = document.getElementById("valor-domicilio");
    const valorDescuento = document.getElementById("valor-descuento");
    const totalFinal = document.getElementById("total-final");

    const WHATSAPP = "573023561621";
    const CLAVE = "miniDreamcomCarritoV3";

    let carrito = [];

    // Comprobar que la configuración de domicilios esté cargada
    if (typeof CONFIG_DOMICILIOS === "undefined") {
        alert("No se encontró delivery.js. Revisa que esté en el repositorio.");
        return;
    }

    // Hacer que el cliente pueda elegir el punto
    // tanto para domicilio como para recogida.
    const datosRecogida = document.getElementById("datos-recogida");
    const datosPedido = document.querySelector(".datos-pedido");

    if (datosRecogida && datosPedido && puntoRecogida) {

        const seccionPunto = document.createElement("div");
        seccionPunto.id = "seleccion-punto";

        while (datosRecogida.firstChild) {
            seccionPunto.appendChild(datosRecogida.firstChild);
        }

        datosPedido.insertBefore(
            seccionPunto,
            datosDomicilio
        );

        datosRecogida.remove();
    }

    function dinero(valor) {
        return "$" + Number(valor).toLocaleString("es-CO");
    }

    function normalizar(texto) {
        return String(texto || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // Recuperar carrito guardado
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE));

        if (Array.isArray(guardado)) {
            carrito = guardado.filter(producto =>
                producto &&
                typeof producto.nombre === "string" &&
                Number.isFinite(producto.precio) &&
                Number.isInteger(producto.cantidad) &&
                producto.precio > 0 &&
                producto.cantidad > 0
            );
        }
    } catch (error) {
        carrito = [];
    }

    function guardar() {
        try {
            localStorage.setItem(CLAVE, JSON.stringify(carrito));
        } catch (error) {
            console.log("No se pudo guardar el carrito.");
        }
    }

    function calcularProductos() {
        return carrito.reduce(
            (suma, producto) =>
                suma + producto.precio * producto.cantidad,
            0
        );
    }

    // Buscar la información del barrio
    function buscarBarrio(nombre) {
        const barrios = CONFIG_DOMICILIOS.barrios || {};
        const buscado = normalizar(nombre);

        return Object.entries(barrios).find(([nombreBarrio]) =>
            normalizar(nombreBarrio) === buscado
        );
    }

    // Calcular domicilio y descuento
    function calcularEntrega() {

        if (tipoEntrega.value === "recogida") {
            return {
                tarifa: 0,
                descuento: 0,
                pendiente: false,
                zona: "Recogida gratuita"
            };
        }

        const barrio = barrioCliente.value.trim();

        if (!barrio) {
            return {
                tarifa: 0,
                descuento: 0,
                pendiente: true,
                zona: "Barrio pendiente"
            };
        }

        const encontrado = buscarBarrio(barrio);

        if (!encontrado) {
            return {
                tarifa: 0,
                descuento: 0,
                pendiente: true,
                zona: "Barrio por clasificar"
            };
        }

        const informacion = encontrado[1];
        const zona = informacion.zona;
        const tarifas = CONFIG_DOMICILIOS.tarifas || {};
        const tarifa = tarifas[zona];

        if (!zona || !Number.isFinite(tarifa)) {
            return {
                tarifa: 0,
                descuento: 0,
                pendiente: true,
                zona: "Tarifa por confirmar"
            };
        }

        const descuentoSolicitado =
            informacion.descuento ||
            CONFIG_DOMICILIOS.descuentoProvisional ||
            0;

        const descuento = Math.min(tarifa, descuentoSolicitado);

        return {
            tarifa: tarifa,
            descuento: descuento,
            pendiente: false,
            zona: zona
        };
    }

    // Mostrar el resumen de compra
    function actualizarResumen() {

        const subtotal = calcularProductos();
        const entrega = calcularEntrega();

        const domicilio = entrega.tarifa;
        const descuento = entrega.descuento;

        if (valorProductos) {
            valorProductos.textContent = dinero(subtotal);
        }

        if (valorDomicilio) {
            valorDomicilio.textContent = entrega.pendiente
                ? "Por confirmar"
                : dinero(domicilio);
        }

        if (valorDescuento) {
            valorDescuento.textContent = dinero(descuento);
        }

        if (totalFinal) {
            if (entrega.pendiente) {
                totalFinal.textContent = "Por confirmar";
            } else {
                totalFinal.textContent = dinero(
                    subtotal + domicilio - descuento
                );
            }
        }
    }

    // Actualizar carrito
    function actualizar() {

        listaCarrito.innerHTML = "";

        let unidades = 0;

        if (carrito.length === 0) {
            const mensaje = document.createElement("p");
            mensaje.textContent = "Tu carrito está vacío.";
            listaCarrito.appendChild(mensaje);
        }

        carrito.forEach((producto, indice) => {

            unidades += producto.cantidad;

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
        total.textContent = dinero(calcularProductos());

        actualizarResumen();
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

            const existente = carrito.find(
                producto => producto.nombre === nombre
            );

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

    // Cambiar entre domicilio y recogida
    tipoEntrega.addEventListener("change", () => {

        const esDomicilio = tipoEntrega.value === "domicilio";

        datosDomicilio.hidden = !esDomicilio;

        actualizarResumen();
    });

    // Actualizar cuando se escriba el barrio
    barrioCliente.addEventListener("input", actualizarResumen);

    // Vaciar carrito
    botonVaciar.onclick = () => {

        if (carrito.length === 0) return;

        if (confirm("¿Deseas vaciar tu carrito?")) {
            carrito = [];
            actualizar();
        }
    };

    // Ir al carrito
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

        const modalidad = tipoEntrega.value;
        const esDomicilio = modalidad === "domicilio";

        const nombre = document.getElementById("nombre-cliente").value.trim();
        const telefono = document.getElementById("telefono-cliente").value.trim();
        const barrio = barrioCliente.value.trim();
        const direccion = document.getElementById("direccion-cliente").value.trim();
        const referencia = document.getElementById("referencia-cliente").value.trim();

        if (esDomicilio) {

            if (!nombre || !barrio || !direccion) {
                alert("Completa tu nombre, barrio y dirección para continuar.");
                return;
            }
        }

        const puntos = CONFIG_DOMICILIOS.puntos || [];

        const puntoElegido = puntos.find(
            punto => punto.id === puntoRecogida.value
        );

        if (!puntoElegido) {
            alert("Selecciona un punto de atención válido.");
            return;
        }

        const subtotal = calcularProductos();
        const entrega = calcularEntrega();

        let suma = 0;

        const productos = carrito.map(producto => {

            const parcial = producto.precio * producto.cantidad;
            suma += parcial;

            return "• " + producto.nombre +
                " x" + producto.cantidad +
                " = " + dinero(parcial);

        }).join("\n");

        let mensaje =
            "¡Hola! Quiero realizar un pedido en MINI DREAMCOM DE SABORES.\n\n";

        if (nombre) {
            mensaje += "Nombre: " + nombre + "\n";
        }

        if (telefono) {
            mensaje += "Teléfono: " + telefono + "\n";
        }

        mensaje += "\nPRODUCTOS:\n" + productos;

        mensaje += "\n\nMODALIDAD: " +
            (esDomicilio ? "Domicilio" : "Recogida gratuita");

        mensaje += "\nPUNTO ELEGIDO: " + puntoElegido.nombre;

        if (esDomicilio) {

            mensaje += "\nBarrio: " + barrio;
            mensaje += "\nDirección: " + direccion;

            if (referencia) {
                mensaje += "\nIndicaciones: " + referencia;
            }

            if (entrega.pendiente) {
                mensaje += "\nDomicilio: pendiente de confirmar";
                mensaje += "\nTotal de productos: " + dinero(subtotal);
                mensaje += "\nTOTAL FINAL: pendiente de confirmar tarifa";
            } else {
                mensaje += "\nDomicilio: " + dinero(entrega.tarifa);
                mensaje += "\nDescuento: " + dinero(entrega.descuento);

                mensaje += "\nTOTAL FINAL: " +
                    dinero(subtotal + entrega.tarifa - entrega.descuento);
            }

        } else {

            mensaje += "\nDomicilio: $0";
            mensaje += "\nTOTAL A PAGAR: " + dinero(subtotal);
        }

        mensaje += "\n\n¡Muchas gracias!";

        const enlace = "https://wa.me/" + WHATSAPP +
            "?text=" + encodeURIComponent(mensaje);

        window.open(enlace, "_blank");
    };

    // Estado inicial
    datosDomicilio.hidden = tipoEntrega.value !== "domicilio";

    actualizar();

    console.log("Mini Dreamcom: carrito y pedidos listos - VERSION 3.0");

});

/* MINI DREAMCOM DE SABORES
   CARRITO, DOMICILIOS Y PEDIDOS
   VERSION 5.5 - NOTIFICACIONES Y AGRADECIMIENTO
*/

document.addEventListener("DOMContentLoaded", () => {

    // ELEMENTOS DE LA PÁGINA
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
    const CLAVE = "miniDreamcomCarritoV4";

    let carrito = [];

    // COMPROBAR ELEMENTOS PRINCIPALES
    if (!listaCarrito || !cantidad || !total) {
        console.error("Faltan elementos del carrito en index.html.");
        return;
    }

    if (
        !tipoEntrega ||
        !datosDomicilio ||
        !barrioCliente ||
        !puntoRecogida
    ) {
        console.error("Faltan elementos de entrega en index.html.");
        return;
    }

    if (typeof CONFIG_DOMICILIOS === "undefined") {
        alert("No se encontró delivery.js. Revisa que esté guardado en el repositorio.");
        return;
    }

    // CONEXIÓN CON SUPABASE
    const supabaseClient = window.supabaseClient || null;

    console.log("Librería Supabase:", window.supabase);
    console.log("Cliente Supabase:", window.supabaseClient);
    console.log("Cliente recibido:", supabaseClient);

    if (!supabaseClient) {
        console.error("No se encontró la conexión con Supabase.");
    }

    // ORGANIZAR PUNTO DE RECOGIDA
    const datosRecogida = document.getElementById("datos-recogida");
    const datosPedido = document.querySelector(".datos-pedido");

    if (datosRecogida && datosPedido) {
        const seccionPunto = document.createElement("div");
        seccionPunto.id = "seleccion-punto";

        while (datosRecogida.firstChild) {
            seccionPunto.appendChild(datosRecogida.firstChild);
        }

        datosPedido.insertBefore(seccionPunto, datosDomicilio);
        datosRecogida.remove();
    }

    // FUNCIONES GENERALES
    function dinero(valor) {
        return "$" + Number(valor || 0).toLocaleString("es-CO");
    }

    function normalizar(texto) {
        return String(texto || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }

    // NOTIFICACIÓN VERDE AL AGREGAR PRODUCTOS
    let temporizadorNotificacion;

    function mostrarNotificacion(texto) {

        let notificacion = document.getElementById("notificacion-producto");

        if (!notificacion) {
            notificacion = document.createElement("div");
            notificacion.id = "notificacion-producto";

            Object.assign(notificacion.style, {
                position: "fixed",
                top: "18px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "calc(100% - 30px)",
                maxWidth: "420px",
                padding: "16px",
                background: "#dcfce7",
                color: "#166534",
                border: "1px solid #86efac",
                borderRadius: "12px",
                boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
                zIndex: "99999",
                fontSize: "15px",
                fontWeight: "bold",
                textAlign: "center",
                opacity: "0",
                transition: "opacity 0.3s ease"
            });

            document.body.appendChild(notificacion);
        }

        notificacion.textContent = "✓ " + texto;
        notificacion.style.display = "block";

        clearTimeout(temporizadorNotificacion);

        requestAnimationFrame(() => {
            notificacion.style.opacity = "1";
        });

        temporizadorNotificacion = setTimeout(() => {
            notificacion.style.opacity = "0";

            setTimeout(() => {
                notificacion.style.display = "none";
            }, 300);

        }, 2800);
    }

    // PANTALLA DE AGRADECIMIENTO
    function mostrarAgradecimiento() {

        let pantalla = document.getElementById("pantalla-agradecimiento");

        if (!pantalla) {

            pantalla = document.createElement("div");
            pantalla.id = "pantalla-agradecimiento";

            Object.assign(pantalla.style, {
                position: "fixed",
                inset: "0",
                background: "rgba(0,0,0,0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                zIndex: "100000"
            });

            const tarjeta = document.createElement("div");

            Object.assign(tarjeta.style, {
                background: "#ffffff",
                color: "#333333",
                width: "100%",
                maxWidth: "380px",
                padding: "30px 22px",
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: "0 8px 30px rgba(0,0,0,0.25)"
            });

            const icono = document.createElement("div");
            icono.textContent = "❤️";
            icono.style.fontSize = "48px";
            icono.style.marginBottom = "12px";

            const titulo = document.createElement("h2");
            titulo.textContent = "¡Gracias por tu compra!";
            titulo.style.color = "#15803d";
            titulo.style.marginBottom = "14px";

            const mensaje = document.createElement("p");
            mensaje.textContent =
                "Tu pedido ha sido registrado correctamente. Gracias por elegir Mini Dreamcom de Sabores. ¡Esperamos que disfrutes cada bocado!";
            mensaje.style.lineHeight = "1.6";
            mensaje.style.marginBottom = "22px";

            const botonNuevo = document.createElement("button");
            botonNuevo.type = "button";
            botonNuevo.textContent = "¡Hacer otro pedido!";

            Object.assign(botonNuevo.style, {
                background: "#16a34a",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "13px 20px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                width: "100%"
            });

            botonNuevo.addEventListener("click", () => {

                carrito = [];
                actualizar();

                const campos = [
                    "nombre-cliente",
                    "telefono-cliente",
                    "barrio-cliente",
                    "direccion-cliente",
                    "referencia-cliente"
                ];

                campos.forEach(id => {
                    const campo = document.getElementById(id);
                    if (campo) campo.value = "";
                });

                tipoEntrega.value = "recogida";
                datosDomicilio.hidden = true;

                actualizarResumen();

                pantalla.remove();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            });

            tarjeta.appendChild(icono);
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(mensaje);
            tarjeta.appendChild(botonNuevo);

            pantalla.appendChild(tarjeta);
            document.body.appendChild(pantalla);
        }
    }

    // RECUPERAR CARRITO
    try {
        const guardado = JSON.parse(localStorage.getItem(CLAVE));

        if (Array.isArray(guardado)) {
            carrito = guardado.filter(producto =>
                producto &&
                typeof producto.nombre === "string" &&
                Number.isFinite(Number(producto.precio)) &&
                Number.isInteger(Number(producto.cantidad)) &&
                Number(producto.precio) > 0 &&
                Number(producto.cantidad) > 0
            ).map(producto => ({
                nombre: producto.nombre,
                precio: Number(producto.precio),
                cantidad: Number(producto.cantidad)
            }));
        }
    } catch (error) {
        carrito = [];
        console.error("No se pudo recuperar el carrito:", error);
    }

    function guardar() {
        try {
            localStorage.setItem(CLAVE, JSON.stringify(carrito));
        } catch (error) {
            console.error("No se pudo guardar el carrito:", error);
        }
    }

    function calcularProductos() {
        return carrito.reduce(
            (suma, producto) =>
                suma + producto.precio * producto.cantidad,
            0
        );
    }

    // BUSCAR BARRIO
    function buscarBarrio(nombre) {
        const punto = puntoRecogida.value;
        const zonas = CONFIG_DOMICILIOS.zonasPorPunto?.[punto] || {};
        const buscado = normalizar(nombre);

        return Object.entries(zonas).find(([nombreBarrio]) =>
            normalizar(nombreBarrio) === buscado
        );
    }

    // CALCULAR DOMICILIO
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
                zona: "Falta seleccionar el barrio"
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
        const tarifas = CONFIG_DOMICILIOS.tarifas || {};
        const tarifa = tarifas[informacion.zona];

        if (!Number.isFinite(tarifa)) {
            return {
                tarifa: 0,
                descuento: 0,
                pendiente: true,
                zona: "Tarifa por confirmar"
            };
        }

        const descuento = Number.isFinite(informacion.descuento)
            ? Math.min(tarifa, informacion.descuento)
            : 0;

        return {
            tarifa,
            descuento,
            pendiente: false,
            zona: informacion.zona
        };
    }

    // ACTUALIZAR RESUMEN
    function actualizarResumen() {

        const subtotal = calcularProductos();
        const entrega = calcularEntrega();

        if (valorProductos) {
            valorProductos.textContent = dinero(subtotal);
        }

        if (valorDomicilio) {
            valorDomicilio.textContent = entrega.pendiente
                ? "Por confirmar"
                : dinero(entrega.tarifa);
        }

        if (valorDescuento) {
            valorDescuento.textContent = dinero(entrega.descuento);
        }

        if (totalFinal) {
            totalFinal.textContent = entrega.pendiente
                ? "Por confirmar"
                : dinero(subtotal + entrega.tarifa - entrega.descuento);
        }
    }

    // ACTUALIZAR CARRITO
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
            restar.type = "button";
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
            sumar.type = "button";
            sumar.textContent = "+";

            sumar.onclick = () => {
                producto.cantidad++;
                actualizar();
            };

            const eliminar = document.createElement("button");
            eliminar.type = "button";
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

    // AGREGAR PRODUCTOS
    botonesAgregar.forEach(boton => {

        boton.type = "button";

        boton.addEventListener("click", (evento) => {

            evento.preventDefault();

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

            actualizar();

            // NUEVO: MENSAJE VERDE DE CONFIRMACIÓN
            mostrarNotificacion(
                "¡Producto agregado! Tu antojito ya está en el carrito. ¡Gracias por elegirnos!"
            );

            console.log("Producto agregado:", nombre);
        });
    });

    console.log("Botones de productos encontrados:", botonesAgregar.length);

    // CAMBIAR DOMICILIO O RECOGIDA
    tipoEntrega.addEventListener("change", () => {

        const esDomicilio = tipoEntrega.value === "domicilio";

        datosDomicilio.hidden = !esDomicilio;

        actualizarResumen();
    });

    barrioCliente.addEventListener("input", actualizarResumen);
    puntoRecogida.addEventListener("change", actualizarResumen);

    // VACIAR CARRITO
    if (botonVaciar) {
        botonVaciar.type = "button";

        botonVaciar.onclick = () => {

            if (carrito.length === 0) return;

            if (confirm("¿Deseas vaciar tu carrito?")) {
                carrito = [];
                actualizar();
            }
        };
    }

    // VER CARRITO
    if (botonVerCarrito) {
        botonVerCarrito.type = "button";

        botonVerCarrito.onclick = (evento) => {
            evento.preventDefault();

            document.getElementById("carrito")?.scrollIntoView({
                behavior: "smooth"
            });
        };
    }

    // REALIZAR PEDIDO
    if (botonPedido) {

        botonPedido.onclick = async (evento) => {

            evento.preventDefault();

            if (carrito.length === 0) {
                alert("Primero agrega productos a tu carrito.");
                return;
            }

            const modalidad = tipoEntrega.value;
            const esDomicilio = modalidad === "domicilio";

            const nombre = document.getElementById("nombre-cliente")?.value.trim() || "";
            const telefono = document.getElementById("telefono-cliente")?.value.trim() || "";
            const barrio = barrioCliente.value.trim();
            const direccion = document.getElementById("direccion-cliente")?.value.trim() || "";
            const referencia = document.getElementById("referencia-cliente")?.value.trim() || "";

            if (esDomicilio && (!nombre || !barrio || !direccion)) {
                alert("Completa tu nombre, barrio y dirección para continuar.");
                return;
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

            if (esDomicilio && entrega.pendiente) {
                alert("El domicilio de este barrio está pendiente de confirmar. Comunícate con nosotros por WhatsApp para conocer la tarifa.");
            }

            const productosMensaje = carrito.map(producto => {
                const parcial = producto.precio * producto.cantidad;

                return "• " + producto.nombre +
                    " x" + producto.cantidad +
                    " = " + dinero(parcial);
            }).join("\n");

            let mensaje =
                "¡Hola! Quiero realizar un pedido en MINI DREAMCOM DE SABORES.\n\n";

            if (nombre) mensaje += "Nombre: " + nombre + "\n";
            if (telefono) mensaje += "Teléfono: " + telefono + "\n";

            mensaje += "\nPRODUCTOS:\n" + productosMensaje;

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
                    mensaje += "\nTOTAL FINAL: pendiente de confirmar domicilio";
                } else {
                    mensaje += "\nDomicilio: " + dinero(entrega.tarifa);
                    mensaje += "\nDescuento de domicilio: " + dinero(entrega.descuento);
                    mensaje += "\nTOTAL A PAGAR: " +
                        dinero(subtotal + entrega.tarifa - entrega.descuento);
                }

            } else {
                mensaje += "\nDomicilio: $0";
                mensaje += "\nTOTAL A PAGAR: " + dinero(subtotal);
            }

            mensaje += "\n\n¡Muchas gracias!";

            const enlace = "

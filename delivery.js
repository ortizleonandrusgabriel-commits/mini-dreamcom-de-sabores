/* MINI DREAMCOM DE SABORES
   SISTEMA DE DOMICILIOS - VERSION 1.0
*/

const CONFIG_DOMICILIOS = {

    // Tarifas provisionales
    tarifas: {
        cercana: 3000,
        intermedia: 4000,
        lejana: 7000
    },

    // Puntos de atención y recogida
    puntos: [
        {
            id: "terminal",
            nombre: "Sector Terminal de Transporte",
            descripcion: "Punto de atención y recogida cerca de la Terminal."
        },
        {
            id: "bazurto",
            nombre: "Sector Mercado de Bazurto",
            descripcion: "Punto de atención y recogida cerca de Bazurto."
        }
    ],

    // Barrios y promociones.
    // Después asignaremos cada barrio a su zona correspondiente.
    barrios: {
        "La Esperanza": {
            zona: "",
            descuento: 1000
        },
        "La Candelaria": {
            zona: "",
            descuento: 1000
        },
        "El Pozón": {
            zona: "",
            descuento: 1000
        },
        "La María": {
            zona: "",
            descuento: 1000
        },
        "Olaya": {
            zona: "",
            descuento: 1000
        }
    },

    descuentoProvisional: 1000
};

console.log("Configuración de domicilios cargada.");

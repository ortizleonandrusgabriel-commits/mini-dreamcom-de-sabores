/* MINI DREAMCOM DE SABORES
   DOMICILIOS INDEPENDIENTES
   TERMINAL Y BAZURTO - VERSION 3.0
*/

const CONFIG_DOMICILIOS = {

    // Tarifas provisionales
    tarifas: {
        cercana: 3000,
        intermedia: 5000,
        lejana: 7000
    },

    // Puntos que puede elegir el cliente
    puntos: [
        {
            id: "terminal",
            nombre: "Sector Terminal de Transporte"
        },
        {
            id: "bazurto",
            nombre: "Sector Mercado de Bazurto"
        }
    ],

    // Clasificación independiente por punto
    zonasPorPunto: {

        terminal: {

            "La Esperanza": {
                zona: "cercana",
                descuento: 1000
            },

            "La Candelaria": {
                zona: "cercana",
                descuento: 1000
            },

            "El Pozón": {
                zona: "intermedia",
                descuento: 1000
            },

            "La María": {
                zona: "cercana",
                descuento: 1000
            },

            "Olaya": {
                zona: "cercana",
                descuento: 1000
            },

            "El Cabrero": {
                zona: "lejana",
                descuento: 0
            },

            "El Espinal": {
                zona: "lejana",
                descuento: 0
            },

            "Crespo": {
                zona: "lejana",
                descuento: 0
            },

            "Bocagrande": {
                zona: "lejana",
                descuento: 0
            },

            "Manga": {
                zona: "lejana",
                descuento: 0
            },

            "Torices": {
                zona: "lejana",
                descuento: 0
            }
        },

        bazurto: {

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
            },

            "El Cabrero": {
                zona: "",
                descuento: 0
            },

            "El Espinal": {
                zona: "",
                descuento: 0
            },

            "Crespo": {
                zona: "",
                descuento: 0
            },

            "Bocagrande": {
                zona: "",
                descuento: 0
            },

            "Manga": {
                zona: "",
                descuento: 0
            },

            "Torices": {
                zona: "",
                descuento: 0
            }
        }
    },

    descuentoProvisional: 1000
};

console.log(
    "Mini Dreamcom: zonas independientes de Terminal y Bazurto cargadas."
);

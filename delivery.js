/* MINI DREAMCOM DE SABORES
   CONFIGURACIÓN DE DOMICILIOS
   TERMINAL Y BAZURTO
*/

const CONFIG_DOMICILIOS = {

    // Tarifas de domicilio
    tarifas: {
        cercana: 3000,
        intermedia: 5000,
        lejana: 7000
    },

    // Descuento aplicado una sola vez al domicilio
    descuentoProvisional: 1500,

    // Puntos de atención
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

    // Barrios y tarifas según el punto de atención
    zonasPorPunto: {

        terminal: {

            "La Esperanza": {
                zona: "cercana",
                descuento: 1500
            },

            "La Candelaria": {
                zona: "cercana",
                descuento: 1500
            },

            "El Pozón": {
                zona: "intermedia",
                descuento: 1500
            },

            "La María": {
                zona: "cercana",
                descuento: 1500
            },

            "Olaya": {
                zona: "cercana",
                descuento: 1500
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
            },

            "Marbella": {
                zona: "lejana",
                descuento: 0
            }
        },

        bazurto: {

            "La Esperanza": {
                zona: "cercana",
                descuento: 1500
            },

            "La Candelaria": {
                zona: "cercana",
                descuento: 1500
            },

            "El Pozón": {
                zona: "intermedia",
                descuento: 1500
            },

            "La María": {
                zona: "cercana",
                descuento: 1500
            },

            "Olaya": {
                zona: "cercana",
                descuento: 1500
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
            },

            "Marbella": {
                zona: "lejana",
                descuento: 0
            }
        }
    }
};

console.log("Mini Dreamcom: domicilios configurados correctamente.");

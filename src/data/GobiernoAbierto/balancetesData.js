const makeCategorias = (meses) => [
    {
        nombre: "Disponibilidad",
        icono: "accountBalanceWallet",
        informes: meses.map((mes) => ({ mes, enlace: "" }))
    },
    {
        nombre: "Ejecución Egresos",
        icono: "trendingDownIcon",
        informes: meses.map((mes) => ({ mes, enlace: "" }))
    },
    {
        nombre: "Ejecución Ingresos",
        icono: "trendingUpIcon",
        informes: meses.map((mes) => ({ mes, enlace: "" }))
    }
]

export const BALANCETES_DATA = [
    {
        año: 2025,
        trimestres: [
            {
                numero: 1,
                titulo: "1° Trimestre",
                descripcion: "Análisis detallado: Enero - Marzo 2025.",
                meses: ["Enero", "Febrero", "Marzo"],
                categorias: [
                    {
                        nombre: "Disponibilidad",
                        icono: "accountBalanceWallet",
                        informes: [
                            { mes: "Enero",   enlace: "https://drive.google.com/file/d/1KcbBE4G4X39UClaPVI6uv466tCPzAMCO/view" },
                            { mes: "Febrero", enlace: "https://drive.google.com/file/d/1t38Ll8dAXer6sKuu6QBoa3wUrgUcssp9/view" },
                            { mes: "Marzo",   enlace: "https://drive.google.com/file/d/1yB8zlpK9PqT0J1innfwXMTkPArs9x0zT/view" }
                        ]
                    },
                    {
                        nombre: "Ejecución Egresos",
                        icono: "trendingDownIcon",
                        informes: [
                            { mes: "Enero",   enlace: "https://drive.google.com/file/d/1vG9U3U_np7M3vlQd8pIEAkN3ckt8701k/view" },
                            { mes: "Febrero", enlace: "https://drive.google.com/file/d/1Cd6D37uIsi0WiKUdxvuSksTP07mcqc0L/view" },
                            { mes: "Marzo",   enlace: "https://drive.google.com/file/d/17hWOCxQAk1ilypGb_VOA5uzJktzJoRrB/view" }
                        ]
                    },
                    {
                        nombre: "Ejecución Ingresos",
                        icono: "trendingUpIcon",
                        informes: [
                            { mes: "Enero",   enlace: "https://drive.google.com/file/d/1Tvsy8QPE-WF8KDpbtALmb_ZOYaapoILp/view" },
                            { mes: "Febrero", enlace: "https://drive.google.com/file/d/1aV8ID4ysOxHEpYAau6k9wegm0qulGKQo/view" },
                            { mes: "Marzo",   enlace: "https://drive.google.com/file/d/1KM_6H7nJqsu6xwDQAMo6W1UgOobGChcB/view" }
                        ]
                    }
                ]
            },
            {
                numero: 2,
                titulo: "2° Trimestre",
                descripcion: "Análisis detallado: Abril - Junio 2025.",
                meses: ["Abril", "Mayo", "Junio"],
                categorias: [
                    {
                        nombre: "Disponibilidad",
                        icono: "accountBalanceWallet",
                        informes: [
                            { mes: "Abril",  enlace: "https://drive.google.com/file/d/1PA1QG65f3NZtVZszqpjN3mVSCOXIAsaO/view" },
                            { mes: "Mayo",   enlace: "https://drive.google.com/file/d/1qZWMjHPfc12Bg_xSCqvpbhEun-BN8KKg/view" },
                            { mes: "Junio",  enlace: "https://drive.google.com/file/d/1pzcZEb5wqwyiezDIb4VFQypTv0-UWXXa/view" }
                        ]
                    },
                    {
                        nombre: "Ejecución Egresos",
                        icono: "trendingDownIcon",
                        informes: [
                            { mes: "Abril",  enlace: "https://drive.google.com/file/d/1sEJ4wpJMrXsH-ej1ivg4It4di8aKYAs6/view" },
                            { mes: "Mayo",   enlace: "https://drive.google.com/file/d/1kBb8rFw27fx5tfLuLpLM1YOouqOVmOHn/view" },
                            { mes: "Junio",  enlace: "https://drive.google.com/file/d/1kv5hQrWJ66mtTr_lVyb0C0JRMxWbGAQm/view" }
                        ]
                    },
                    {
                        nombre: "Ejecución Ingresos",
                        icono: "trendingUpIcon",
                        informes: [
                            { mes: "Abril",  enlace: "https://drive.google.com/file/d/1cBbgfIdJv2lq_rFMj2ugXv32QxI7K-q1/view" },
                            { mes: "Mayo",   enlace: "https://drive.google.com/file/d/1vwh8j7TfzufK33RI3FDoeoIPdsTewNha/view" },
                            { mes: "Junio",  enlace: "https://drive.google.com/file/d/1mUdBq14XCfW7_hq_Ky15GihXVt20jHe6/view" }
                        ]
                    }
                ]
            },
            {
                numero: 3,
                titulo: "3° Trimestre",
                descripcion: "Análisis detallado: Julio - Septiembre 2025.",
                meses: ["Julio", "Agosto", "Septiembre"],
                categorias: [
                    {
                        nombre: "Disponibilidad",
                        icono: "accountBalanceWallet",
                        informes: [
                            { mes: "Julio",      enlace: "https://drive.google.com/file/d/1fs2i7RZLcYQ07nCFnaXnQHkGZ73jRtfa/view" },
                            { mes: "Agosto",     enlace: "https://drive.google.com/file/d/1kSp7dhoxmMqN22t-OnYB4zQ0kF07tMW0/view" },
                            { mes: "Septiembre", enlace: "https://drive.google.com/file/d/1PfWCKa7hcyQ1Hvo5AKcJn0L_J-TFcojj/view" }
                        ]
                    },
                    {
                        nombre: "Ejecución Egresos",
                        icono: "trendingDownIcon",
                        informes: [
                            { mes: "Julio",      enlace: "https://drive.google.com/file/d/1Ze3iApU6bYdErLZ-Z2s30FI0cXor6ezh/view" },
                            { mes: "Agosto",     enlace: "https://drive.google.com/file/d/1wYGfDdN8VjdRqLOcaKvJdrHsZ95dv9NN/view" },
                            { mes: "Septiembre", enlace: "https://drive.google.com/file/d/1GsgHS9ZuRrIL5bQUTrv8VRtFSixhBVc-/view" }
                        ]
                    },
                    {
                        nombre: "Ejecución Ingresos",
                        icono: "trendingUpIcon",
                        informes: [
                            { mes: "Julio",      enlace: "https://drive.google.com/file/d/1BIJt4S05cmWG57foLn-wdAYMpw1i-is_/view" },
                            { mes: "Agosto",     enlace: "https://drive.google.com/file/d/1IIm7SGzzVMNM98Zgw5fKJD4cqokt3xST/view" },
                            { mes: "Septiembre", enlace: "https://drive.google.com/file/d/1vHqb-9pV2KV4Oa_LtzfNPDQlLv3pFgLr/view" }
                        ]
                    }
                ]
            },
            {
                numero: 4,
                titulo: "4° Trimestre",
                descripcion: "Análisis detallado: Octubre - Diciembre 2025.",
                meses: ["Octubre", "Noviembre", "Diciembre"],
                categorias: makeCategorias(["Octubre", "Noviembre", "Diciembre"])
            }
        ]
    }
]

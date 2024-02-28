const tilesProvider = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png	";
let map = L.map("map", {
    scrollWheelZoom: true, // Asegurarse de que el zoom con scroll esté habilitado
    doubleClickZoom: false, // Deshabilitar el zoom con doble clic
}).setView([-12.034648172427179, -77.02137380889968], 13);

L.tileLayer(tilesProvider, {
    maxZoom: 30,
}).addTo(map);

// L.Control.geocoder().addTo(map);

let polygon;

let marker_incidencia;

var currentMarkers = [];

var globalPolygons = []; // Almacena los polígonos aquí

// Ejemplo de cómo usar la función showPolygonFromCSV
var csvPath = "/Zarate.csv";
var csvFilePath1 = "/10 de Octubre.csv"; // Reemplaza 'tu_archivo.csv' con la ruta de tu archivo CSV
var csvFilePath2 = "/Bayovar.csv"; // Reemplaza 'tu_archivo.csv' con la ruta de tu archivo CSV
var csvFilePath3 = "/Caja de Agua.csv"; // Reemplaza 'tu_archivo.csv' con la ruta de tu archivo CSV
var csvFilePath4 = "/Canto Rey.csv"; // Reemplaza 'tu_archivo.csv' con la ruta de tu archivo CSV
var csvFilePath5 = "/La Huayrona.csv"; // Reemplaza 'tu_archivo.csv' con la ruta de tu archivo CSV
var csvFilePath6 = "/Mariscal Caceres.csv"; // Reemplaza 'tu_archivo.csv' con la ruta de tu archivo CSV
var csvFilePath7 = "/Santa Elizabeth.csv"; // Reemplaza 'tu_archivo.csv' con la ruta de tu archivo CSV
var polygonColor = "black"; // Color del polígono
var polygonColor2 = "blue"; // Color del polígono
var polygonColor3 = "green"; // Color del polígono
var polygonColor4 = "purple"; // Color del polígono
var polygonColor5 = "orange"; // Color del polígono
var polygonColor6 = "red"; // Color del polígono
var polygonColor7 = "gray"; // Color del polígono
var polygonColor8 = "brown"; // Color del polígono

function clearMarkers() {
    for (var i = 0; i < currentMarkers.length; i++) {
        map.removeLayer(currentMarkers[i]);
    }
    currentMarkers = []; // Limpiar el array
}

function showMarkerIncidencias() {
    var redIcon = L.icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var blueIcon = L.icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var greenIcon = new L.Icon({
        iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var orangeIcon = new L.Icon({
        iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var url = window.miVariableDeEntorno;
    $.ajax({
        url: "/obtener-incidencias",
        type: "GET",
        success: function (data) {
            clearMarkers();
            // Agregar las nuevas opciones
            $.each(data, function (key, value) {
                if (value.latitud !== null && value.longitud !== null) {
                    // Crear el marcador
                    // var markerColor =
                    //     value.situacion.id === 3 ? greenIcon : orangeIcon;
                    var markerColor =
                        value.situacion.id === 1
                            ? orangeIcon
                            : value.situacion.id === 2
                            ? blueIcon
                            : value.situacion.id === 3
                            ? greenIcon
                            : defaultIcon;
                    // Si el id es 1, el color es verde, de lo contrario, es rojo
                    var marker_incidencia = L.marker(
                        [value.latitud, value.longitud],
                        { icon: markerColor }
                    ).addTo(map);

                    var url_atender = `${url}/incidencias/atender/${value.id}`;

                    var url_ver = `${url}/incidencias/${value.id}`;

                    // Crear el contenido del popup
                    var popupContent = `
                        <div>
                            <b>N° INCIDENCIA: ${value.id}</b>
                            <li><strong>UNIDAD:</strong> ${
                                value.unidad.descripcion
                            }</li>
                            <li><strong>CASO:</strong> ${
                                value.tipo_caso.descripcion
                            }</li>
                            <li><strong>SUB CASO:</strong> ${
                                value.sub_tipo_caso.descripcion
                            }</li>
                            <li><strong>REPORTANTE:</strong> ${
                                value.nombre_reportante
                            }</li>
                            <li><strong>TELEFONO:</strong> ${
                                value.telefono_reportante
                            }</li>
                            <li><strong>FECHA NOT:</strong> ${
                                value.fecha_registro
                            }</li>
                            <li><strong>FECHA INC:</strong> ${
                                value.fecha_ocurrencia
                            }</li>
                            <li><strong>SITUACION:</strong> ${
                                value.situacion.descripcion
                            }</li>
                            <hr>
                            <a href="${
                                value.situacion.id === 3
                                    ? `${url_ver}`
                                    : `${url_atender}`
                            }" class="btn btn-primary" style="color: white;">${
                        value.situacion.id === 3 ? "VER" : "ATENDER"
                    }</a>
                        </div>
                    `;

                    // Asignar el contenido del popup al marcador
                    marker_incidencia.bindPopup(popupContent);
                } else {
                    console.log(
                        "No hay datos válidos para el marcador:",
                        value
                    );
                }
                currentMarkers.push(marker_incidencia);
            });
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            // Manejar el error si es necesario
        },
    });
}

function showMarkerIncidenciasxEstado(idEstado) {
    var redIcon = L.icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var blueIcon = L.icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var greenIcon = new L.Icon({
        iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var orangeIcon = new L.Icon({
        iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var url = window.miVariableDeEntorno;
    $.ajax({
        url: "/obtener-incidencias-estado/" + idEstado,
        type: "GET",
        success: function (data) {
            clearMarkers();
            // Agregar las nuevas opciones
            $.each(data, function (key, value) {
                if (value.latitud !== null && value.longitud !== null) {
                    // Crear el marcador
                    var markerColor =
                        value.situacion.id === 3 ? greenIcon : orangeIcon; // Si el id es 1, el color es verde, de lo contrario, es rojo
                    var marker_incidencia = L.marker(
                        [value.latitud, value.longitud],
                        { icon: markerColor }
                    ).addTo(map);

                    var url_atender = `${url}/incidencias/atender/${value.id}`;

                    var url_ver = `${url}/incidencias/${value.id}`;

                    // Crear el contenido del popup
                    var popupContent = `
                        <div>
                            <b>N° INCIDENCIA: ${value.id}</b>
                            <li><strong>UNIDAD:</strong> ${
                                value.unidad.descripcion
                            }</li>
                            <li><strong>CASO:</strong> ${
                                value.tipo_caso.descripcion
                            }</li>
                            <li><strong>SUB CASO:</strong> ${
                                value.sub_tipo_caso.descripcion
                            }</li>
                            <li><strong>REPORTANTE:</strong> ${
                                value.nombre_reportante
                            }</li>
                            <li><strong>TELEFONO:</strong> ${
                                value.telefono_reportante
                            }</li>
                            <li><strong>FECHA NOT:</strong> ${
                                value.fecha_registro
                            }</li>
                            <li><strong>FECHA INC:</strong> ${
                                value.fecha_ocurrencia
                            }</li>
                            <li><strong>SITUACION:</strong> ${
                                value.situacion.descripcion
                            }</li>
                            <hr>
                            <a href="${
                                value.situacion.id === 3
                                    ? `${url_ver}`
                                    : `${url_atender}`
                            }" class="btn btn-primary" style="color: white;">${
                        value.situacion.id === 3 ? "VER" : "ATENDER"
                    }</a>
                        </div>
                    `;

                    // Asignar el contenido del popup al marcador
                    marker_incidencia.bindPopup(popupContent);
                } else {
                    console.log(
                        "No hay datos válidos para el marcador:",
                        value
                    );
                }
                currentMarkers.push(marker_incidencia);
            });
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            // Manejar el error si es necesario
        },
    });
}

function showMarkerIncidenciasxFecha(fecha_registro) {
    // if (polygon) {
    //     map.removeLayer(polygon);
    // }

    var redIcon = L.icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var blueIcon = L.icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var greenIcon = new L.Icon({
        iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var orangeIcon = new L.Icon({
        iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var url = window.miVariableDeEntorno;
    $.ajax({
        url: "/obtener-incidencias/" + fecha_registro,
        type: "GET",
        success: function (data) {
            clearMarkers();
            // Agregar las nuevas opciones
            $.each(data, function (key, value) {
                if (value.latitud !== null && value.longitud !== null) {
                    // Crear el marcador
                    var markerColor =
                        value.situacion.id === 1
                            ? orangeIcon
                            : value.situacion.id === 2
                            ? blueIcon
                            : value.situacion.id === 3
                            ? greenIcon
                            : defaultIcon; // Si el id es 1, el color es verde, de lo contrario, es rojo
                    var marker_incidencia = L.marker(
                        [value.latitud, value.longitud],
                        { icon: markerColor }
                    ).addTo(map);

                    var url_atender = `${url}/incidencias/atender/${value.id}`;

                    var url_ver = `${url}/incidencias/${value.id}`;

                    // Crear el contenido del popup
                    var popupContent = `
                    <div>
                        <b>N° INCIDENCIA: ${value.id}</b>
                        <li><strong>UNIDAD:</strong> ${
                            value.unidad.descripcion
                        }</li>
                        <li><strong>CASO:</strong> ${
                            value.tipo_caso.descripcion
                        }</li>
                        <li><strong>SUB CASO:</strong> ${
                            value.sub_tipo_caso.descripcion
                        }</li>
                        <li><strong>REPORTANTE:</strong> ${
                            value.nombre_reportante
                        }</li>
                        <li><strong>TELEFONO:</strong> ${
                            value.telefono_reportante
                        }</li>
                        <li><strong>FECHA NOT:</strong> ${
                            value.fecha_registro
                        }</li>
                        <li><strong>FECHA INC:</strong> ${
                            value.fecha_ocurrencia
                        }</li>
                        <li><strong>SITUACION:</strong> ${
                            value.situacion.descripcion
                        }</li>
                        <hr>
                        <a href="${
                            value.situacion.id === 3
                                ? `${url_ver}`
                                : `${url_atender}`
                        }" class="btn btn-primary" style="color: white;">${
                        value.situacion.id === 3 ? "VER" : "ATENDER"
                    }</a>
                    </div>
                `;

                    // Asignar el contenido del popup al marcador
                    marker_incidencia.bindPopup(popupContent);
                } else {
                    console.log(
                        "No hay datos válidos para el marcador:",
                        value
                    );
                }

                currentMarkers.push(marker_incidencia);
            });
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            // Manejar el error si es necesario
        },
    });
}

function showMarkerIncidenciasxFechayEstado(idEstado, fecha_registro) {
    // if (polygon) {
    //     map.removeLayer(polygon);
    // }

    var redIcon = L.icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var blueIcon = L.icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var greenIcon = new L.Icon({
        iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var orangeIcon = new L.Icon({
        iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var url = window.miVariableDeEntorno;
    $.ajax({
        url: "/obtener-incidencias-estado-fecha/" + idEstado + "/" + fecha_registro,
        type: "GET",
        success: function (data) {
            clearMarkers();
            // Agregar las nuevas opciones
            $.each(data, function (key, value) {
                if (value.latitud !== null && value.longitud !== null) {
                    // Crear el marcador
                    var markerColor =
                        value.situacion.id === 1
                            ? orangeIcon
                            : value.situacion.id === 2
                            ? blueIcon
                            : value.situacion.id === 3
                            ? greenIcon
                            : defaultIcon; // Si el id es 1, el color es verde, de lo contrario, es rojo
                    var marker_incidencia = L.marker(
                        [value.latitud, value.longitud],
                        { icon: markerColor }
                    ).addTo(map);

                    var url_atender = `${url}/incidencias/atender/${value.id}`;

                    var url_ver = `${url}/incidencias/${value.id}`;

                    // Crear el contenido del popup
                    var popupContent = `
                    <div>
                        <b>N° INCIDENCIA: ${value.id}</b>
                        <li><strong>UNIDAD:</strong> ${
                            value.unidad.descripcion
                        }</li>
                        <li><strong>CASO:</strong> ${
                            value.tipo_caso.descripcion
                        }</li>
                        <li><strong>SUB CASO:</strong> ${
                            value.sub_tipo_caso.descripcion
                        }</li>
                        <li><strong>REPORTANTE:</strong> ${
                            value.nombre_reportante
                        }</li>
                        <li><strong>TELEFONO:</strong> ${
                            value.telefono_reportante
                        }</li>
                        <li><strong>FECHA NOT:</strong> ${
                            value.fecha_registro
                        }</li>
                        <li><strong>FECHA INC:</strong> ${
                            value.fecha_ocurrencia
                        }</li>
                        <li><strong>SITUACION:</strong> ${
                            value.situacion.descripcion
                        }</li>
                        <hr>
                        <a href="${
                            value.situacion.id === 3
                                ? `${url_ver}`
                                : `${url_atender}`
                        }" class="btn btn-primary" style="color: white;">${
                        value.situacion.id === 3 ? "VER" : "ATENDER"
                    }</a>
                    </div>
                `;

                    // Asignar el contenido del popup al marcador
                    marker_incidencia.bindPopup(popupContent);
                } else {
                    console.log(
                        "No hay datos válidos para el marcador:",
                        value
                    );
                }

                currentMarkers.push(marker_incidencia);
            });
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            // Manejar el error si es necesario
        },
    });
}


function showMarkerIncidenciasxHorayFecha(fecha_registro, hora_registro) {
    // if (polygon) {
    //     map.removeLayer(polygon);
    // }

    var redIcon = L.icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var blueIcon = L.icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var greenIcon = new L.Icon({
        iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var orangeIcon = new L.Icon({
        iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var url = window.miVariableDeEntorno;
    $.ajax({
        url: "/obtener-incidencias/" + fecha_registro + "/" + hora_registro,
        type: "GET",
        success: function (data) {
            clearMarkers();
            // Agregar las nuevas opciones
            $.each(data, function (key, value) {
                if (value.latitud !== null && value.longitud !== null) {
                    // Crear el marcador
                    var markerColor =
                        value.situacion.id === 3 ? greenIcon : orangeIcon; // Si el id es 1, el color es verde, de lo contrario, es rojo
                    var marker_incidencia = L.marker(
                        [value.latitud, value.longitud],
                        { icon: markerColor }
                    ).addTo(map);

                    var url_atender = `${url}/incidencias/atender/${value.id}`;

                    var url_ver = `${url}/incidencias/${value.id}`;

                    // Crear el contenido del popup
                    var popupContent = `
                        <div>
                            <b>N° INCIDENCIA: ${value.id}</b>
                            <li><strong>UNIDAD:</strong> ${
                                value.unidad.descripcion
                            }</li>
                            <li><strong>CASO:</strong> ${
                                value.tipo_caso.descripcion
                            }</li>
                            <li><strong>SUB CASO:</strong> ${
                                value.sub_tipo_caso.descripcion
                            }</li>
                            <li><strong>REPORTANTE:</strong> ${
                                value.nombre_reportante
                            }</li>
                            <li><strong>TELEFONO:</strong> ${
                                value.telefono_reportante
                            }</li>
                            <li><strong>FECHA NOT:</strong> ${
                                value.fecha_registro
                            }</li>
                            <li><strong>FECHA INC:</strong> ${
                                value.fecha_ocurrencia
                            }</li>
                            <li><strong>SITUACION:</strong> ${
                                value.situacion.descripcion
                            }</li>
                            <hr>
                            <a href="${
                                value.situacion.id === 3
                                    ? `${url_ver}`
                                    : `${url_atender}`
                            }" class="btn btn-primary" style="color: white;">${
                        value.situacion.id === 3 ? "VER" : "ATENDER"
                    }</a>
                        </div>
                    `;

                    // Asignar el contenido del popup al marcador
                    marker_incidencia.bindPopup(popupContent);
                } else {
                    console.log(
                        "No hay datos válidos para el marcador:",
                        value
                    );
                }

                currentMarkers.push(marker_incidencia);
            });
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            // Manejar el error si es necesario
        },
    });
}

function showMarkerIncidenciasxComisariayFecha(comisaria_id, fecha_registro) {
    // if (polygon) {
    //     map.removeLayer(polygon);
    // }

    var redIcon = L.icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var blueIcon = L.icon({
        iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var greenIcon = new L.Icon({
        iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var orangeIcon = new L.Icon({
        iconUrl:
            "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });

    var url = window.miVariableDeEntorno;
    $.ajax({
        url:
            "/obtener-incidencias-comisaria/" +
            comisaria_id +
            "/" +
            fecha_registro,
        type: "GET",
        success: function (data) {
            clearMarkers();
            // Agregar las nuevas opciones
            $.each(data, function (key, value) {
                if (value.latitud !== null && value.longitud !== null) {
                    // Crear el marcador
                    var markerColor =
                        value.situacion.id === 3 ? greenIcon : orangeIcon; // Si el id es 1, el color es verde, de lo contrario, es rojo
                    var marker_incidencia = L.marker(
                        [value.latitud, value.longitud],
                        { icon: markerColor }
                    ).addTo(map);

                    var url_atender = `${url}/incidencias/atender/${value.id}`;

                    var url_ver = `${url}/incidencias/${value.id}`;

                    // Crear el contenido del popup
                    var popupContent = `
                        <div>
                            <b>N° INCIDENCIA: ${value.id}</b>
                            <li><strong>UNIDAD:</strong> ${
                                value.unidad.descripcion
                            }</li>
                            <li><strong>CASO:</strong> ${
                                value.tipo_caso.descripcion
                            }</li>
                            <li><strong>SUB CASO:</strong> ${
                                value.sub_tipo_caso.descripcion
                            }</li>
                            <li><strong>REPORTANTE:</strong> ${
                                value.nombre_reportante
                            }</li>
                            <li><strong>TELEFONO:</strong> ${
                                value.telefono_reportante
                            }</li>
                            <li><strong>FECHA NOT:</strong> ${
                                value.fecha_registro
                            }</li>
                            <li><strong>FECHA INC:</strong> ${
                                value.fecha_ocurrencia
                            }</li>
                            <li><strong>SITUACION:</strong> ${
                                value.situacion.descripcion
                            }</li>
                            <hr>
                            <a href="${
                                value.situacion.id === 3
                                    ? `${url_ver}`
                                    : `${url_atender}`
                            }" class="btn btn-primary" style="color: white;">${
                        value.situacion.id === 3 ? "VER" : "ATENDER"
                    }</a>
                        </div>
                    `;

                    // Asignar el contenido del popup al marcador
                    marker_incidencia.bindPopup(popupContent);
                } else {
                    console.log(
                        "No hay datos válidos para el marcador:",
                        value
                    );
                }

                currentMarkers.push(marker_incidencia);
            });
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            // Manejar el error si es necesario
        },
    });
}

function isMarkerInsideAnyPolygon(markerCoords, polygons) {
    var point = turf.point(markerCoords);
    for (var i = 0; i < polygons.length; i++) {
        if (
            turf.inside(
                point,
                turf.polygon([
                    polygons[i]
                        .getLatLngs()
                        .map((latlng) => [latlng.lng, latlng.lat]),
                ])
            )
        ) {
            return true;
        }
    }
    return false;
}

function showPolygon(coordenadas) {
    if (polygon) {
        map.removeLayer(polygon);
    }

    //[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]
    polygon = L.polygon(coordenadas, { color: "red" }).addTo(map);

    // zoom the map to the polygon
    map.fitBounds(polygon.getBounds());
}

function showPolygonFromCSV(csvFilePath, color, popupMessage, name) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var csvData = xhr.responseText;
                var csvRows = csvData.split("\n");

                var latlngs = [];

                for (var i = 0; i < csvRows.length; i++) {
                    var rowData = csvRows[i].split(","); // Cambiar '\t' si el delimitador es diferente

                    // Verificar si hay al menos dos elementos en la fila
                    if (rowData.length >= 2) {
                        // Convertir las coordenadas a números
                        var latitude = parseFloat(rowData[0].trim());
                        var longitude = parseFloat(rowData[1].trim());

                        // Verificar si los datos son válidos
                        if (!isNaN(latitude) && !isNaN(longitude)) {
                            latlngs.push([latitude, longitude]);
                        }
                    }
                }

                // Mostrar el polígono en el mapa con un popup estático
                var polygon = L.polygon(latlngs, { color: color }).addTo(map);
                globalPolygons.push(latlngs);
                //map.fitBounds(polygon.getBounds());

                // Agregar evento click al polígono
                polygon.on("click", function (e) {
                    var lat = e.latlng.lat;
                    var lng = e.latlng.lng;

                    var nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

                    fetch(nominatimUrl)
                        .then((response) => response.json())
                        .then((data) => {
                            var address = data.display_name;
                            var addressDetails = data.address;

                            var cuadra = addressDetails.road;
                            //var jurisdiccion = addressDetails.city;
                            var jurisdiccion = popupMessage;
                            var urbanizacion = name;

                            // Puedes realizar acciones adicionales aquí, como abrir un modal
                            openModal(
                                lat,
                                lng,
                                address,
                                addressDetails,
                                cuadra,
                                jurisdiccion,
                                urbanizacion
                            );
                            console.log(addressDetails);
                        })
                        .catch((error) => {
                            console.error(
                                "Error al obtener la dirección:",
                                error
                            );
                        });
                });
            } else {
                console.error("Error al cargar el archivo CSV: " + csvFilePath);
            }
        }
    };

    xhr.open("GET", csvFilePath, true);
    xhr.send();
}

// function showPolygonFromCSV(csvFilePath, color, popupMessage) {
//     var xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState === XMLHttpRequest.DONE) {
//             if (xhr.status === 200) {
//                 var csvData = xhr.responseText;
//                 var csvRows = csvData.split("\n");

//                 var latlngs = [];

//                 for (var i = 0; i < csvRows.length; i++) {
//                     var rowData = csvRows[i].split(","); // Cambiar '\t' si el delimitador es diferente

//                     // Verificar si hay al menos dos elementos en la fila
//                     if (rowData.length >= 2) {
//                         // Convertir las coordenadas a números
//                         var latitude = parseFloat(rowData[0].trim());
//                         var longitude = parseFloat(rowData[1].trim());

//                         // Verificar si los datos son válidos
//                         if (!isNaN(latitude) && !isNaN(longitude)) {
//                             latlngs.push([latitude, longitude]);
//                         }
//                     }
//                 }

//                 // Mostrar el polígono en el mapa con un popup estático
//                 var polygon = L.polygon(latlngs, { color: color }).addTo(map);

//                 // Agregar el popup estático con el mensaje
//                 //polygon.bindPopup(popupMessage);

//                 // Agregar evento click al polígono
//                 polygon.on("click", function (e) {
//                     // Obtener el "quarter" o "jurisdicción" del popupMessage
//                     var quarterOrJurisdiccion = popupMessage;

//                     // Imprimir en la consola el "quarter" o "jurisdicción"
//                     console.log("Quarter o Jurisdicción:", quarterOrJurisdiccion);
//                 });
//             } else {
//                 console.error("Error al cargar el archivo CSV: " + csvFilePath);
//             }
//         }
//     };

//     xhr.open("GET", csvFilePath, true);
//     xhr.send();
// }

document.addEventListener("DOMContentLoaded", function () {
    if (polygon) {
        map.removeLayer(polygon);
    }
    showPolygonFromCSV(csvPath, polygonColor, 2, "Zarate");
    showPolygonFromCSV(csvFilePath1, polygonColor2, 8, "10 de Octubre");
    showPolygonFromCSV(csvFilePath2, polygonColor3, 6, "Bayovar");
    showPolygonFromCSV(csvFilePath3, polygonColor4, 1, "Caja de Agua");
    showPolygonFromCSV(csvFilePath4, polygonColor5, 4, "Canto Rey");
    showPolygonFromCSV(csvFilePath5, polygonColor6, 3, "La Huayrona");
    showPolygonFromCSV(csvFilePath6, polygonColor7, 7, "Mariscal Caceres");
    showPolygonFromCSV(csvFilePath7, polygonColor8, 5, "Santa Elizabeth");
});

// function getAddressOnClick(lat, lng) {
//     var nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

//     fetch(nominatimUrl)
//         .then((response) => response.json())
//         .then((data) => {
//             var address = data.display_name;
//             var addressDetails = data.address;

//             var cuadra = addressDetails.road;
//             var jurisdiccion = addressDetails.city;
//             var urbanizacion = addressDetails.suburb;

//             // Puedes realizar acciones adicionales aquí, como abrir un modal
//             openModal(
//                 lat,
//                 lng,
//                 address,
//                 addressDetails,
//                 cuadra,
//                 jurisdiccion,
//                 urbanizacion
//             );
//             console.log(addressDetails);
//         })
//         .catch((error) => {
//             console.error("Error al obtener la dirección:", error);
//         });
// }

// map.on("click", function (e) {
//     // Obtener coordenadas donde se hizo clic
//     var lat = e.latlng.lat;
//     var lng = e.latlng.lng;

//     // Obtener la dirección utilizando Nominatim
//     var nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;

//     fetch(nominatimUrl)
//         .then((response) => response.json())
//         .then((data) => {
//             // La dirección se encuentra en el campo 'display_name'
//             var address = data.display_name;
//             var addressDetails = data.address;

//             var cuadra = addressDetails.road; // Puede variar según la ubicación
//             var jurisdiccion = addressDetails.city; // Puede variar según la ubicación
//             var urbanizacion = addressDetails.suburb;

//             // Agregar el marcador al mapa
//             //addMarker(lat, lng);

//             // Mostrar el modal con información y mini-mapa
//             openModal(
//                 lat,
//                 lng,
//                 address,
//                 addressDetails,
//                 cuadra,
//                 jurisdiccion,
//                 urbanizacion
//             );

//             console.log(addressDetails);
//         })
//         .catch((error) => {
//             console.error("Error al obtener la dirección:", error);
//         });
// });

// Función para abrir el modal
function openModal(
    lat,
    lng,
    address,
    addressDetails,
    cuadra,
    jurisdiccion,
    urbanizacion
) {
    // Modificar el contenido del modal con las coordenadas y la dirección
    document.getElementById("divDireccion").innerHTML = `
            <label class="form-label" for="modalEditUserEmail">Direccion</label>
            <input type="text" id="modalEditUserEmail" name="direccion" class="form-control"
                value="${address}" readonly/>
    `;

    document.getElementById("divLatitud").innerHTML = `
            <label class="form-label" for="modalEditUserEmail">Latitud</label>
            <input type="text" id="modalEditUserEmail" name="latitud" class="form-control"
                value="${lat}" readonly/>
    `;

    document.getElementById("divLongitud").innerHTML = `
            <label class="form-label" for="modalEditUserEmail">Longitud</label>
            <input type="text" id="modalEditUserEmail" name="longitud" class="form-control"
                value="${lng}" readonly/>
    `;

    document.getElementById("modalMapa").innerHTML = `
        <div id="modalMap" style="height: 300px; width:600px;"></div>
    `;

    // Valor de popupMessage que deseas agregar
    var id_comisaria = jurisdiccion;
    // Obtener el elemento <select> por su id
    var selectElement = document.getElementById("selet_jurisdiccion");

    while (selectElement.firstChild) {
        selectElement.removeChild(selectElement.firstChild);
    }
    // Crear una nueva opción
    var option = document.createElement("option");
    option.value = id_comisaria;
    option.text = urbanizacion;

    // Agregar la opción al select
    selectElement.appendChild(option);

    // Inicializar mini-mapa en el modal
    var modalMap = L.map("modalMap").setView([lat, lng], 17);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        // attribution: '© OpenStreetMap contributors'
    }).addTo(modalMap);

    modalMap.dragging.disable();
    modalMap.scrollWheelZoom.disable();
    // Agregar marcador en el mini-mapa
    L.marker([lat, lng]).addTo(modalMap);

    // Mostrar el modal
    $("#mapModal").modal("show");

    //console.log(addressDetails);
}

// function closeModal() {
//   document.getElementById("mapModal").style.display = "none";
// }
// Función para agregar un marcador al mapa principal
function addMarker(lat, lng) {
    // Eliminar marcador anterior si existe
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Agregar nuevo marcador
    var marker = L.marker([lat, lng]).addTo(map);
}

document
    .getElementById("showIncidencias")
    .addEventListener("click", function () {
        showMarkerIncidencias();
    });
// Obtener el elemento de entrada por su ID
var fechaInput = document.getElementById("showIncidenciasxFecha");
var horaInput = document.getElementById("showIncidenciasxHora");
var selectElement = document.getElementById("select_tipo_caso");
var selectElementEstado = document.getElementById("select_estado");

selectElement.addEventListener("change", function () {
    var selectedValue = selectElement.value;
    var fechaSeleccionada = fechaInput.value;
    var selectedIndex = selectElement.selectedIndex;

    // Después, obtén el elemento <option> seleccionado usando el índice
    var selectedOption = selectElement.options[selectedIndex];

    // Finalmente, obtén el texto de la opción seleccionada
    var selectedText = selectedOption.textContent;

    showMarkerIncidenciasxComisariayFecha(selectedValue, fechaSeleccionada);
});

selectElementEstado.addEventListener("change", function () {
    var selectedValue = selectElementEstado.value;
    var fechaSeleccionada = fechaInput.value;
    var selectedIndex = selectElement.selectedIndex;

    // Después, obtén el elemento <option> seleccionado usando el índice
    var selectedOption = selectElement.options[selectedIndex];

    // Finalmente, obtén el texto de la opción seleccionada
    var selectedText = selectedOption.textContent;

    showMarkerIncidenciasxEstado(selectedValue);
});

// Agregar un evento para escuchar cambios en la fecha
fechaInput.addEventListener("change", function () {
    // Obtener el valor seleccionado en la fecha
    var fechaSeleccionada = fechaInput.value;
    var EstadoselectedValue = selectElementEstado.value;


    // Puedes hacer algo con la fecha seleccionada aquí
    if (EstadoselectedValue) {
        showMarkerIncidenciasxFechayEstado(EstadoselectedValue, fechaSeleccionada);
    } else {
        showMarkerIncidenciasxFecha(fechaSeleccionada);
    }
});

horaInput.addEventListener("change", function () {
    // Obtener el valor seleccionado en la fecha
    var horaSeleccionada = horaInput.value;
    var fechaSeleccionada = fechaInput.value;

    // Puedes hacer algo con la fecha seleccionada aquí
    showMarkerIncidenciasxHorayFecha(fechaSeleccionada, horaSeleccionada);
});

document
    .getElementById("showPolygonButtonCom")
    .addEventListener("click", function () {
        if (polygon) {
            map.removeLayer(polygon);
        }
        showPolygonFromCSV(csvPath, polygonColor, 2, "Zarate");
        showPolygonFromCSV(csvFilePath1, polygonColor2, 8, "10 de Octubre");
        showPolygonFromCSV(csvFilePath2, polygonColor3, 6, "Bayovar");
        showPolygonFromCSV(csvFilePath3, polygonColor4, 1, "Caja de Agua");
        showPolygonFromCSV(csvFilePath4, polygonColor5, 4, "Canto Rey");
        showPolygonFromCSV(csvFilePath5, polygonColor6, 3, "La Huayrona");
        showPolygonFromCSV(csvFilePath6, polygonColor7, 7, "Mariscal Caceres");
        showPolygonFromCSV(csvFilePath7, polygonColor8, 5, "Santa Elizabeth");
    });

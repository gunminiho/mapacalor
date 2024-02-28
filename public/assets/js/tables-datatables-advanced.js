/**
 * DataTables Advanced (jquery)
 */

"use strict";

$(function () {
    var dt_ajax_table = $(".datatables-ajax"),
        dt_filter_table = $(".dt-column-search"),
        dt_adv_filter_table = $(".dt-advanced-search"),
        dt_adv_filter_table_sereno = $(".dt-advanced-search-sereno"),
        dt_adv_filter_table_tipocaso = $(".dt-advanced-search-tipo-caso"),
        dt_adv_filter_table_subtipocaso = $(".dt-advanced-search-subtipo-caso"),
        dt_adv_filter_table_cargo_sereno = $(
            ".dt-advanced-search-cargo-sereno"
        ),
        dt_responsive_table = $(".dt-responsive"),
        startDateEle = $(".start_date"),
        endDateEle = $(".end_date");

    // Advanced Search Functions Starts
    // --------------------------------------------------------------------

    // Datepicker for advanced filter
    var rangePickr = $(".flatpickr-range"),
        dateFormat = "MM/DD/YYYY";

    if (rangePickr.length) {
        rangePickr.flatpickr({
            mode: "range",
            dateFormat: "m/d/Y",
            orientation: isRtl ? "auto right" : "auto left",
            locale: {
                format: dateFormat,
            },
            onClose: function (selectedDates, dateStr, instance) {
                var startDate = "",
                    endDate = new Date();
                if (selectedDates[0] != undefined) {
                    startDate = moment(selectedDates[0]).format("MM/DD/YYYY");
                    startDateEle.val(startDate);
                }
                if (selectedDates[1] != undefined) {
                    endDate = moment(selectedDates[1]).format("MM/DD/YYYY");
                    endDateEle.val(endDate);
                }
                $(rangePickr).trigger("change").trigger("keyup");
            },
        });
    }

    // Filter column wise function
    function filterColumn(i, val) {
        if (i == 100) {
            var startDate = startDateEle.val(),
                endDate = endDateEle.val();
            if (startDate !== "" && endDate !== "") {
                $.fn.dataTableExt.afnFiltering.length = 0; // Reset datatable filter
                dt_adv_filter_table.dataTable().fnDraw(); // Draw table after filter
                filterByDate(i, startDate, endDate); // We call our filter function
            }
            dt_adv_filter_table.dataTable().fnDraw();
        } else {
            dt_adv_filter_table
                .DataTable()
                .column(i)
                .search(val, false, true)
                .draw();
        }
    }

    function filterColumnSereno(i, val) {
        dt_adv_filter_table_sereno
            .DataTable()
            .column(i)
            .search(val, false, true)
            .draw();
    }

    function filterColumnCargoSereno(i, val) {
        dt_adv_filter_table_cargo_sereno
            .DataTable()
            .column(i)
            .search(val, false, true)
            .draw();
    }

    function filterColumnTipoCaso(i, val) {
        dt_adv_filter_table_tipocaso
            .DataTable()
            .column(i)
            .search(val, false, true)
            .draw();
    }

    function filterColumnSubTipoCaso(i, val) {
        dt_adv_filter_table_subtipocaso
            .DataTable()
            .column(i)
            .search(val, false, true)
            .draw();
    }

    // Advance filter function
    // We pass the column location, the start date, and the end date
    $.fn.dataTableExt.afnFiltering.length = 0;
    var filterByDate = function (column, startDate, endDate) {
        // Custom filter syntax requires pushing the new filter to the global filter array
        $.fn.dataTableExt.afnFiltering.push(function (
            oSettings,
            aData,
            iDataIndex
        ) {
            var rowDate = normalizeDate(aData[column]),
                start = normalizeDate(startDate),
                end = normalizeDate(endDate);

            // If our date from the row is between the start and end
            if (start <= rowDate && rowDate <= end) {
                return true;
            } else if (rowDate >= start && end === "" && start !== "") {
                return true;
            } else if (rowDate <= end && start === "" && end !== "") {
                return true;
            } else {
                return false;
            }
        });
    };

    // converts date strings to a Date object, then normalized into a YYYYMMMDD format (ex: 20131220). Makes comparing dates easier. ex: 20131220 > 20121220
    var normalizeDate = function (dateString) {
        var date = new Date(dateString);
        var normalized =
            date.getFullYear() +
            "" +
            ("0" + (date.getMonth() + 1)).slice(-2) +
            "" +
            ("0" + date.getDate()).slice(-2);
        return normalized;
    };
    // Advanced Search Functions Ends

    // Ajax Sourced Server-side
    // --------------------------------------------------------------------

    if (dt_ajax_table.length) {
        var dt_ajax = dt_ajax_table.dataTable({
            processing: true,
            ajax: assetsPath + "json/ajax.php",
            dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>><"table-responsive"t><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        });
    }

    // Column Search
    // --------------------------------------------------------------------

    if (dt_filter_table.length) {
        // Setup - add a text input to each footer cell
        $(".dt-column-search thead tr")
            .clone(true)
            .appendTo(".dt-column-search thead");
        $(".dt-column-search thead tr:eq(1) th").each(function (i) {
            var title = $(this).text();
            $(this).html(
                '<input type="text" class="form-control" placeholder="Search ' +
                    title +
                    '" />'
            );

            $("input", this).on("keyup change", function () {
                if (dt_filter.column(i).search() !== this.value) {
                    dt_filter.column(i).search(this.value).draw();
                }
            });
        });

        var dt_filter = dt_filter_table.DataTable({
            ajax: assetsPath + "json/table-datatable.json",
            columns: [
                { data: "full_name" },
                { data: "email" },
                { data: "post" },
                { data: "city" },
                { data: "start_date" },
                { data: "salary" },
            ],
            orderCellsTop: true,
            dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>><"table-responsive"t><"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
        });
    }

    // Advanced Search
    // --------------------------------------------------------------------
    var url = window.miVariableDeEntorno;
    // Advanced Filter table
    if (dt_adv_filter_table.length) {
        var dt_adv_filter = dt_adv_filter_table.DataTable({
            dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6 dataTables_pager'p>>",
            //ajax: assetsPath + 'json/table-datatable.json',
            ajax: url + "/incidencias",
            // columns: [
            //   { data: '' },
            //   { data: 'full_name' },
            //   { data: 'email' },
            //   { data: 'post' },
            //   { data: 'city' },
            //   { data: 'start_date' },
            //   { data: 'salary' }
            // ],

            columns: [
                { data: "" },
                { data: "id" },
                {
                    data: "id",
                    render: function (data, type, full, meta) {
                        // Aquí puedes personalizar el contenido de la celda
                        // return '<a href="{{ route('calificacion.ingenieria.pdf', ['registro' => '_ID_']) }}" class="bs-tooltip" data-bs-toggle="tooltip" data-bs-placement="top" title="Descargar Liquidacion" data-original-title="Delete"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></a>'
                        //     .replace('_ID_', data);
                        return (
                            '<div class="dropdown">' +
                            '<button type="button" class="btn p-0 dropdown-toggle hide-arrow" ' +
                            'data-bs-toggle="dropdown">' +
                            '<i class="ti ti-dots-vertical"></i>' +
                            "</button>" +
                            '<div class="dropdown-menu">' +
                            '<a class="dropdown-item" href="' +
                            url +
                            "/incidencias/" +
                            data +
                            '/edit"><i ' +
                            'class="ti ti-pencil me-1"></i> Editar</a>' +
                            '<a class="dropdown-item" href="' +
                            url +
                            "/incidencias/" +
                            data +
                            '"><i ' +
                            'class="ti ti-eye me-1"></i> Ver </a>' +
                            // '<a class="dropdown-item" href="' +
                            // url +
                            // "/incidencias/" +
                            // data +
                            // '/cambiar-estado"><i ' +
                            // 'class="ti ti-reload me-1"></i> Cambiar estado </a>' +
                            "</div>" +
                            "</div>"
                        );
                    },
                },
                { data: "fecha_ocurrencia" },
                { data: "fecha_registro" },
                { data: "situacion" },
                { data: "medio" },
                { data: "unidad" },
                { data: "caso" },
                { data: "subcaso" },
                { data: "nombre_reportante" },
                { data: "telefono_reportante" },
                { data: "operador" },
                { data: "user" },
            ],

            columnDefs: [
                {
                    className: "control",
                    orderable: false,
                    targets: 0,
                    render: function (data, type, full, meta) {
                        return "";
                    },
                },
            ],
            language: {
                sProcessing: "Procesando...",
                sLengthMenu: "Mostrar _MENU_ registros",
                sZeroRecords: "No se encontraron resultados",
                sEmptyTable: "Ningún dato disponible en esta tabla",
                sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                sInfoEmpty:
                    "Mostrando registros del 0 al 0 de un total de 0 registros",
                sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                sInfoPostFix: "",
                sSearch: "Buscar:",
                sUrl: "",
                sInfoThousands: ",",
                sLoadingRecords: "Cargando...",
                oPaginate: {
                    sFirst: "Primero",
                    sLast: "Último",
                    sNext: "Siguiente",
                    sPrevious: "Anterior",
                },
                oAria: {
                    sSortAscending:
                        ": Activar para ordenar la columna de manera ascendente",
                    sSortDescending:
                        ": Activar para ordenar la columna de manera descendente",
                },
                buttons: {
                    copy: "Copiar",
                    colvis: "Visibilidad",
                },
            },
            paging: true,
            pageLength: 10,
            orderCellsTop: true,
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function (row) {
                            var data = row.data();
                            return "Detalle de la Incidencia: ID" + data["id"];
                        },
                    }),
                    type: "column",
                    renderer: function (api, rowIdx, columns) {
                        var data = $.map(columns, function (col, i) {
                            return col.title !== "" // ? Do not show row in modal popup if title is blank (for check box)
                                ? '<tr data-dt-row="' +
                                      col.rowIndex +
                                      '" data-dt-column="' +
                                      col.columnIndex +
                                      '">' +
                                      "<td>" +
                                      col.title +
                                      ":" +
                                      "</td> " +
                                      "<td>" +
                                      col.data +
                                      "</td>" +
                                      "</tr>"
                                : "";
                        }).join("");

                        return data
                            ? $('<table class="table"/><tbody />').append(data)
                            : false;
                    },
                },
            },
        });
    }

    if (dt_adv_filter_table_sereno.length) {
        var dt_adv_filter = dt_adv_filter_table_sereno.DataTable({
            dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6 dataTables_pager'p>>",
            //ajax: assetsPath + 'json/table-datatable.json',
            ajax: url + "/serenos",
            // columns: [
            //   { data: '' },
            //   { data: 'full_name' },
            //   { data: 'email' },
            //   { data: 'post' },
            //   { data: 'city' },
            //   { data: 'start_date' },
            //   { data: 'salary' }
            // ],

            columns: [
                { data: "" },
                { data: "dni" },
                { data: "nombres" },
                { data: "apellidoPaterno" },
                { data: "apellidoMaterno" },
                { data: "cargo_sereno" },
                {
                    data: "habilitado",
                    render: function (data, type, full, meta) {
                        var estadoText =
                            data == 1 ? "Habilitado" : "No Habilitado";
                        var badgeClass =
                            data == 1 ? "bg-label-success" : "bg-label-danger";
                        return (
                            '<span class="badge rounded-pill ' +
                            badgeClass +
                            '">' +
                            estadoText +
                            "</span>"
                        );
                    },
                },
                {
                    data: "id",
                    render: function (data, type, full, meta) {
                        // Aquí puedes personalizar el contenido de la celda
                        // return '<a href="{{ route('calificacion.ingenieria.pdf', ['registro' => '_ID_']) }}" class="bs-tooltip" data-bs-toggle="tooltip" data-bs-placement="top" title="Descargar Liquidacion" data-original-title="Delete"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></a>'
                        //     .replace('_ID_', data);
                        return (
                            '<div class="dropdown">' +
                            '<button type="button" class="btn p-0 dropdown-toggle hide-arrow" ' +
                            'data-bs-toggle="dropdown">' +
                            '<i class="ti ti-dots-vertical"></i>' +
                            "</button>" +
                            '<div class="dropdown-menu">' +
                            '<a class="dropdown-item" href="' +
                            url +
                            "/serenos/" +
                            data +
                            '/edit"><i ' +
                            'class="ti ti-pencil me-1"></i> Editar</a>' +
                            '<a class="dropdown-item" href="' +
                            url +
                            "/serenos/" +
                            data +
                            '/cambiar-estado"><i ' +
                            'class="ti ti-rotate me-1"></i> Cambiar estado </a>' +
                            "</div>" +
                            "</div>"
                        );
                    },
                },
            ],

            columnDefs: [
                {
                    className: "control",
                    orderable: false,
                    targets: 0,
                    render: function (data, type, full, meta) {
                        return "";
                    },
                },
            ],
            language: {
                sProcessing: "Procesando...",
                sLengthMenu: "Mostrar _MENU_ registros",
                sZeroRecords: "No se encontraron resultados",
                sEmptyTable: "Ningún dato disponible en esta tabla",
                sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                sInfoEmpty:
                    "Mostrando registros del 0 al 0 de un total de 0 registros",
                sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                sInfoPostFix: "",
                sSearch: "Buscar:",
                sUrl: "",
                sInfoThousands: ",",
                sLoadingRecords: "Cargando...",
                oPaginate: {
                    sFirst: "Primero",
                    sLast: "Último",
                    sNext: "Siguiente",
                    sPrevious: "Anterior",
                },
                oAria: {
                    sSortAscending:
                        ": Activar para ordenar la columna de manera ascendente",
                    sSortDescending:
                        ": Activar para ordenar la columna de manera descendente",
                },
                buttons: {
                    copy: "Copiar",
                    colvis: "Visibilidad",
                },
            },
            orderCellsTop: true,
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function (row) {
                            var data = row.data();
                            return "Detalle del Seren: ID" + data["id"];
                        },
                    }),
                    type: "column",
                    renderer: function (api, rowIdx, columns) {
                        var data = $.map(columns, function (col, i) {
                            return col.title !== "" // ? Do not show row in modal popup if title is blank (for check box)
                                ? '<tr data-dt-row="' +
                                      col.rowIndex +
                                      '" data-dt-column="' +
                                      col.columnIndex +
                                      '">' +
                                      "<td>" +
                                      col.title +
                                      ":" +
                                      "</td> " +
                                      "<td>" +
                                      col.data +
                                      "</td>" +
                                      "</tr>"
                                : "";
                        }).join("");

                        return data
                            ? $('<table class="table"/><tbody />').append(data)
                            : false;
                    },
                },
            },
        });
    }

    if (dt_adv_filter_table_cargo_sereno.length) {
        var dt_adv_filter = dt_adv_filter_table_cargo_sereno.DataTable({
            dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6 dataTables_pager'p>>",
            //ajax: assetsPath + 'json/table-datatable.json',
            ajax: url + "/cargo-serenos",
            // columns: [
            //   { data: '' },
            //   { data: 'full_name' },
            //   { data: 'email' },
            //   { data: 'post' },
            //   { data: 'city' },
            //   { data: 'start_date' },
            //   { data: 'salary' }
            // ],

            columns: [
                { data: "id" },
                { data: "descripcion" },
                {
                    data: "habilitado",
                    render: function (data, type, full, meta) {
                        var estadoText =
                            data == 1 ? "Habilitado" : "No Habilitado";
                        var badgeClass =
                            data == 1 ? "bg-label-success" : "bg-label-danger";
                        return (
                            '<span class="badge rounded-pill ' +
                            badgeClass +
                            '">' +
                            estadoText +
                            "</span>"
                        );
                    },
                },
                {
                    data: "id",
                    render: function (data, type, full, meta) {
                        // Aquí puedes personalizar el contenido de la celda
                        // return '<a href="{{ route('calificacion.ingenieria.pdf', ['registro' => '_ID_']) }}" class="bs-tooltip" data-bs-toggle="tooltip" data-bs-placement="top" title="Descargar Liquidacion" data-original-title="Delete"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></a>'
                        //     .replace('_ID_', data);
                        return (
                            '<div class="dropdown">' +
                            '<button type="button" class="btn p-0 dropdown-toggle hide-arrow" ' +
                            'data-bs-toggle="dropdown">' +
                            '<i class="ti ti-dots-vertical"></i>' +
                            "</button>" +
                            '<div class="dropdown-menu">' +
                            '<a class="dropdown-item" href="' +
                            url +
                            "/cargo-serenos/" +
                            data +
                            '/edit"><i ' +
                            'class="ti ti-pencil me-1"></i> Editar</a>' +
                            '<a class="dropdown-item" href="' +
                            url +
                            "/cargo-serenos/" +
                            data +
                            '/cambiar-estado"><i ' +
                            'class="ti ti-rotate me-1"></i> Cambiar estado </a>' +
                            "</div>" +
                            "</div>"
                        );
                    },
                },
            ],

            columnDefs: [
                {
                    className: "control",
                    orderable: false,
                    targets: 0,
                    render: function (data, type, full, meta) {
                        return "";
                    },
                },
            ],
            language: {
                sProcessing: "Procesando...",
                sLengthMenu: "Mostrar _MENU_ registros",
                sZeroRecords: "No se encontraron resultados",
                sEmptyTable: "Ningún dato disponible en esta tabla",
                sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                sInfoEmpty:
                    "Mostrando registros del 0 al 0 de un total de 0 registros",
                sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                sInfoPostFix: "",
                sSearch: "Buscar:",
                sUrl: "",
                sInfoThousands: ",",
                sLoadingRecords: "Cargando...",
                oPaginate: {
                    sFirst: "Primero",
                    sLast: "Último",
                    sNext: "Siguiente",
                    sPrevious: "Anterior",
                },
                oAria: {
                    sSortAscending:
                        ": Activar para ordenar la columna de manera ascendente",
                    sSortDescending:
                        ": Activar para ordenar la columna de manera descendente",
                },
                buttons: {
                    copy: "Copiar",
                    colvis: "Visibilidad",
                },
            },
            orderCellsTop: true,
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function (row) {
                            var data = row.data();
                            return "Detalle del Seren: ID" + data["id"];
                        },
                    }),
                    type: "column",
                    renderer: function (api, rowIdx, columns) {
                        var data = $.map(columns, function (col, i) {
                            return col.title !== "" // ? Do not show row in modal popup if title is blank (for check box)
                                ? '<tr data-dt-row="' +
                                      col.rowIndex +
                                      '" data-dt-column="' +
                                      col.columnIndex +
                                      '">' +
                                      "<td>" +
                                      col.title +
                                      ":" +
                                      "</td> " +
                                      "<td>" +
                                      col.data +
                                      "</td>" +
                                      "</tr>"
                                : "";
                        }).join("");

                        return data
                            ? $('<table class="table"/><tbody />').append(data)
                            : false;
                    },
                },
            },
        });
    }

    if (dt_adv_filter_table_tipocaso.length) {
        var dt_adv_filter = dt_adv_filter_table_tipocaso.DataTable({
            dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6 dataTables_pager'p>>",
            //ajax: assetsPath + 'json/table-datatable.json',
            ajax: url + "/tipo-casos",
            // columns: [
            //   { data: '' },
            //   { data: 'full_name' },
            //   { data: 'email' },
            //   { data: 'post' },
            //   { data: 'city' },
            //   { data: 'start_date' },
            //   { data: 'salary' }
            // ],

            columns: [
                { data: "id" },
                { data: "descripcion" },
                {
                    data: "habilitado",
                    render: function (data, type, full, meta) {
                        var estadoText =
                            data == 1 ? "Habilitado" : "No Habilitado";
                        var badgeClass =
                            data == 1 ? "bg-label-success" : "bg-label-danger";
                        return (
                            '<span class="badge rounded-pill ' +
                            badgeClass +
                            '">' +
                            estadoText +
                            "</span>"
                        );
                    },
                },
                {
                    data: "id",
                    render: function (data, type, full, meta) {
                        // Aquí puedes personalizar el contenido de la celda
                        // return '<a href="{{ route('calificacion.ingenieria.pdf', ['registro' => '_ID_']) }}" class="bs-tooltip" data-bs-toggle="tooltip" data-bs-placement="top" title="Descargar Liquidacion" data-original-title="Delete"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></a>'
                        //     .replace('_ID_', data);
                        return (
                            '<div class="dropdown">' +
                            '<button type="button" class="btn p-0 dropdown-toggle hide-arrow" ' +
                            'data-bs-toggle="dropdown">' +
                            '<i class="ti ti-dots-vertical"></i>' +
                            "</button>" +
                            '<div class="dropdown-menu">' +
                            '<a class="dropdown-item" href="' +
                            url +
                            "/tipo-casos/" +
                            data +
                            '/edit"><i ' +
                            'class="ti ti-pencil me-1"></i> Editar</a>' +
                            '<a class="dropdown-item" href="' +
                            url +
                            "/tipo-casos/" +
                            data +
                            '/cambiar-estado"><i ' +
                            'class="ti ti-rotate me-1"></i> Cambiar estado </a>' +
                            "</div>" +
                            "</div>"
                        );
                    },
                },
            ],

            columnDefs: [
                {
                    className: "control",
                    orderable: false,
                    targets: 0,
                    render: function (data, type, full, meta) {
                        return "";
                    },
                },
            ],
            language: {
                sProcessing: "Procesando...",
                sLengthMenu: "Mostrar _MENU_ registros",
                sZeroRecords: "No se encontraron resultados",
                sEmptyTable: "Ningún dato disponible en esta tabla",
                sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                sInfoEmpty:
                    "Mostrando registros del 0 al 0 de un total de 0 registros",
                sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                sInfoPostFix: "",
                sSearch: "Buscar:",
                sUrl: "",
                sInfoThousands: ",",
                sLoadingRecords: "Cargando...",
                oPaginate: {
                    sFirst: "Primero",
                    sLast: "Último",
                    sNext: "Siguiente",
                    sPrevious: "Anterior",
                },
                oAria: {
                    sSortAscending:
                        ": Activar para ordenar la columna de manera ascendente",
                    sSortDescending:
                        ": Activar para ordenar la columna de manera descendente",
                },
                buttons: {
                    copy: "Copiar",
                    colvis: "Visibilidad",
                },
            },
            orderCellsTop: true,
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function (row) {
                            var data = row.data();
                            return "Detalle del Seren: ID" + data["id"];
                        },
                    }),
                    type: "column",
                    renderer: function (api, rowIdx, columns) {
                        var data = $.map(columns, function (col, i) {
                            return col.title !== "" // ? Do not show row in modal popup if title is blank (for check box)
                                ? '<tr data-dt-row="' +
                                      col.rowIndex +
                                      '" data-dt-column="' +
                                      col.columnIndex +
                                      '">' +
                                      "<td>" +
                                      col.title +
                                      ":" +
                                      "</td> " +
                                      "<td>" +
                                      col.data +
                                      "</td>" +
                                      "</tr>"
                                : "";
                        }).join("");

                        return data
                            ? $('<table class="table"/><tbody />').append(data)
                            : false;
                    },
                },
            },
        });
    }

    if (dt_adv_filter_table_subtipocaso.length) {
        var dt_adv_filter = dt_adv_filter_table_subtipocaso.DataTable({
            dom: "<'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-6'i><'col-sm-12 col-md-6 dataTables_pager'p>>",
            //ajax: assetsPath + 'json/table-datatable.json',
            ajax: url + "/subtipo-casos",
            // columns: [
            //   { data: '' },
            //   { data: 'full_name' },
            //   { data: 'email' },
            //   { data: 'post' },
            //   { data: 'city' },
            //   { data: 'start_date' },
            //   { data: 'salary' }
            // ],

            columns: [
                { data: "id" },
                { data: "descripcion" },
                { data: "tipo_caso" },
                {
                    data: "habilitado",
                    render: function (data, type, full, meta) {
                        var estadoText =
                            data == 1 ? "Habilitado" : "No Habilitado";
                        var badgeClass =
                            data == 1 ? "bg-label-success" : "bg-label-danger";
                        return (
                            '<span class="badge rounded-pill ' +
                            badgeClass +
                            '">' +
                            estadoText +
                            "</span>"
                        );
                    },
                },
                {
                    data: "id",
                    render: function (data, type, full, meta) {
                        // Aquí puedes personalizar el contenido de la celda
                        // return '<a href="{{ route('calificacion.ingenieria.pdf', ['registro' => '_ID_']) }}" class="bs-tooltip" data-bs-toggle="tooltip" data-bs-placement="top" title="Descargar Liquidacion" data-original-title="Delete"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></a>'
                        //     .replace('_ID_', data);
                        return (
                            '<div class="dropdown">' +
                            '<button type="button" class="btn p-0 dropdown-toggle hide-arrow" ' +
                            'data-bs-toggle="dropdown">' +
                            '<i class="ti ti-dots-vertical"></i>' +
                            "</button>" +
                            '<div class="dropdown-menu">' +
                            '<a class="dropdown-item" href="' +
                            url +
                            "/subtipo-casos/" +
                            data +
                            '/edit"><i ' +
                            'class="ti ti-pencil me-1"></i> Editar</a>' +
                            '<a class="dropdown-item" href="' +
                            url +
                            "/subtipo-casos/" +
                            data +
                            '/cambiar-estado"><i ' +
                            'class="ti ti-rotate me-1"></i> Cambiar estado </a>' +
                            "</div>" +
                            "</div>"
                        );
                    },
                },
            ],

            columnDefs: [
                {
                    className: "control",
                    orderable: false,
                    targets: 0,
                    render: function (data, type, full, meta) {
                        return "";
                    },
                },
            ],
            language: {
                sProcessing: "Procesando...",
                sLengthMenu: "Mostrar _MENU_ registros",
                sZeroRecords: "No se encontraron resultados",
                sEmptyTable: "Ningún dato disponible en esta tabla",
                sInfo: "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
                sInfoEmpty:
                    "Mostrando registros del 0 al 0 de un total de 0 registros",
                sInfoFiltered: "(filtrado de un total de _MAX_ registros)",
                sInfoPostFix: "",
                sSearch: "Buscar:",
                sUrl: "",
                sInfoThousands: ",",
                sLoadingRecords: "Cargando...",
                oPaginate: {
                    sFirst: "Primero",
                    sLast: "Último",
                    sNext: "Siguiente",
                    sPrevious: "Anterior",
                },
                oAria: {
                    sSortAscending:
                        ": Activar para ordenar la columna de manera ascendente",
                    sSortDescending:
                        ": Activar para ordenar la columna de manera descendente",
                },
                buttons: {
                    copy: "Copiar",
                    colvis: "Visibilidad",
                },
            },
            orderCellsTop: true,
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function (row) {
                            var data = row.data();
                            return "Detalle del Seren: ID" + data["id"];
                        },
                    }),
                    type: "column",
                    renderer: function (api, rowIdx, columns) {
                        var data = $.map(columns, function (col, i) {
                            return col.title !== "" // ? Do not show row in modal popup if title is blank (for check box)
                                ? '<tr data-dt-row="' +
                                      col.rowIndex +
                                      '" data-dt-column="' +
                                      col.columnIndex +
                                      '">' +
                                      "<td>" +
                                      col.title +
                                      ":" +
                                      "</td> " +
                                      "<td>" +
                                      col.data +
                                      "</td>" +
                                      "</tr>"
                                : "";
                        }).join("");

                        return data
                            ? $('<table class="table"/><tbody />').append(data)
                            : false;
                    },
                },
            },
        });
    }

    // on key up from input field
    $("input.dt-input").on("keyup", function () {
        filterColumn($(this).attr("data-column"), $(this).val());
    });

    $("select.dt-input").on("change", function () {
        filterColumn($(this).attr("data-column"), $(this).val());
        console.log($(this).val());
    });

    $("input.dt-input-sereno").on("keyup", function () {
        filterColumnSereno($(this).attr("data-column"), $(this).val());
    });

    $("input.dt-input-cargo-sereno ").on("keyup", function () {
        filterColumnCargoSereno($(this).attr("data-column"), $(this).val());
    });

    //dt-input-cargo-tipocaso
    $("input.dt-input-cargo-tipocaso").on("keyup", function () {
        filterColumnTipoCaso($(this).attr("data-column"), $(this).val());
    });

    $("input.dt-input-cargo-subtipocaso").on("keyup", function () {
        filterColumnSubTipoCaso($(this).attr("data-column"), $(this).val());
    });

    $("select.dt-input-sereno").on("change", function () {
        filterColumnSereno($(this).attr("data-column"), $(this).val());
        //console.log($(this).val());
    });

    $("select.dt-input-tipo-caso").on("change", function () {
        filterColumnSubTipoCaso($(this).attr("data-column"), $(this).val());
        //console.log($(this).val());
    });

    //select_tipo_caso
    $("#select_tipo_caso").on("change", function () {
        var optionTipoCaso = $(this).find("option:selected");
        var texto = optionTipoCaso.data("descripcion");
        filterColumn($(this).attr("data-column"), texto);
    });

    //select_subtipo_caso
    // $("#select_subtipo_caso").on("change", function () {
    //     var optionSubTipoCaso = $(this).find('option:selected');
    //     var texto_sub = optionSubTipoCaso.data('descripcion');
    //     filterColumn($(this).attr("data-column"), texto_sub);
    // });

    $("#fecha_ocurrencia").on("change", function () {
        filterColumn($(this).attr("data-column"), $(this).val());
    });

    $("#fecha_sistema").on("change", function () {
        filterColumn($(this).attr("data-column"), $(this).val());
    });

    // Responsive Table
    // --------------------------------------------------------------------

    if (dt_responsive_table.length) {
        var dt_responsive = dt_responsive_table.DataTable({
            ajax: assetsPath + "json/table-datatable.json",
            columns: [
                { data: "" },
                { data: "full_name" },
                { data: "email" },
                { data: "post" },
                { data: "city" },
                { data: "start_date" },
                { data: "salary" },
                { data: "age" },
                { data: "experience" },
                { data: "status" },
            ],
            columnDefs: [
                {
                    className: "control",
                    orderable: false,
                    targets: 0,
                    searchable: false,
                    render: function (data, type, full, meta) {
                        return "";
                    },
                },
                {
                    // Label
                    targets: -1,
                    render: function (data, type, full, meta) {
                        var $status_number = full["status"];
                        var $status = {
                            1: { title: "Current", class: "bg-label-primary" },
                            2: {
                                title: "Professional",
                                class: " bg-label-success",
                            },
                            3: { title: "Rejected", class: " bg-label-danger" },
                            4: {
                                title: "Resigned",
                                class: " bg-label-warning",
                            },
                            5: { title: "Applied", class: " bg-label-info" },
                        };
                        if (typeof $status[$status_number] === "undefined") {
                            return data;
                        }
                        return (
                            '<span class="badge ' +
                            $status[$status_number].class +
                            '">' +
                            $status[$status_number].title +
                            "</span>"
                        );
                    },
                },
            ],
            // scrollX: true,
            destroy: true,
            dom: '<"row"<"col-sm-12 col-md-6"l><"col-sm-12 col-md-6 d-flex justify-content-center justify-content-md-end"f>>t<"row"<"col-sm-12 col-md-6"i><"col-sm-12 col-md-6"p>>',
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function (row) {
                            var data = row.data();
                            return "Details of " + data["full_name"];
                        },
                    }),
                    type: "column",
                    renderer: function (api, rowIdx, columns) {
                        var data = $.map(columns, function (col, i) {
                            return col.title !== "" // ? Do not show row in modal popup if title is blank (for check box)
                                ? '<tr data-dt-row="' +
                                      col.rowIndex +
                                      '" data-dt-column="' +
                                      col.columnIndex +
                                      '">' +
                                      "<td>" +
                                      col.title +
                                      ":" +
                                      "</td> " +
                                      "<td>" +
                                      col.data +
                                      "</td>" +
                                      "</tr>"
                                : "";
                        }).join("");

                        return data
                            ? $('<table class="table"/><tbody />').append(data)
                            : false;
                    },
                },
            },
        });
    }

    // Filter form control to default size
    // ? setTimeout used for multilingual table initialization
    setTimeout(() => {
        $(".dataTables_filter .form-control").removeClass("form-control-sm");
        $(".dataTables_length .form-select").removeClass("form-select-sm");
    }, 200);
});

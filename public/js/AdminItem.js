class AdminItem {
    constructor() {
        this.page = 0;
        this.limit = 10;
        this.hasItemPage = 0;
        this.hasItemLimit = 10;
        this.isHasItemLastPage = false;
        this.isLastPage = false;
    }
    init() {
        $.ajax({
            method: "GET",
            url: "/api/login-detail",
            dataType: "json",
            success: (response) => {
                if (!response.isAdmin) {
                    window.location.hash = "#home";
                }
                else {
                    this.detailModalHandler();
                    this.addModalHandler();
                    this.fillTable();
                    this.paginationHandler();
                    this.searchHandler();
                }
            },
            statusCode: {
                401 : () => {
                    window.location = "login.html";
                }
            }
        });

    }

    searchHandler() {
        $("#search-item").unbind().on("input", (event) => {
            if (event.target.value) {
                $.ajax({
                    method: "GET",
                    url: "/api/items",
                    data: {page: this.page, limit: this.limit, sort: "itemName", keyword: event.target.value},
                    dataType: "json",
                    success: (response) => {
                        var content = "";
                        if (response.content.length > 0) {
                            response.content.forEach(element => {
                                content += '<tr data-toggle="modal" data-target="#item-detail" data-iditem="' + element.idItem + '">'
                                + '<td scope="row">' + element.idItem + '</td>'
                                + '<td>' + element.itemName + '</td>'
                                + '<td>Rp' + element.price + '</td>'
                                + '<td class="text-center">' + element.totalQty + '</td>'
                                + '<td class="text-center">' + element.availableQty + '</td>'
                                + '</tr>';
                            });
                            this.isLastPage = response.last;
                            if (response.last) {
                                $("#page-item-next").addClass("disabled");
                            }
                            else {
                                $("#page-item-next").removeClass("disabled");
                            }

                            if (response.first) {
                                $("#page-item-prev").addClass("disabled");
                            }
                            else {
                                $("#page-item-prev").removeClass("disabled");
                            }
                        }
                        else {
                            content = '<td colspan="5">No item available</td>';
                        }

                        $("#item tbody").html(content);
                    },
                    statusCode: {
                        401: () => {
                            window.location = "login.html";
                        }
                    }
                });
            }
            else {
                this.fillTable();
            }
        })
    }

    paginationHandler() {
        $("#page-item-prev:not(.disabled)").unbind().click(() => {
            if (this.page > 0) {
                this.page--;
                this.fillTable();
                if (this.page == 0) {
                    $("#page-item-prev").addClass("disabled");
                }
            }
        })

        $("#page-item-next:not(.disabled").unbind().click(() => {
            if (!this.isLastPage) {
                this.page++;
                this.fillTable();
                if (this.isLastPage) {
                    $("#page-item-next").addClass("disabled");
                }
            }
        })
    }

    fillTable() {
        $.ajax({
            method: "GET",
            url: "/api/items",
            data: {page: this.page, limit: this.limit, sort: "itemName"},
            dataType: "json",
            success: (response) => {
                var content = "";
                if (response.content.length > 0) {
                    response.content.forEach(element => {
                        content += '<tr data-toggle="modal" data-target="#item-detail" data-iditem="' + element.idItem + '">'
                        + '<td scope="row">' + element.idItem + '</td>'
                        + '<td>' + element.itemName + '</td>'
                        + '<td>Rp' + element.price + '</td>'
                        + '<td class="text-center">' + element.totalQty + '</td>'
                        + '<td class="text-center">' + element.availableQty + '</td>'
                        + '</tr>';
                    });
                    this.isLastPage = response.last;
                    if (response.last) {
                        $("#page-item-next").addClass("disabled");
                    }
                    else {
                        $("#page-item-next").removeClass("disabled");
                    }

                    if (response.first) {
                        $("#page-item-prev").addClass("disabled");
                    }
                    else {
                        $("#page-item-prev").removeClass("disabled");
                    }
                }
                else {
                    content = '<td colspan="5">No item available</td>';
                }

                $("#admin-item-main-table").html(content);
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });
    }

    fillDetail(idItem) {
        var spinner = $("#item-detail-spinner");
        var header = $("#item-detail .modal-header");
        var body = $("#item-detail .modal-body");
        spinner.attr("style", "display: block");
        header.attr("style", "display: none");
        body.attr("style", "display: none");
        $.ajax({
            type: "GET",
            url: "/api/items/" + idItem,
            dataType: "json",
            success: (response) => {
                $("#itemDetailId").text(response.itemName);
                if (response.pictureURL != '') {
                    $("#detail-item img").attr("src", response.pictureURL);
                }
                else {
                    $("#detail-item img").attr("src", "/public/images/no-image.jpg");
                }
                $(".item-price").text(response.price);
                $(".item-total-qty").text(response.totalQty);
                $(".item-available-qty").text(response.availableQty);
                $(".item-description").text(response.description);
                $("#update-item img").attr("src", $("#detail-item img").attr("src"));
                $("#form-update-item-name").val($("#itemDetailId").text());
                $("#form-update-item-price").val($(".item-price").text());
                $("#form-update-item-totalqty").val($(".item-total-qty").text());
                $("#form-update-item-description").val($(".item-description").text());
                spinner.attr("style", "display: none");
                header.attr("style", "display: flex");
                body.attr("style", "display: block");
            },
            responseStatus : {
                401 : () => {
                    spinner.attr("style", "display: none");
                    window.location = "login.html";
                }
            }
        });
        $("#print-item-detail").unbind().click(() => {
            window.location = "/api/item-detail/" + idItem;
        });
        this.fillHasItemTable(idItem);
        this.paginationHasItemHandler(idItem);
    }

    paginationHasItemHandler(idItem) {
        this.hasItemPage = 0;
        $("#page-has-item-prev:not(.disabled)").unbind().click(() => {
            if (this.hasItemPage > 0) {
                this.hasItemPage--;
                this.fillHasItemTable(idItem);
                if (this.hasItemPage == 0) {
                    $("#page-has-item-prev").addClass("disabled");
                }
            }
        });

        $("#page-has-item-next:not(.disabled").unbind().click(() => {
            if (!this.isHasItemLastPage) {
                this.hasItemPage++;
                this.fillHasItemTable(idItem);
                if (this.isHasItemLastPage) {
                    $("#page-item-next").addClass("disabled");
                }
            }
        });
    }

    fillHasItemTable(idItem) {
        var spinner = $("#item-detail-hasitem-spinner");
        var table = $("#item-detail-hasitem-table");
        spinner.attr("style", "display: block");
        table.attr("style", "display: none");
        $.ajax({
            method: "GET",
            url: "/api/user-items",
            data: {page: this.hasItemPage, limit: this.hasItemLimit,
                sort: "user.name", idItem: idItem},
            dataType: "json",
            success: (response) => {
                this.isHasItemLastPage = response.last;
                if (response.last) {
                    $("#page-has-item-next").addClass("disabled");
                }
                else {
                    $("#page-has-item-next").removeClass("disabled");
                }

                if (response.first) {
                    $("#page-has-item-prev").addClass("disabled");
                }
                else {
                    $("#page-has-item-prev").removeClass("disabled");
                }

                var content = "";
                if (response.content.length > 0) {
                    response.content.forEach(element => {
                        content += '<tr><td class="text-center">' + element.user.idUser + '</td>'
                        + '<td>' + element.user.name + '</td>'
                        + '<td class="text-center">' + element.hasQty + '</td></tr>';
                    });
                }
                else {
                    content = '<td colspan="3">No employee has this item</td>';
                }
                $("#admin-has-item-table").html(content);
                spinner.attr("style", "display: none");
                table.attr("style", "display: table");
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });
    }

    detailModalHandler() {
        $("#item-detail").unbind().on('show.bs.modal', (event) => {
            var idItem = $(event.relatedTarget).data('iditem');
            this.fillDetail(idItem);
            $(".update-btn").unbind().click(() => {
                $("#detail-item").css("display", "none");
                $("#update-item").css("display", "block");
                $(".modal-header").css("display", "none");
                this.updateFormHandler(idItem);
            });

            $(".delete-btn").unbind().click(() => {
                this.deleteItem(idItem);
            });
        });
    }

    updateFormHandler(idItem) {
        $("#item-update-image-uploader").unbind().change(() => {
            var formData = new FormData($("#update-item form")[0]);
            Helper.uploadFile(formData, function(response) {
                var imageUrl = response.file.slice(21);
                $("#update-item img").attr("src", imageUrl);
                $("#detail-item img").attr("src", imageUrl);
            });
        });

        $("#update-item .save-update-btn").unbind().click((event) => {
            event.preventDefault();
            var request = {
                itemName: $("#form-update-item-name").val(),
                description: $("#form-update-item-description").val(),
                pictureURL: $("#update-item img").attr("src"),
                price: $("#form-update-item-price").val(),
                totalQty: $("#form-update-item-totalqty").val()
            }

            if (this.singleEntryValidation(request)) {
                this.updateItem(request, idItem);
            }
        });
    }

    addModalHandler() {
        $("#add-item").unbind().on('show.bs.modal', () => {
            this.singleEntryFormHandler();
            this.bulkEntriesFormHandler();
            $("#bulk-item-entries label").text("Choose CSV File");
            $("#upload-bulk-item-entries").val('');
        })
    }


    bulkEntriesFormHandler() {
        $("#upload-bulk-item-entries").unbind().change((event) => {
            $("#upload-bulk-item-entries").removeClass("is-invalid");
            var files = event.target.files;
            $("#bulk-item-entries label").text(files[0].name);
            var reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = (event) => {
                var csv = event.target.result;
                var data = $.csv.toArrays(csv);
                var requests = [];
                for (var value in data) {
                    var request = {
                        itemName: data[value][0],
                        price: parseInt(data[value][1]),
                        totalQty: parseInt(data[value][2]),
                        description: data[value][3],
                        pictureURL: data[value][4]
                    }
                    requests.push(request);
                }
                $(".save-update-bulk-btn").unbind().click(() => {
                    if (this.bulkEntriesValidation(requests)) {
                        this.addItem(requests, true)
                    }
                })
            }
            reader.onerror = () => {
                $(".item-invalid-feedback").text("Unable to read " + file.name);
                $(".item-form-name").addClass("is-invalid");
            }
        })

    }

    singleEntryFormHandler() {
        var imageUrl = '';
        $("#item-add-image-uploader").unbind().change(() => {
            var formData = new FormData($("#add-item form")[0]);
            Helper.uploadFile(formData, function(response) {
                imageUrl = response.file.slice(21);
                $("#add-item img").attr("src", imageUrl);
            });
        });

        $("#add-item .save-update-btn").unbind().click((event) => {
            event.preventDefault();
            var requests = [{
                itemName: $("#form-add-item-name").val(),
                description: $("#form-add-item-description").val(),
                pictureURL: imageUrl,
                price: $("#form-add-item-price").val(),
                totalQty: $("#form-add-item-totalqty").val()
            }]
            var validated = this.singleEntryValidation(requests[0]);
            if (validated) {
                this.addItem(requests, false);
            }
        })
    }

    singleEntryValidation(request) {
        var valid = true;
        $(".item-form-name").unbind().change(() => {
            $(".item-form-name").removeClass("is-invalid");
        });

        $(".item-form-price").unbind().change(() => {
            $(".item-form-price").removeClass("is-invalid");
        });

        $(".item-form-totalqty").unbind().change(() => {
            $(".item-form-totalqty").removeClass("is-invalid");
        });

        $(".item-form-description").unbind().change(() => {
            $(".item-form-description").removeClass("is-invalid");
        });


        if (request.itemName == "") {
            $(".item-invalid-feedback").text("Please provide an item name");
            $(".item-form-name").addClass("is-invalid");
            valid = false;
        }
        if (request.description == "") {
            $(".item-form-description").addClass("is-invalid");
            valid = false;
        }
        if (request.price == "") {
            $(".item-form-price").addClass("is-invalid");
            valid = false;
        }
        if (request.totalQty == "") {
            $(".item-form-totalqty").addClass("is-invalid");
            valid = false;
        }
        return valid;
    }

    bulkEntriesValidation(requests) {
        var upload_form = $("#upload-bulk-item-entries");
        var invalid_feedback = $("#bulk-item-entry-invalid-feedback");
        upload_form.unbind().change(function () {
            upload_form.removeClass("is-invalid");
        });
        this.bulkEntriesFormHandler();

        var valid = true;
        for (var request in requests) {
            if (!requests[request].itemName || !requests[request].description || !requests[request].price || !requests[request].totalQty) {
                upload_form.addClass("is-invalid");
                invalid_feedback.text("Invalid input! All item name, description, price, and total quantity fields must be filled");
                valid = false;
            }
        }
        return valid;
    }

    addItem(requests, isBulkEntries) {
        $.ajax({
            method: "POST",
            url: "/api/items",
            data: JSON.stringify(requests),
            dataType: "json",
            contentType: "application/json",
            success: (response) => {
                this.page = 0;
                this.fillTable();
                $("#form-add-item-name").val('');
                $("#form-add-item-description").val('');
                $("#form-add-item-price").val('');
                $("#form-add-item-totalqty").val('');
                $("#item-add-image-uploader").val('');
                $("#add-item img").attr("src", "/public/images/no-image.jpg");
                $("#add-item").modal('hide');
            },
            statusCode: {
                409: () => {
                    if (isBulkEntries) {
                        $("#upload-bulk-item-entries").addClass("is-invalid");
                        $("#bulk-item-entry-invalid-feedback").text("Item name must be unique")
                        this.bulkEntriesFormHandler();
                    }
                    else {
                        $(".item-invalid-feedback").text("Item name already exists");
                        $("#form-add-item-name").addClass("is-invalid");
                    }

                },
                401: () => {
                    window.location = 'login.html';
                }
            }
        });
    }

    updateItem(request, idItem) {
        $.ajax({
            method: "PUT",
            url: "/api/items/" + idItem,
            data: JSON.stringify(request),
            contentType: "application/json",
            dataType: "json",
            success: (response) => {
                this.fillDetail(idItem);
                this.fillTable();
                $("#detail-item").css("display", "block");
                $("#update-item").css("display", "none");
                $(".modal-header").css("display", "flex");
            },
            statusCode: {
                409: () => {
                    $(".item-invalid-feedback").text("Item name already exists");
                    $("#form-update-item-name").addClass("is-invalid");
                },
                400: () => {
                    $(".invalid-totalqty").text("Total quantity must be more than or equal number of used items")
                    $("#form-update-item-totalqty").addClass("is-invalid");
                },
                401: () => {
                    window.location = 'login.html';
                }
            }
        });
    }

    deleteItem(idItem) {
        $.ajax({
            method: "DELETE",
            url: "/api/items",
            data: JSON.stringify({idItem: idItem}),
            contentType: "application/json",
            success: () => {
                this.page = 0;
                this.fillTable();
                $("#item-detail").modal('hide');
            },
            statusCode: {
                401: () => {
                    window.location = 'login.html';
                }
            }
        });
    }
}

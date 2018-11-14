class AdminDashboard {
    constructor() {
        this.itemPage = 0;
        this.itemPageLast = false;
        this.itemLimit = 50;
        this.employeePage = 0;
        this.employeeLimit = 50;
        this.employeePageLast = false;
    }
    init() {
        this.detailItemModalHandler();
        this.addItemModalHandler();
        this.fillItemTable();

    }

    fillItemDetail(idItem) {
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
                $("#form-update-item-description").val($(".item-description").text())
            }
        });
    }

    detailItemModalHandler() {
        $("#item-detail").unbind().on('show.bs.modal', (event) => {
            var idItem = $(event.relatedTarget).data('iditem');
            this.fillItemDetail(idItem);

            $(".update-btn").unbind().click(() => {
                $("#detail-item").css("display", "none");
                $("#update-item").css("display", "block");
                $(".modal-header").css("display", "none");
                this.updateItemFormHandler(idItem);

            });

            $(".delete-btn").unbind().click(() => {
                this.deleteItem(idItem);
            })


        });
    }

    updateItemFormHandler(idItem) {
        $("#item-update-image-uploader").unbind().change(() => {
            var formData = new FormData($("#update-item form")[0]);
            var imageUrl = Helper.uploadFile(formData);
            $("#update-item img").attr("src", imageUrl);
            $("#detail-item img").attr("src", imageUrl);
        })

        $("#update-item .save-update-btn").unbind().click((event) => {
            event.preventDefault();
            var request = {
                itemName: $("#form-update-item-name").val(),
                description: $("#form-update-item-description").val(),
                pictureURL: $("#update-item img").attr("src"),
                price: $("#form-update-item-price").val(),
                totalQty: $("#form-update-item-totalqty").val()
            }

            if (this.validateRequest(request)) {
                this.updateItem(request, idItem);
            }
        })
    }

    updateItem(request, idItem) {
        $.ajax({
            method: "PUT",
            url: "/api/items/" + idItem,
            data: JSON.stringify(request),
            contentType: "application/json",
            dataType: "json",
            success: (response) => {
                this.fillItemDetail(idItem);
                this.fillItemTable();
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
                }
            }
        });
    }

    addItemModalHandler() {
        $("#add-item").unbind().on('show.bs.modal', () => {
            this.addItemFormHandler();
        })
    }

    addItemFormHandler() {
        var imageUrl = '';
        $("#item-add-image-uploader").unbind().change(() => {
            var formData = new FormData($("#add-item form")[0]);
            imageUrl = Helper.uploadFile(formData);
            $("#add-item img").attr("src", imageUrl);
        })
        $("#add-item .save-update-btn").unbind().click((event) => {
            event.preventDefault();
            var requests = [{
                itemName: $("#form-add-item-name").val(),
                description: $("#form-add-item-description").val(),
                pictureURL: imageUrl,
                price: $("#form-add-item-price").val(),
                totalQty: $("#form-add-item-totalqty").val()
            }]
            var validated = true;
            for (var request in requests) {
                validated = validated && this.validateRequest(request);
            }
            if (validated) {
                this.addItem(requests);
            }
        })
    }

    validateRequest(request) {
        var valid = true;
        $(".item-form-name").unbind().change(() => {
            $(".item-form-name").removeClass("is-invalid");
        })

        $(".item-form-price").unbind().change(() => {
            $(".item-form-price").removeClass("is-invalid")
        })

        $(".item-form-totalqty").unbind().change(() => {
            $(".item-form-totalqty").removeClass("is-invalid")
        })

        $(".item-form-description").unbind().change(() => {
            $(".item-form-description").removeClass("is-invalid")
        })

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

    addItem(request) {
        $.ajax({
            method: "POST",
            url: "/api/items",
            data: JSON.stringify(request),
            dataType: "json",
            contentType: "application/json",
            success: (response) => {
                this.fillItemTable();
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
                    $(".item-invalid-feedback").text("Item name already exists");
                    $("#form-add-item-name").addClass("is-invalid");
                }
            }
        });
    }

    fillItemTable() {
        $.ajax({
            method: "GET",
            url: "/api/items",
            data: {page: this.itemPage, limit: this.itemLimit},
            dataType: "json",
            success: (response) => {
                var numb = 1;
                var content = "";
                response.content.forEach(element => {
                    content += '<tr data-toggle="modal" data-target="#item-detail" data-iditem="' + element.idItem + '">'
                    + '<td scope="row">' + numb + '</td>'
                    + '<td>' + element.itemName + '</td>'
                    + '<td>Rp' + element.price + '</td>'
                    + '<td class="text-center">' + element.totalQty + '</td>'
                    + '<td class="text-center">' + element.availableQty + '</td>'
                    + '</tr>'
                    numb++;
                });
                $("#item tbody").html(content);
            },
        });
    }

    deleteItem(idItem) {
        $.ajax({
            method: "DELETE",
            url: "/api/items",
            data: JSON.stringify({idItem: idItem}),
            contentType: "application/json",
            success: () => {
                this.fillItemTable();
                $("#item-detail").modal('hide');
            }
        });
    }
}

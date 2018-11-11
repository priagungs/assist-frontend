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
        $.ajax({
            type: "post",
            url: "/api/login",
            data: "username=admin&password=admin",
            success: function (response) {
            }
        });
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
                
                $("#update-item img").attr("src", $("#detail-item img").attr("src"));
                $("#form-update-item-name").attr("value", $("#itemDetailId").text());
                $("#form-update-item-price").attr("value", $(".item-price").text());
                $("#form-update-item-totalqty").attr("value", $(".item-total-qty").text());
                $("#form-update-item-description").text($(".item-description").text())
            });
    
            $("#update-item .save-update-btn").unbind().click(() => {
                $("#detail-item").css("display", "block");
                $("#update-item").css("display", "none");
                $(".modal-header").css("display", "flex");
            });

            $(".delete-btn").unbind().click(() => {
                this.deleteItem(idItem);
            })
        
        });
    }

    addItemModalHandler() {
        $("#add-item").unbind().on('show.bs.modal', () => {
      
            $("#form-add-item-name").unbind().change(() => {
                $("#form-add-item-name").removeClass("is-invalid");
            })

            $("#form-add-item-price").unbind().change(() => {
                $("#form-add-item-price").removeClass("is-invalid")
            })

            $("#form-add-item-totalqty").unbind().change(() => {
                $("#form-add-item-totalqty").removeClass("is-invalid")
            })

            $("#form-add-item-description").unbind().change(() => {
                $("#form-add-item-description").removeClass("is-invalid")
            })
            
            this.addItemFormHandler();      
            
        })
    }

    addItemFormHandler() {
        var imageUrl = '';
        $(".item-form-image").unbind().change(() => {
            var formData = new FormData($("#add-item form")[0]);
            imageUrl = Helper.uploadFile(formData);
            $("#add-item img").attr("src", imageUrl);
        })
        $("#add-item .save-update-btn").unbind().click((event) => {
            event.preventDefault();
            var request = [{
                itemName: $("#form-add-item-name").val(),
                description: $("#form-add-item-description").val(),
                pictureURL: imageUrl,
                price: $("#form-add-item-price").val(),
                totalQty: $("#form-add-item-totalqty").val()
            }]
            
            if (this.validateRequest(request)) {
                this.addItem(request);
            }
        })
    }

    validateRequest(request) {
        var valid = true;
        console.log(request);
        if (request[0].itemName == "") {
            $(".item-invalid-feedback").text("Please provide an item name");
            $(".item-form-name").addClass("is-invalid");
            valid = false;
        }
        if (request[0].description == "") {
            $(".item-form-description").addClass("is-invalid");
            console.log($(".item-form-description"));
            valid = false;
        }
        if (request[0].price == "") {
            $(".item-form-price").addClass("is-invalid");
            valid = false;
        }
        if (request[0].totalQty == "") {
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
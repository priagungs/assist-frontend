class Home {

    constructor() {
        this.itemPage = 0;
        this.itemLimit = 10;
        this.dropdownLimit = 5;
    }

    init() {
        $.ajax({
            type: "GET",
            url: "/api/login-detail/",
            dataType: "json",
            success: (data, status) => {
                this.loggedInUser = data;
                this.fillUserCard(data);
                this.emptyTable();
                this.fillItemTable(data.idUser);
                this.detailModalHandler();
                this.tableHandler(data.idUser);
                this.paginationHandler(data.idUser);
                this.createRequestHandler();
            }
        });
    }

    fillUserCard(data) {
        $("#name").text(data.name);
        $("#nip").text(data.idUser);
        $("#division").text(data.division);
        $("#role").text(data.role);
        if (data.superior != null) {
            $("#superior-name").text(data.superior.name);
            $("#superior-id").text(data.superior.idUser);
        } else {
            $("#superior-name").text();
            $("#superior-id").text("NULL");
        }
    }

    fillItemTable(idUser) {
        $.ajax({
            method: "GET",
            url: "/api/user-items",
            data: {page: this.itemPage, limit: this.itemLimit, idUser: idUser, sort: "idUserHasItem"},
            dataType: "json",
            success: (response) => {
                var content = "";
                response.content.forEach(element => {
                    content += '<tr class="' + element.requestStatus +
                    '"  data-toggle="modal" data-target="#home-item-detail" data-iditem="' + element.item.idItem
                    + '" data-itemname="' + element.item.itemName
                    + '" data-status="' + 'SENT'
                    + '" data-idhasitem="' + element.idUserHasItem + '">'
                    + '<td>' + element.item.itemName +'</td>'
                    + '<td class="text-center">' + element.hasQty + '</td>'
                    + '<td class="text-center">' + 'SENT' + '</td>'
                    + '</tr>';
                    console.log("AUNG" + element.item.itemName);
                });
                $("#content-items").html(content);
            }
        })
    }

    fillCustomItemTable(idUser, status) {
        $.ajax({
            method: "GET",
            url: "/api/requests",
            data: {page: this.itemPage, limit: this.itemLimit, idUser: idUser, status:status.toUpperCase(), sort: "idRequest"},
            dataType: "json",
            success: (response) => {
                var content = "";
                response.content.forEach(element => {
                    content += '<tr class="' + element.requestStatus +
                    '"  data-toggle="modal" data-target="#home-item-detail" data-iditem="' + element.item.idItem
                    + '" data-itemname="' + element.item.itemName
                    + '" data-status="' + element.requestStatus
                    + '" data-idrequest="' + element.idRequest + '">'
                    + '<td>' + element.item.itemName +'</td>'
                    + '<td class="text-center">' + element.reqQty + '</td>'
                    + '<td class="text-center">' + element.requestStatus + '</td>'
                    + '</tr>';
                    console.log("AUNG" + element.item.itemName);
                });
                $("#content-items").html(content);
            }
        })
    }

    tableHandler(idUser) {
        $(".filter").change(() => {
            var status = $(".filter").val();
            this.emptyTable();
            if (status == "sent") {
                this.fillItemTable(idUser);
            } else {
                console.log(status);
                this.fillCustomItemTable(idUser, status);
            }
        });
    }

    fillHomeItemDetail(idItem) {
        console.log("OINK");
        console.log("oin",idItem);
        $.ajax({
            type: "GET",
            url: "/api/items/" + idItem,
            dataType: "json",
            success: (response) => {
                console.log("hoiii");
                $("#item-detail-name").text(response.itemName);
                if (response.pictureURL != '') {
                    $("#detail-item img").attr("src", response.pictureURL);
                }
                else {
                    $("#detail-item img").attr("src", "/public/images/no-image.jpg");
                }
                $("#detail-item #item-price").text(response.price);
                $("#detail-item #item-total-qty").text(response.totalQty);
                $("#detail-item #item-available-qty").text(response.availableQty);
                $("#detail-item #item-description").text(response.description);
            },
            responseStatus : {
                401 : () => {
                    window.location = "login.html";
                }
            }
        });
    }

    emptyHomeItemDetail() {
        $("#detail-item").html('');
        $("#item-detail-name").html('');
    }

    detailModalHandler() {
        $("#home-item-detail").unbind().on('show.bs.modal', (event)=> {
            // this.emptyHomeItemDetail();
            var idItem = $(event.relatedTarget).data('iditem');
            var status = $(event.relatedTarget).data('status');
            console.log(idItem);
            console.log(status);
            this.fillHomeItemDetail(idItem);

            if (status!="SENT" && status!="sent") {
                var buttonreturn = document.getElementById('return-btn');
                buttonreturn.style.display='none';
            }

            $("#return-btn").unbind().click(() => {
                if (confirm("Are you sure you want to return " + $(event.relatedTarget).data('itemname') + '?')) {
                    console.log($(event.relatedTarget).data('idhasitem'));
                    var deleteditem = {
                        idUserHasItem : $(event.relatedTarget).data('idhasitem')
                    };
                    this.deleteRequest(deleteditem, idItem);
                }
            });
        });
    }

    deleteRequest(deleteditem, idItem) {
        $.ajax({
            method: "DELETE",
            url: "/api/user-items",
            data: JSON.stringify(deleteditem),
            contentType: "application/json",
            dataType: "json",
            success: (response) => {
                this.fillItemDetail(idItem);
                this.fillItemTable(this.loggedInUser.idUser);
            }
        })
    }

    paginationHandler(idUser) {
        $("#page-item-prev:not(.disabled)").unbind().click(() => {
            if (this.itemPage > 0) {
                this.itemPage--;
                this.fillItemTable(idUser);
                if (this.itemPage == 0) {
                    $("#page-item-prev").addClass("disabled");
                }
            }
        });

        $("#page-item-next:not(.disabled").unbind().click(() => {
            if (this.itemPage < this.itemLimit && !this.isLastPageItem) {
                this.itemPage++;
                this.fillItemTable(idUser);
                if (this.itemPage == this.itemLimit || this.isLastPageItem) {
                    $("#page-item-next").addClass("disabled");
                }
            }
        });
    }

    emptyTable() {
        var content = "";
        $("#content-items").html(content);
    }

    createRequestHandler() {
        $("#add-request").on('show.bs.modal', () => {
            this.requestItems = [];
            this.fillCreateRequestTable();
            this.searchHandler();
            this.submitRequestHandler();
        });
    }

    submitRequestHandler() {
        $("#add-request-btn").unbind().click(() => {
            var requestBody = {
                idUser: this.loggedInUser.idUser,
                items: this.requestItems
            };
            $.ajax({
                method: "POST",
                url: "/api/requests",
                data: JSON.stringify(requestBody),
                contentType: "application/json",
                success: () => {
                    this.fillItemTable(this.loggedInUser.idUser);
                    $("#add-request").modal('hide');
                }
            })
        })
    }


    addRequestItems(idItem) {
        $.ajax({
            method: "GET",
            url: "/api/items/" + idItem,
            dataType: "json",
            success: (response) => {
                this.requestItems.push({
                    item: response,
                    requestQty: 1
                });
                this.fillCreateRequestTable();
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });
    }

    fillCreateRequestTable() {
        var content = '';
        var index = 0;
        this.requestItems.forEach((element) => {
            content += '<tr><td class="text-center">' + element.item.idItem + '</td>'
                + '<td>' + element.item.itemName + '</td>'
                + '<td class="target-item-request text-center"><input type="number" data-index="' + index + '" id="item-request-' + element.item.idItem + '" max="' + element.item.availableQty
                + '" style="width: 3rem" min="1" value="' + element.requestQty + '"></td>'
                + '<td class="text-center" style="width: 3rem"><i class="fa fa-times remove-item-transaction" data-index="' + index + '" aria-hidden="true"></i></td></tr>';
            index++;
        });
        $("#content-create-request-items").html(content);
        $(".remove-item-transaction").unbind().click(event => {
            var removeIdx = $(event.currentTarget).data('index');
            this.requestItems.splice(removeIdx, 1);
            this.fillCreateRequestTable();
        });
        $(".target-item-request input").unbind().on('mouseup keyup change', (event) => {
            var idx = $(event.currentTarget).data('index');
            this.requestItems[idx].requestQty = parseInt(event.currentTarget.value)
        });
    }

    searchHandler() {
        $("#form-add-item-request").unbind().focusin(() => {
            $('#home .dropdown-menu').html('<p class="dropdown-item"><strong>Insert Item</strong></p>');
        });
        $("#form-add-item-request").on('input', (event) => {
            $("#form-add-item-request").removeClass("is-invalid");
            $("#id-item-form").text("");
            if (event.target.value) {
                $.ajax({
                    type: "GET",
                    url: "/api/items",
                    data: {page: 0, limit: this.dropdownLimit, sort: "itemName", keyword: event.target.value, minqty: 0},
                    dataType: "json",
                    success: (response) => {
                        var dropdown_content = "";
                        response.content.forEach((element) => {
                            dropdown_content += '<button class="dropdown-item candidate-item-trx" data-iditem="' + element.idItem + '" data-name="' + element.itemName + '">'
                            + '<div class="row"><div class="col-2">'
                            + '<img src="' + (element.pictureURL ? element.pictureURL : "/public/images/no-image.jpg") + '" class="img-thumbnail rounded-circle" alt=""></div>'
                            + '<div class="col-10">'
                            + '<p><strong>' + element.itemName + '</strong></p>'
                            + '<p>ID : ' + element.idItem + '</p>'
                            + '<p>Available Qty : ' + element.availableQty + '</p>'
                            + '</div></div></button>';
                        });
                        if (response.content.length > 0) {
                            $('#home .dropdown-menu').html(dropdown_content);
                        }
                        else {
                            $('#home .dropdown-menu').html('<p class="dropdown-item"><strong>Item not found</strong></p>');
                        }

                        $("#dropdown-add-item-request .candidate-item-trx").unbind().click((event) => {
                            event.preventDefault();
                            $("#form-add-item-request").val("");
                            this.addRequestItems(parseInt($(event.currentTarget).data('iditem')));
                        });
                    },
                    statusCode: {
                        401: () => {
                            window.location = "login.html";
                        }
                    }
                });
            }
            else {
                $('#dropdown-add-item-transaction').html('<p class="dropdown-item"><strong>Insert Item</strong></p>');
            }
        });
    }
}

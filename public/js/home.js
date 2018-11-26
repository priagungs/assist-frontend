class Home {

    constructor() {
        this.itemPage = 0;
        this.itemLimit = 10;
    }

    init() {
        $.ajax({
            type: "GET",
            url: "/api/login-detail/",
            dataType: "json",
            success: (data, status) => {
                this.fillUserCard(data);
                this.emptyTable();
                this.fillItemTable(data.idUser);
                this.detailModalHandler();
                this.tableHandler(data.idUser);
                this.paginationHandler(data.idUser);
            }
        });
    }

    fillUserCard(data) {
        if (data.pictureURL) {
            $('#profile-photo').attr('src', data.pictureURL);
        } else {
            $('#profile-photo').attr('src', "public/images/profile.png");
        }
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
        })
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
                console.log($("#detail-item img"));
                if (response.pictureURL) {
                    $("#img-detail-item-home").attr("src", response.pictureURL);
                }
                else {
                    $("#img-detail-item-home").attr("src", "/public/images/no-image.jpg");
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
    detailModalHandler() {
        $("#home-item-detail").unbind().on('show.bs.modal', (event)=> {
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
            })
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
                this.fillItemTable();
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

    addModalHandler() {
        $("#add-request").unbind().on('show.bs.modal', () => {
            this.searchHandler();
            this.bulkEntriesFormHandler();
            $("#bulk-item-entries label").text("Choose CSV File");
            $("#upload-bulk-item-entries").val('');
        })
    }

    searchHandler() {
        $(".search-item-form").unbind().focusin(() => {
            console.log("masuk search");
            $("#home .dropdown-menu").html('<p class="dropdown-item"><strong>No Item Found</strong></p>');
        })
        $(".search-item-form").on("input", (event) => {
            console.log("ngetik search");
            $(".search-item-form").removeClass("is-invalid");
            $(".id-item").text("");
            if (event.target.value) {
                $.ajax({
                    type: "GET",
                    url: "/api/items",
                    data: {page:0, limit: 10, sort: itemName, keyword:event.target.value},
                    dataType: "json",
                    success: function (response) {
                        var dropdown_content = "";
                        response.content.forEach((element) => {
                            dropdown_content += '<button class="dropdown-item candidate-item" data-iditem="' + element.idItem + '" data-name="' + element.itemName + '">'
                            + '<div class="row"><div class="col-10">'
                            + '<p><strong>' + element.itemName + '</strong></p>'
                            + '<p><i>Available :' + element.availableQty + '</i></p></div></button>';
                        });
                        if (response.content.length > 0) {
                            $('#home .dropdown-menu').html(dropdown_content);
                        } else {
                            $("#home .dropdown-menu").html('<p class="dropdown-item"><strong>No Item Found</strong></p>');
                        }

                        $("#dropdown-search-item .candidate-superior").unbind().click((event) => {
                            event.preventDefault();
                            $("#form-search-item").val($(event.currentTarget).data('name'));
                            $("#id-search-item-form").text($(event.currentTarget).data('iditem'));
                        })
                    }
                });
            }
            else {
                $('#dropdown-search-item').html('<p>')
            }
        })
    }


}

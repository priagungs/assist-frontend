class Home {
    constructor() {
        this.itemPage = 0;
        this.itemLimit = 1;
    }
    init() {
        this.fillUserCard();
        this.detailModalHandler();
    }
    fillUserCard() {
        $.ajax({
            type: "GET",
            url: "/api/login-detail/",
            dataType: "json",
            success: (data, status) => {
                $("#name").text(data.name);
                $("#nip").text(data.idUser);
                $("#division").text(data.division);
                $("#role").text(data.role);
                $("#superior-name").text(data.superior.name);
                $("#superior-id").text(data.superior.idUser);
                this.paginationHandler(data.idUser);
                this.fillItemTable(data.idUser);
            }
        })
    }
    fillItemTable(idUser) {
        $.ajax({
            method: "GET",
            url: "/api/requests",
            data: {page: this.itemPage, limit: this.itemLimit, idUser: idUser},
            dataType: "json",
            success: (response) => {
                if (response.pictureURL != '') {
                    $("#profile-photo").attr("src", response.pictureURL);
                }
                else {
                    $("#profile-photo").attr("src", "/public/images/item.jpg");
                }
                var no = 1;
                var content = "";
                response.content.forEach(element => {
                    content += '<tr class="' + element.requestStatus + '"  data-toggle="modal" data-target="#home-item-detail" data-iditem="' + element.item.idItem + '">'
                    + '<td class="text-center">' + no + '</td>'
                    + '<td>' + element.item.itemName +'</td>'
                    + '<td class="text-center">' + element.reqQty + '</td>'
                    + '<td class="text-center">' + element.requestStatus + '</td>'
                    + '<td> <button class="btn btn-primary btn-sm"> detail</button> </td>'
                    + '</tr>';
                    no++;
                });
                $("#content-items").html(content);
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
    detailModalHandler() {
        $("#home-item-detail").unbind().on('show.bs.modal', (event)=> {
            console.log("HAHAHAH");
            var idItem = $(event.relatedTarget).data('iditem');
            console.log("ha", idItem);
            this.fillHomeItemDetail(idItem);
        });
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
        })

        $("#page-item-next:not(.disabled").unbind().click(() => {
            if (this.itemPage < this.itemLimit && !this.isLastPageItem) {
                this.itemPage++;
                this.fillItemTable(idUser);
                if (this.itemPage == this.itemLimit || this.isLastPageItem) {
                    $("#page-item-next").addClass("disabled");
                }
            }
        })
    }
    // changeTable() {
        // $(".filter").change(function() {
        //     alert("HEHE");
        //     console.log("triggered");
        //     var status = $(this).val();
        //     $("#content-items").replaceWith("");
            // $.ajax({
            //     method: "GET",
            //     url: "api/requests",
            //     data: {page:this.itemPage, limit: this.itemLimit, idUser: this.idUser, status: status},
            //     success: (response) => {
            //         var no = 1;
            //         var content = "";
            //         response.content.forEach(element => {
            //             content += '<tr class=""' + element.requestStatus + '">'
            //             + '<td>' + no + '</td>'
            //             + '<td>' + element.item.itemName +'</td>'
            //             + '<td class="text-center">' + element.reqQty + '</td>'
            //             + '<td class="text-center">' + element.requestStatus + '</td>'
            //             + '<td> <button class="btn btn-primary btn-sm"> detail</button> </td>'
            //             + '</tr>';
            //             no++;
            //         });
            //         $("#items tbody").html(content);
            //     }
            // })
          //   console.clear();
          //   var filterValue = $(this).val();
          //   var row = $('.row');
          //
          //   row.each(function(i, el) {
          //       if ($(el).attr('data-type') == filterValue) {
          //           row.hide()
          //           $(el).show();
          //       }
          //   });
          //   // In Addition to Wlin's Answer (For "All" value)
          //   if ("all" == filterValue) {
          //       row.show();
          // }

        // });
    // }
}

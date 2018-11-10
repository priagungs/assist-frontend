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
        this.initItemModalHandler();
        this.fillItemTable();
    }

    fillItemDetail(idItem) {
        $.ajax({
            type: "GET",
            url: "/api/items/" + idItem,
            dataType: "json",
            success: (response) => {
                console.log(response);
                $("#itemDetailId").text(response.itemName);
                $("#detail-item img").attr("src", response.pictureURL);
                $(".item-price").text(response.price);
                $(".item-total-qty").text(response.totalQty);
                $(".item-available-qty").text(response.availableQty);
                $(".item-description").text(response.description);
            }
        });
    }

    initItemModalHandler() {
        $("#item-detail").on('show.bs.modal', (event) => {
            var idItem = $(event.relatedTarget).data('iditem');
            // do some ajax to get the data
            this.fillItemDetail(idItem);
            // $(this).find('.modal-title').text("id item nya " + idItem);
        
            $(".update-btn").click(() => {
                $("#detail-item").css("display", "none");
                $("#update-item").css("display", "block");
                $(".modal-header").css("display", "none");
                
                $("#update-item img").attr("src", $("#detail-item img").attr("src"));
                $("#form-update-item-name").attr("value", $("#itemDetailId").text());
                $("#form-update-item-price").attr("value", $(".item-price").text());
                $("#form-update-item-totalqty").attr("value", $(".item-total-qty").text());
                $("#form-update-item-description").text($(".item-description").text())
            });
    
            $(".save-update-btn").click(() => {
                $("#detail-item").css("display", "block");
                $("#update-item").css("display", "none");
                $(".modal-header").css("display", "flex");
            });

            $(".delete-btn").click(() => {
                this.deleteItem(idItem);
            })
        
        });
    }

    fillItemTable() {
        $.ajax({
            type: "GET",
            url: "/api/items",
            data: {page: this.itemPage, limit: this.itemLimit},
            dataType: "json",
            success: (response) => {
                console.log(response);
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
        // $.ajax({
        //     type: "post",
        //     url: "/api/login",
        //     data: "username=admin&password=admin",
        //     success: function (response) {
        //         alert(response);
        //     }
        // });
    }

    deleteItem(idItem) {
        $.ajax({
            type: "DELETE",
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
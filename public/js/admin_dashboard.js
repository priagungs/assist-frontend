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
                $(".detail-item img").attr("src", response.pictureURL);
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
                $(".detail-item").css("display", "none");
                $(".update-item").css("display", "block");
                $(".modal-header").css("display", "none");
            })
    
            $(".save-update-btn").click(() => {
                $(".detail-item").css("display", "block");
                $(".update-item").css("display", "none");
                $(".modal-header").css("display", "flex");
            })
        
        })
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
                response.content.forEach(element => {
                    var content = '<tr data-toggle="modal" data-target="#item-detail" data-iditem="' + element.idItem + '">'
                    + '<td scope="row">' + numb + '</td>'
                    + '<td>' + element.itemName + '</td>'
                    + '<td>Rp' + element.price + '</td>'
                    + '<td class="text-center">' + element.totalQty + '</td>'
                    + '<td class="text-center">' + element.availableQty + '</td>'
                    + '</tr>'
                    $("#item tbody").append(content);
                    numb++;
                });  
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
}
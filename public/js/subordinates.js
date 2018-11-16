class SubordinatesDashboard {
    constructor() {
        this.subordinatePage = 0;
        this.subordinateLimit = 10;
        this.isLastPage = false;

    }

    init() {
        $.ajax({
            type: "get",
            url: "/api/login-detail",
            success: (data, status) => {
                this.fillSubordinatedetail(data.idUser);
            }
        });

    }


    fillSubordinatedetail(idUser) {
        $.ajax({
            type: "get",
            url: "/api/users",
            data : {page : this.subordinatePage, limit : this.subordinateLimit, idSuperior : idUser},
            dataType: "json",
            success: (response) => {
                console.log(response.content);
                console.log("masuk add element");
                var index=1;
                var content = "";
                response.content.forEach(element => {
                    content += '<tr data-toggle="modal" data-target="#myModal" >'
                    + '<td>' + element.name + '</td>'
                    + '<td>' + element.role + '</td>'
                    + '<td> 4 </td>'
                    + '</tr>';
                });
                this.isLastPageItem = response.last;
                this.lastPageItem = response.totalPages-1;
                // if (response.last) {
                //     $("#page-item-next").addClass("disabled");
                // }
                // else {
                //     $("#page-item-next").removeClass("disabled");
                // }

                // if (response.first) {
                //     $("#page-item-prev").addClass("disabled");
                // }
                // else {
                //     $("#page-item-prev").removeClass("disabled");
                // }

                $("#subordinates .data-table-subordinates").html(content);
            }
        });
    }
}





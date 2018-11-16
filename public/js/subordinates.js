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
                console.log("aaa");
                this.fillSubordinatesDetail(data.idUser);
                this.detailSubordinateHandler();
            }
        });

    }


    fillSubordinatesDetail(idUser) {
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
                    content += '<tr data-toggle="modal" data-target="#subordinates-detail" data-idUser="' + element.idUser +'">'
                    + '<td>' + element.name + '</td>'
                    + '<td>' + element.role + '</td>'
                    + '<td id="sub-detail-index-'+index+'"> </td>'
                    + '</tr>';
                    this.fillCounterRequest(element.idUser,index);
                    console.log(element.idUser+" : "+index);
                    index++;
                });
                $("#data-table-subordinates").html(content);
            }
        });
    }

    detailSubordinateHandler() {
        $("#subordinates-detail").unbind().on('show.bs.modal',(event) => {
            var idUser = $(event.relatedTarget).data("iduser");
            this.fillSubDetail(idUser);
        });
    }

    fillSubDetail(idUser) {
        $.ajax({
            method: "GET",
            url: "/api/user/" + idUser,
            dataType : "json",
            success: (response) => {
                console.log(response);
                if (response.pictureURL) {
                    $("#subordinates-detail img").attr("src", response.pictureURL);
                }
                else {
                    $("#subordinates-detail img").attr("src", "/public/images/profile.png");
                }
                $("#sub-name").text(response.name);
                $("#sub-id").text("NIP      :"+response.idUser);
                $("#sub-division").text("Division   :"+response.division);
                $("#sub-role").text("Role       :"+response.role);
                var superiorContent = "Superior :"+response.superior.name + "( NIP :" + response.superior.idUser +")";
                $("#sub-superior").text(superiorContent);
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });

        $.ajax({
            method: "GET",
            url: "/api/user-items",
            data: {page: 0, limit: JAVA_MAX_INTEGER, idUser: idUser},
            dataType: "json",
            success: (response) => {
                var content = '';
                response.content.forEach((element) => {
                    content += '<tr><td class="text-center" scope="row">' + element.item.idItem + '</td>'
                    + '<td class="text-center">' + element.item.itemName+ '</td>'
                    + '<td class="text-center">' + element.hasQty + '</td>';
                });
                $(".subordinates-item-table tbody").html(content);
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });

        $.ajax({
            method: "GET",
            url: "/api/requests",
            data: {page: 0, limit: JAVA_MAX_INTEGER, idUser: idUser},
            dataType: "json",
            success: (response) => {
                var content = '';
                response.content.forEach((element) => {
                    content += '<tr>'
                    + '<td class="text-center" scope="row">' + element.item.idItem + '</td>'
                    + '<td class="text-center">' + element.item.itemName+ '</td>'
                    + '<td class="text-center">' + element.reqQty + '</td>'
                    + '<td class="text-center">' + element.requestStatus + '</td>'
                    + '</tr>';
                });
                $(".subordinates-request-table tbody").html(content);
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });
    }

    fillCounterRequest(idUser,index) {
        $.ajax({
            method: "GET",
            url: "/api/requests",
            data: {page: 0, limit: JAVA_MAX_INTEGER, idUser: idUser},
            dataType: "json",
            success: (response) => {
                var count = response.content.length;
                $("#sub-detail-index-"+index,).html(count);
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });
    }
}





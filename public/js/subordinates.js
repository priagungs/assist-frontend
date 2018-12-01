class SubordinatesDashboard {
    constructor() {
        this.subordinatePage = 0;
        this.subordinateLimit = 10;
        this.isLastPage = false;
        this.sortUser = "name";
    }

    init() {
        $.ajax({
            type: "get",
            url: "/api/login-detail",
            success: (data, status) => {
                this.fillSubordinatesDetail(data.idUser);
                this.detailSubordinateHandler(data.idUser);
                this.callOke(data.idUser);
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });

    }


    fillSubordinatesDetail(idUser) {

        $.ajax({
            type: "get",
            url: "/api/users",
            data : {page : this.subordinatePage, limit : this.subordinateLimit, sort: this.sortUser, idSuperior : idUser},
            dataType: "json",
            success: (response) => {
                console.log("ini");
                console.log(response.content.length);
                console.log(response.content);
                console.log("masuk add element");
                var index=1;
                var content = "";
                if(response.content.length > 0) {
                    response.content.forEach(element => {
                        content += '<tr data-toggle="modal" data-target="#subordinates-detail" data-idUser="' + element.idUser +'">'
                        + '<td>' + element.name + '</td>'
                        + '<td>' + element.role + '</td>'
                        + '<td id="sub-detail-index-'+index+'"> </td>'
                        + '</tr>';
                        this.fillCounterRequest(element.idUser,index);
                        index++;
                    });
                } else {
                    content = '<tr>'
                            + '<td colspan="3">There is no Subordinates</td>'
                            + '</tr>';
                }
                $("#data-table-subordinates").html(content);
            }
        });
    }

    detailSubordinateHandler(idUser) {
        $("#subordinates-detail").unbind().on('show.bs.modal',(event) => {
            var idSub = $(event.relatedTarget).data("iduser");
            this.fillSubDetail(idUser,idSub);
        });
    }

    fillSubDetail(idUser,idSub) {
        $.ajax({
            method: "GET",
            url: "/api/user/" + idSub,
            dataType : "json",
            success: (response) => {
                // console.log(response);
                if (response.pictureURL) {
                    $("#subordinates-detail img").attr("src", response.pictureURL);
                }
                else {
                    $("#subordinates-detail img").attr("src", "/public/images/profile.png");
                }
                $("#sub-name").html("<b>" + response.name + "</b>");
                $("#sub-id").html("NIP      : <b>" + response.idUser + "</b>");
                $("#sub-division").html("Division   : <b>" + response.division + "</b>");
                $("#sub-role").html("Role       : <b>" + response.role + "</b>");
                var superiorContent = "Superior : <b>"
                    + response.superior.name
                    + " (NIP :"
                    + response.superior.idUser
                    +")</b>";
                $("#sub-superior").html(superiorContent);
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
            data: {page: 0, limit: JAVA_MAX_INTEGER, idUser: idSub, sort: "idUserHasItem"},
            dataType: "json",
            success: (response) => {
                var idx = 1;
                var content = '';
                response.content.forEach((element) => {
                    content += '<tr><td class="text-center" scope="row">' + element.item.idItem + '</td>'
                    + '<td class="text-center">' + element.item.itemName+ '</td>'
                    + '<td class="text-center">' + element.hasQty + '</td>';
                    idx++;
                });
                if (idx == 1){
                    content = '<tr>'
                            + '<td colspan=3> There is no request</td>'
                            + '</tr>';
                }
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
            data: {page: 0, limit: JAVA_MAX_INTEGER, idUser: idSub, sort: "idRequest"},
            dataType: "json",
            success: (response) => {
                console.log(response.content);
                var idx = 1;
                var content = '';
                response.content.forEach((element) => {
                    if (element.requestStatus == "REQUESTED") {
                        content += '<tr>'
                        + '<td id="data-ke-'+ idx +'" id-request="'+element.idRequest+'"class="text-center" scope="row">' + element.item.idItem + '</td>'
                        + '<td class="text-center">' + element.item.itemName+ '</td>'
                        + '<td class="text-center">' + element.reqQty + '</td>'
                        + '<td class="text-center">' + element.requestStatus + '</td>'
                        + '<td class="text-center">'
                        + '<div class="form-check-inline">'
                        + '<label class="form-check-label">'
                        + '<input type="radio" class="form-check-input" name="opt'+idx+'" value="Yes" >Yes'
                        + '</label>'
                        + '<label class="form-check-label">'
                        + '<input type="radio" class="form-check-input" name="opt'+idx+'" value="No" >No'
                        + '</label>'
                        + '</div>'
                        + '</td>'
                        + '</tr>';
                        idx++;
                    }
                });
                if (idx > 1) {
                    $("#subordinate-new-request-table").addClass("table-responsive-sm").removeClass("table-responsive-xs");
                    var contentButton = '';
                    contentButton = '<button id="oke-button" type="button" class="btn btn-success" >Approve</button>';
                    $("#button-request").html(contentButton);
                    this.callOke(idUser,idSub);
                } else {
                    $("#subordinate-new-request-table").addClass("table-responsive-xs").removeClass("table-responsive-sm");
                    content = '<tr>'
                            + '<td colspan=5> There is no request</td>'
                            + '</tr>';
                    $("#button-request").html("");
                }
                idx--;
                $(".subordinates-request-table tbody").attr("counter",idx);
                $(".subordinates-request-table tbody").html(content);
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
            data: {page: 0, limit: JAVA_MAX_INTEGER, idUser: idSub, sort: "idRequest"},
            dataType: "json",
            success: (response) => {
                var idx =1;
                var content = '';
                response.content.forEach((element) => {
                    if(element.requestStatus != "REQUESTED") {
                        content += '<tr>'
                        + '<td class="text-center" scope="row">' + element.item.idItem + '</td>'
                        + '<td class="text-center">' + element.item.itemName+ '</td>'
                        + '<td class="text-center">' + element.reqQty + '</td>'
                        + '<td class="text-center">' + element.requestStatus + '</td>';
                        content += '</tr>';
                        idx ++;
                    }
                });
                if (idx == 1){
                    content = '<tr>'
                            + '<td colspan=4> There is no request</td>'
                            + '</tr>';
                }
                $(".subordinates-history-table tbody").html(content);
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
            data: {page: 0, limit: JAVA_MAX_INTEGER, idUser: idUser, sort:"idRequest"},
            dataType: "json",
            success: (response) => {
                var count = 0;
                var length = response.content.length;
                console.log("response counter");
                for (var i = 0 ; i < length; i ++) {
                    if(response.content[i].requestStatus == "REQUESTED"){
                        count++;
                    }
                }
                $("#sub-detail-index-"+index,).html(count);
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });
    }

    callOke(idUser,idSub){
        $("#oke-button").on("click",() =>{
            var idx =1 ;
            var numberOfRecord = $("#subordinates-request-table-details").attr("counter");
            var requests = []

            for(idx = 1; idx <= numberOfRecord; idx++) {
                var input = 'input[name=\'opt'+idx+'\']';
                var request = {};
                if($(input).is(":checked") && !($(input).is(":disabled"))) {
                    var value = $(input+':checked').val();
                    console.log(value);
                    console.log($('#data-ke-'+idx).text());
                    console.log("id Requestnya"+$('#data-ke-'+idx).attr("id-request"));
                    console.log(idUser);

                    if(value == "Yes"){
                        request = {
                            idRequest : parseInt($('#data-ke-'+idx).attr("id-request")),
                            idSuperior : idUser,
                            idAdmin : "\0",
                            requestStatus : "APPROVED"
                        }
                    } else {
                        request = {
                            idRequest : parseInt($('#data-ke-'+idx).attr("id-request")),
                            idSuperior : idUser,
                            idAdmin : "\0",
                            requestStatus : "REJECTED"
                        }
                    }
                    requests.push(request);
                    $(input).prop("disabled","disabled");
                }
            }
            console.log(JSON.stringify(requests));


            $.ajax({
                method : "PUT",
                url : "/api/requests",
                data : JSON.stringify(requests),
                contentType: "application/json",
                dataType: "json",
                success: (response) => {
                    console.log(response);
                    this.fillSubDetail(idUser, idSub);
                    this.fillSubordinatesDetail(idUser);
                    location.reload(true);
                },
                error : (response) => {
                    console.log(response);
                }
            });


        });
    }
}





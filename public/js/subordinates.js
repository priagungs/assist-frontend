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
                    index++;
                });
                $("#data-table-subordinates").html(content);
            }
        });
    }

    detailSubordinateHandler(idUser) {
        $("#subordinates-detail").unbind().on('show.bs.modal',(event) => {
            var idSub = $(event.relatedTarget).data("iduser");
            this.fillSubDetail(idSub);
            this.callOke(idUser);
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
                $("#sub-id").text("NIP      : "+response.idUser);
                $("#sub-division").text("Division   : "+response.division);
                $("#sub-role").text("Role       : "+response.role);
                var superiorContent = "Superior : "
                    + response.superior.name
                    + " (NIP :"
                    + response.superior.idUser
                    +")";
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
                var idx = 1;
                var content = '';
                response.content.forEach((element) => {
                    content += '<tr>'
                    + '<td id="data-ke-'+ idx +'" id-request="'+element.idRequest+'"class="text-center" scope="row">' + element.item.idItem + '</td>'
                    + '<td class="text-center">' + element.item.itemName+ '</td>'
                    + '<td class="text-center">' + element.reqQty + '</td>'
                    + '<td class="text-center">' + element.requestStatus + '</td>';
                    var radioButton = '<div class="form-check-inline">'
                    + '<div class="form-check-inline">'
                    + '<label class="form-check-label">';
                    if(element.requestStatus != "REQUESTED"){
                        radioButton +='<input type="radio" class="form-check-input" name="opt'+idx+'" value="Yes" disabled>Yes'
                            + '</label>'
                            + '<label class="form-check-label">'
                            + '<input type="radio" class="form-check-input" name="opt'+idx+'" value="No" disabled>No';
                    } else {
                        radioButton+= '<input type="radio" class="form-check-input" name="opt'+idx+'" value="Yes" >Yes'
                        + '</label>'
                        + '<label class="form-check-label">'
                        + '<input type="radio" class="form-check-input" name="opt'+idx+'" value="No" >No';
                    }
                        radioButton += '</label>'
                        + '</div>'
                        + '</div>';
                    content += '<td class="text-center">' + radioButton + '</td>';
                    content += '</tr>';
                    idx++;
                });
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

    callOke(idUser){
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
                            requestStatus : "APPROVED"
                        }
                    } else {
                        request = {
                            idRequest : parseInt($('#data-ke-'+idx).attr("id-request")),
                            idSuperior : idUser,
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
                data : requests,
                contentType: "application/json",
                dataType: "json",
                success: (response) => {
                    console.log(response);
                    console.log("ahhhh");
                },
                error : (response) => {
                    console.log(response);
                }
            });
        });
    }
}





class SubordinatesDashboard {
    constructor() {
        this.subordinatePage = 0;
        this.subordinateLimit = 5;
        this.isLastPage = false;
        this.sortUser = "name";

        this.itemPage = 0;
        this.itemLimit = 5;
        this.isItemLastPage = false;

        this.requestPage = 0;
        this.requestLimit = 5;
        this.isRequestLastPage = false;

        this.newRequestPage = 0;
        this.newRequestLimit = 10;
        this.isNewRequestLastPage = false;
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

    resetPage() {
        this.subordinatePage = 0;
        this.subordinateLimit = 5;
        this.isLastPage = false;
        this.sortUser = "name";

        this.itemPage = 0;
        this.itemLimit = 5;
        this.isItemLastPage = false;

        this.requestPage = 0;
        this.requestLimit = 5;
        this.isRequestLastPage = false;

        this.newRequestPage = 0;
        this.newRequestLimit = 10;
        this.isNewRequestLastPage = false;
    }

    fillSubordinatesDetail(idUser) {
        var spinner = $("#subordinates-table-spinner").addClass("d-block");
        var table = $("#data-table-subordinates").addClass("d-none");
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
                    var count = 0;
                    response.content.forEach(element => {
                        content += '<tr data-toggle="modal" data-target="#subordinates-detail" data-idUser="' + element.idUser +'">'
                        + '<td>' + element.name + '</td>'
                        + '<td>' + element.role + '</td>'
                        + '<td id="sub-detail-index-'+index+'"> </td>'
                        + '</tr>';
                        this.fillCounterRequest(element.idUser,index);
                        index++;
                        count++;
                    });
                    for (var i = count; i < this.subordinateLimit; i++) {
                        content += '<tr style="height: 3rem"><td></td><td></td><td></td></tr>';
                    }
                } else {
                    content = '<tr>'
                            + '<td colspan="3">There is no Subordinates</td>'
                            + '</tr>';
                }
                this.isLastPage = response.last;
                this.paginationHandler(idUser);
                $("#data-table-subordinates").html(content);
                spinner.removeClass("d-block");
                table.removeClass("d-none");
            },
            statusCode: {
                401: () => {
                    spinner.removeClass("d-block");
                    window.location = "login.html";
                }
            }
        });
    }

    paginationHandler(idUser) {
        var nextBtn = $("#page-subordinates-next");
        var prevBtn = $("#page-subordinates-prev");

        if (this.subordinatePage == 0) {
            prevBtn.addClass("disabled");
        }
        else {
            prevBtn.removeClass("disabled");
        }

        if (this.isLastPage) {
            nextBtn.addClass("disabled");
        }
        else {
            nextBtn.removeClass("disabled");
        }

        nextBtn.unbind().click(() => {
            if (!this.isLastPage) {
                this.subordinatePage++;
                nextBtn.removeClass("disabled");
                this.fillSubordinatesDetail(idUser);
            }
        });

        prevBtn.unbind().click(() => {
            if (this.subordinatePage > 0) {
                this.subordinatePage--;
                this.fillSubordinatesDetail(idUser);
                prevBtn.removeClass("disabled");
            }
        });
    }

    paginationSubItemHandler(idUser) {
        var nextBtn = $("#page-subordinates-item-next");
        var prevBtn = $("#page-subordinates-item-prev");

        if (this.itemPage == 0) {
            prevBtn.addClass("disabled");
        }
        else {
            prevBtn.removeClass("disabled");
        }

        if (this.isItemLastPage) {
            nextBtn.addClass("disabled");
        }
        else {
            nextBtn.removeClass("disabled");
        }

        nextBtn.unbind().click(() => {
            if (!this.isItemLastPage) {
                this.itemPage++;
                nextBtn.removeClass("disabled");
                this.fillSubItem(idUser);
            }
        });

        prevBtn.unbind().click(() => {
            if (this.itemPage > 0) {
                this.itemPage--;
                this.fillSubItem(idUser);
                prevBtn.removeClass("disabled");
            }
        });
    }

    paginationRequestHandler(idUser) {
        var nextBtn = $("#page-subordinates-request-next");
        var prevBtn = $("#page-subordinates-request-prev");

        if (this.requestPage == 0) {
            prevBtn.addClass("disabled");
        }
        else {
            prevBtn.removeClass("disabled");
        }

        if (this.isRequestLastPage) {
            nextBtn.addClass("disabled");
        }
        else {
            nextBtn.removeClass("disabled");
        }

        nextBtn.unbind().click(() => {
            if (!this.isRequestLastPage) {
                this.requestPage++;
                nextBtn.removeClass("disabled");
                this.fillSubItemRequest(idUser);
            }
        });

        prevBtn.unbind().click(() => {
            if (this.requestPage > 0) {
                this.requestPage--;
                this.fillSubItemRequest(idUser);
                prevBtn.removeClass("disabled");
            }
        });
    }

    paginationNewRequestHandler(idUser, idSub) {
        var nextBtn = $("#page-subordinates-newrequest-next");
        var prevBtn = $("#page-subordinates-newrequest-prev");

        if (this.newRequestPage == 0) {
            prevBtn.addClass("disabled");
        }
        else {
            prevBtn.removeClass("disabled");
        }

        if (this.isNewRequestLastPage) {
            nextBtn.addClass("disabled");
        }
        else {
            nextBtn.removeClass("disabled");
        }

        nextBtn.unbind().click(() => {
            if (!this.isNewRequestLastPage) {
                this.newRequestPage++;
                nextBtn.removeClass("disabled");
                this.fillSubItemNewRequest(idUser, idSub);
            }
        });

        prevBtn.unbind().click(() => {
            if (this.newRequestPage > 0) {
                this.newRequestPage--;
                this.fillSubItemNewRequest(idUser, idSub);
                prevBtn.removeClass("disabled");
            }
        });
    }

    detailSubordinateHandler(idUser) {
        $("#subordinates-detail").unbind().on('show.bs.modal',(event) => {
            var idSub = $(event.relatedTarget).data("iduser");
            this.resetPage();
            this.fillSubDetail(idUser,idSub);
        });
    }

    fillSubDetail(idUser,idSub) {
        var spinner = $("#subordinates-detail-spinner").addClass("d-block");
        var header = $("#subordinates-detail .modal-header").addClass("d-none");
        var body = $("#subordinates-detail .modal-body").addClass("d-none");
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
                spinner.removeClass("d-block");
                header.removeClass("d-none");
                body.removeClass("d-none");
                this.fillSubItem(idSub);
                this.fillSubItemNewRequest(idUser, idSub);
                this.fillSubItemRequest(idSub);
            },
            statusCode: {
                401: () => {
                    spinner.removeClass("d-block");
                    window.location = "login.html";
                }
            }
        });
    }

    fillSubItem(idSub) {
        var spinner = $("#subordinates-detail-item-spinner").addClass("d-block");
        var table = $("#subordinate-item-table").addClass("d-none");
        $.ajax({
            method: "GET",
            url: "/api/user-items",
            data: {page: this.itemPage, limit: this.itemLimit, idUser: idSub, sort: "idUserHasItem"},
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
                $("#sub-item-pagination").removeClass("d-none")
                if (idx == 1){
                    content = '<tr>'
                            + '<td colspan=3> There is no item</td>'
                            + '</tr>';
                    $("#sub-item-pagination").addClass("d-none");
                }
                else {
                    for (var i = idx; i <= this.itemLimit; i++) {
                        content += '<tr style="height: 2rem"><td></td><td></td><td></td></tr>';
                    }
                }

                this.isItemLastPage = response.last;
                this.paginationSubItemHandler(idSub);


                $(".subordinates-item-table tbody").html(content);
                spinner.removeClass("d-block");
                table.removeClass("d-none");
            },
            statusCode: {
                401: () => {
                    spinner.removeClass("d-block");
                    window.location = "login.html";
                }
            }
        });
    }

    fillSubItemNewRequest(idUser, idSub) {
        var spinner = $("#subordinates-detail-newrequest-spinner").addClass("d-block");
        var table = $("#subordinate-new-request-table").addClass("d-none");
        $.ajax({
            method: "GET",
            url: "/api/requests",
            data: {page: this.newRequestPage, limit: this.newRequestLimit, idUser: idSub, sort: "requestDate", status: "REQUESTED"},
            dataType: "json",
            success: (response) => {
                console.log(response);
                var idx = 1;
                var content = '';
                this.isNewRequestLastPage = response.last;
                this.paginationNewRequestHandler(idUser, idSub);

                response.content.forEach((element) => {
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
                });
                if (idx > 1) {
                    $("#sub-newrequest-pagination").removeClass("d-none");
                    $("#subordinate-new-request-table").addClass("table-responsive-sm").removeClass("table-responsive-xs");
                    var contentButton = '';
                    contentButton = '<button id="oke-button" type="button" class="btn btn-success" >Approve</button>';
                    $("#button-request").html(contentButton);
                    this.callOke(idUser,idSub);
                } else {
                    $("#sub-newrequest-pagination").addClass("d-none");
                    $("#subordinate-new-request-table").addClass("table-responsive-xs").removeClass("table-responsive-sm");
                    content = '<tr>'
                            + '<td colspan=5> There is no request</td>'
                            + '</tr>';
                    $("#button-request").html("");
                }
                idx--;
                $(".subordinates-request-table tbody").attr("counter",idx);
                $(".subordinates-request-table tbody").html(content);
                spinner.removeClass("d-block");
                table.removeClass("d-none");
            },
            statusCode: {
                401: () => {
                    spinner.removeClass("d-block");
                    window.location = "login.html";
                }
            }
        });
    }

    fillSubItemRequest(idSub) {
        var spinner = $("#subordinates-detail-request-spinner").addClass("d-block");
        var table = $("#subordinate-request-table").addClass("d-none");
        $.ajax({
            method: "GET",
            url: "/api/requests",
            data: {page: this.requestPage, limit: this.requestLimit, idUser: idSub, sort: "requestDate"},
            dataType: "json",
            success: (response) => {
                var idx = 1;
                var content = '';
                response.content.forEach((element) => {
                    if(element.requestStatus != "REQUESTED") {
                        content += '<tr>'
                        + '<td class="text-center" scope="row">' + element.item.idItem + '</td>'
                        + '<td class="text-center">' + element.item.itemName+ '</td>'
                        + '<td class="text-center">' + element.reqQty + '</td>'
                        + '<td class="text-center">' + element.requestStatus + '</td>';

                        var date = new Date(element.requestDate);

                        content += '<td class="text-center">' + date.toLocaleString() + '</td>';
                        content += '</tr>';
                        idx ++;
                    }
                });
                $("#sub-request-pagination").removeClass("d-none")
                if (idx == 1){
                    content = '<tr>'
                            + '<td colspan=5> There is no request</td>'
                            + '</tr>';
                    $("#sub-request-pagination").addClass("d-none")
                }
                else {
                    for (var i = idx; i <= this.requestLimit; i++) {
                        content += '<tr style="height: 2rem"><td></td><td></td><td></td><td></td><td></td></tr>';
                    }
                }

                this.isRequestLastPage = response.last
                this.paginationRequestHandler(idSub);
                $(".subordinates-history-table tbody").html(content);
                spinner.removeClass("d-block");
                table.removeClass("d-none");
            },
            statusCode: {
                401: () => {
                    spinner.removeClass("d-block");
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
                    location.reload(true);
                    this.fillSubDetail(idUser, idSub);
                    // this.fillSubordinatesDetail(idUser);
                },
                error : (response) => {
                    console.log(response);
                }
            });


        });
    }
}





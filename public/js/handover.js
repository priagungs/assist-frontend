class Handover {
    constructor() {
        this.page = 0;
        this.limit = 1;
        this.sortBy = "idRequest";
        this.dropdownLimit = 5;
        this.isLastPage = false;
    }

    init() {
        $.ajax({
            type: "get",
            url: "/api/login-detail",
            success: (data, status) => {
                this.fillRequestTable();
                this.sendRequest(data.idUser);
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });

    }


    fillRequestTable() {
        $.ajax({
            method: "GET",
            url: "api/requests",
            dataType: "json",
            data: {page: this.page, limit: this.limit, status: "APPROVED", sort: "idRequest"},
            success: (response) => {
                console.log(response);
                this.isLastPage = response.last;
                this.paginationHandler();
                var content = "";
                var idx = 1;
                response.content.forEach(element => {
                    content += '<tr id="data-ke-'+ idx +'" id-request="'+element.idRequest+'">'
                    + '<td class="text-center">' + element.idRequest + '</td>'
                    + '<td class="text-center">' + element.item.itemName + '</td>'
                    + '<td class="text-center">' + element.requestBy.name + '</td>'
                    + '<td class="text-center">' + element.reqQty + '</td>'
                    + '<td class="text-center">'
                    + '<label class="form-check-label">'
                    + '<input type="radio" class="form-check-input" name="opt'+idx+'" value="SENT" >'
                    + 'ready for send'
                    + '</label>'
                    + '</td>'
                    + '</tr>'
                    idx++;
                });
                idx--;
                $("#content-items").attr("counter",idx)
                $("#content-items").html(content);
            }
        });
    }

    paginationHandler() {
        var nextBtn = $("#page-handover-next");
        var prevBtn = $("#page-handover-prev");

        console.log(this.page);
        if (this.page == 0) {
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
                this.page++;
                nextBtn.removeClass("disabled");
                this.fillRequestTable();
            }
        })

        prevBtn.unbind().click(() => {
            if (this.page > 0) {
                this.page--;
                this.fillRequestTable();
                prevBtn.removeClass("disabled");
            }
        })
    }

    sendRequest(idUser) {
        $("#send-button").on("click",() =>{
            var idx =1 ;
            var numberOfRecord = $("#content-items").attr("counter");
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
                    request = {
                        idRequest : parseInt($('#data-ke-'+idx).attr("id-request")),
                        idSuperior : "\0",
                        idAdmin : idUser,
                        requestStatus : "SENT"
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
                },
                error : (response) => {
                    console.log(response);
                }
            });
            alert("item sended");
            this.fillRequestTable();
        });
    }
}

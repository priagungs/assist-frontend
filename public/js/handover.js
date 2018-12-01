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
                var idAdmin = data.idUser;
                console.log("id admin jancuk");
                console.log(idAdmin);
                this.fillRequestTable(idAdmin);
                // this.sendRequest(idAdmin);
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });

    }


    fillRequestTable(idAdmin) {
        console.log("ini id admin"+idAdmin);
        $.ajax({
            method: "GET",
            url: "api/requests",
            dataType: "json",
            data: {page: this.page, limit: this.limit, status: "APPROVED", sort: "idRequest"},
            success: (response) => {
                console.log(response);
                this.isLastPage = response.last;
                this.paginationHandler(idAdmin);
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
                    + '<input type="checkbox" class="form-check-input chk-box" name="opt'+idx+'" value="SENT" >'
                    + 'ready for send'
                    + '</label>'
                    + '</td>'
                    + '</tr>'
                    idx++;
                });
                if (idx > 1) {
                    var contentButton = '';
                    contentButton = '<button id="sent-button" type="button" class="btn btn-primary" >SENT</button>';
                    $("#button-sent-area").html(contentButton);
                    console.log("call send request dengan id admin"+idAdmin);
                    this.sendRequest(idAdmin);
                } else {
                    content = '<tr>'
                            + '<td colspan=5> There is no request</td>'
                            + '</tr>';
                    $("#button-sent-area").html("");
                }
                idx--;
                $("#content-items").attr("counter",idx)
                $("#content-items").html(content);
            }
        });
    }

    paginationHandler(idAdmin) {
        console.log("paging handler"+idAdmin);
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
                this.fillRequestTable(idAdmin);
            }
        })

        prevBtn.unbind().click(() => {
            if (this.page > 0) {
                this.page--;
                prevBtn.removeClass("disabled");
                this.fillRequestTable(idAdmin);
            }
        })
    }

    sendRequest(idAdmin) {
        $("#sent-button").click(() =>{
            console.log("called");
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
                    console.log(idAdmin);
                    request = {
                        idRequest : parseInt($('#data-ke-'+idx).attr("id-request")),
                        idSuperior : "\0",
                        idAdmin : idAdmin,
                        requestStatus : "SENT"
                    }
                    requests.push(request);
                    $(input).prop("disabled","disabled");
                }
            }
            if(requests.length > 0) {
                $.ajax({
                    method : "PUT",
                    url : "/api/requests",
                    data : JSON.stringify(requests),
                    contentType: "application/json",
                    dataType: "json",
                    success: (response) => {
                        console.log(JSON.stringify(requests));
                        console.log(response);
                        alert("item sended");
                        this.fillRequestTable();
                    },
                    error : (response) => {
                        console.log(JSON.stringify(requests));
                        console.log(response);
                    }
                });
            } else {
                alert('not request selected');
            }
            
        });
    }

}

// $(document).ready(()=>{
//     console.log("asdf");
//     function triggerChange() {
//         $('.chk-box').trigger("change");
//     }

//     $(".chk-box").change(function() {
//         alert("triggered!");
//      });

//     $(".chk-box").on("click",()=>{
//         console.log("clicksuccess");
//         alert("click");
//     });
//      triggerChange();
// });

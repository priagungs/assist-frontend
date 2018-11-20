class Procurement {
    constructor() {
        this.page = 0;
        this.limit = 10;
    }

    init() {
        $.ajax({
            method: "GET",
            url: "/api/login-detail",
            dataType: "json",
            success: (response) => {
                if (!response.isAdmin) {
                    window.location.hash = "#home";
                }
                else {
                    this.fillTable();
                }
            },
            statusCode: {
                401 : () => {
                    window.location = "login.html";
                }
            }
        });
    }

    paginationHandler() {
        var nextBtn = $("#page-transactions-next");
        var prevBtn = $("#page-transactions-prev");

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
                this.fillTable();
            }
        })

        prevBtn.unbind().click(() => {
            if (this.page > 0) {
                this.page--;
                this.fillTable();
                prevBtn.removeClass("disabled");
            }
        })
    }

    fillTable() {
        $.ajax({
            method: "GET",
            url: "/api/transactions",
            data: {page: this.page, limit: this.limit, sort: "transactionDate"},
            dataType: "json",
            success: (response) => {
                this.isLastPage = response.last;
                this.lastPage = response.totalPages-1;
                this.paginationHandler();
                var content = "";
                response.content.forEach(element => {
                    content += '<tr data-toggle="modal" data-target="#transaction-detail" data-idtransaction="' + element.idTransaction + '">'
                    + '<td scope="row">' + element.idTransaction + '</td>'
                    + '<td>' + element.admin.name + '</td>'
                    + '<td>' + element.supplier + '</td>';

                    var date = new Date(element.transactionDate);

                    content += '<td>' + date.toLocaleString() + '</td>';

                    var value = 0;
                    element.itemTransactions.forEach(itemTrx => {
                        value += itemTrx.boughtQty * itemTrx.price;
                    })

                    content += '<td>Rp ' + value + '</td></tr>';
                });
                
                $("#table-procurements tbody").html(content);
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });
    }
}
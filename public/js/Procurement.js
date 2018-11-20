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
                    this.detailModalHandler();
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

    detailModalHandler() {
        $("#transaction-detail").on('show.bs.modal', (event) => {
            var idTransaction = $(event.relatedTarget).data("idtransaction");
            $.ajax({
                method: "GET",
                url: "/api/transactions/" + idTransaction,
                dataType: "json",
                success: (response) => {
                    $("#transaction-detail-id").text(response.idTransaction);
                    $("#transaction-detail-supplier").text(response.supplier);
                    
                    var date = new Date(response.transactionDate);
                    $("#transaction-detail-date").text(date.toLocaleString());

                    $("#transaction-detail-admin").text(response.admin.name + ' (' + response.admin.idUser + ')');
                    
                    var value = 0;
                    var tableContent = '';
                    response.itemTransactions.forEach(element => {
                        value += element.boughtQty * element.price;
                        
                        tableContent += '<tr><td scope="row">' + element.item.idItem + '</td>'
                        + '<td>' + element.item.itemName + '</td>'
                        + '<td>' + element.boughtQty + '</td>'
                        + '<td>Rp ' + element.price + '</td></tr>';
                    })
                    $("#transaction-detail-value").text(value);
                    $("#table-procurement-detail tbody").html(tableContent);
                },
                statusCode: {
                    401: () => {
                        window.location = "login.html";
                    }
                }
            });
            this.deleteHandler(idTransaction);
        })
    }

    deleteHandler(idTransaction) {
        $("#transaction-delete-invalid-feedback").attr("style", "display: none");
        $("#delete-transaction").unbind().click(() => {
            $.ajax({
                method: "DELETE",
                url: "/api/transactions",
                data: JSON.stringify({idTransaction: idTransaction}),
                contentType: "application/json",
                success: () => {
                    this.page = 0;
                    this.fillTable();
                    $("#transaction-detail").modal('hide');
                },
                statusCode: {
                    403: () => {
                        $("#transaction-delete-invalid-feedback").text("Couldn't delete this transaction, time limit exceeded").attr("style", "display: block");
                    },
                    400: () => {
                        $("#transaction-delete-invalid-feedback").text("Couldn't delete this transaction, items are being used").attr("style", "display: block");
                    }
                }
            });
        })
    }
}
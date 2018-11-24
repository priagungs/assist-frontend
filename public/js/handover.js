class Handover {
    constructor() {
        this.page = 0;
        this.limit = 1;
        this.sortBy = "idRequest";
        this.dropdownLimit = 5;
        this.isLastPage = false;
    }

    init() {
        this.fillRequestTable();
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
                response.content.forEach(element => {
                    content += '<tr>'
                    + '<td class="text-center">' + element.idRequest + '</td>'
                    + '<td class="text-center">' + element.item.itemName + '</td>'
                    + '<td class="text-center">' + element.requestBy.name + '</td>'
                    + '<td class="text-center">' + element.reqQty + '</td>'
                    + '</tr>'
                });
                $("#content-items").html(content);
            }
        });
    }

    paginationHandler() {
        var nextBtn = $("#page-handover-next");
        var prevBtn = $("#page-handover-prev");

        console.log(this.page);
        if (this.page == 0) {
            console.log("asdf");
            prevBtn.addClass("disabled");
        }
        else {
            console.log("asdf1");
            prevBtn.removeClass("disabled");
        }

        if (this.isLastPage) {
            console.log("asdf2");
            nextBtn.addClass("disabled");
        }
        else {
            console.log("asdf3");
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
}
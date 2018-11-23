class Handover {
    constructor() {
        this.itemPage = 0;
        this.itemLimit = 10;
    }

    init() {
        this.fillRequestTable();
    }


    fillRequestTable() {
        $.ajax({
            method: "GET",
            url: "api/requests",
            data: {page: this.itemPage, limit: this.itemLimit, status: "APPROVED", sort: "idRequest"},
            dataType: "json",
            success: (response) => {
                console.log(response);
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
}
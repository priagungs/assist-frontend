class Home {
    constructor() {
        this.itemPage = 0;
        this.itemPageLast = false;
        this.itemLimit = 50;
    }
    init() {
        $.ajax({
            type: "post",
            url: "/api/login",
            data: "username=admin&password=admin",
            success: function (response) {

            }
        });
        this.fillItemTable();
    }
    fillItemTable() {
        $.ajax({
            method: "GET",
            url: "/api/requests",
            data: {page: this.itemPage, limit: this.itemLimit, idUser: this.idUser},
            dataType: "json",
            success: (response) => {
                var no = 1;
                var content = "";
                response.content.forEach(element => {
                    content += '<tr class=""' + element.requestStatus + '">'
                    + '<td>' + element.item.itemName +'</td>'
                    + '<td class="text-center">' + element.reqQty + '</td>'
                    + '<td class="text-center">' + element.requestStatus + '</td>'
                    + '</tr>'
                })
            }
        })
    }
}

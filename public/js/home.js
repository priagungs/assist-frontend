class Home {
    constructor() {
        this.itemPage = 0;
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
        this.fillUserCard();
        this.fillItemTable();
    }
    fillUserCard() {
        $.ajax({
            type: "GET",
            url: "/api/login-detail",
            dataType: "json",
            success: (response) => {
                $("#name").text(response.name);
                $("#nip").text(13516000);
                $("#division").text(response.division);
                $("#role").text(response.role);
                $("#superior").text("HEHEE");
            }
        })
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
                    + '</tr>';
                    no++;
                });
                $("#items tbody").html(content);
            }
        })
    }
}

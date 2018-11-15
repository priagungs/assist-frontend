class Home {
    constructor() {
        this.itemPage = 0;
        this.itemLimit = 50;
    }
    init() {
        this.fillUserCard();
        this.fillItemTable();
    }
    fillUserCard() {
        $.ajax({
            type: "GET",
            url: "/api/login-detail/",
            dataType: "json",
            success: (data, status) => {
                $("#name").text(data.name);
                $("#nip").text(data.idUser);
                $("#division").text(data.division);
                $("#role").text(data.role);
                $("#superior").text(data.idSuperior);
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
                    + '<td>' + no + '</td>'
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

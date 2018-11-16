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
                $("#superior").text(data.superior);
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
                    + '<td> <button class="btn btn-primary btn-sm"> detail</button> </td>'
                    + '</tr>';
                    no++;
                });
                $("#items tbody").html(content);
            }
        })
    }
    changeTable() {
        $("#filter").change(function() {
            var status = $(this).val();
            $.ajax({
                method: "GET",
                url: "api/requests",
                data: {page:this.itemPage, limit: this.itemLimit, idUser: this.idUser, status: status},
                success: (response) => {
                    var no = 1;
                    var content = "";
                    response.content.forEach(element => {
                        content += '<tr class=""' + element.requestStatus + '">'
                        + '<td>' + no + '</td>'
                        + '<td>' + element.item.itemName +'</td>'
                        + '<td class="text-center">' + element.reqQty + '</td>'
                        + '<td class="text-center">' + element.requestStatus + '</td>'
                        + '<td> <button class="btn btn-primary btn-sm"> detail</button> </td>'
                        + '</tr>';
                        no++;
                    });
                    $("#items tbody").html(content);
                }
            })
          //   console.clear();
          //   var filterValue = $(this).val();
          //   var row = $('.row');
          //
          //   row.each(function(i, el) {
          //       if ($(el).attr('data-type') == filterValue) {
          //           row.hide()
          //           $(el).show();
          //       }
          //   });
          //   // In Addition to Wlin's Answer (For "All" value)
          //   if ("all" == filterValue) {
          //       row.show();
          // }

        });
    }
}

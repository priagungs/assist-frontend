class AdminEmployee {
    constructor() {
        this.page = 0;
        this.limit = 10;
        this.isLastPage = false;
    }

    init() {
        this.fillTable();
    }

    fillTable() {
        $.ajax({
            method: "GET",
            url: "/api/users",
            data: {page: this.page, limit: this.limit},
            dataType: "json",
            success: (response) => {
                this.isLastPage = response.last;
                this.lastPage = response.totalPages-1;
                var content = '';
                response.content.forEach(element => {
                    content += '<tr data-toggle="modal" data-target="#employee-detail" data-iduser="' + element.idUser + '">'
                    + '<td scope="row">' + element.idUser + '</td>'
                    + '<td>' + element.username + '</td>'
                    + '<td>' + element.name + '</td>'
                    + '<td class="text-center">' + element.division + '</td>'
                    + '<td class="text-center">' + element.role + '</td>'
                    + '</tr>'; 
                });

                $("#employee tbody").html(content);
            }
        });
    }
}
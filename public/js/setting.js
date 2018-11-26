class Setting {

    constructor() {
        this.itemPage = 0;
        this.itemLimit = 10;
    }

    init() {
        $.ajax({
            type: "GET",
            url: "/api/login-detail/",
            dataType: "json",
            success: (data, status) => {
                this.fillUserCard(data);
            }
        });
    }

    fillUserCard(data) {
        $("#name").text(data.name);
        $("#nip").text(data.idUser);
        $("#division").text(data.division);
        $("#role").text(data.role);
        if (data.superior != null) {
            $("#superior-name").text(data.superior.name);
            $("#superior-id").text(data.superior.idUser);
        } else {
            $("#superior-name").text();
            $("#superior-id").text("NULL");
        }
    }
}

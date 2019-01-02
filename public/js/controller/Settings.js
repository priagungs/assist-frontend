class Settings {

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
                this.fillContent(data);
                this.validateData(data);
                this.validateInput();
                this.changeFotoHandler();
            }
        });
    }

    fillContent(data) {
        $("#form-add-setting-name").val(data.name);
        if (data.pictureURL == null) {
            $("#picture-setting").attr("src", '/public/images/profile.png');
        } else {
            $("#picture-setting").attr("src", data.pictureURL);
        }
    }

    validateData(data) {
        $(".save-setting-btn").click((event) => {
            event.preventDefault();
            var valid = true;

            if (!$("#form-add-setting-name").val()) {
                $("#form-add-setting-name").addClass("is-invalid");
                valid = false;
            }
            if (!$("#form-add-setting-password").val()) {
                $("#form-add-setting-password").addClass("is-invalid");
                valid = false;
            }
            if ($("#form-add-setting-confirm-password").val() != $("#form-add-setting-password").val()) {
                $("#form-add-setting-confirm-password").addClass("is-invalid");
                valid = false;
            }
            if (valid) {
            
                var request = {
                    idUser: data.idUser,
                    isAdmin: data.isAdmin,
                    username: data.username,
                    isActive: data.isActive,
                    division: "tech",
                    role: "se",
                    superior: data.superior,
                    name: $("#form-add-setting-name").val(),
                    password: $("#form-add-setting-password").val(),
                    pictureURL: $("#picture-setting").attr("src")
                };

                $.ajax({
                    method: "PUT",
                    url: "/api/user",
                    data: JSON.stringify(request),
                    dataType: "json",
                    contentType: "application/json",
                    statusCode: {
                        401: () => {
                            window.location = "login.html";
                        }
                    }
                });
            }
        });
    }

    validateInput() {
        $("#form-add-setting-name").unbind().on("input", () => {
            $("#form-add-setting-name").removeClass("is-invalid")
        });
        $("#form-add-setting-password").unbind().on("input", () => {
            $("#form-add-setting-password").removeClass("is-invalid")
        });
        $("#form-add-setting-confirm-password").unbind().on("input", () => {
            $("#form-add-setting-confirm-password").removeClass("is-invalid")
        });
    }

    changeFotoHandler() {
        var imageUrl = '';
        $("#setting-image-uploader").change(() => {
            var formData = new FormData($("#setting-content form")[0]);
            Helper.uploadFile(formData, function (response) {
                imageUrl = response.file.slice(21);
                $("#picture-setting").attr("src", imageUrl);
            });
        });
    }
}

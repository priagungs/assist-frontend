class AdminEmployee {
    constructor() {
        this.page = 0;
        this.limit = 10;
        this.dropdownLimit = 4;
        this.isLastPage = false;
    }

    init() {
        this.fillTable();
        this.addModalHandler();
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
                    + '<td>' + element.name + '</td>'
                    + '<td>' + element.username + '</td>'
                    + '<td class="text-center">' + element.division + '</td>'
                    + '<td class="text-center">' + element.role + '</td>'
                    + '</tr>'; 
                });

                $("#employee tbody").html(content);
            }
        });
    }

    addModalHandler() {
        $("#add-employee").unbind().on('show.bs.modal', () => {
            this.resetAddForm();
            this.singleEntryHandler();
            this.bulkEntryHandler();
        })
    }

    singleEntryHandler() {
        var imageUrl = '';
        $("#employee-add-image-uploader").unbind().change(() => {
            var formData = new FormData($("#add-employee form")[0]);
            imageUrl = Helper.uploadFile(formData);
            $("#add-employee img").attr("src", imageUrl);
        })
        this.superiorFormHandler();

        $(".save-employee-add-btn").unbind().click((event) => {
            event.preventDefault();
            var request = [{
                isAdmin: $("#form-add-employee-isadmin").val() == 'Yes' ? true : false,
                name: $("#form-add-employee-name").val(),
                username: $("#form-add-employee-username").val(),
                password: $("#form-add-employee-password").val(),
                pictureURL: imageUrl,
                division: $("#form-add-employee-division").val(),
                role: $("#form-add-employee-role").val(),
                superior: {
                    idUser: parseInt($("#id-superior").text())
                }
            }];
            if (this.validateSingleEntry(request[0])) {
                this.addUser(request, false);
            }
            this.superiorFormHandler();
        })
    }

    superiorFormHandler() {
        $("#form-add-employee-superior").unbind().focusin(() => {
            $('#dropdown-add-employee-superior').html('<p class="dropdown-item"><strong>Insert Superior</strong></p>');
        })
        $("#form-add-employee-superior").on('input', (event) => {
            $("#form-add-employee-superior").removeClass("is-invalid");
            $("#id-superior").text("");
            if (event.target.value) {
                $.ajax({
                    type: "GET",
                    url: "/api/users",
                    data: {page: this.page, limit:this.dropdownLimit, keyword: event.target.value},
                    dataType: "json",
                    success: function (response) {
                        var dropdown_content = "";
                        response.content.forEach((element) => {
                            dropdown_content += '<button class="dropdown-item candidate-superior" data-iduser="' + element.idUser + '" data-name="' + element.name + '">'
                            + '<div class="row"><div class="col-2">' 
                            + '<img src="' + (element.pictureURL ? element.pictureURL : "/public/images/profile.png") + '" class="img-thumbnail rounded-circle" alt=""></div>'
                            + '<div class="col-10">'
                            + '<p><strong>' + element.name + '</strong></p>'
                            + '<p>ID : ' + element.idUser + '</p>'
                            + '<p><i>' + element.division + ' - ' + element.role + '</i></p></div></div></button>';
                        });
                        if (response.content.length > 0) {
                            $('#dropdown-add-employee-superior').html(dropdown_content);
                        }
                        else {
                            $('#dropdown-add-employee-superior').html('<p class="dropdown-item"><strong>Superior not found</strong></p>');
                        }

                        $("#dropdown-add-employee-superior .candidate-superior").unbind().click((event) => {
                            event.preventDefault();
                            $("#form-add-employee-superior").val($(event.currentTarget).data('name'));
                            $("#id-superior").text($(event.currentTarget).data('iduser'));
                        })
                    },
                    statusCode: {
                        401: () => {
                            window.location = "login.html";
                        }
                    }
                });
            }
            else {
                $('#dropdown-add-employee-superior').html('<p class="dropdown-item"><strong>Insert Superior</strong></p>');
            }
        })
    }

    validateSingleEntry(request) {
        var form_name = $("#form-add-employee-name");
        var form_username = $("#form-add-employee-username");
        var form_password = $("#form-add-employee-password");
        var form_division = $("#form-add-employee-division");
        var form_role = $("#form-add-employee-role");
        var form_superior = $("#form-add-employee-superior");

        form_username.unbind().on("input", () => {
            form_username.removeClass("is-invalid");
        })

        form_name.unbind().on("input", () => {
            form_name.removeClass("is-invalid");
        })

        form_password.unbind().on("input", () => {
            form_password.removeClass("is-invalid");
        })

        form_division.unbind().on("input", () => {
            form_division.removeClass("is-invalid");
        })

        form_role.unbind().on("input", () => {
            form_role.removeClass("is-invalid");
        })

        var result = true;
        if (!request.name) {
            form_name.addClass("is-invalid");
            result = false;
        }
        if (!request.username) {
            $(".username-validation").text("Please provide a username");
            form_username.addClass("is-invalid");
            result = false;
        }
        if (!request.password) {
            form_password.addClass("is-invalid");
            result = false;
        }
        if (!request.role) {
            form_role.addClass("is-invalid");
            result = false;
        }
        if (!request.division) {
            form_division.addClass("is-invalid");
            result = false;
        }
        if (!request.superior.idUser) {
            form_superior.addClass("is-invalid");
            result = false;
        }

        return result;
    }

    bulkEntryHandler() {
        $("#upload-bulk-employee-entries").unbind().change((event) => {
            $("#upload-bulk-employee-entries").removeClass("is-invalid");
            var files = event.target.files;
            console.log(files[0].name);
            $("#bulk-employee-entries label").text(files[0].name);
            var reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = (event) => {
                var csv = event.target.result;
                var data = $.csv.toArrays(csv);
                var requests = [];
                for (var value in data) {
                    var request = {
                        isAdmin: data[value][0] == 1,
                        name: data[value][1],
                        username: data[value][2],
                        password: data[value][3],
                        pictureURL: data[value][4],
                        division: data[value][5],
                        role: data[value][6],
                        superior: {
                            idUser: parseInt(data[value][7])
                        }
                    }
                    requests.push(request);
                }
                $("#add-employee .save-update-bulk-btn").unbind().click(() => {
                    if (this.validateBulkEntries(requests)) {
                        this.addUser(requests, true);
                    }
                })
            }
        })
    }

    validateBulkEntries(requests) {
        var upload_form = $("#upload-bulk-employee-entries");
        var invalid_feedback = $("#bulk-employee-entry-invalid-feedback");
        upload_form.unbind().change(function () {  
            upload_form.removeClass("is-invalid");
        });
        this.bulkEntryHandler();

        var valid = true;
        for (var request in requests) {
            if (!requests[request].isAdmin || !requests[request].name || !requests[request].username 
                || !requests[request].division || !requests[request].password
                || !requests[request].pictureURL || !requests[request].role || !requests[request].superior.idUser) {
                upload_form.addClass("is-invalid");
                invalid_feedback.text("Invalid input! All field must be filled");
                valid = false;
            }
        } 
        return valid;
    }

    resetAddForm() {
        $("#add-employee img").attr("src", "/public/images/profile.png");
        $("#img-uploader-employee input").val(null);
        $("#form-add-employee-name").val(null);
        $("#form-add-employee-name").removeClass("is-invalid");
        $("#form-add-employee-username").val(null);
        $("#form-add-employee-username").removeClass("is-invalid");
        $("#form-add-employee-password").val(null);
        $("#form-add-employee-password").removeClass("is-invalid");
        $("#form-add-employee-division").val(null);
        $("#form-add-employee-division").removeClass("is-invalid");
        $("#form-add-employee-role").val(null);
        $("#form-add-employee-role").removeClass("is-invalid");
        $("#form-add-employee-superior").val(null);
        $("#form-add-employee-superior").removeClass("is-invalid");
        $("#id-superior").text('');

        $("#upload-bulk-employee-entries").val(null);
        $("#upload-bulk-employee-entries").removeClass("is-invalid");
        $("#bulk-employee-entries label").text("Choose CSV File");
    }

    addUser(request, isBulk) {
        $.ajax({
            method: "POST",
            url: "/api/users",
            data: JSON.stringify(request),
            dataType: "json",
            contentType: "application/json",
            success: (response) => {
                this.page = 0;
                this.resetAddForm();
                this.fillTable();
                $("#add-employee").modal('hide');
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                },
                409: () => {
                    if (isBulk) {
                        $("#upload-bulk-employee-entries").addClass("is-invalid");
                        $("#bulk-employee-entry-invalid-feedback").text("Username already exist")
                        this.bulkEntryHandler();
                    }
                    else {
                        $(".username-validation").text("Username already exist");
                        $("#form-add-employee-username").addClass("is-invalid");
                    }
                },
                404: () => {
                    $(".username-validation").text("Superior not found");
                    $("#upload-bulk-employee-entries").addClass("is-invalid");
                    this.bulkEntryHandler();
                }
            }
        });
    }
}
const JAVA_MAX_INTEGER = Math.pow(2, 31) - 1;

class AdminEmployee {
    constructor() {
        this.page = 0;
        this.limit = 10;
        this.sortBy = "name";
        this.dropdownLimit = 5;
        this.isLastPage = false;
    }

    init() {
        $.ajax({
            method: "GET",
            url: "/api/login-detail",
            dataType: "json",
            success: (response) => {
                if (!response.isAdmin) {
                    window.location.hash = "#home";
                }
                else {
                    this.fillTable();
                    this.addModalHandler();
                    this.detailModalHandler();
                    this.paginationHandler();
                    this.searchHandler();
                }
            },
            statusCode: {
                401 : () => {
                    window.location = "login.html";
                }
            }
        })
    }

    searchHandler() {
        $("#search-employee").unbind().on("input", (event) => {
            if (event.target.value) {
                $.ajax({
                    method: "GET",
                    url: "/api/users",
                    data: {page: this.page, limit: this.limit, sort: this.sortBy, keyword: event.target.value},
                    dataType: "json",
                    success: (response) => {
                        this.isLastPage = response.last;
                        this.lastPage = response.totalPages-1;
                        this.paginationHandler();
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
        
                        $("#all-employee-table").html(content);
                    },
                    statusCode: {
                        401: () => {
                            window.location = "login.html";
                        }
                    }
                });
            }
            else {
                this.fillTable();
            }
        })
    }

    paginationHandler() {
        var nextBtn = $("#page-employee-next");
        var prevBtn = $("#page-employee-prev");

        if (this.page == 0) {
            prevBtn.addClass("disabled");
        }
        else {
            prevBtn.removeClass("disabled");
        }

        if (this.isLastPage) {
            nextBtn.addClass("disabled");
        }
        else {
            nextBtn.removeClass("disabled");
        }

        nextBtn.unbind().click(() => {
            if (!this.isLastPage) {
                this.page++;
                nextBtn.removeClass("disabled");
                this.fillTable();
            }
        })

        prevBtn.unbind().click(() => {
            if (this.page > 0) {
                this.page--;
                this.fillTable();
                prevBtn.removeClass("disabled");
            }
        })
    }

    fillTable() {
        $.ajax({
            method: "GET",
            url: "/api/users",
            data: {page: this.page, limit: this.limit, sort: this.sortBy},
            dataType: "json",
            success: (response) => {
                this.isLastPage = response.last;
                this.lastPage = response.totalPages-1;
                this.paginationHandler();
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

                $("#all-employee-table").html(content);
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
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
                superior: $("#id-superior-add-form").text ? {
                    idUser: parseInt($("#id-superior-add-form").text())
                } : null
            }];
            if (this.validateSingleEntry(request[0])) {
                this.addUser(request, false);
            }
            this.superiorFormHandler();
        })
    }

    superiorFormHandler() {
        $(".employee-form-superior").unbind().focusin(() => {
            $('#admin-dashboard .dropdown-menu').html('<p class="dropdown-item"><strong>Insert Superior</strong></p>');
        })
        $(".employee-form-superior").on('input', (event) => {
            $(".employee-form-superior").removeClass("is-invalid");
            $(".id-superior").text("");
            if (event.target.value) {
                $.ajax({
                    type: "GET",
                    url: "/api/users",
                    data: {page: 0, limit: this.dropdownLimit, sort: this.sortBy, keyword: event.target.value},
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
                            $('#admin-dashboard .dropdown-menu').html(dropdown_content);
                        }
                        else {
                            $('#admin-dashboard .dropdown-menu').html('<p class="dropdown-item"><strong>Superior not found</strong></p>');

                        }

                        $("#dropdown-add-employee-superior .candidate-superior").unbind().click((event) => {
                            event.preventDefault();
                            $("#form-add-employee-superior").val($(event.currentTarget).data('name'));
                            $("#id-superior-add-form").text($(event.currentTarget).data('iduser'));
                        })

                        $("#dropdown-update-employee-superior .candidate-superior").unbind().click((event) => {
                            event.preventDefault();
                            $("#form-update-employee-superior").val($(event.currentTarget).data('name'));
                            $("#id-superior-update-form").text($(event.currentTarget).data('iduser'));
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
        var form_name = $(".employee-form-name");
        var form_username = $(".employee-form-username");
        var form_password = $(".employee-form-password");
        var form_division = $(".employee-form-division");
        var form_role = $(".employee-form-role");
        var form_superior = $(".employee-form-superior");

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

        console.log(request);

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

        return result;
    }

    bulkEntryHandler() {
        $("#upload-bulk-employee-entries").unbind().change((event) => {
            $("#upload-bulk-employee-entries").removeClass("is-invalid");
            var files = event.target.files;
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
        $(".default-image-form").attr("src", "/public/images/profile.png");
        $(".employee-form-image").val(null);
        $(".employee-form-name").val(null);
        $(".employee-form-name").removeClass("is-invalid");
        $(".employee-form-username").val(null);
        $(".employee-form-username").removeClass("is-invalid");
        $(".employee-form-password").val(null);
        $(".employee-form-password").removeClass("is-invalid");
        $(".employee-form-division").val(null);
        $(".employee-form-division").removeClass("is-invalid");
        $(".employee-form-role").val(null);
        $(".employee-form-role").removeClass("is-invalid");
        $(".employee-form-superior").val(null);
        $(".employee-form-superior").removeClass("is-invalid");
        $("#id-superior-add-form").text('');
        $("#id-superior-update-form").text('');

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

    detailModalHandler() {
        $("#employee-detail").unbind().on('show.bs.modal', (event) => {
            var idUser = $(event.relatedTarget).data("iduser");
            this.fillDetail(idUser);
            this.resetAddForm();
            this.updateHandler(idUser);
            this.deleteHandler(idUser);
            $("#employee-update-section").attr("style", "display: none");
            $("#employee-detail-section").removeAttr("style");
        })
    }

    updateHandler(idUser) {
        $(".update-btn").unbind().click(() => {
            this.fillUpdateForm(idUser);
            this.superiorFormHandler();
            $("#employee-update-section").removeAttr("style");
            $("#employee-detail-section").attr("style", "display: none");
            $("#employee-update-image-uploader").unbind().change(() => {
                var formData = new FormData($("#employee-update-section form")[0]);
                var imageUrl = Helper.uploadFile(formData);
                $("#employee-update-section img").attr("src", imageUrl);
            })
            $(".save-employee-update-btn").unbind().click(() => {
                event.preventDefault();
                var request = {
                    idUser: idUser,
                    isAdmin: $("#form-update-employee-isadmin").val() == 'Yes' ? true : false,
                    name: $("#form-update-employee-name").val(),
                    username: $("#form-update-employee-username").val(),
                    password: $("#form-update-employee-password").val(),
                    pictureURL: $("#employee-update-section img").attr("src"),
                    division: $("#form-update-employee-division").val(),
                    role: $("#form-update-employee-role").val(),
                    superior: $("#id-superior-update-form").text() ? {
                        idUser: parseInt($("#id-superior-update-form").text())
                    } : null
                };
                if (this.validateSingleEntry(request)) {
                    $.ajax({
                        method: "PUT",
                        url: "/api/user",
                        data: JSON.stringify(request),
                        contentType: "application/json",
                        success: (response) => {
                            this.fillDetail(response.idUser);
                            this.fillTable();
                            $("#employee-update-section").attr("style", "display: none");
                            $("#employee-detail-section").removeAttr("style");
                            this.resetAddForm();
                        },
                        statusCode: {
                            401: () => {
                                window.location = "login.html";
                            },
                            400: () => {
                                $(".superior-validation").text("His/her subordinate could not be his/her superior in the same time");
                                $(".employee-form-superior").addClass("is-invalid");
                            },
                            409: () => {
                                $(".username-validation").text("His/her subordinate could not be his/her superior in the same time");
                                $(".employee-form-username").addClass("is-invalid");
                            }
                        }
                    });
                }
                this.superiorFormHandler();
            })
        })
    }

    fillUpdateForm(idUser) {
        $.ajax({
            method: "GET",
            url: "/api/user/" + idUser,
            dataType: "json",
            success: (response) => {
                if (response.pictureURL) {
                    $("#employee-update-section img").attr("src", response.pictureURL);
                }
                else {
                    $("#employee-update-section img").attr("src", "/public/images/profile.png")
                }
                $("#form-update-employee-name").val(response.name);
                $("#form-update-employee-isadmin").val(response.isAdmin ? "Yes" : "No");
                $("#form-update-employee-username").val(response.username);
                $("#form-update-employee-division").val(response.division);
                $("#form-update-employee-role").val(response.role);
                if (response.superior) {
                    $("#form-update-employee-superior").val(response.superior.name);
                    $("#id-superior-update-form").text(response.superior.idUser);
                }
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });
    }

    deleteHandler(idUser) {
        $(".delete-btn").unbind().click(() => {
            $.ajax({
                method: "DELETE",
                url: "/api/user",
                data: JSON.stringify({idUser: idUser}),
                contentType: "application/json",
                success: () => {
                    this.page = 0;
                    this.resetAddForm();
                    this.fillTable();
                    $("#nav-item").removeClass("active");
                    $("#nav-employee").addClass("active");
                    $("#employee-detail").modal('hide');
                }
            });
        })
    }

    fillDetail(idUser) {
        $.ajax({
            method: "GET",
            url: "/api/user/" + idUser,
            dataType: "json",
            success: (response) => {
                if (response.pictureURL) {
                    $("#employee-detail-section img").attr("src", response.pictureURL);
                }
                else {
                    $("#employee-detail-section img").attr("src", "/public/images/profile.png");
                }
                $("#employee-detail-name").text(response.name);
                $("#employee-detail-id").text(response.idUser);
                $("#employee-detail-isadmin").text(response.isAdmin ? "Yes" : "No");
                $("#employee-detail-username").text(response.username);
                $("#employee-detail-division").text(response.division);
                $("#employee-detail-role").text(response.role);
                if (response.superior) {
                    $("#employee-detail-superior-name").text(response.superior.name);
                    $("#employee-detail-superior-id").text('(' + response.superior.idUser + ')');
                }
                else {
                    $("#employee-detail-superior-name").text('');
                    $("#employee-detail-superior-id").text('');
                }
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });

        $.ajax({
            method: "GET",
            url: "/api/user-items",
            data: {page: 0, limit: JAVA_MAX_INTEGER, idUser: idUser},
            dataType: "json",
            success: (response) => {
                var content = '';
                response.content.forEach((element) => {
                    content += '<tr><td class="text-center" scope="row">' + element.item.idItem + '</td>'
                    + '<td class="text-center">' + element.item.itemName+ '</td>'
                    + '<td class="text-center">' + element.hasQty + '</td>';
                });
                $(".table-employee-items tbody").html(content);
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });

        $.ajax({
            method: "GET",
            url: "/api/users",
            data: {page: 0, limit: JAVA_MAX_INTEGER, sort: this.sortBy, idSuperior: idUser},
            dataType: "json",
            success: function (response) {
                var content = '';
                response.content.forEach((element) => {
                    content += '<tr><td class="text-center" scope="row">' + element.idUser + '</td>'
                    + '<td>' + element.name + '</td>'
                    + '<td class="text-center">' + element.role + '</td>'
                });
                $(".table-employee-subordinates tbody").html(content);
            },
            statusCode: {
                401: () => {
                    window.location = "login.html";
                }
            }
        });
    } 
}
class Helper {
    static uploadFile(formData, callback) {
        $.ajax({
            method: "POST",
            url: "/api/upload",
            data: formData,
            dataType: "json",
            contentType: false,
            processData: false,
            success: callback
        });
    }

    static restore(formData, success, error) {
        if (confirm("Are you sure want to restore the data ? (all previous data will be permanently deleted)")) {
            $.ajax({
                method: "POST",
                url: "/api/restore",
                data: formData,
                processData: false,
                contentType: false,
                success: success,
                error: error
            });
        }
    }
    
    static restoreHandler() {
        $("#restore-invalid").removeClass("d-block");
        $("#restore-uploader").unbind().change(() => {
            var formData = new FormData($("#restore-form")[0]);
            Helper.restore(formData, () => {
                $("#restore-invalid").removeClass("d-block");
                window.location = 'login.html';
            }, 
            () => {
                $("#restore-invalid").addClass("d-block");
            });
        });
    }
}

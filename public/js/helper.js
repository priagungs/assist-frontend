class Helper {
    static uploadFile(formData, callback) {
        var result = '';
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
}

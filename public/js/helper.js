class Helper {
    static uploadFile(formData) {
        var result = '';
        $.ajax({
            method: "POST",
            async: false,
            url: "/api/upload",
            data: formData,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function (response) {
                result = response.file.slice(21);
            }
        });
        return result;
    }
}

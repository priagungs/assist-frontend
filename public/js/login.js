$(document).ready(function(){
    $("#login").click(function(){
        var username = $("#username").val();
        var password = $("#password").val();
        console.log("haloo");
        console.log(username + " " + password);
        var formData = {
            'username'  : $("#username").val(),
            'password'  : $("#password").val()
        };
        $.ajax({
            type: "post",
            url: "/api/login",
            data: "username="+username+"&password="+password,
            success: function (data, status) {
                console.log(data);
                console.log(status);
                window.location = "index.html"
            }
        });
    });
});

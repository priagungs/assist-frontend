$(document).ready(function(){
    $.ajax({
        type: "get",
        url: "/api/login-detail",
        success: function (data, status) {
            window.location = "index.html";
        },
        statusCode: {
            401: () => {
                console.log("not login");
            }
        }
    });
    $("#login").click(() =>{
        var username = $("#username").val();
        var password = $("#password").val();
        var formData = {
            'username'  : $("#username").val(),
            'password'  : $("#password").val()
        };
        if(username === "" || password === ""){
            console.log("ga ada username");
            $("#username").css({"border" : "1px solid red"});
        } else {
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
        }
    });
});
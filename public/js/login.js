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
        $.post("http://localhost:8080/login",formData,function(data, status){
            console.log(status);
        });
    });
});

function go() {
    // var username = document.getElementById("username").value;
    // var password = document.getElementById("password").value;
    // console.log(username + password);
    // if(username == "ricky" && password == "asd12345"){
    //     window.location = "home.html";
    // }
    return false;
}
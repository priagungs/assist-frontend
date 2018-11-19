'use strict'
$(document).ready(() => {
    $.ajax({
        type: "get",
        url: "/api/login-detail",
        success: function (data, status) {
            // console.log(data);
            // console.log(status);
        },
        statusCode: {
            401: () => {
                // console.log("not login");
                window.location = "login.html";
            }
        }
    });
    $("#logout-button").click(() => {
        $.ajax({
            type: "get",
            url: "/api/logout",
            success: function (data, status) {
                // console.log("logout :"+status);
                window.location = 'login.html';
            }
        });
    });
});

(function () {
    function init() {
        var router = new Router([
            new Route('home', 'home.html', true), //default
            new Route('subordinates', "subordinates.html"),
            new Route('profile', "user_card.html"),
            new Route('admin', "admin_dashboard.html"),
            new Route('procurement', "procurement.html")
        ]);
    }
    init();
}());
'use strict'
$(document).ready(() => {
    $.ajax({
        type: "get",
        url: "/api/login-detail",
        success: function (data, status) {
            if (!data.isAdmin) {
                $(".admin-only").attr("style", "display: none");
            }
        },
        statusCode: {
            401: () => {
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
            new Route('procurement', "procurement.html"),
            new Route('handover', "handover.html"),
            new Route('setting', "setting.html")
        ]);
    }
    init();
}());

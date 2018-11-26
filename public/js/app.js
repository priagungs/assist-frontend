'use strict'
$(document).ready(() => {
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

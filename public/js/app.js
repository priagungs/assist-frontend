'use strict';

(function () {
    function init() {
        var router = new Router([
            new Route('beranda', 'beranda.html', true), //default
            new Route('item', "item.html"),
            new Route('profile', "user_card.html"),
            new Route('admin', "admin_dashboard.html"),
        ]);
    }
    init();
}());

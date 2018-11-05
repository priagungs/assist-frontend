'use strict';

(function () {
    function init() {
        var router = new Router([
            new Route('home', 'home.html', true), //default
            new Route('subordinates', "subordinates.html"),
            new Route('profile', "user_card.html")
        ]);
    }
    init();
}());

class Procurement {
    constructor() {

    }

    init() {
        $.ajax({
            method: "GET",
            url: "/api/login-detail",
            dataType: "json",
            success: (response) => {
                if (!response.isAdmin) {
                    window.location.hash = "#home";
                }
                else {
                    
                }
            },
            statusCode: {
                401 : () => {
                    window.location = "login.html";
                }
            }
        });
    }
}
$( '#navbar-list .nav-item .nav-link' ).on( 'click', function () {
	$( '.nav-item .nav-link' ).removeClass( 'active' );
	$( this ).addClass( 'active' );
});

$.ajax({
    type: "GET",
    url: "/api/login-detail/",
    dataType: "json",
    success: (data, status) => {
        if (!data.isAdmin) {
            document.getElementsByClassName('admin-only').style.display = "none";
        }

    }
});

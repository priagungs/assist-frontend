class AdminDashboard {
    static init() {
        AdminDashboard.initItemModalHandler();
        AdminDashboard.fillItemTable();
    }

    static initItemModalHandler() {
        $("#item-detail").on('show.bs.modal', function(event) {
            var idItem = $(event.relatedTarget).data('iditem');
            // do some ajax to get the data

            // $(this).find('.modal-title').text("id item nya " + idItem);
        })

        $(".update-btn").click(function() {
            $(".detail-item").css("display", "none");
            $(".update-item").css("display", "block");
            $(".modal-header").css("display", "none");
        })

        $(".save-update-btn").click(function() {
            $(".detail-item").css("display", "block");
            $(".update-item").css("display", "none");
            $(".modal-header").css("display", "flex");
        })

    }

    static fillItemDetail(idItem) {
        
    }

    static fillItemTable() {

    }
}
class AdminDashboard {
    static init() {
        AdminDashboard.initItemTable();
        AdminDashboard.initModalHandler();
    }

    static initModalHandler() {
        $("#item-detail").on('show.bs.modal', function(event) {
            var idItem = $(event.relatedTarget).data('iditem');
            // do some ajax to get the data

            // $(this).find('.modal-title').text("id item nya " + idItem);
        })
    }

    static initItemTable() {

    }
}
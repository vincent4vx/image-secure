// Because Javascript can't do it (to complicated lol)
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

$(document).ready(function(){
    $(document).on({
        dragenter : function(e){fileHandler.onDragEnter(e);},
        dragover : function(e){fileHandler.onDragOver(e);},
        dragleave : function(){fileHandler.onDragLeave()},
        drop : function(e){fileHandler.onDrop(e)}
    }, '#main-page');

    $(document).on('change', '#file-input', function(e) {
        fileHandler.launch(e.target.files);
    });
    $(document).on('click', '#file-upload-btn', function() {
        $('#file-input').click();
    });

    $(document).on('click', '#register-button', function(e){
        e.preventDefault();
        app.register();
    });

    $('#connection-form').on('submit', function(e){
        e.preventDefault();
        var infos = $(this).serialize();

        $.post('/users/connect', infos, function(data){
           if(data.success == undefined){
               mobile.displayError('Une erreur est survenue');
           } else if(data.success == false){
               mobile.displayError(data.message);
           } else if (data.success == true){
                $('#connection-form').fadeOut('slow');
                location.hash = 'main-page';
           }
        });
    });
});

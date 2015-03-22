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

    $(document).on('click', '#connection-link', function(e){
        e.preventDefault();
        console.log('click');
        $.mobile.changePage('#connection-page', {transition: 'slide'});
    });
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
        var username = infos.split('&')[0].split('=')[1].capitalize();

        $.post('/users/connect', infos, function(data){
           if(data.success == undefined){
               mobile.displayError('Une erreur est survenue');
           } else if(data.success == false){
               mobile.displayError(data.message);
           } else if (data.success == true){
               // Because jQuery Mobile is so great, I have to set the class
               // by myself ...
               $("div:jqmData(role='navbar')").find('ul')
                   .empty()
                   .removeClass('ui-grid-solo')
                   .addClass('ui-grid-a')
                   .append(
                     $('<li />')
                         .addClass('ui-block-a')
                         .append(
                         $('<a />')
                             .addClass('ui-link ui-btn')
                             .attr('href', '#user-admin-page')
                             .html('<i class="glyphicon glyphicon-user"></i>' +
                              ' ' + username)
                     ),
                    $('<li />')
                        .addClass('ui-block-b')
                        .append(
                        $('<a />')
                            .addClass('ui-link ui-btn')
                            .attr('href', '/users/disconnect')
                            .html('<i class="glyphicon glyphicon-log-out"></i>'+
                            ' Se deconnecter')
                    )
               );
               $.mobile.changePage('#main-page', {transition: 'slide'});
           }
        });
    });
});

// Because Javascript can't do it (to complex lol)
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
var app = {};

$(document).ready(function(){
    $(document).on({
        dragenter : function(e){fileHandler.onDragEnter(e);},
        dragover : function(e){fileHandler.onDragOver(e);},
        dragleave : function(){fileHandler.onDragLeave()},
        drop : function(e){fileHandler.onDrop(e)}
    }, '.jumbotron');

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

    // Connection handling
    $('#connection-form').on('submit', function(e){
        e.preventDefault();
        var infos = $(this).serialize();

        $.post('/users/connect', infos, function(data){
           if(data.success == undefined){
               app.displayError('Une erreur est survenue');

           } else if(data.success == false){
               app.displayError(data.message);

           } else if (data.success == true){
                $('#connection-form').fadeOut('slow');
                $('#connection-form').parent().append(
                        $('<ul />')
                            .addClass('nav navbar-nav')
                            .append(
                                $('<li />').append(
                                    $('<a />')
                                        .attr('href', '/users/admin')
                                        .append(
                                    $('<i />')
                                        .addClass('glyphicon glyphicon-user'),
                                     ' ' + data.message.username.capitalize()
                                    )
                                ),
                            $('<li />').append(
                                $('<a />')
                                    .attr('href', '/users/disconnect')
                                    .append(
                                    $('<i />')
                                        .addClass('glyphicon glyphicon-log-out')
                                )
                            )
                        )
                ).addClass('navbar-right');

               $('#connection-form').remove();
           }
        });
    });
});

// Because Javascript can't do it (to complicated lol)
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

$(document).ready(function(){
    if(location.hash == '#admin-page'){
        admin();
    } else if (location.hash == '#register-page'){
        mobile.registerFormBehaviour();
    }

    $(document).on({
        dragenter : function(e){fileHandler.onDragEnter(e);},
        dragover : function(e){fileHandler.onDragOver(e);},
        dragleave : function(){fileHandler.onDragLeave()},
        drop : function(e){fileHandler.onDrop(e)}
    }, '#main-page');

    $(document).on('click', '#admin-page-link', function(){
        admin();
    });

    $(document).on('click', '#connection-link', function(e){
        e.preventDefault();
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
        $.mobile.changePage('#register-page', {transition: 'slide'});
        mobile.registerFormBehaviour();
    });

    $(document).on('click', '#disconnect-link', function(e){
        e.preventDefault();
        // I use location.reload() here because switching to /users/disconnect
        // is cause of a bad behaviour for the connection button
        $.get('/users/disconnect').success(function(){
            location.reload();
        });
    });


    $('#connection-form').on('submit', function(e){
        e.preventDefault();
        var infos = $(this).serialize();
        var username = infos.split('&')[0].split('=')[1].capitalize();

        $.post('/users/connect', infos, function(data){
                if (data.success == true){
                    onConnectSuccess(username);
               } else {
                  // Ternary operators are cool
                  (data.success == undefined)
                      ? mobile.displayError('Une erreur est survenue')
                      : mobile.displayError(data.message);
              }
          });
    });

    $('#register-form').on('submit', function(e){
        e.preventDefault();
        var infos = $(this).serialize();

        $.post('/register', infos, function(data){
           if(data.success == true){
               var pageID = 'register-success';
               mobile.newPage(pageID);

               $('#' + pageID).append(
                   $('<h2 />').text('Inscription réussie !'),
                   $('<button />')
                       .addClass('ui-btn ui-shadow')
                       .text('Revenir à l\'accueil')
                       .on('click', function(){
                           $.mobile.changePage('#main-page', {transition: 'slide'});
                       })
               );
               $.mobile.changePage('#' + pageID, {transition: 'slide'});

           } else {
               var message = (data.success === undefined)
                   ? 'Une erreur est survenue'
                   : data.message;

               mobile.displayError(message);
           }
        });
    });
});

function onConnectSuccess(username){
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
                .attr('href', '#admin-page')
                .attr('id', 'admin-page-link')
                .html('<i class="glyphicon glyphicon-user"></i>' +
                ' ' + username)
        ),
        $('<li />')
            .addClass('ui-block-b')
            .append(
            $('<a />')
                .addClass('ui-link ui-btn')
                .attr('href', '#')
                .attr('id', 'disconnect-link')
                .html('<i class="glyphicon glyphicon-log-out"></i>'+
                ' Se deconnecter')
        )
    );
    $.mobile.changePage('#main-page', {transition: 'slide'});
};

/**
 * Created by thomasmunoz on 07/03/15.
 */
$(document).ready(function(){
    var url = $(location).attr('href').split('/');

    // if there is 2 parameters (otherwise, PHP will handle the error by itself (HomeController))

    if(url.length == 7){
        var imageID = url[url.indexOf('view') + 1];
        var key = url[url.indexOf('view') + 2];

        //Loading message for big images
        $('.content').append(
            $('<div />')
                .attr('id', 'img-received')
                .append(
                $('<h3 />')
                    .text('Chargement ...')
            )
        );
        $.get( "/image/get", {'id': imageID})
            .done(function(data){
                if(data.success != undefined){
                    if(data.success === false) {
                        app.displayError(data.message);
                    } else {
                        fileHandler.decrypt(data.message, key);
                    }
                } else {
                    app.displayError('Le serveur n\'a pas répondu à la requete, veuillez rééssayer');
                }
            });
    }
});
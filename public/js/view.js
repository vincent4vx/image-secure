/**
 * Created by thomasmunoz on 07/03/15.
 */
$(document).ready(function(){
    var url = $(location).attr('href').split('/');

    // if there is 2 parameters (otherwise, PHP will handle the error
    // by itself (HomeController))
    if(url.length == 7){
        var imageID = url[url.indexOf('view') + 1];
        var key = url[url.indexOf('view') + 2];

       // Loading message for big images
        $('.content').append(
            $('<div />')
                .attr('id', 'img-received')
        );

        /*$.get( "/image/get", {'id': imageID})
            .done(function(data){
                if(data.success != undefined){
                    if(data.success === false) {
                        app.displayError(data.message);
                    } else {
                        fileHandler.decrypt(data.message, key);
                    }
                } else {
                    app.displayError('Le serveur n\'a pas répondu à la ' +
                                     'requete, veuillez rééssayer');
                }
            });*/
        app.generateProgressBar($('.content'));
        $.ajax({
            url: '/image/get',
            type: 'GET',
            data: {'id' : imageID},
            xhr: function() {
                var xhr = new window.XMLHttpRequest();
                xhr.addEventListener("progress", function(e) {
                    if (e.lengthComputable) {
                        var percentCompleted = e.loaded / e.total;
                        percentCompleted = (percentCompleted * 100).toFixed(2);
                        app.changeProgressBar($('.content .progress-bar'),
                            percentCompleted);
                    }
                }, false);
                return xhr;
            }}).success(function(data) {
                if (data.success != undefined) {
                    if (data.success === false) {
                        app.displayError(data.message);
                    } else {
                        fileHandler.decrypt(data.message, key);
                        $('.jumbotron h3, .jumbotron .progress').remove();
                    }
                } else {
                    app.displayError('Le serveur n\'a pas répondu à la ' +
                    'requete, veuillez rééssayer')
                }
            });

    }
});
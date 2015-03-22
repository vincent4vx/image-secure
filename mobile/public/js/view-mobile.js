/**
 * Created by thomasmunoz on 07/03/15.
 */
function init(){
    var url = $(location).attr('href').split('/');

    // if there is 2 parameters (otherwise, PHP will handle the error
    // by itself (HomeController))
    if(url.length == 7){
        var imageID = url[url.indexOf('view') + 1];
        var key = url[url.indexOf('view') + 2];

        $.mobile.changePage('#image-view-page', {transition: 'slide'});

        mobile.generateProgressBar($('#image-view-page'));

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
                        mobile.changeProgressBar(percentCompleted);
                    }
                }, false);
                return xhr;
            }}).success(function(data) {
            if (data.success != undefined) {
                if (data.success === false) {
                    mobile.displayError(data.message);
                } else {
                    $('#image-view-page').empty();
                    $('#image-view-page').append(
                        $('<div />')
                            .attr('id', 'img-received')
                    );
                    fileHandler.decrypt(data.message, key);
                }
            } else {
                mobile.displayError('Le serveur n\'a pas répondu à la ' +
                'requete, veuillez rééssayer')
            }
        }).always(function(){
            $('#image-view-page').append(
                $('<button />')
                    .addClass('ui-btn ui-shadow')
                    .text('Revenir à l\'accueil')
                    .on('click', function(e){
                        e.preventDefault();
                        $.mobile.changePage('#main-page', {transition: 'flow'});
                        var link = $(location).attr('href').split('/');
                        link = link.splice(0, 3);
                        link = link[0] + '//' + link[2];
                        $(location).attr('href', link);
                        console.log(location.href);
                    })
            );
        });
    }

}

$(document).ready(function(){
    if($(location).attr('href').split('/')[3] == 'image'){
        init();
    }
});

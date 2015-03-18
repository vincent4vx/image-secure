$(document).ready(function(){

    $('.jumbotron ul').hide();
    // Get the list of images uploaded by the user and displays it on a list
    $.get('/users/getimages', function(data){
        var master;
        $.get('/check', function(d){
            master = d.message;
        }).done(function(){
            if(data.success != undefined && data.success == true){
                if(data.message.length > 0){
                    var list = $('.jumbotron ul');
                    list.append(
                        $('<li />')
                            .addClass('list-group-item clearfix')
                            .append(
                            $('<a />')
                                .attr('id', 'byName')
                                .addClass('pull-left')
                                .text('Nom'),
                            $('<a />')
                                .attr('id', 'byDate')
                                .addClass('pull-right')
                                .text('Envoyé le')
                        )
                    );
                    for(var i = 0; i < data.message.length; ++i){
                        var elem = data.message[i];
                        var key = CryptoJS.AES.decrypt(elem.key, master);
                        key = key.toString(CryptoJS.enc.Utf8);
                        var date = new Date(elem.uploaded * 1000);
                        list.append(
                            $('<li />')
                                .addClass('list-group-item clearfix')
                                .append(
                                $('<b />')
                                    .append(
                                    $('<a />').attr('href', 'http://' +
                                        window.location.host + '/image/view/' +
                                        elem.imageid + '/' + key )
                                        .text(elem.filename + ' ')
                                        .addClass('clearfix')
                                ),
                                $('<span />')
                                    .addClass('pull-right')
                                    .text('Ajouté le ' + app.convertDate(date))
                            )
                        )
                    }
                    $('.jumbotron ul li').css({opacity:0, bottom:'100%'});
                    list.show();
                    $('ul').each(function() {
                        $(this).children().each(function(i) {
                            $(this).delay((i++) * 100).animate({bottom:0,
                                                                opacity:1});
                        });
                    });
                } else {
                    $('.jumbotron').append(
                        $('<h4 />')
                            .text('Vous n\'avez envoyé aucun fichier :\'(')
                    );
                }
            }
        });
    });
});

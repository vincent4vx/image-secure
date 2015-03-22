function admin(){
    $.mobile.changePage('#admin-page', {transition: 'slide'});
    $('#admin-page ul').empty();
    $('#admin-page ul').hide();
    // Get the list of images uploaded by the user and displays it on a list
    $.get('/users/getimages', function(data){
        var master;
        $.get('/check', function(d){
            master = d.message;
        }).done(function(){
            if(data.success != undefined && data.success == true){
                if(data.message.length > 0){
                    var list = $('#admin-page ul');
                    list.append(
                        $('<li />')
                            .attr('id', 'sorting-links')
                            .addClass('ui-grid-a')
                            .append(
                            $('<span />')
                                .attr('href', '#')
                                .attr('id', 'byName')
                                .addClass('ui-block-a')
                                .text('Nom'),
                            $('<span />')
                                .attr('href', '#')
                                .attr('id', 'byDate')
                                .addClass('ui-block-b')
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
                                .addClass('ui-grid-a')
                                .append(
                                $('<b />')
                                    .addClass('ui-block-a')
                                    .append(
                                    $('<a />').attr('href', 'http://' +
                                    window.location.host + '/image/view/' +
                                    elem.imageid + '/' + key )
                                        .text(elem.filename + ' ')
                                        .addClass('clearfix')
                                ),
                                $('<span />')
                                    .addClass('ui-block-b')
                                    .append(
                                    $('<span />')
                                        .addClass('pull-right')
                                        .text('Ajouté le ' + mobile.convertDate(date)),
                                    $('<i />')
                                        .addClass('glyphicon glyphicon-trash')
                                        .addClass('remove-file')
                                        .attr('id', elem.imageid)
                                )
                            )
                        )
                    }
                    $('#admin-page ul li').css({opacity:0, bottom:'100%'});
                    list.show();
                    listUpdate();
                    $('ul').each(function() {
                        $(this).children().each(function(i) {
                            $(this).delay((i++) * 100).animate({bottom:0,
                                opacity:1});
                        });
                    });
                } else {
                    $('#admin-page').append(
                        $('<h4 />')
                            .text('Vous n\'avez envoyé aucun fichier :\'(')
                    );
                }
            }
        });
    });

    /**
     * This function sort the images list on admin list
     * @param toCatch
     * @param alpha
     */
    function sortList (toCatch, alpha){
        var tabName = [];
        $('ul.list-group li').each(function(){
            if($(this).attr('id') != 'sorting-links'){
                var elem = {'title' : $(this).find(toCatch).text(),
                    'tag' : $(this)};
                tabName.push(elem);
            }
        });

        tabName.sort(function(a, b){
            if(alpha){
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });
        var first = $('#sorting-links').html();
        $('#admin-page ul')
            .empty()
            .append(
            $('<li />')
                .attr('id', 'sorting-links')
                .addClass('ui-grid-a')
                .html(first)
        );
        for(var i = 0; i < tabName.length; ++i){
            $('#admin-page ul').append(tabName[i].tag);
        }
        listUpdate();
    };

    /**
     * This function check the order class to know which sort to make
     * @param elemToBind
     * @param elemSorting
     */
    function bindOrder(elemToBind, elemSorting){
        if($(elemToBind).hasClass('order')){
            sortList(elemSorting, false);
        } else {
            sortList(elemSorting, true);
        }
        $(elemToBind).toggleClass('order');
    };

    $('#admin-page').on('click', '#byName', function(e){
        e.preventDefault();
        bindOrder('#byName', 'a');
    }).on('click', '#byDate', function(e){
        e.preventDefault();
        bindOrder('#byDate', 'span');
    }).on('click', '.remove-file', function(){
        var imageID = $(this).attr('id');
        var listElem = $(this).parent().parent();

        $.get('/image/delete/' + imageID, function(data){
            if(data.success != undefined && data.success == false){
                mobile.displayError(data.message);
                listElem.removeClass('list-group-item-danger');
            } else if (data.success != undefined && data.success == true){
                listElem.fadeOut('slow', function() {
                    $(this).remove()

                    if ($('ul.list-group li').length == 1) {
                        $('ul.list-group').fadeOut('slow');
                        $('#admin-page').append('<h4>Vous n\'avez envoyé aucun ' +
                        'fichier :\'(</h4>');
                    }
                });
            } else {
                alert('Erreur lors de la transmission, veuillez rééssayer');
            }
        });
    });

    function listUpdate(){
        $('#admin-page ul').listview().listview('refresh');
    }
}


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
                            .attr('id', 'sorting-links')
                            .addClass('list-group-item clearfix')
                            .append(
                            $('<a />')
                                .attr('href', '#')
                                .attr('id', 'byName')
                                .addClass('pull-left')
                                .text('Nom'),
                            $('<a />')
                                .attr('href', '#')
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
        $('.jumbotron ul.list-group')
            .empty()
            .append(
            $('<li />')
                .attr('id', 'sorting-links')
                .addClass('list-group-item clearfix')
                .html(first)
        );
        for(var i = 0; i < tabName.length; ++i){
            $('.jumbotron ul.list-group').append(tabName[i].tag);
        }
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

    $('.jumbotron').on('click', '#byName', function(e){
        e.preventDefault();
        bindOrder('#byName', 'a');
    }).on('click', '#byDate', function(e){
        e.preventDefault();
        bindOrder('#byDate', 'span');
    });

});

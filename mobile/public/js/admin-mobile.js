var admin = {};
(function(){
    /**
     * Init admin page
     */
    admin.admin = function(){
        $.mobile.changePage('#admin-page', {transition: 'slide'});
        admin.load()
        admin.listEvents();
    }

    /**
     * Load the user's images and set up the image list
     */
    admin.load = function(){
        $('#admin-page ul')
            .empty()
            .hide();

        $.get('/users/getimages', function(data){
            if(data.success) {
                if(data.message.length > 0) {
                    admin.imageList = data.message;
                } else {
                    $('#admin-page').append(
                        $('<h4 />')
                            .text('Vous n\'avez envoyé aucun fichier :\'(')
                    );
                }
            } else {
                mobile.displayError('Une erreur est survenue');
            }
        }).done(admin.getMasterKey);
    };

    /**
     * Get the master key and put it in admin.master
     */
    admin.getMasterKey = function(){
        $.get('/check', function(data){
            if(data.success) {
                admin.master = data.message;
            } else {
                mobile.displayError('Une erreur est survenue');
            }
        }).done(admin.displayImages);
    };

    /**
     * Create the image list
     */
    admin.displayImages = function(){
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

        for(var i = 0; i < admin.imageList.length; ++i){
            var elem = admin.imageList[i];
            var key = CryptoJS.AES.decrypt(elem.key, admin.master);
            var date = new Date(elem.uploaded * 1000);

            key = key.toString(CryptoJS.enc.Utf8);

            list.append(
                $('<li />')
                    .addClass('ui-grid-a')
                    .append(
                    $('<b />')
                        .addClass('ui-block-a')
                        .append(
                        $('<a />')
                            .attr('href', 'http://' +
                            window.location.host + '/image/view/' +
                            elem.imageid + '/' + key )
                            .attr('rel', 'external')
                            .text(elem.filename + ' ')
                            .on('click', function(e){
                                e.preventDefault();
                                location.href = $(this).attr('href');
                            })
                    ),
                    $('<span />')
                        .addClass('ui-block-b')
                        .append(
                        $('<span />')
                            .addClass('pull-right')
                            .text(mobile.convertDate(date)),
                        $('<i />')
                            .addClass('glyphicon glyphicon-trash')
                            .addClass('remove-file')
                            .attr('id', elem.imageid)
                    )
                )
            )
        }

        $('#admin-page ul li').css({opacity: 0, bottom: '100%'});

        list.show();
        admin.listUpdate();

        // Animate each element of the list (top to bottom)
        $('ul').each(function() {
            $(this).children().each(function(i) {
                $(this).delay((i++) * 100).animate({bottom: 0, opacity: 1});
            });
        });
    };

    /**
     * This function sort the images list on admin list
     * @param toCatch base element to sorting on
     * @param alpha(betical) order
     */
    admin.sortList = function(toCatch, alpha){
        var tabName = [];

        // Puts all the links in an array
        $('ul.list-group li').each(function(){
            if($(this).attr('id') != 'sorting-links'){
                var elem = {
                    'title' : $(this).find(toCatch).text(),
                    'tag' : $(this)
                };
                tabName.push(elem);
            }
        });

        // Sort the array
        tabName.sort(function(a, b){
            if(alpha){
                return a.title.localeCompare(b.title);
            } else {
                return b.title.localeCompare(a.title);
            }
        });

        // List header
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

        admin.listUpdate();
    };

    /**
     * This function determine what sort sortList will use based
     * on the title class
     * @param elemToBind (title or uploaded time)
     * @param elemSorting
     */
    admin.bindOrder = function(elemToBind, elemSorting){
        if($(elemToBind).hasClass('order')){
            admin.sortList(elemSorting, false);
        } else {
            admin.sortList(elemSorting, true);
        }

        $(elemToBind).toggleClass('order');
    };

    /**
     * All the list events
     */
    admin.listEvents = function(){
        $('#admin-page').on('click', '#byName', function(e){
            e.preventDefault();
            admin.bindOrder('#byName', 'a');

        }).on('click', '#byDate', function(e){
            e.preventDefault();
            admin.bindOrder('#byDate', 'span');

        }).on('click', '.remove-file', function(){
            var imageID = $(this).attr('id');
            var listElem = $(this).parent().parent();

            $.get('/image/delete/' + imageID, function(data){
                if (data.success){
                    listElem.fadeOut('slow', function() {
                        $(this).remove()

                        if ($('ul.list-group li').length == 1) {
                            $('ul.list-group').fadeOut('slow');
                            $('#admin-page').append(
                                $('<h4 />')
                                    .text('Vous n\'avez envoyé aucun fichier :(')
                            );
                        }
                    });
                } else {
                    listElem.removeClass('list-group-item-danger');
                    var message = (data.message === undefined)
                        ? 'Une erreur est survenue'
                        : data.message;

                    mobile.displayError(message);
                }
            });
        });
    };

    /**
     * Tell jQuery Mobile to refresh the list displaying
     */
    admin.listUpdate = function(){
        $('#admin-page ul').listview().listview('refresh');
    }

})();
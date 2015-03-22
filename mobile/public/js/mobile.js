/**
 * Created by thomas on 21/03/15.
 */

var mobile = {};

/**
 * This method display any error message returned by the server
 * @param message
 */
mobile.displayError = function(message){
    if(!$('#popupCloseRight').length){
        $('body').append(
            $('<div />')
                .attr('data-role', 'popup')
                .attr('id', 'popupCloseRight')
                .addClass('ui-content')
                .append(
                $('<a />')
                    .attr('href', '#')
                    .attr('data-rel', 'back')
                    .addClass('ui-btn ui-corner-all ui-shadow uit-btn-a')
                    .addClass('ui-icon-delete ui-btn-icon-notext ui-btn-right')
                    .text("Fermer"),
                $('<p />')
                    .text(message)
            )
        );
    } else {
        $('#popupCloseRight p').text(message);
    }
    $('#popupCloseRight').popup();
    $('#popupCloseRight').popup("open");
};

mobile.generateProgressBar = function(elem){
    elem.append(
        $('<h2 />')
            .text('Chargement ...'),
        $('<div />')
            .addClass('progress-bar')
            .append(
            $('<span />')
                .addClass('progress-status')
                .css({'width': '2%'})
                .text('')
        )
    );
};

mobile.changeProgressBar = function(percent){
    if (Math.round(percent) === 100) {
        $('.progress-status')
            .css({'background-color': '#4CAF50', 'width' : '100%'})
            .text('Terminé');
    } else {
       $('.progress-status')
            .css({width: percent + '%'})
            .text(percent);
    }
};

mobile.newPage = function(pageID){
    $('body').append(
      $('<div />')
          .attr('id', pageID)
          .attr('data-role', 'page')
    );
};

mobile.newUploadPage = function(file){
    $('#upload-page').append(
        $('<h3 />')
            .text('Image selectionnée : ' + file.name),
        $('<img>')
            .attr('id', 'uploaded-image')
            .addClass('img-responsive')
    );
    $.mobile.changePage('#upload-page',  {transition: 'slide'});
};

/**
 * This method generate the encryption form, which allow the user to define
 * a private key
 * @param filename
 * @param image
 */
mobile.generateEncryptForm = function(filename, image){
    $('#upload-page').append(
        $('<p />')
            .text('Si vous le souhaitez, vous pouvez saisir votre clé privée ' +
            'afin de crypter votre image' +
            ', sinon, une clé sera générée automatiquement par l\'application'),
        $('<form />')
            .attr('method', 'POST')
            .addClass('ui-content')
            .attr('action', '#')
            .append(
            $('<div />')
                .append(
                $('<label />')
                    .attr('for', 'key')
                    .text('Votre clé privée : '),
                $('<input />')
                    .attr('type', 'text')
                    .attr('placeholder', 'Clé privée ...')
                    .attr('id', 'key')
                    .attr('name', 'key'),
                $('<button />')
                    .addClass('ui-btn ui-btn-inline')
                    .append(
                    $('<i />')
                        .addClass('glyphicon')
                        .addClass('glyphicon-repeat')
                )
                    .on('click', function(e){
                        e.preventDefault();
                        var newKey = fileHandler.generateKey();
                        $('#key').attr('value', newKey);
                    }),
                $('<button />')
                    .attr('type', 'submit')
                    .addClass('ui-btn ui-shadow')
                    .text('Envoyer')
                    .on('click', function(e){
                        e.preventDefault();
                        fileHandler.encrypt(filename,
                            image,
                            $('form').serializeArray()[0]);
                    })
            )
        )
    );

    $('#upload-page input[type="text"]').textinput();
};

/**
 * This method gives to the user the link to see his encrypted image
 * @param fileID
 * @param key
 */
mobile.onFileUploadSuccess = function(fileID, key){
    $('body').append(
        $('<div />')
            .attr('data-role', 'page')
            .attr('id', 'upload-success-page')
            .addClass('mobile-page')
    );

    $('#upload-success-page').append(
        $('<h2 />')
            .text('Terminé'),
        $('<p />')
            .text('Votre fichier a bien été envoyé, copier/coller le lien ' +
            'ci-dessous pour partager votre image.'),
        $('<form />').append(
            $('<label />')
                .attr('for', 'link')
                .text('Votre lien'),
            $('<input>')
                .attr('type', 'text')
                .attr('name', 'link')
                .attr('type', 'text')
                .attr('value', 'http://' + window.location.host +
                '/image/view/' + fileID + '/' + key)
        ),
        $('<a />')
            .attr('href', 'http://' + window.location.host +
            '/image/view/' + fileID + '/' + key)
            .text('Voir l\'image')
            .on('click', function(e){
                e.preventDefault();
                $(location).attr('href', $(this).attr('href'));
                init();
            })
    );

    $('#upload-success-page input[type="text"]').textinput();
    $.mobile.changePage('#upload-success-page', {transition: 'slide'});
};
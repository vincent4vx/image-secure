/**
 * Created by thomasmunoz on 07/03/15.
 */

var app = {};

app.displayError = function(message){
    $('.jumbotron').prepend(
        $('<div />')
            .addClass('alert')
            .addClass('alert-danger')
            .addClass('alert-error')
            .append(
                $('<a />')
                    .attr('href', '#')
                    .addClass('close')
                    .attr('data-dismiss', 'alert')
                    .html('&times;'),
                $('<b />')
                    .text('Erreur ! '),
                message
        )
    );
};

app.generateProgressBar = function(element){
    element.append(
        $('<h3 />')
            .text('Chargement ...'),
        $('<div />')
            .addClass('progress')
            .append(
            $('<div />')
                .addClass('progress-bar')
                .attr('role', 'progressbar')
                .attr('aria-valuenow', '0')
                .attr('aria-valuemin', '0')
                .attr('aria-valuemax', '100')
                .attr('style', 'min-width: 2em;')
                .text('0%')
        )
    );
};
app.generateEncryptForm = function(filename, image){
    $('#content').append(
        $('<p />')
            .text('Si vous le souhaitez, vous pouvez saisir votre clé privée afin de crypter votre image' +
            ', sinon, une clé sera générée automatiquement par l\'application'),
        $('<form />')
            .attr('method', 'POST')
            .attr('action', '#')
            .addClass('form-inline')
            .append(
            $('<div />')
                .addClass('form-group')
                .append(
                $('<label />')
                    .attr('for', 'key')
                    .text('Votre clé privée : '),
                $('<input />')
                    .addClass('form-control')
                    .attr('type', 'text')
                    .attr('placeholder', 'Clé privée ...')
                    .attr('id', 'key')
                    .attr('name', 'key'),
                $('<button />')
                    .addClass('btn')
                    .addClass('btn-info')
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
                    .addClass('btn')
                    .addClass('btn-primary')
                    .text('Envoyer')
                    .on('click', function(e){
                        e.preventDefault();
                        fileHandler.encrypt(filename, image, $('form').serializeArray()[0]);
                    })
            )
        )
    );
};

app.changeProgressBar = function(element, percentCompleted){
    element
        .attr('aria-valuenow', percentCompleted)
        .attr('style', 'min-width: 2em; width: ' + percentCompleted + '%;')
        .text(percentCompleted + '%');

    if (Math.round(percentCompleted) === 100) {
       element
            .addClass('progress-bar-success')
            .text('Terminé !');
    }
};

app.onFileUploadSuccess = function(fileID, key){
    $('#content').empty();
    $('#content').append(
        $('<h2 />')
            .text('Terminé'),
        $('<p />')
            .text('Votre fichier a bien été envoyé, copier/coller le lien ci-dessous pour partager votre image.'),
        $('<form />').append(
            $('<div />')
                .addClass('form-group')
                .append(
                $('<label />')
                    .attr('for', 'link')
                    .text('Votre lien'),
                $('<input>')
                    .attr('type', 'email')
                    .attr('name', 'link')
                    .attr('type', 'text')
                    .addClass('form-control')
                    .attr('value', 'http://' + window.location.host + '/image/view/' + fileID + '/' + key)
            )
        )
    );
};
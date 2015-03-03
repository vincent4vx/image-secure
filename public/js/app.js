/**
 * Created by thomasmunoz on 25/02/15.
 */
var fileHandler = {};

fileHandler.launch = function(file){
    file = file[0];

    fileHandler.homePageSave = $('.jumbotron').html();

    $('.jumbotron').empty();

    $('.jumbotron').append(
        $('<button />')
            .attr('type', 'button')
            .addClass('btn')
            .addClass('btn-primary')
            .append(
            $('<i />')
                .addClass('glyphicon')
                .addClass('glyphicon-arrow-left'),
            $('<b />')
                .text(' Retour')
        )
            .on('click', function(e){
                e.preventDefault();
                $('.jumbotron').empty();
                $('.jumbotron').html(fileHandler.homePageSave);
            }),
        $('<div />')
            .attr('id', 'content')
            .append(
                $('<h3 />')
                    .text('Image selectionnée : ' + file.name),
                $('<img>')
                    .attr('id', 'uploaded-image')
                    .addClass('img-responsive')
                    .addClass('center-block')
        )
    );

    var fileReader = new FileReader();
    fileReader.onload = function (e){
        $('#uploaded-image').attr('src', e.target.result)
        fileHandler.generateForm(file.name, e.target.result);
    };
    fileReader.readAsDataURL(file);
};

fileHandler.generateForm = function(filename, image){
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

/**
 * Encrypt an image (base64 content) using AES CryptoJS implementation
 */
fileHandler.encrypt = function(filename, image, key){
    var imageArray = image.split(',');
    var keyCrypted = CryptoJS.SHA1(key.value).toString();

    var encrypt = CryptoJS.AES.encrypt(imageArray[1], keyCrypted);

    encrypt = imageArray[0] + ',' + encrypt.toString();

    /*var decrypt = CryptoJS.AES.decrypt(encrypt, "2c93598a50e3cf32eea4e4190e0dff2b3ccacb8d");
    var final = atob(decrypt.toString(CryptoJS.enc.Base64));
    var prefix = 'data:image/png;base64';
    final = prefix + ', ' + final;*/

    fileHandler.upload(filename, encrypt, keyCrypted);
};

/**
 * Upload the encrypted file and displays a progress bar
 * @param filename
 * @param file
 * @param key
 */
fileHandler.upload = function(filename, file, key){
    var formData = new FormData();
    formData.append('filename', filename);
    formData.append('file', file);

    $('#content').empty();
    $('#content').append(
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

    $.ajax({
        url: '/upload',
        type: 'POST',
        processData: false,
        contentType: false,
        data: formData,
        xhr: function() {
            var xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener("progress", function(e) {
                if (e.lengthComputable) {
                    var percentCompleted = e.loaded / e.total;
                    percentCompleted = (percentCompleted * 100).toFixed(2);

                    $('.jumbotron .progress-bar')
                        .attr('aria-valuenow', percentCompleted)
                        .attr('style', 'min-width: 2em; width: ' + percentCompleted + '%;')
                        .text(percentCompleted + '%');

                    if (Math.round(percentCompleted) === 100) {
                        $('.jumbotron .progress-bar')
                            .addClass('progress-bar-success')
                            .text('Terminé !');
                    }
                }
            }, false);
            return xhr;
        },
        success: function(data){
            if(data !== undefined){
                if(data.success !== undefined && data.success){
                    fileHandler.onFileSuccess(data.message, key);
                }
            }
        }
    });
};

fileHandler.onFileSuccess = function(fileID, key){
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

/**
 * Generate a random string
 * @returns {string}
 */
fileHandler.generateKey = function(){
    var key = '';
    // Random size (between 32 and 64)
    var size = Math.floor(Math.random() * 64) + 32;

    for(var i = 0; i < size; ++i) {
        var currentChar = Math.floor(Math.random() * 100);
        // escape space, tab and backspace
        while($.inArray(currentChar, [32, 9, 8]) !== -1) {
            currentChar = Math.floor(Math.random() * 100);
        }

        key += String.fromCharCode(currentChar);
    }
    return key;
};

fileHandler.onDragEnter = function(e){
    e.stopPropagation();
    e.preventDefault();
};

fileHandler.onDragOver = function(e){
    e.stopPropagation();
    e.preventDefault();

    $('.jumbotron .content').css('opacity', '0.1');
    if($('.jumbotron #drag_message').html() === undefined)
        $('.jumbotron').append('<h2 id="drag_message">Envoyer votre fichier !</h2>');
};

fileHandler.onDragLeave = function(){
    $('.jumbotron .content').css('opacity', '1');
    $('#drag_message').remove();
};

fileHandler.onDrop = function(e){
    e.preventDefault();
    $('.jumbotron .content').css('opacity', '1');
    var file = e.originalEvent.dataTransfer.files;
    $('#drag_message').remove();
    fileHandler.launch(file);

    $('.jumbotron').off('dragenter');
    $('.jumbotron').off('dragover');
    $('.jumbotron').off('dragleave');
    $('.jumbotron').off('drop');
};

$(document).ready(function(){

    $(document).on({
        dragenter : function(e){fileHandler.onDragEnter(e);},
        dragover : function(e){fileHandler.onDragOver(e);},
        dragleave : function(){fileHandler.onDragLeave()},
        drop : function(e){fileHandler.onDrop(e)}
    }, '.jumbotron');
});

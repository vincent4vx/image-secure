/**
 * Created by thomasmunoz on 04/04/15.
 */

(function(){
    /**
     * This method generate the encryption form, which allow the user to define
     * a private key
     * @param filename
     * @param image
     */
    app.generateEncryptForm = function(filename, image){
        $('#content').append(
            $('<p />')
                .text('Si vous le souhaitez, vous pouvez saisir votre clé privée ' +
                'afin de crypter votre image' +
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
                            fileHandler.encrypt(filename,
                                image,
                                $('form').serializeArray()[0]);
                        })
                )
            )
        );
    };
    /**
     * This metho give to the user the link to see his encrypted image
     * @param fileID
     * @param key
     */
    app.onFileUploadSuccess = function(fileID, key){
        $('#content')
            .empty()
            .append(
            $('<h2 />')
                .text('Terminé'),
            $('<p />')
                .text('Votre fichier a bien été envoyé, copier/coller le lien ' +
                'ci-dessous pour partager votre image.'),
            $('<form />').append(
                $('<div />')
                    .addClass('form-group')
                    .append(
                    $('<label />')
                        .attr('for', 'link')
                        .text('Votre lien'),
                    $('<input>')
                        .attr('name', 'link')
                        .attr('type', 'text')
                        .addClass('form-control')
                        .attr('value', 'http://' + window.location.host +
                        '/image/view/' + fileID + '#' + key)
                )
            )
        );
    };
})();
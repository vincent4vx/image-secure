/**
 * Created by thomasmunoz on 07/03/15.
 */

var app = {};

app.jumbotron = null;

/**
 * This method display any error message returned by the server
 * @param message
 */
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

/**
 * This method generate a progress bar (at 0%)
 * @param element
 */
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

/**
 *  This method change the progress bar status to the value given (in percent)
 * @param element
 * @param percentCompleted
 */
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
    $('#content').empty();
    $('#content').append(
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
                    .attr('type', 'email')
                    .attr('name', 'link')
                    .attr('type', 'text')
                    .addClass('form-control')
                    .attr('value', 'http://' + window.location.host +
                                            '/image/view/' + fileID + '/' + key)
            )
        )
    );
};
/**
 * This method clear the jumbotron (main content of the website) and create a
 * return button to go back in the homepage
 */
app.newPage = function(){
    app.jumbotron = $('.jumbotron').html();

    $('.jumbotron').empty();

    $('.jumbotron').append(
        $('<button />')
            .attr('type', 'button')
            .attr('id', 'return-btn')
            .addClass('btn')
            .addClass('btn-primary')
            .append(
            $('<i />')
                .addClass('glyphicon')
                .addClass('glyphicon-arrow-left'),
            $('<b />')
                .text(' Retour')
        ));

    $('.jumbotron').on('click', '#return-btn', function(e){
        e.preventDefault();
        $('.jumbotron').empty();
        $('.jumbotron').html(app.jumbotron);
    });
};

/**
 * This method create the register form
 */
app.register = function(){
    $('.jumbotron').fadeOut(0.0001);
    $('.jumbotron').fadeIn(1000);

    app.newPage();

    $('.jumbotron').append(
        $('<h2 />')
            .text('Inscription'),
        $('<form />')
    );

    app.createFormField('username', 'Nom d\'utilisateur', 'text',
        'Nom d\'utilisateur');

    app.createFormField('password', 'Mot de passe', 'password',
        'Mot de passe');

    app.createFormField('password_confirm', 'Confirmation', 'password',
        'Confirmation du mot de passe');

    app.createFormField('mail', 'Adresse mail', 'email',
        'Votre adresse mail');

    $('.jumbotron form').append(
        $('<div />')
            .addClass('form-group')
            .addClass('has-feedback')
            .append(
            $('<label />')
                .attr('for', 'master_key')
                .attr('id', 'master_key_popover')
                .append(
                    $('<a />')
                        .attr('data-toggle', 'popover')
                        .attr('data-placement', 'auto')
                        .attr('data-trigger', 'focus')
                        .text('Clé Principale')
            ),
            $('<input>')
                .attr('type', 'text')
                .addClass('form-control')
                .attr('name', 'master_key')
                .attr('id', 'master_key')
                .prop('required', true)
                .attr('placeholder', 'Votre clé')
        ),
        $('<button />')
            .attr('type', 'submit')
            .addClass('btn')
            .addClass('btn-primary')
            .text('S\'inscrire')
    );

    $('#master_key_popover').popover({
        'content' : "La clé principale vous permet de garder en sécurité les " +
                    "différentes clés privés des fichiers" +
                    " envoyés sur le site, ne perdez pas cette clé, sans " +
                    "elle il vous sera impossible de retrouver " +
                    " vos fichiers et de les visualiser.",
        'title' : "Qu'est-ce que c'est ?"
    });

    $('.jumbotron').on('keyup', '#password_confirm', function(){
        if($(this).val() != $('#password').val()){
           app.inputValidity(this, false);
        } else {
            app.inputValidity(this, true);
            app.inputValidity($('#password'), true);
        }
    })
    $('.jumbotron').on('keyup', '#password', function(){
        if($(this).val() != $('#password_confirm').val()){
            app.inputValidity($('#password_confirm'), false);
        } else {
            app.inputValidity($('#password_confirm'), true);
        }
    });

    $('.jumbotron').on('keyup', '#mail', function(){
        if(!app.isMailAddressValid($(this).val())){
            app.inputValidity(this, false);
        } else {
            app.inputValidity(this, true);
        }

    });
};

/**
 * This method create a form field in a form (with required input)
 * @param name
 * @param title
 * @param type
 * @param placeholder
 */
app.createFormField = function(name, title, type, placeholder){
    $('.jumbotron form').append(
        $('<div />')
            .addClass('form-group')
            .addClass('has-feedback')
            .append(
            $('<label />')
                .attr('for', name)
                .text(title),
            $('<input>')
                .attr('type', type)
                .addClass('form-control')
                .attr('name', name)
                .attr('id', name)
                .attr('placeholder', placeholder)
                .prop('required', true)
        )
    );
};

/**
 * This method show the validity of the input (error or success)
 * @param elem
 * @param success
 */
app.inputValidity = function(elem, success){

    // If span doesn't exist, we create it
    if(!$(elem).parent().find('span').length){
        $(elem).parent().append(
            $('<span />')
                .addClass('glyphicon')
                .addClass('form-control-feedback')
        );
    }
    if(success == true){
        $(elem).parent()
            .removeClass('has-error')
            .addClass('has-success');
        $(elem).parent().find('span')
            .removeClass('glyphicon-remove')
            .addClass('glyphicon-ok');

    } else {
        $(elem).parent()
            .addClass('has-error')
            .removeClass('has-success')

        $(elem).parent().find('span')
            .removeClass('glyphicon-ok')
            .addClass('glyphicon-remove');
    }
};

/**
 * Check email address validity
 * Thanks to stackoverflow I don't have to write my own regex
 * Shamefully copied at http://stackoverflow.com/a/17968929
 * @param emailAddress
 * @returns {boolean}
 */
app.isMailAddressValid = function(email) {
    var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,15})?$/);
    return pattern.test(email);
};
/**
 * Created by thomasmunoz on 04/04/15.
 */
(function(){
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

        app.createFormField('username', 'text',
            'Nom d\'utilisateur');

        app.createFormField('firstname', 'text', 'Prénom');

        app.createFormField('lastname', 'text', 'Nom');

        app.createFormField('password', 'password', 'Mot de passe');

        app.createFormField('password_confirm', 'password', 'Confirmation du mot de passe');

        app.createFormField('mail', 'email', 'Votre adresse mail');

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
                        .text('Clé Principale ?')
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
        app.registerFormBehaviour();
        $('#username').focus();
    };

    /**
     * This method set the behaviour for the register form
     * such as input validation or error displaying.
     */
    app.registerFormBehaviour = function(){
        $('#master_key_popover').popover({
            'content' : "La clé principale vous permet de garder en sécurité les " +
            "différentes clés privés des fichiers" +
            " envoyés sur le site, ne perdez pas cette clé, sans " +
            "elle il vous sera impossible de retrouver " +
            " vos fichiers et de les visualiser.",
            'title' : "Qu'est-ce que c'est ?"
        });

        $('.jumbotron').on('keyup', '#username', function(){
            var username = $(this).val();
            if(username.length > 2){
                $.get('/users/exist/' + username, function(data){
                    if(data.success != undefined && data.success == true){
                        app.inputValidity($('#username'), true);
                    } else {
                        app.inputValidity($('#username'), false);
                    }
                });
            }
        }).on('keyup', '#password_confirm', function(){
            if($(this).val() != $('#password').val()){
                app.inputValidity(this, false);
            } else {
                app.inputValidity(this, true);
                app.inputValidity($('#password'), true);
            }
        }).on('keyup', '#password', function(){
            if($(this).val() != $('#password_confirm').val()){
                app.inputValidity($('#password_confirm'), false);
            } else {
                app.inputValidity($('#password_confirm'), true);
            }
        }).on('keyup', '#mail', function(){
            if(!app.isMailAddressValid($(this).val())){
                app.inputValidity(this, false);
            } else {
                app.inputValidity(this, true);
            }
        }).on('keyup', '#master_key', function(){
            if($(this).val().length < 10){
                app.inputValidity(this, false);
            } else {
                app.inputValidity(this, true);
            }
        }).on('submit', 'form', function(e){
            e.preventDefault();
            var values = $(this).serialize();

            $.post('/register', values, function(data){

                if(data.success != undefined && data.success == true){
                    app.registerSuccess();
                } else if(data.success != undefined && data.success == false){
                    app.displayError(data.message);
                } else {
                    app.displayError('Une erreur inconnue est survenue, veuillez ' +
                    'reéssayer');
                }
            });
        });
    };

    /**
     * This method create a form field in a form (with required input)
     * @param name
     * @param title
     * @param type
     * @param placeholder
     */
    app.createFormField = function(name, type, placeholder){
        $('.jumbotron form').append(
            $('<div />')
                .addClass('form-group')
                .addClass('has-feedback')
                .append(
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
     * This method display the register success page
     */
    app.registerSuccess = function(){
        app.newPage();
        $('.jumbotron').append(
            $('<h3 />')
                .text('Inscription réussie'),
            $('<p />')
                .text('Bravo, votre inscription est réussie, vous pouvez maintenant'
                + ' vous connecter sur notre site et profiter de ses ' +
                ' fonctionnalités !')
        );
    };
})();
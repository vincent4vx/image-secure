(function(){
    /**
     * This method set the behaviour for the register form
     * such as input validation or error displaying.
     */
    mobile.registerFormBehaviour = function(){

        var _password = $('#password');
        var _passwordConfirm = $('#password_confirm');
        var _username = $('#username');
        var _mail = $('#mail');
        var _masterKey = $('#master_key');

        $(document)
            .on('keyup', '#username', function(){
                var username = _username.val();

                if(username.length > 2){
                    $.get('/users/exist/' + username, function(data){
                        if(data.success != undefined && data.success == true){
                            mobile.inputValidity(_username, true);
                        } else {
                            mobile.inputValidity(_username, false);
                        }
                    });
                }
            }).on('keyup', '#password_confirm', function(){
                if(_passwordConfirm.val() != _password.val()){
                    mobile.inputValidity(_passwordConfirm, false);
                } else {
                    mobile.inputValidity(_passwordConfirm, true);
                    mobile.inputValidity(_password, true);
                }

            }).on('keyup', '#password', function(){
                if(_password.val() != _passwordConfirm.val()){
                    mobile.inputValidity(_passwordConfirm, false);
                } else {
                    mobile.inputValidity(_passwordConfirm, true);
                }

            }).on('keyup', '#mail', function(){
                if(!mobile.isMailAddressValid(_mail.val())){
                    mobile.inputValidity(_mail, false);
                } else {
                    mobile.inputValidity(_mail, true);
                }

            }).on('keyup', '#master_key', function(){
                if(_masterKey.val().length < 10){
                    mobile.inputValidity(_masterKey, false);
                } else {
                    mobile.inputValidity(_masterKey, true);
                }
            });
    };

    /**
     * This method show the validity of the input (error or success)
     * @param elem
     * @param success
     */
    mobile.inputValidity = function(elem, success){
        if(success == true){
            elem
                .removeClass('input-invalid')
                .addClass('input-valid');
        } else {
            elem
                .addClass('input-invalid')
                .removeClass('input-valid')
        }
    };

    /**
     * This method displays the register success page
     */
    mobile.registerSuccess = function(){
        mobile.newPage();
        $('.jumbotron').append(
            $('<h3 />')
                .text('Inscription réussie'),
            $('<p />')
                .text('Bravo, votre inscription est réussie, vous pouvez maintenant'
                    + ' vous connecter sur notre site et profiter de ces fonctionnalités !')
        );
    };
})();
/**
 * Created by thomasmunoz on 25/02/15.
 */
var fileHandler = {};
(function() {
    fileHandler.launch = function(file){
        file = file[0];
        app.newPage();
        $('.jumbotron').append(
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
            app.generateEncryptForm(file.name, e.target.result);
        };
        fileReader.readAsDataURL(file);
    };

    /**
     * Encrypt an image (base64 content) using AES CryptoJS implementation
     */
    fileHandler.encrypt = function(filename, image, key){
        var imageArray = image.split(',');
        //var keyCrypted = CryptoJS.SHA1(key.value).toString();
        console.log(key);
        var encrypt = CryptoJS.AES.encrypt(imageArray[1], key);

        encrypt = imageArray[0] + ',' + encrypt.toString();
        fileHandler.upload(filename, encrypt, key);
    };

    fileHandler.decrypt = function(image, key){
        var image = image.split(',');
        var decrypt = CryptoJS.AES.decrypt(image[1], key);
        var final = atob(decrypt.toString(CryptoJS.enc.Base64));
        var prefix = image[0];
        final = prefix + ', ' + final;
        $('#img-received').empty();
        $('#img-received').append(
            $('<img>')
                .attr('src', final)
                .addClass('img-responsive')
                .addClass('center-block')
        );
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

        $.get('/check', function(master){
            if(master.success != undefined && master.success){
                var master_encrypt = CryptoJS.AES.encrypt(key, master.message);
                formData.append('key', master_encrypt.toString());
            }
        }).done(function(){
            $('#content').empty();
            app.generateProgressBar($('#content'));

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
                            app.changeProgressBar($('#content .progress-bar'),
                                percentCompleted);
                        }
                    }, false);
                    return xhr;
                },
                success: function(data){
                    if(data !== undefined){
                        if(data.success !== undefined){
                            if(data.success) {
                                app.onFileUploadSuccess(data.message, key);
                            } else {
                                app.displayError(data.message);
                            }
                        }
                    }
                }
            });
        });
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
            var currentChar = Math.floor(33 + Math.random() * 93); //random number from 33 to 126 = displayable chars
            
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
            $('.jumbotron')
                .append('<h2 id="drag_message">Envoyer votre fichier !</h2>');
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
    };
})();
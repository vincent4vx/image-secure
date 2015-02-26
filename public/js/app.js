/**
 * Created by thomasmunoz on 25/02/15.
 */
var fileHandler = {};

fileHandler.launch = function(file){
    /*$('.content').append('<div class="progress"></div>');
    $('.progress').append('<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0"' + ' aria-valuemax="100" style="min-width: 2em;">0%</div>');*/
    file = file[0];

    var contentSave = $('.jumbotron').html();

    $('.jumbotron').empty();
    $('.jumbotron').append(
        $('<h3 />')
            .text('Image selectionnée : ' + file.name),
        $('<img>')
            .attr('id', 'hiddenImage')
    );

    var fileReader = new FileReader();
    fileReader.onload = function (e){

        $('#hiddenImage').attr('src', e.target.result)
        var width = $('#hiddenImage').width();
        var height = $('#hiddenImage').height();

        $('.jumbotron').append(
            $('<canvas />')
                .addClass('img-responsive')
                .addClass('center-block')
                .attr('width', width)
                .attr('height', height)
                .attr('id', 'canvas-uploaded')
        );

        var canvas = $('#canvas-uploaded')[0];
        var context = canvas.getContext('2d');

        $('#hiddenImage').load(function() {
           context.drawImage(this, 0, 0);
           $('#hiddenImage').remove();
           fileHandler.generateForm();
        });
    };
    fileReader.readAsDataURL(file);
};

fileHandler.generateForm = function(){
    $('.jumbotron').append(
            $('<p />')
                .text('Si vous le souhaitez, vous pouvez saisir votre clé privée afin de crypter votre image' +
                ', sinon, une clé sera générée automatiquement par l\'application'),
            $('<form />')
                .attr('method', 'POST')
                .attr('action', '#')
                .addClass('form-horizontal')
                .append(
                $('<textarea />')
                    .addClass('form-control')
                    .attr('rows', '3'),
                $('<button />')
                    .attr('type', 'submit')
                    .addClass('btn')
                    .addClass('btn-primary')
                    .text('Envoyer')
            )
        );
};

fileHandler.encrypt = function(){

};

fileHandler.upload = function(file){
    var formData = new FormData();
    formData.append('file', file);

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
                    percentCompleted = (percentComplete * 100).toFixed(2);
                    console.log(percentCompleted);
                    if (percentCompleted === 100) {
                        console.log('finish');
                    }
                }
            }, false);
            return xhr;
        },
        success: function(data){
            console.log(data);
        }
    });
};

$(document).ready(function(){

    $('.jumbotron').on({
        dragenter : function(e) {
            e.stopPropagation();
            e.preventDefault();
        },
        dragover: function(e) {
            e.stopPropagation();
            e.preventDefault();

            $('.jumbotron .content').css('opacity', '0.1');
            if($('.jumbotron #drag_message').html() === undefined)
                $('.jumbotron').append('<h2 id="drag_message">Envoyer votre fichier !</h2>');
        },
        dragleave: function(e){
            $('.jumbotron .content').css('opacity', '1');
            $('#drag_message').remove();
        },
        drop: function(e) {
            e.preventDefault();
            $('.jumbotron .content').css('opacity', '1');
            var file = e.originalEvent.dataTransfer.files;
            $('#drag_message').remove();
            fileHandler.launch(file);
        }
    });
});

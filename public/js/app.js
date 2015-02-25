/**
 * Created by thomasmunoz on 25/02/15.
 */
var fileHandler = {};

fileHandler.uploadFile = function(file){
    console.log('UPLOAD FILE');
    $('.content').append('<div class="progress"></div>');
    $('.progress').append('<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0"' +
                            ' aria-valuemax="100" style="min-width: 2em;">0%</div>');
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
            fileHandler.uploadFile(file);
        }
    });
});
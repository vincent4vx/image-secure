$(document).ready(function(){
    $(document).on({
        dragenter : function(e){fileHandler.onDragEnter(e);},
        dragover : function(e){fileHandler.onDragOver(e);},
        dragleave : function(){fileHandler.onDragLeave()},
        drop : function(e){fileHandler.onDrop(e)}
    }, '.jumbotron');

    $(document).on('change', '#file-input', function(e) {
        fileHandler.launch(e.target.files);
    });
    $(document).on('click', '#file-upload-btn', function() {
        $('#file-input').click();
    });

    $(document).on('click', '#register-button', function(e){
        e.preventDefault();
        app.register();
    });
});

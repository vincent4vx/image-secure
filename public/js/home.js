$(document).ready(function(){
    $(document).on({
        dragenter : function(e){fileHandler.onDragEnter(e);},
        dragover : function(e){fileHandler.onDragOver(e);},
        dragleave : function(){fileHandler.onDragLeave()},
        drop : function(e){fileHandler.onDrop(e)}
    }, '.jumbotron');
});

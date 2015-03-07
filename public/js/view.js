/**
 * Created by thomasmunoz on 07/03/15.
 */
$(document).ready(function(){
    var url = $(location).attr('href').split('/');

    // if there is 2 parameters
    if(url.length == 7){
        var imageID = url[url.indexOf('view') + 1];
        var key = url[url.indexOf('view') + 2];
    }
});
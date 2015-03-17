$(document).ready(function(){
    $.get('/users/getimages', function(data){
       if(data.success != undefined && data.success == true){
           for(var i = 0; i < data.message.length; ++i){
               var date = new Date(data.message[i].uploaded * 1000);
               $('.jumbotron ul').append(
                   $('<li />')
                       .addClass('list-group-item')
                       .text('Ajouté le ' + date.getDay() + '/' + date.getMonth()
                             + '/' + date.getYear() + ' à ' + date.getHours() +
                                ':' + date.getMinutes())
               );
           }
       }
    });
});
$(document).ready(function(){

    $('.jumbotron ul').hide();
    // Get the list of images uploaded by the user and displays it on a list
    $.get('/users/getimages', function(data){
       if(data.success != undefined && data.success == true){
           if(data.message.length > 0){
               $('.jumbotron ul').append(
                   $('<li />')
                       .addClass('list-group-item clearfix')
                       .append(
                            $('<a />')
                                .attr('id', 'byName')
                                .addClass('pull-left')
                                .text('Nom'),
                            $('<a />')
                                .attr('id', 'byDate')
                                .addClass('pull-right')
                                .text('Envoyé le')
                   )
               );
              for(var i = 0; i < data.message.length; ++i){

                   var date = new Date(data.message[i].uploaded * 1000);
                   $('.jumbotron ul').append(
                       $('<li />')
                            .addClass('list-group-item')
                            .append(
                                $('<b />')
                                     .text(data.message[i].filename + ' '),
                                $('<span />')
                                     .addClass('pull-right')
                                     .text('Ajouté le ' + date.getDay() + '/'
                                        + date.getMonth() + '/' + date.getYear()
                                        + ' à ' + date.getHours() + ':'
                                        + date.getMinutes())
                            )
                   )
              }
               $('.jumbotron ul li').css({opacity:0, bottom:'100%'});
               $('.jumbotron ul').show();
               $('ul').each(function() {
                   $(this).children().each(function(i) {
                       $(this).delay((i++) * 100).animate({bottom:0, opacity:1});
                   });
               });
           } else {
              $('.jumbotron').append(  
                            $('<h4 />')
                                .text('Vous n\'avez envoyé aucun fichier :\'(')
              );
           }
          
       }
    });
});

(function(){
    /**
     * Create an empty page
     * @param pageID
     */
    mobile.newPage = function(pageID){
        $('body').append(
            $('<div />')
                .attr('id', pageID)
                .attr('data-role', 'page')
        );
    };

    /**
     * Create a progress bar (with 0%)
     * @param elem
     */
    mobile.generateProgressBar = function(elem){
        elem.append(
            $('<h2 />')
                .text('Chargement ...'),
            $('<div />')
                .addClass('progress-bar')
                .append(
                $('<span />')
                    .addClass('progress-status')
                    .css({'width': '2%'})
                    .text('')
            )
        );
    };

    /**
     * Change the progress bar value to the given percent
     * @param percent
     */
    mobile.changeProgressBar = function(percent){
        if (Math.round(percent) === 100) {
            $('.progress-status')
                .css({'background-color': '#4CAF50', 'width' : '100%'})
                .text('Terminé');
        } else {
            $('.progress-status')
                .css({width: percent + '%'})
                .text(percent);
        }
    };

    /**
     * This method display any error message returned by the server
     * @param message
     */
    mobile.displayError = function(message){
        if(!$('#popupCloseRight').length){
            $('body').append(
                $('<div />')
                    .attr('data-role', 'popup')
                    .attr('id', 'popupCloseRight')
                    .addClass('ui-content')
                    .append(
                    $('<a />')
                        .attr('href', '#')
                        .attr('data-rel', 'back')
                        .addClass('ui-btn ui-corner-all ui-shadow uit-btn-a')
                        .addClass('ui-icon-delete ui-btn-icon-notext ui-btn-right')
                        .text("Fermer"),
                    $('<p />').text(message)
                )
            );
        } else {
            $('#popupCloseRight p').text(message);
        }
        $('#popupCloseRight').popup();
        $('#popupCloseRight').popup("open");
    };
    /**
     * This method return a Date Object to a string with the format
     * dd/mm/yyyy HH:MM
     * @param date
     * @returns {string}
     */
    mobile.convertDate = function(date){
        var year = date.getFullYear();
        var month = parseInt(date.getMonth()) + 1;
        month = (month.length > 1) ? month : '0' + month;

        var day = date.getDate().toString();
        day = (day.length > 1) ? day : '0' + day;

        var minutes = date.getMinutes();
        minutes = (minutes.toString().length > 1) ? minutes : '0' + minutes;

        var hour = date.getHours();
        hour = (hour.toString().length > 1) ? hour : '0' + hour;

        return day + '/' + month + '/' + year + ' ' + hour + ':' + minutes;
    };

    /**
     * Check email address validity
     * Thanks to stackoverflow I don't have to write my own regex
     * Shamefully copied at http://stackoverflow.com/a/17968929
     * @param emailAddress
     * @returns {boolean}
     */
    mobile.isMailAddressValid = function(email) {
        var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,15})?$/);
        return pattern.test(email);
    };
})();
/**
 * Created by thomasmunoz on 07/03/15.
 */

(function(){
    app.jumbotron = null;
    /**
     * This method display any error message returned by the server
     * @param message
     */
    app.displayError = function(message){
        if(!$('.jumbotron .alert').length){
            $('.jumbotron').prepend(
                $('<div />')
                    .addClass('alert')
                    .addClass('alert-danger')
                    .addClass('alert-error')
            );
        } else {
            $('.jumbotron .alert').empty();
        }

        $('.jumbotron .alert')
            .append(
            $('<a />')
                .attr('href', '#')
                .addClass('close')
                .attr('data-dismiss', 'alert')
                .html('&times;'),
            $('<b />')
                .text('Erreur ! '),
            message
        )
    };

    /**
     * This method generate a progress bar (at 0%)
     * @param element
     */
    app.generateProgressBar = function(element){
        element.append(
            $('<h3 />')
                .text('Chargement ...'),
            $('<div />')
                .addClass('progress')
                .append(
                $('<div />')
                    .addClass('progress-bar')
                    .attr('role', 'progressbar')
                    .attr('aria-valuenow', '0')
                    .attr('aria-valuemin', '0')
                    .attr('aria-valuemax', '100')
                    .attr('style', 'min-width: 2em;')
                    .text('0%')
            )
        );
    };

    /**
     *  This method change the progress bar status to the value given (in percent)
     * @param element
     * @param percentCompleted
     */
    app.changeProgressBar = function(element, percentCompleted){
        element
            .attr('aria-valuenow', percentCompleted)
            .attr('style', 'min-width: 2em; width: ' + percentCompleted + '%;')
            .text(percentCompleted + '%');

        if (Math.round(percentCompleted) === 100) {
            element
                .addClass('progress-bar-success')
                .text('Terminé !');
        }
    };

    /**
     * This method clear the jumbotron (main content of the website) and create a
     * return button to go back in the homepage
     */
    app.newPage = function(){
        app.jumbotron = $('.jumbotron').html();

        $('.jumbotron')
            .empty()
            .append(
            $('<button />')
                .attr('type', 'button')
                .attr('id', 'return-btn')
                .addClass('btn')
                .addClass('btn-primary')
                .append(
                $('<i />')
                    .addClass('glyphicon')
                    .addClass('glyphicon-arrow-left'),
                $('<b />')
                    .text(' Retour')
            ));

        $('.jumbotron').on('click', '#return-btn', function(e){
            e.preventDefault();
            $('.jumbotron')
                .empty()
                .html(app.jumbotron);
        });
    };

    /**
     * Check email address validity
     * Thanks to stackoverflow I don't have to write my own regex
     * Shamefully copied at http://stackoverflow.com/a/17968929
     * @param email
     * @returns {boolean}
     */
    app.isMailAddressValid = function(email) {
        var pattern = new RegExp(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,15})?$/);
        return (email.length > 6) ? pattern.test(email) : false;
    };



    /**
     * This method return a Date Object to a string with the format
     * dd/mm/yyyy HH:MM
     * @param date
     * @returns {string}
     */
    app.convertDate = function(date){
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
})();
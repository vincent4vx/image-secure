var isMobile = {};
(function(){
    /**
     * To know if the user agent match with a mobile
     * from http://www.abeautifulsite.net/detecting-mobile-devices-with-javascript/
     * @type {{Android: Function, BlackBerry: Function, iOS: Function, Opera: Function, Windows: Function, any: Function}}
     */
    isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS()
            || isMobile.Opera() || isMobile.Windows());
        }
    };

    /**
     * This method asks the user if we wants to be redirected to the mobile version
     * and store the choice in localstorage
     */
    isMobile.detect = function(){
        var choice = localStorage.getItem('mobile');

        if(!isMobile.isSafariPrivateBrowsing()){
            if(choice == null && isMobile.any()){
                if(confirm('Souhaitez-vous être redirigé vers la version mobile ?' +
                    ' (votre choix sera conservé)')){

                    localStorage.setItem('mobile', true);
                    isMobile.redirect('http://mobile.image-secure.munoz.ovh');
                } else {
                    localStorage.setItem('mobile', false);
                }
            } else if (choice == 'true' && isMobile.any()){
                isMobile.redirect('http://mobile.image-secure.munoz.ovh');
            }
        }
    };

    /**
     * This method redirect the user to the url given
     */
    isMobile.redirect = function(url){
        // On Safari location.href doesn't seems to be working
        if(isMobile.iOS()){
            window.location = url;
        } else {
            location.href = url;
        }
    };

    /**
     * Safari Mobile doesn't allow localStorage on private browsing
     * so we check if it's possible to write on localStorage
     * and return true if not :)
     */
    isMobile.isSafariPrivateBrowsing = function(){
        try {
            localStorage.setItem('cetrucestabsolumentgenialctropbienlol', 42);
            localStorage.removeItem('cetrucestabsolumentgenialctropbienlol');
            return false;
        } catch(e) {
            return true;
        }
    };
})();
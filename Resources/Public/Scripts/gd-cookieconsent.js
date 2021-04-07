(function($) {
    function initCookieConsent() {
        var cookieConsent = $('#cookieConsent');

        if (typeof $.fn.modal === 'undefined') {
            throw 'Please ensure the bootstrap javascript is included';
        }

        if (cookieConsent.length > 0 && cookie('gdcc-cookie-consent-settings') == null) {
            cookieConsent.modal();
        }

        $('[data-toggle="popover"]').popover();

        $('.popover-dismiss').popover({
            trigger: 'focus'
        });

        $('.toggle-manager').on('click', function(e) {
            e.preventDefault();
            $('#cookieManager .card').toggle();
        });
    }

    function init() {
        initCookieConsent();
        new GdCookieConsent(false);
    }

    $(document).ready(function () {
        init();
    });
})(jQuery);
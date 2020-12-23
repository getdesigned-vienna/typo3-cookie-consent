function GdCookieConsent(debug = false) {
    this.debugMode = debug;
    this.$gdcc = null; // will point to gdcc wrapper soon
    this.config = []
    this.jQueryEventsSet = false;

    this.init = function () {
        if (this.debugMode) console.log('==== Getdesigned Cookie Consent in Debug Mode ====')
        if (!this.checkJquery()) return;
        if (!this.checkFgCookie()) return;
        if (!this.initWrapper()) return;
        this.restoreUserSettings();
        if (!this.deriveConfig()) return;
        if (!this.bindJqEvents()) return;
        this.deleteCookies();
        this.updateContent();
    }

    this.updateContent = function () {
        var i = 0;
        while (i < this.config.length) {
            this.showHide(this.config[i].id, this.config[i].checked);
            this.modifySrcAndScriptType(this.config[i].id, this.config[i].checked);
            this.modifyHeaderLinks(this.config[i].id, this.config[i].checked);
            i++;
        }
    }

    this.showHide = function (id, status) {
        var optIn = '.gdcc-optin[data-gdcc-cookie="' + id + '"]:not("script, link"), .gdcc-optin-' + id + ':not("script, link"), [data-gdcc-selector="gdcc-optin-' + id + '"]:not("script, link")';
        var optOut = '.gdcc-optout[data-gdcc-cookie="' + id + '"]:not("script, link"), .gdcc-optout-' + id + ':not("script, link"), [data-gdcc-selector="gdcc-optout-' + id + '"]:not("script, link")';

        this.info((status ? 'Showing' : 'Hiding') + ' DOM elements with selectors "' + optIn + '"');
        var $optInEls = jQuery(status ? optIn : optOut);
        if (this.debugMode && status && (this.$gdcc.filter('.gdcc-saved').length === 0) && ($optInEls.filter(':not(.gdcc-hide)').length > 0)) {
            this.warn('Element(s) with selector "' + optIn + '" found, which do not have set the class ".gdcc-hide" hardcoded (but should have)');
            this.warn($optInEls.filter(':not(.gdcc-hide)'));
        }
        $optInEls.removeClass('gdcc-hide');
        var that = this;
        if (!status) {
            var msg = that.getCookieMsg(id);
            if (msg) {
                $optInEls.addClass('gdcc-has-msg');
                $optInEls.off('click.askExplicitPermission').on('click.askExplicitPermission', function () {
                    if (confirm(msg)) {
                        that.$gdcc.find('#' + id).prop("checked", 1);
                        that.saveUserSettings(that);
                        that.updateContent();
                    }
                });
            }
        }

        this.info((!status ? 'Showing' : 'Hiding') + 'DOM elements with selectors "' + optOut + '"');
        var $optOutEls = jQuery(!status ? optIn : optOut);
        $optOutEls.addClass('gdcc-hide');
    }

    this.getCookieMsg = function (id) {
        $input = this.$gdcc.find('#' + id);
        $label = this.$gdcc.find('label[for=' + id + ']');
        var msg = (this.getAttribute($label, 'data-gdcc-msg')
            ?? this.getAttribute($input, 'data-gdcc-msg')
            ?? this.getAttribute(this.$gdcc, 'data-gdcc-msg'))
            ?? false;
        if (msg) {
            return msg.replace('@cookie@', $label.html());
        } else {
            return false;
        }
    }

    this.modifyHeaderLinks = function (id, status) {
        var optIn = 'link.gdcc-optin[data-gdcc-cookie="' + id + '"][data-gdcc-href], link.gdcc-optin-' + id + '[data-gdcc-href], link[data-gdcc-selector="gdcc-optin-' + id + '"][data-gdcc-href]';
        var optOut = 'link.gdcc-optout[data-gdcc-cookie="' + id + '"][data-gdcc-href], link.gdcc-optout-' + id + '[data-gdcc-href], link[data-gdcc-selector="gdcc-optout-' + id + '"][data-gdcc-href]';
        var that = this;
        this.info((status ? 'Copy attribute "data-gdcc-href" => "href"' : 'Removing attribute "href"') + ' for DOM elements with selectors "' + optIn + '"');
        var $optInEls = jQuery(status ? optIn : optOut);
        if (this.debugMode && status && (this.$gdcc.filter('.gdcc-saved').length === 0) && ($optInEls.filter('[href]').length > 0)) {
            this.warn('Element(s) with selector "' + optIn + '" found, which still have the attribute "href" hardcoded (but should NOT have)');
        }
        $optInEls.each(function () {
            var $this = $(this);
            var tagName = $this.prop("tagName").toString().toLowerCase();
            // if (that.debugMode && status && (that.$gdcc.filter('.gdcc-saved').length === 0) && tagName === 'link' && $this.attr('type').toString().toLowerCase() === "text/css") {
            //     that.warn('OptIn Script Tag(s) with selector "' + optIn + '" found, which have the attribute "type" hardcoded to "text/css" (but should have "text/plain")');
            // }
            if (tagName === 'link' && $this.attr('type').toString().toLowerCase() === "text/plain") {
                that.info('Changing link type from text/plain to text/css to activate javascript');
                $this.attr('type', 'text/css');
            }
            $this.attr('href', $this.attr('data-gdcc-href'));
        });

        this.info((!status ? 'Copy attribute "data-gdcc-href" => "href"' : 'Removing attribute "href"') + ' for DOM elements with selectors "' + optOut + '"');
        var $optOutEls = jQuery(!status ? optIn : optOut);
        $optOutEls.each(function () {
            var $this = $(this);
            var tagName = $this.prop("tagName").toString().toLowerCase();
            if (tagName === 'link' && $this.attr('type').toString().toLowerCase() === "text/css") {
                that.info('Changing script type back from text/css to text/plain to disable css');
                $this.attr('type', 'text/plain');
            }
            $this.removeAttr('href');
        });
    }

    this.modifySrcAndScriptType = function (id, status) {
        var optIn = '.gdcc-optin[data-gdcc-cookie="' + id + '"][data-gdcc-src], .gdcc-optin-' + id + '[data-gdcc-src], [data-gdcc-selector="gdcc-optin-' + id + '"][data-gdcc-src]';
        var optOut = '.gdcc-optout[data-gdcc-cookie="' + id + '"][data-gdcc-src], .gdcc-optout-' + id + '[data-gdcc-src], [data-gdcc-selector="gdcc-optout-' + id + '"][data-gdcc-src]';
        var that = this;

        this.info((status ? 'Copy attribute "data-gdcc-src" => "src"' : 'Removing attribute "src"') + ' for DOM elements with selectors "' + optIn + '"');
        var $optInEls = jQuery(status ? optIn : optOut);
        if (this.debugMode && status && (this.$gdcc.filter('.gdcc-saved').length === 0) && ($optInEls.filter('[src]').length > 0)) {
            this.warn('Element(s) with selector "' + optIn + '" found, which still have the attribute "src" hardcoded (but should NOT have)');
        }
        $optInEls.each(function () {
            var $this = $(this);
            var tagName = $this.prop("tagName").toString().toLowerCase();
            if (that.debugMode && status && (that.$gdcc.filter('.gdcc-saved').length === 0) && tagName === 'script' && $this.attr('type').toString().toLowerCase() === "text/javascript") {
                that.warn('OptIn Script Tag(s) with selector "' + optIn + '" found, which have the attribute "type" hardcoded to "text/javascript" (but should have "text/plain")');
            }
            if (tagName === 'script' && $this.attr('type').toString().toLowerCase() === "text/plain") {
                that.info('Changing script type from text/plain to text/javascript to activate javascript');
                $this.attr('type', 'text/javascript');
            }
            $this.attr('src', $this.attr('data-gdcc-src'));
        });

        this.info((!status ? 'Copy attribute "data-gdcc-src" => "src"' : 'Removing attribute "src"') + ' for DOM elements with selectors "' + optOut + '"');
        var $optOutEls = jQuery(!status ? optIn : optOut);
        $optOutEls.each(function () {
            var $this = $(this);
            var tagName = $this.prop("tagName").toString().toLowerCase();
            if (tagName === 'script' && $this.attr('type').toString().toLowerCase() === "text/javascript") {
                that.info('Changing script type back from text/javascript to text/plain disable javascript');
                $this.attr('type', 'text/plain');
            }
            $this.removeAttr('src');
        });
    }

    this.restoreUserSettings = function () {
        var cookieString = cookie('gdcc-cookie-consent-settings');
        if (!cookieString) {
            this.log('No User Settings found');
            this.$gdcc.addClass('gdcc-unconfirmed');
        } else {
            this.log('User Settings could be loaded');
            var settings = JSON.parse(cookieString);
            this.info(settings);
            this.$gdcc.addClass('gdcc-restored gdcc-confirmed');
        }
        var that = this;
        this.log('Restoring User Settings')
        jQuery.each(settings, function (el) {
            that.info('Now setting input#' + this.id + ' to ' + (this.checked ? 'checked' : 'unchecked'))
            that.$gdcc.find('#' + this.id).prop("checked", this.checked);
        });
    }

    this.bindJqEvents = function (force = false) {
        if (this.jQueryEventsSet && !force) return true;
        this.$_saveConsentEl = this.$gdcc.find('input[type=submit], .gdcc-save-consent');
        if (this.$_saveConsentEl.length === 0) {
            this.error('No input[type=submit] or other element with CSS ".gdcc-save-consent" found inside gdcc wrapper. Please add. jQuery events could not be added to be able to save cookie consent settings');
            this.info('Sample: <input type="submit" value="Speichern" />');
            return false;
        }
        var that = this;
        this.$_saveConsentEl.on('click', function (e) {
            e.preventDefault();
            that.deriveConfig()
            that.$gdcc.removeClass('gdcc-unconfirmed').addClass('gdcc-saved gdcc-confirmed');
            that.saveUserSettings(that, this);
            that.deleteCookies();
            that.updateContent();
        });

        this.jQueryEventsSet = true;
        return true;

    }

    this.deleteCookies = function () {
        var i = 0;
        while (i < this.config.length) {
            if (this.config[i].checked === 0) {
                $el = this.$gdcc.find('#' + this.config[i].id);
                this.log('checking for cookies for #' + this.config[i].id);
                var deleteCookie = this.getAttribute($el, 'data-gdcc-delete-cookie');
                if (deleteCookie) {
                    deleteCookie = this._explode(deleteCookie);
                    this.log('found ' + deleteCookie.length + ' cookies for #' + this.config[i].id);
                    var j = 0;
                    while (j < deleteCookie.length) {
                        cookie(deleteCookie[j], false);
                        this.log('trying to delete cookie "' + deleteCookie[j] + '" for #' + this.config[i].id);
                        j++;
                    }
                } else {
                    this.log('XX nothing found');
                }
            }
            i++;
        }
    }

    this.saveUserSettings = function (context, button = false) {
        if (button) {
            this._preselectCheckboxes(button);
        }
        this.deriveConfig();
        var json = JSON.stringify(context.config);
        cookie('gdcc-cookie-consent-settings', json);
        this.log(JSON.parse(json));
    }

    this._explode = function (input) {
        return input.toString().trim().replace(/[ ,]{1,}/g, ',').split(',');
    }

    this._preselectCheckboxes = function (button) {
        var $button = $(button);
        if ($button.attr('data-gdcc-select')) {
            var selector = this._explode($button.attr('data-gdcc-select'));
            var i = 0;
            while (i < selector.length) {
                if (selector[i] === '*') {
                    this.$gdcc.find('input[type=checkbox]:not([disabled]').prop("checked", true);
                } else if (selector[i] === '-') {
                    this.$gdcc.find('input[type=checkbox]:not([disabled]').prop("checked", false);
                } else {
                    var inputSelector = 'input#' + selector[i] + '[type=checkbox]:not([disabled], [readonly]), fieldset#' + selector[i] + ' input[type=checkbox]:not([disabled], [readonly])';
                    if (i === 0) {
                        this.$gdcc.find('input[type=checkbox]:not([disabled]').prop("checked", false);
                    }
                    this.$gdcc.find(inputSelector).prop("checked", true);
                }
                i++;
            }
        }

    }

    this.deriveConfig = function () {
        this.config = [];
        this.$_checkboxes = this.$gdcc.find('input[type=checkbox]');
        if (this.$_checkboxes.length === 0) {
            this.error('No input[type=checkbox] found inside gdcc wrapper. Please add. Note: can be wrapped in fieldset');
            this.info('Sample: <input type="checkbox" id="cookie1" />');
            return false;
        }
        var that = this;
        this.$_checkboxes.each(function (i) {
            var $this = jQuery(this);
            config = new GdCookieConfig($this, that, i);
            if (config.id) {
                that.config.push(config);
            }
        })
        if (this.config.length === 0) {
            this.error('No settings added to config, because all input[type=checkbox] are incomplete');
            return false;
        }
        if (this.config.length !== this.$_checkboxes.length) {
            this.log('Note: Some input[type=checkbox] are incomplete (maybe this is intended)');
        }
        return true;
    }

    this.initWrapper = function () {
        this.$gdcc = $('#gd-cookie-consent, #gdcc-wrapper');
        if (this.$gdcc.length === 0) {
            this.error('GdCookieConsent Wrapper not found: can not find element with id "#gd-cookie-consent". Please add.');
            this.error('Sample: <div id="gd-cookie-consent">');
            return false;
        }
        if (!this.getAttribute(this.$gdcc, 'data-gdcc-msg')) {
            this.warn('GdCookieConsent Wrapper does not have attribute "data-gdcc-msg". This is used to i18n the hint to enable a certain cookie.');
            this.warn('Sample: <div id="gdcc-wrapper" data-gdcc-msg="You need to activate the cookie category @cookie@. Continue?">' + ' (@cookie@ will be replaced with the label of the cookie).');
            this.warn('Note: More specific messages can configured on the input / label itself with the same attribute');
            this.warn('If the attribute is neither available on the wrapper, nor on input / label, onclick enabling on optout elements is disabled.');
        }

        return true;
    }

    this.checkJquery = function () {
        if (typeof jQuery == 'undefined') {
            this.error('jQuery not found. Please include in JS source.')
            return false;
        }
        return true;
    }

    this.checkFgCookie = function () {
        if (typeof cookie == 'undefined') {
            this.error('fg-cookie not found. Please include in JS source.')
            return false;
        }
        return true;
    }

    this.getAttribute = function (tag, attribute, defaultReturn) {
        $tag = jQuery(tag);
        attribute = $tag.attr(attribute);
        return (typeof attribute !== typeof undefined && attribute !== defaultReturn) ? attribute : defaultReturn;
    }

    this.info = function (msg) {
        if (this.debugMode && typeof console != 'undefined') console.info(msg);
    }

    this.log = function (msg) {
        if (this.debugMode && typeof console != 'undefined') console.log(msg);
    }

    this.warn = function (msg) {
        if (this.debugMode && typeof console != 'undefined') console.warn(msg);
    }

    this.error = function (msg) {
        if (this.debugMode && typeof console != 'undefined') console.error(msg);
    }

    this.init();
    this.log(this.config);
}

function GdCookieConfig($this, gdcc, i) {
    this.id = null;

    if (!$this.attr('id')) {
        gdcc.log('input[type=checkbox] #' + i + ' is missing an id attribute. skipping!');
    }

    this.id = $this.attr('id');
    this.checked = $this.is(':checked, [readonly], [disabled]') ? 1 : 0;
}

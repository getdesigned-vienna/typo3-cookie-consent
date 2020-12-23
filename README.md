# TYPO3 Extension `gd_cookieconsent`

## 1 Features

* Easy integrable cookie consent for your TYPO3 installation
* Configure your cookie settings inside TYPO3 Backend (also possible for editors)
* Fully customizable due to fluid template engine
* Takes advantage of [GDCC JS library][1]

## 2 Usage

### 2.1 Installation

#### Installation using Composer

The recommended way to install the extension is using [Composer][2].

Run the following command within your Composer based TYPO3 project:

```
TODO
```

#### Installation as extension from TYPO3 Extension Repository (TER)

Download and install the [extension][3] with the extension manager module.

### 2.2 Setup

1) Run `npm install` or `yarn install` or download JS dependencies from [GitHub][1] and place them wherever you want. There is also a copy of them placed at `Resources/Public/Scripts` if you will use TWB style template.
2) Include the static TypoScript of the extension. **Optional:** If your templates are based on Twitter Bootstrap, add the TWB styles as well to get optimized CSS styles and default JS behaviour.
3) If you are **not using** TWB style template, make sure you have included all necessary JS libraries (jQuery > 3, fg-cookie, gdcc-js). Those libraries will be delivered via npm dependency. Take a look into `package.json`.
4) If you are **not using** TWB style template, initialize GDCC in your JavaScript once the DOM is ready. `gdcc = new GdCookieConsent(debugMode);`. The parameter `debugMode` is a boolean and triggers debug output of GDCC.
5) Create some cookie category-, script- and cookie records on a sysfolder.
6) Define sysfolder as storage pid in Typoscript constants – `$plugin.tx_gdcookieconsent.settings.storagePid`

### 3 Useful general information

* The cookie consent itself is places per default at `page.5`. If this key is already in use, you can reference `lib.cookieConsent` at any location inside your `page` object.
* Scripts, handled by this extension (script records with given script-content e.g. Google Analytics code) are placed at `page.headerData.5`. If this key is already in use, you can reference `lib.cookieScripts` at any location inside `page.headerData` or `page.footerData`.
* It is possible to override the fluid templates via `$plugin.tx_gdcookieconsent.view.` settings in Typoscript constants.

### 4 Handling media (eg. YouTube videos)
TODO

[1]: https://github.com/getdesigned-vienna/cookie-consent
[2]: https://getcomposer.org/
[3]: TODO
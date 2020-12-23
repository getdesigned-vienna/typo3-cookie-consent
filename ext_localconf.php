<?php

defined('TYPO3_MODE') || die('Access denied.');

\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
    'GdCookieconsent',
    'Cookiehandling',
    [
        \GD\Cookieconsent\Controller\CookieConsentController::class => 'show',
    ],
    // non-cacheable actions
    []
);
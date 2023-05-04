<?php

defined('TYPO3_MODE') || defined('TYPO3') || die('Access denied.');

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile(
    'gd_cookieconsent',
    'Configuration/TypoScript',
    'Getdesigned Cookie Consent - Setup'
);

\TYPO3\CMS\Core\Utility\ExtensionManagementUtility::addStaticFile(
    'gd_cookieconsent',
    'Configuration/TypoScript/Styles/Twb',
    'Getdesigned Cookie Consent - Styles Twitter Bootstrap'
);
<?php

$EM_CONF['gd_cookieconsent'] = array(
	'title' => 'Getdesigned cookie consent',
	'description' => 'TYPO3 Extension for Getdesigned cookie consent (GDCC)',
	'author' => 'Stephan',
	'author_company' => 'Getdesigned',
	'author_email' => 'sta@getdesigned.at',
	'category' => 'plugin',
	'state' => 'stable',
	'version' => '1.0.3-dev',
    'clearCacheOnLoad' => true,
    'constraints' => [
        'depends' => [
            'typo3' => '9.5.17-10.9.99',
        ],
        'conflicts' => [],
        'suggests' => [],
    ],
);

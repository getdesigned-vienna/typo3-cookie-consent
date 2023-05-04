<?php
defined('TYPO3_MODE') || defined('TYPO3') || die('Access denied.');

$GLOBALS['TCA']['tx_cookieconsent_domain_model_cookie'] = [
    'ctrl' => [
        'title'	=> 'Cookie',
        'label' => 'name',
        'iconfile' => 'EXT:gd_cookieconsent/Resources/Public/Icons/cookie_icon.png',

        'tstamp' => 'tstamp',
        'crdate' => 'crdate',
        'cruser_id' => 'cruser_id',

        'languageField' => 'sys_language_uid',
        'transOrigPointerField' => 'l10n_parent',
        'transOrigDiffSourceField' => 'l10n_diffsource',
        'delete' => 'deleted',
        'enablecolumns' => [
            'disabled' => 'hidden',
            'starttime' => 'starttime',
            'endtime' => 'endtime',
        ],
        'searchFields' => 'name,description'
    ],

    'types' => [
        '0' => [
            'showitem' => 'sys_language_uid, l10n_parent, hidden, name, identifier, description, script'
        ]
    ],

    'columns' => [
        'sys_language_uid' => [
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.language',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'special' => 'languages',
                'items' => [
                    [
                        'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.allLanguages',
                        -1,
                        'flags-multiple'
                    ]
                ],
                'default' => 0
            ]
        ],
        'l10n_parent' => [
            'displayCond' => 'FIELD:sys_language_uid:>:0',
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.l18n_parent',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'items' => [
                    ['', 0]
                ],
                'foreign_table' => 'tx_cookieconsent_domain_model_cookie',
                'foreign_table_where' => 'AND tx_cookieconsent_domain_model_cookie.uid=###REC_FIELD_l10n_parent### AND tx_cookieconsent_domain_model_cookie.sys_language_uid IN (-1,0)',
                'default' => 0
            ]
        ],
        'l10n_diffsource' => [
            'config' => [
                'type' => 'passthrough'
            ]
        ],

        'hidden' => [
            'exclude' => 1,
            'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.hidden',
            'config' => [
                'type' => 'check'
            ]
        ],

        'name' => [
            'exclude' => 0,
            'label' => 'Name',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'trim'
            ]
        ],

        'description' => [
            'label' => 'Beschreibung',
            'config' => [
                'type' => 'text',
                'eval' => 'trim'
            ]
        ],

        'identifier' => [
            'label' => 'Cookie Kürzel',
            'config' => [
                'type' => 'input',
                'size' => 30,
                'eval' => 'trim'
            ]
        ],

        'script' => [
            'label' => 'Zugehöriges Skript',
            'config' => [
                'type' => 'select',
                'renderType' => 'selectSingle',
                'foreign_table' => 'tx_cookieconsent_domain_model_script'
            ]
        ]

    ]
];
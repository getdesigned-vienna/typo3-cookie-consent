<?php
if (!defined ('TYPO3_MODE')) 	die ('Access denied.');

$GLOBALS['TCA']['tx_cookieconsent_domain_model_cookiecategory'] = [
    'ctrl' => [
        'title'	=> 'Cookie Kategorie',
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
            'showitem' => 'sys_language_uid, l10n_parent, hidden, name, description, forced, scripts'
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
                'foreign_table' => 'tx_cookieconsent_domain_model_cookiecategory',
                'foreign_table_where' => 'AND tx_cookieconsent_domain_model_cookiecategory.uid=###REC_FIELD_l10n_parent### AND tx_cookieconsent_domain_model_cookiecategory.sys_language_uid IN (-1,0)',
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

        'forced' => [
            'label' => 'Muss akzeptiert werden',
            'config' => [
                'type' => 'check'
            ]
        ],

        'scripts' => [
            'label' =>  'Verknüpfte Skripte',
            'config' => [
                'type' => 'inline',
                'foreign_table' => 'tx_cookieconsent_domain_model_script',
                'foreign_field' => 'cookiecategory'
            ]
        ]
   ]
];
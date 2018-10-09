<?php
namespace Presence;
use Zend\Router\Http\Segment;
use Zend\ServiceManager\Factory\InvokableFactory;
return [
    'router' => [
        'routes' => [
            'genererlot' => [
                'type'    => Segment::class,
                'options' => [
                    'route'       => '/api/presence/genererlot',
                    'defaults'    => [
                        'controller' => Controller\PresenceController::class,
                        'action'     => 'genererlot',
                    ],
                ],
            ],
        	'creerlot' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'       => '/api/presence/creerlot',
        						'defaults'    => [
        								'controller' => Controller\PresenceController::class,
        								'action'     => 'creerlot',
        						],
        				],
        		],
        	'creerfiche' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'       => '/api/presence/creerfiche',
        						'defaults'    => [
        								'controller' => Controller\PresenceController::class,
        								'action'     => 'creerfiche',
        						],
        				],
        		],
        	'sauvegarderlot' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'       => '/api/presence/sauvegarderlot',
        						'defaults'    => [
        								'controller' => Controller\PresenceController::class,
        								'action'     => 'sauvegarderlot',
        						],
        				],
        		],
        	'extraire' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'       => '/api/presence/extraire',
        						'defaults'    => [
        								'controller' => Controller\PresenceController::class,
        								'action'     => 'extraire',
        						],
        				],
        		],
        	'extraire-excel' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'       => '/api/presence/extraire-excel',
        						'defaults'    => [
        								'controller' => Controller\PresenceController::class,
        								'action'     => 'extraireExcel',
        						],
        				],
        		],
        ],
    ],
    /*
    'controllers' => [
        'factories' => [
            Controller\AlbumController::class => InvokableFactory::class,
        ],
    ],
    */
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'template_path_stack' => [
            'presence' => __DIR__ . '/../view',
        ],
    ],
];
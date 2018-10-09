<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */
namespace Application;
use Zend\Router\Http\Literal;
use Zend\Router\Http\Segment;
use Zend\ServiceManager\Factory\InvokableFactory;
return [
    'router' => [
        'routes' => [
            'home' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action'     => 'index',
                    ],
                ],
			],
			'app' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/app',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            'authenticate' => [
        				'type' => Literal::class,
        				'options' => [
        						'route' => '/authenticate',
        						'defaults' => [
        								'controller' => Controller\IndexController::class,
        								'action' => 'authenticate',
        						],
        				],
        		],
            'logout' => [
        				'type' => Literal::class,
        				'options' => [
        						'route' => '/logout',
        						'defaults' => [
        								'controller' => Controller\IndexController::class,
        								'action' => 'logout',
        						],
        				],
        		],
            'login' => [
        				'type' => Literal::class,
        				'options' => [
        						'route'    => '/login',
        						'defaults' => [
        								'controller' => Controller\IndexController::class,
        								'action'     => 'login',
        						],
        				],
            		'may_terminate' => true,
            		'child_routes' => [
                    'process' => [
                        'type' => 'Segment',
                        'options' => [
                            'route' => '/[:module][/:action][/:id]',
                            'constraints' => [
                                'controller' => '[a-zA-Z][a-zA-Z0-9_-]*',
                                'action' => '[a-zA-Z][a-zA-Z0-9_-]*',
                            ],
                            'defaults' => [
                            ],
                        ],
                    ],
        		],
            ],
            'application' => [
                'type'    => Segment::class,
                'options' => [
                    'route'    => '/application[/:action]',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
              'chargementcours' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'    => '/api/chargementcours[/]',
        						    'defaults' => [
                        			    'controller' => Controller\IndexController::class,
                        				'action'     => 'chargementcours',
                    					],
        				],
        		],
        		'maj-des-salles-hp' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'    => '/api/maj-des-salles-hp[/]',
        						'defaults' => [
        								'controller' => Controller\IndexController::class,
        								'action'     => 'majDesSallesHP',
        						],
        				],
        		],
        		// Liste des services REST
        		'lotservice' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'    => '/api/lotservice[/][:id][/]',
        						'defaults' => [
        								'controller' => Service\LotServiceController::class,
        						],
        				],
        		],
        		'presenceservice' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'    => '/api/presenceservice[/][:id][/]',
        						'defaults' => [
        								'controller' => Service\PresenceServiceController::class,
        						],
        				],
        		],
        		'salleservice' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'    => '/api/salleservice[/][:id][/]',
        						'constraints' => [
        								'id'     => '[0-9]+',
        						],
        						'defaults' => [
        								'controller' => Service\SalleServiceController::class,
        						],
        				],
        		],
        		'groupesalleservice' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'    => '/api/groupesalleservice[/][:id][/]',
        						'constraints' => [
        								'id'     => '[0-9]+',
        						],
        						'defaults' => [
        								'controller' => Service\GroupeSalleServiceController::class,
        						],
        				],
        		],
        		'coursservice' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'    => '/api/coursservice[/][:id][/]',
        						'defaults' => [
        								'controller' => Service\CoursServiceController::class,
        						],
        				],
        		],
        		'favorisservice' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'    => '/api/favorisservice[/][:id][/]',
        						'defaults' => [
        								'controller' => Service\FavorisServiceController::class,
        						],
        				],
        		],
                'userservice' => [
                         'type'    => Segment::class,
                         'options' => [
                                'route'    => '/api/userservice[/][:id][/]',
                                'defaults' => [
                                    'controller' => Service\UserServiceController::class,
                    ],
                ],
            ],
        		'hyperplanningservice' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'    => '/api/hyperplanningservice[/][/:action][/:id][/]',
        						'constraints' => [
        								'id'     => '[0-9]+',
        						],
        						'defaults' => [
        								'controller' => Service\HyperServiceController::class,
        								'action'     => 'index',
        						],
        				],
        		],
        		'ldapservice' => [
        				'type'    => Segment::class,
        				'options' => [
        						'route'    => '/api/ldapservice[/][/:action][/:id][/]',
        						'constraints' => [
        								'id'     => '[0-9]+',
        						],
        						'defaults' => [
        								'controller' => Service\LdapServiceController::class,
        								'action'     => 'index',
        						],
        				],
        		],
        		// Liste des composants Angular 2 gérés par le routeur Angular
        		// (redirection vers le controlleur Index en entrée)
        		'viewgraphics' => [
        				'type' => Literal::class,
        				'options' => [
        						'route'    => '/viewgraphics',
        						'defaults' => [
        								'controller' => Controller\IndexController::class,
        								'action'     => 'index',
        						],
        				],
        		],
        		'stats-presence' => [
        				'type' => Literal::class,
        				'options' => [
        						'route'    => '/stats-presence',
        						'defaults' => [
        								'controller' => Controller\IndexController::class,
        								'action'     => 'index',
        						],
        				],
        		],
        		'viewplanning' => [
        				'type' => Literal::class,
        				'options' => [
        						'route'    => '/viewplanning',
        						'defaults' => [
        								'controller' => Controller\IndexController::class,
        								'action'     => 'index',
        						],
        				],
        		],
        		'accueil' => [
        				'type' => Literal::class,
        				'options' => [
        						'route'    => '/accueil',
        						'defaults' => [
        								'controller' => Controller\IndexController::class,
        								'action'     => 'index',
        						],
        				],
        		],
        		'edition' => [
        				'type' => Literal::class,
        				'options' => [
        						'route'    => '/edition',
        						'defaults' => [
        								'controller' => Controller\IndexController::class,
        								'action'     => 'index',
        						],
        				],
        		],
        		'groupes-salles' => [
        				'type' => Literal::class,
        				'options' => [
        						'route'    => '/groupes-salles',
        						'defaults' => [
        								'controller' => Controller\IndexController::class,
        								'action'     => 'index',
        						],
        				],
        		],
        		'hyper-planning' => [
        				'type' => Literal::class,
        				'options' => [
        						'route'    => '/hyper-planning',
        						'defaults' => [
        								'controller' => Controller\IndexController::class,
        								'action'     => 'index',
        						],
        				],
        		],
        		'saisie-fiches' => [
        				'type' => Literal::class,
        				'options' => [
        						'route'    => '/saisie-fiches',
        						'defaults' => [
        								'controller' => Controller\IndexController::class,
        								'action'     => 'index',
        						],
        				],
        		],
        		'export' => [
        				'type' => Literal::class,
        				'options' => [
        						'route'    => '/export',
        						'defaults' => [
        								'controller' => Controller\IndexController::class,
        								'action'     => 'index',
        						],
        				],
        		],
            'adminusers' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/adminusers',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
            'suivi' => [
                'type' => Literal::class,
                'options' => [
                    'route'    => '/suivi',
                    'defaults' => [
                        'controller' => Controller\IndexController::class,
                        'action'     => 'index',
                    ],
                ],
            ],
        ],
    ],
    'controllers' => [
        'factories' => [
            //Controller\IndexController::class => InvokableFactory::class,
           // Service\PresenceServiceController::class => InvokableFactory::class,
        ],
    ],
    'view_manager' => [
        'display_not_found_reason' => true,
        'display_exceptions'       => true,
        'doctype'                  => 'HTML5',
        'not_found_template'       => 'error/404',
        'exception_template'       => 'error/index',
        'template_map' => [
            'layout/layout'           => __DIR__ . '/../view/layout/layout.phtml',
            'application/index/index' => __DIR__ . '/../view/application/index/index.phtml',
            'error/404'               => __DIR__ . '/../view/error/404.phtml',
            'error/index'             => __DIR__ . '/../view/error/index.phtml',
        ],
        'template_path_stack' => [
            __DIR__ . '/../view',
        ],
    	'strategies' => [
    				'ViewJsonStrategy',
    		],
    ],
];
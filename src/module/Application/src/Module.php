<?php

/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */
namespace Application;

use Presence\Model\Presence;
use Presence\Model\PresenceTable;
use Application\Model\Favoris;
use Application\Model\FavorisTable;
use Application\Model\Lot;
use Application\Model\LotTable;
use Application\Model\User;
use Application\Model\UserTable;
use Application\Model\Cours;
use Application\Model\CoursTable;
use Application\Model\Salle;
use Application\Model\SalleTable;
use Application\Model\GroupeSalle;
use Application\Model\GroupeSalleTable;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\TableGateway\TableGateway;
use Zend\Db\Adapter\AdapterInterface;
use Zend\Authentication\AuthenticationService;
use Zend\Mvc\MvcEvent;
use Zend\View\Model\ViewModel;
use Zend\View\Resolver\TemplateMapResolver;
use Zend\View\Renderer\PhpRenderer;

class Module {
	const VERSION = '3.0.2dev';
	private $auth;
	
	// if (!$this->authservice->hasIdentity())
	// return $ctrl->redirect()->toRoute('login');
	public function onBootstrap(MvcEvent $mvcEvent) {
		
		/** @var AuthService $authService */
		$container = $mvcEvent->getApplication ()->getServiceManager ()->get ('AuthService');
		if ($container->hasIdentity() ||
				($mvcEvent->getParam('request')->getRequestUri() == '/login') ||
				($mvcEvent->getParam('request')->getRequestUri() == '/login//authenticate') ||
				($mvcEvent->getParam('request')->getRequestUri() == '/authenticate'))
			//	strpos($mvcEvent->getParam('request')->getRequestUri(),'authenticate') ||
			//	strpos($mvcEvent->getParam('request')->getRequestUri(),'login')) 
		{ 
			// utilisateur authentifié ou en cours d'authentification
		}
		else
		{ 
			
			//  Assuming your login route has a name 'login', this will do the assembly
			// (you can also use directly $url=/path/to/login)
			$url = $mvcEvent->getRouter()->assemble(array(), array('name' => 'login'));
			$response=$mvcEvent->getResponse();
			$response->getHeaders()->addHeaderLine('Location', $url);
			$response->setStatusCode(302);
			$response->sendHeaders();
			// When an MvcEvent Listener returns a Response object,
			// It automatically short-circuit the Application running
			// -> true only for Route Event propagation see Zend\Mvc\Application::run
			
			// To avoid additional processing
			// we can attach a listener for Event Route with a high priority
			$stopCallBack = function($event) use ($response){
				$event->stopPropagation();
				return $response;
			};
			//Attach the "break" as a listener with a high priority
			$mvcEvent->getApplication()->getEventManager()->attach(MvcEvent::EVENT_ROUTE, $stopCallBack,-10000);
			return $response;
			
		}

	}
	public function getConfig() {
		return include __DIR__ . '/../config/module.config.php';
	}
	public function getServiceConfig() {
		return [ 
				'factories' => [ 
						'Application\Model\AuthStorage' => function ($container) {
							return new \Application\Model\AuthStorage ( 'hyper' );
						},
						'AuthService' => function ($container) {
							$authService = new AuthenticationService ();
							$authService->setStorage ( $container->get ( 'Application\Model\AuthStorage' ) );
							return $authService;
						},
						\Presence\Model\PresenceTable::class => function ($container) {
							$tableGateway = $container->get ( '\Presence\Model\PresenceTableGateway' );
							
							return new \Presence\Model\PresenceTable ( $tableGateway );
						},
						'\Presence\Model\PresenceTableGateway' => function ($container) {
							$dbAdapter = $container->get ( AdapterInterface::class );
							$resultSetPrototype = new ResultSet ();
							$resultSetPrototype->setArrayObjectPrototype ( new Presence () );
							
							return new TableGateway ( 'presence', $dbAdapter, null, $resultSetPrototype );
						},
						\Application\Model\GroupeSalleTable::class => function ($container) {
							$tableGateway = $container->get ( '\Application\Model\GroupeSalleTableGateway' );
							
							return new \Application\Model\GroupeSalleTable ( $tableGateway );
						},
						'\Application\Model\GroupeSalleTableGateway' => function ($container) {
							$dbAdapter = $container->get ( AdapterInterface::class );
							$resultSetPrototype = new ResultSet ();
							$resultSetPrototype->setArrayObjectPrototype ( new GroupeSalle () );
							
							return new TableGateway ( 'groupesalle', $dbAdapter, null, $resultSetPrototype );
						},
						\Application\Model\SalleTable::class => function ($container) {
							$tableGateway = $container->get ( '\Application\Model\SalleTableGateway' );
							
							return new \Application\Model\SalleTable ( $tableGateway );
						},
						'\Application\Model\SalleTableGateway' => function ($container) {
							$dbAdapter = $container->get ( AdapterInterface::class );
							$resultSetPrototype = new ResultSet ();
							$resultSetPrototype->setArrayObjectPrototype ( new Salle () );
							
							return new TableGateway ( 'salle', $dbAdapter, null, $resultSetPrototype );
						},
						\Application\Model\CoursTable::class => function ($container) {
							$tableGateway = $container->get ( '\Application\Model\CoursTableGateway' );
							
							return new \Application\Model\CoursTable ( $tableGateway );
						},
						'\Application\Model\CoursTableGateway' => function ($container) {
							$dbAdapter = $container->get ( AdapterInterface::class );
							$resultSetPrototype = new ResultSet ();
							$resultSetPrototype->setArrayObjectPrototype ( new Cours () );
							
							return new TableGateway ( 'cours', $dbAdapter, null, $resultSetPrototype );
						},
						\Application\Model\LotTable::class => function ($container) {
							$tableGateway = $container->get ( '\Application\Model\LotTableGateway' );
							
							return new \Application\Model\LotTable ( $tableGateway );
						},
						'\Application\Model\LotTableGateway' => function ($container) {
							$dbAdapter = $container->get ( AdapterInterface::class );
							$resultSetPrototype = new ResultSet ();
							$resultSetPrototype->setArrayObjectPrototype ( new Lot () );
							
							return new TableGateway ( 'lot', $dbAdapter, null, $resultSetPrototype );
						},
						\Application\Model\UserTable::class => function ($container) {
							$tableGateway = $container->get ( '\Application\Model\UserTableGateway' );
							
							return new \Application\Model\UserTable ( $tableGateway );
						},
						'\Application\Model\UserTableGateway' => function ($container) {
							$dbAdapter = $container->get ( AdapterInterface::class );
							$resultSetPrototype = new ResultSet ();
							$resultSetPrototype->setArrayObjectPrototype ( new User () );
							
							return new TableGateway ( 'auth_user', $dbAdapter, null, $resultSetPrototype );
						},
						\Application\Model\FavorisTable::class => function ($container) {
							$tableGateway = $container->get ( '\Application\Model\FavorisTableGateway' );
								
							return new \Application\Model\FavorisTable ( $tableGateway );
						},
						'\Application\Model\FavorisTableGateway' => function ($container) {
						$dbAdapter = $container->get ( AdapterInterface::class );
						$resultSetPrototype = new ResultSet ();
						$resultSetPrototype->setArrayObjectPrototype ( new Favoris () );
							
						return new TableGateway ( 'favoris', $dbAdapter, null, $resultSetPrototype );
						}
				] 
		];
	}
	public function getControllerConfig() {
		return [ 
				'factories' => [ 
						Service\PresenceServiceController::class => function ($container) {
							return new Service\PresenceServiceController ( $container->get ( \Presence\Model\PresenceTable::class ),
									$container->get ( \Application\Model\CoursTable::class ));
						},
						Service\SalleServiceController::class => function ($container) {
							return new Service\SalleServiceController ( $container->get ( \Application\Model\SalleTable::class ) );
						},
						Service\GroupeSalleServiceController::class => function ($container) {
							return new Service\GroupeSalleServiceController ( $container->get ( \Application\Model\GroupeSalleTable::class ) );
						},
						Service\CoursServiceController::class => function ($container) {
							return new Service\CoursServiceController ( $container->get ( \Application\Model\CoursTable::class ) );
						},
						Service\LotServiceController::class => function ($container) {
							return new Service\LotServiceController ( $container->get ( \Application\Model\LotTable::class ) );
						},
						Service\FavorisServiceController::class => function ($container) {
							return new Service\FavorisServiceController ( $container->get ( \Application\Model\FavorisTable::class ) );
						},
						Service\HyperServiceController::class => function ($container) {
							return new Service\HyperServiceController ( $container->get ( \Application\Model\CoursTable::class ) );
						},
						Service\LdapServiceController::class => function ($container) {
							return new Service\LdapServiceController ();
						},
						Service\UserServiceController::class => function ($container) {
						    return new Service\UserServiceController ( $container->get ( \Application\Model\UserTable::class ) );
						},
						Controller\IndexController::class => function ($container) {
							return new Controller\IndexController ( $container->
									get ( \Application\Model\CoursTable::class ), 
									$container->get ( \Application\Model\SalleTable::class ), 
									$container->get ( \Application\Model\GroupeSalleTable::class ), 
									$container->get ( \Presence\Model\PresenceTable::class ), 
									$container->get ( \Application\Model\LotTable::class ), 
									$container->get ( \Application\Model\UserTable::class ), 
									$container->get ( 'AuthService' ) );
						} 
				] 
		];
	}
}

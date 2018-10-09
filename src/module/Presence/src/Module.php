<?php

namespace Presence;

use Presence\Model\Presence;
use Presence\Model\PresenceTable;
use Zend\Db\Adapter\Adapter;
use Zend\Db\Adapter\AdapterInterface;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\TableGateway\TableGateway;
use Zend\ModuleManager\Feature\ConfigProviderInterface;
use Application\Model\CoursTable;
use Application\Model\Cours;
use Application\Model\SalleTable;
use Application\Model\Salle;

class Module implements ConfigProviderInterface
{
    
    public function getConfig()
    {
        return include __DIR__ . '/../config/module.config.php';
    }

    public function getServiceConfig()
    {
        return [
            'factories' => [
                Model\PresenceTable::class        => function ($container) {
                    $tableGateway = $container->get('Model\PresenceTableGateway');

                    return new Model\PresenceTable($tableGateway);
                },
                'Model\PresenceTableGateway' => function ($container) {
                    $dbAdapter          = $container->get(AdapterInterface::class);
                    $resultSetPrototype = new ResultSet();
                    $resultSetPrototype->setArrayObjectPrototype(new Model\Presence());

                    return new TableGateway('presence', $dbAdapter, null, $resultSetPrototype);
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
            ],
        ];
    }

    public function getControllerConfig()
    {
        return [
            'factories' => [
                Controller\PresenceController::class => function ($container) {
                    return new Controller\PresenceController(
                        $container->get(Model\PresenceTable::class),
                    	$container->get ( \Application\Model\CoursTable::class ),
                        $container->get ( \Application\Model\SalleTable::class )
                    );
                },
            ],
        ];
    }
    
}

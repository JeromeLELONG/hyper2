<?php

namespace Application\Service;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use Zend\Ldap\Ldap;
use Zend\Session\Container;

class LdapServiceController extends AbstractActionController {
	private $config;
	
	public function __construct() {
	}
	
	public function indexAction() {
	    $data = array ();
	    $donneessupp = array ();
	    $ldapOptions = $this->getConfig ( 'ldap' );
	    $ldap = new Ldap ( $ldapOptions ['server'] );
	    $ldap->bind ();
	    if($this->params()->fromQuery('username') !== null)
	    {
	        $result = $ldap->search ( '(&(uid=' . $this->params ()->fromQuery ( 'username' ) . '))', $ldapOptions ['server'] ['baseDn'], Ldap::SEARCH_SCOPE_SUB );
	        foreach ( $result->toArray () as $enseignant ) {
	            $data['username'] = $enseignant ['uid'] [0];
	            $data['nom'] = $enseignant ['sn'] [0];
	            $data['prenom'] = $enseignant ['givenname'] [0];
	            if(array_key_exists("codeservice",$enseignant))
	               $data['service'] = $enseignant ['codeservice'] [0];
	            else
	                $data['service'] = "";
	            if(array_key_exists("lecnamnet-mail",$enseignant))
	               $data['email'] = $enseignant ['lecnamnet-mail'] [0];
	            else 
	                $data['email'] = "";
	            
	        }
	        return new JsonModel ( array (
	            "username" => array_key_exists('username',$data)?$data['username']:'',
	            "nom" => array_key_exists('nom',$data)?$data['nom']:'',
	            "prenom" => array_key_exists('prenom',$data)?$data['prenom']:'',
	            "service" => array_key_exists('service',$data)?$data['service']:'',
	            "email" => array_key_exists('email',$data)?$data['email']:'',
	        ) );
	    }
	    

		if (strlen ( $this->params ()->fromQuery ( 'nom' ) ) > 1) {
			$result = $ldap->search ( '(&(sn=*' . $this->params ()->fromQuery ( 'nom' ) . '*))', $ldapOptions ['server'] ['baseDn'], Ldap::SEARCH_SCOPE_SUB );
			$i = 0;
			foreach ( $result->toArray () as $enseignant ) {
				//$data [] = array ("nom_enseignant" => $enseignant ['sn'] [0] . " " . $enseignant ['givenname'] [0]);
			    if($this->params()->fromQuery('uid') !== null)
			        $data [] = $enseignant ['uid'] [0]." - ".$enseignant ['sn'] [0] . " " . $enseignant ['givenname'] [0];
			    else
			    $data [] = $enseignant ['sn'] [0] . " " . $enseignant ['givenname'] [0];
				if(array_key_exists('casecourrier', $enseignant))
				    $casecourrier = $enseignant ['casecourrier'] [0];
				else
				    $casecourrier = "";
				    $donneessupp [] = array('nom' => $enseignant ['sn'] [0] . " " . $enseignant ['givenname'] [0], 'casecourrier' => $casecourrier);
				if($i++ == 15) break;
			}
		}
		return new JsonModel ( array (
				"results" => $data,
		        "donneessupp" => $donneessupp,
				"status" => "OK" 
		) );
	}
	
	public function getConfig($entry = null) {
		if (! $this->config) {
			$this->config = $this->event->getParam ( 'application' )->getConfig ();
		}
		
		if ($entry)
			return $this->config [$entry];
		return $this->config;
	}
	
	public function donneesConnexionAction()
	{
		$session = new Container('admin');
		$login = $session->offsetGet("login");
		$role = $session->offsetGet("role");
		$donneesLdap = $session->offsetGet('donneesLdap');
		$donneesLdapResponse = (object) ['acl' => $donneesLdap->acl ,
				'casecourrier' => $donneesLdap->casecourrier,
				'civilite' => $donneesLdap->civilite,
				'cn' => $donneesLdap->cn,
				'fullname' => $donneesLdap->fullname,
				'mail' => $donneesLdap->mail,
				'uid' => $donneesLdap->uid,
		    'role' => $role,
		];
		return new JsonModel(array($donneesLdapResponse));
	}
	
	public function getLogger()
	{
		$writer = new Stream($this->getConfig('logPath'));
		$logger = new Logger();
		return $logger->addWriter($writer);
	}
	
}

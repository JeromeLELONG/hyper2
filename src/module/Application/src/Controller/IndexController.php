<?php
/**
 * @link      http://github.com/zendframework/ZendSkeletonApplication for the canonical source repository
 * @copyright Copyright (c) 2005-2016 Zend Technologies USA Inc. (http://www.zend.com)
 * @license   http://framework.zend.com/license/new-bsd New BSD License
 */
namespace Application\Controller;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\Http\Client\Adapter\Curl;
use Zend\Http\Client;
use Zend\View\Model\ViewModel;
use Application\Form\ChargementCoursForm;
use Application\Model\Cours;
use Application\Model\CoursTable;
use Application\Model\Salle;
use Application\Model\SalleTable;
use Application\Model\GroupeSalle;
use Application\Model\GroupeSalleTable;
use Application\Model\Lot;
use Application\Model\LotTable;
use Application\Model\User;
use Application\Model\UserTable;
use Presence\Model\Presence;
use Presence\Model\PresenceTable;
use Zend\Validator\File\Size;
use Zend\Session\Container;
use ZendPdf\PdfDocument;
use ZendPdf\Font;
use ZendPdf\Image;
use HTML2PDF;
use Zff\Html2Pdf\View\Model\Html2PdfModel;
use Zend\View\Model\JsonModel;
use Zend\Ldap\Ldap;
use Zend\Ldap\Filter;
use Zend\Authentication\Adapter\Ldap as AuthAdapter;
use Zend\Log\Logger;
use Application\Form\Login;
use Zend\Authentication\AuthenticationService;
use Zend\Log\Writer\Stream;
use Zend\Authentication\Adapter\DbTable as DbAuthAdapter;
use Zend\Db\Adapter\Adapter as DbAdapter;
class IndexController extends AbstractActionController
{
	private $config;
	protected $coursTable;
	protected $salleTable;
	protected $groupeSalleTable;
	protected $presenceTable;
	protected $lotTable;
	protected $loginForm;
	protected $storage;
	protected $authservice;
	protected $userTable;
	
	public function __construct(CoursTable $table, SalleTable $salletable,GroupeSalleTable $groupesalletable,
			PresenceTable $presencetable,LotTable $lottable,UserTable $usertable,AuthenticationService $authService)
	{
		$this->coursTable = $table;
		$this->salleTable = $salletable;
		$this->groupeSalleTable = $groupesalletable;
		$this->presenceTable = $presencetable;
		$this->lotTable = $lottable;
		$this->userTable = $usertable;
		$this->authservice = $authService;
	}
	
    public function indexAction()
    {
    	$this->assertAuth($this);
    	$cuser = new Container('user');
    	$this->layout()->setVariable('user', $cuser->user);
    	return new ViewModel();
    }
    
   public function majDesSallesHPAction()
   { 
   	$result = new JsonModel();
   	$result = $this->forward()->dispatch(\Application\Service\HyperServiceController::class, array(
            'action' => 'getSalles',
        ));
   	$listeSallesHP = $result->getVariables();
   	$this->salleTable->truncateSalle();
   	$salle = new Salle();
   	foreach ($listeSallesHP as $salleHP)
   	{
   		$salle->nom = $salleHP['nom'];
   		$salle->famille = $salleHP['famille'];
   		$salle->capa = $salleHP['capa'];
   		$salle->nbocc = $salleHP['nbocc'];
   		$salle->occ = $salleHP['occ'];
   		$salle->prop = $salleHP['prop'];
   		$salle->code = $salleHP['code'];
   		$salle->numero = $salleHP['numero'];
   		// Supprimer les entrées ne correspondant pas à des salles
   		if(!(substr($salle->code,0,2) == "VP") && !(substr($salle->code,0,2) == "TV") &&  !(substr($salle->code,0,8) == "Enceinte") && $salle->code)
   		$this->salleTable->saveSalle($salle);
   	}
   }
    
    public function chargementcoursAction()
    {
    	ini_set('memory_limit', '512M');
    	set_time_limit(160);
    	// Chargement du fichier des cours dans la base
    	$form = new ChargementCoursForm('chargementcours');
    	if ($this->getRequest()->isPost()) {
    		// Postback
    		$data = array_merge_recursive(
    				$this->getRequest()->getPost()->toArray(),
    				$this->getRequest()->getFiles()->toArray()
    				);
    	
    		$form->setData($data);
    		if ($form->isValid()) {
    			$cours = new Cours();
    			$file = gzopen($form->getData()['file']['tmp_name'],"r");
    			$this->getCoursTable()->DropPrimaryKey();
    			//$this->getCoursTable()->setLatin1();
    			$this->getCoursTable()->truncateCours();
    			$this->getCoursTable()->LoadCours();
    			
    			/*
    			// Traitement sans utiliser LOAD DATA
    			$nb = 0;
    			//while (!feof($file) ) 
    			while (!gzeof($file)) {
    				//$buffer = fgets($file, 4096);
    				$buffer = gzgets($file, 4096);
    				
    				$buffer = trim($buffer);
    				if($nb++ != 0)
    				if($buffer != "")
    				{
    					$buffer=trim($buffer);
    					//$buffer=utf8_encode($buffer);
    					$liste = explode( ";",$buffer);
    					$cours->numero = $liste[0];
    					$cours->duree = $liste[1];
    					$cours->cumul = $liste[2];
    					$cours->ddebut = $liste[3];
    					$cours->dfin = $liste[4];
    					$cours->nbsem = $liste[5];
    					$cours->jour = $liste[6];
    					$cours->hdebut = $liste[7];
    					$cours->hfin = $liste[8];
    					$cours->type = $liste[9];
    					$cours->codemat = $liste[10];
    					$cours->matiere = $liste[11];
    					$cours->enseignant = $liste[12];
    					$cours->codeenseignant = $liste[13];
    					$cours->codediplome = $liste[14];
    					$cours->libdiplome = $liste[15];
    					$cours->codelibdiplome = $liste[16];
    					$cours->codesalle = $liste[17];
    					//$cours->salle = $liste[18];
    					$cours->pond = $liste[18];
    					$cours->prop = $liste[19];
    					$cours->memo = $liste[20];
    					$cours->date_modif = $liste[21];
    					$this->getCoursTable()->saveCours($cours);
    				}
    			}
    			*/
    			
    			$this->getCoursTable()->traitementCoursTable();
    			gzclose($file);
    		}
    	}
    	
    	return array('form' => $form);
    }
    public function getCoursTable() {
    	return $this->coursTable;
    }
    
    public function loginAction()
    {
    	$session = new Container('admin');
    	$auth = $this->getAuthService();
    	if ($auth->hasIdentity() && $session->offsetExists('login')) {
    		return $this->redirect()->toRoute('app');
    	}
    	$form = $this->getForm();
    	return array(
    			'form' => $form,
    			'messages' => $this->flashmessenger()->getMessages()
    	);
    }
    
    public function getLogger()
    {
    	$writer = new Stream($this->getConfig('logPath'));
    	$logger = new Logger();
    	return $logger->addWriter($writer);
    }
    
    public function authenticateAction()
    {
    	$form = $this->getForm();
    	$redirect = 'login';
    	//$user = new UserService();
    	$request = $this->getRequest();
    	if ($request->isPost() || $request->isXmlHttpRequest()) {
  		if ($request->isXmlHttpRequest()){ // If it's ajax call
    			$this->getLogger()->info('DEBUT ' . $request->getPost('username') . ' tente de se connecter par XmlHttpRequest! ');
    			$username = $request->getPost('username');
    		}
    		$this->getLogger()->info('DEBUT ' . $request->getPost('username') . ' tente de se connecter ! ');
    		$form->setData($request->getPost());
    		if ($form->isValid()) {
    			$this->getLogger()->info('1/4 ' . $request->getPost('username') . ' tente via LDAP ! ');
    			if($request->getPost('username') == 'exploit')
    			{
    				$this->getLogger()->info('2/4 ' . $request->getPost('username') . ' s\'est connecté. ');
    				$DbAuthAdapter = new DbAuthAdapter($this->coursTable->getAdapter(),
    						'auth_user',
    						'username',
    						'password'
    						);
    				$DbAuthAdapter
    				->setIdentity($request->getPost('username'))
    				->setCredential($request->getPost('password'));
    				$auth = $this->getAuthService();
    				$result = $auth->authenticate($DbAuthAdapter);
    				$redirect = 'home';
    				$session = new Container('admin');
    				$session->offsetSet('login', $request->getPost('username'));
    				return $this->redirect()->toRoute($redirect);
    			}
    			try {
    				$ldapOptions = $this->getConfig('ldap');
    				$auth = $this->getAuthService();
    				//$this->flashMessenger()->addMessage(\Zend\Debug\Debug::dump($ldapOptions));
    				$authAdapter = new AuthAdapter(array('server1' => $ldapOptions['server']), $request->getPost('username'), $request->getPost('password'));
					$result = $auth->authenticate($authAdapter);
    				//$this->flashMessenger()->addMessage(\Zend\Debug\Debug::dump($result));
    			} catch (Exception $e) {
    				$this->flashMessenger()->addMessage("Login ou mot de passe incorrect !");
				}
				
    			if($this->userTable->UserExists($request->getPost('username')) == true)
    				if ($result->isValid()) {
    					$this->getLogger()->info('2/4 ' . $request->getPost('username') . ' s\'est connecté via LDAP ! ');
    					$ldapUser = $authAdapter->getAccountObject();
    					$credentials = $this->userTable->getUser($request->getPost('username'));
    					$redirect = 'app';
    					$session = new Container('admin');
    					$session->offsetSet('login', $request->getPost('username'));
    					$session->offsetSet('donneesLdap', $ldapUser);
    					$session->offsetSet('role', $credentials->role);
    				}
    			if($this->userTable->UserExists($request->getPost('username')) == false)
    				if($result->isValid())
    				{
    					$this->flashMessenger()->addMessage("Vous n'êtes pas autorisé à vous connecter sur cette partie");
    					$this->getLogger()->info("FIN " . $request->getPost('username') . " n'est pas autorisé");
    					return $this->redirect()->toRoute('login');
    				}
    			else
    			{
    				$this->flashMessenger()->addMessage("Login ou mot de passe incorrect !");
    				$this->getLogger()->info("FIN " . $request->getPost('username') . " n'a pas été trouvé ou a saisi un mot de passe incorrect");
    				return $this->redirect()->toRoute('login');
    			}
    
    		}
    	}
    	return $this->redirect()->toRoute($redirect);
    }
    
    protected function getAuthService()
    {
    	$app = $this->getEvent()->getApplication();
    	$this->authservice = $app->getServiceManager()->get('AuthService');
    	if (!$this->authservice) {
    		$app = $this->getEvent()->getApplication();
    		$this->authservice = $app->getServiceManager()->get('AuthService');
    	}
    	return $this->authservice;
    }
    
    protected function getForm()
    {
    	if (!$this->loginForm)
    		$this->loginForm = new Login();
    
    		return $this->loginForm;
    }
    
    public function logoutAction()
    {
    	$this->getSessionStorage()->forgetMe();
    	$this->getAuthService()->clearIdentity();
    	$cuser = new Container('user');
    	$cuser->getManager()->destroy();
    	$this->flashmessenger()->addMessage("Vous avez été déconnecté");
    	return $this->redirect()->toRoute('login');
    }
    
    protected function getSessionStorage()
    {
    	if (!$this->storage) {
    		$app = $this->getEvent()->getApplication();
    		$this->storage = $app->getServiceManager()->get('Application\Model\AuthStorage');
    	}
    
    	return $this->storage;
    }
    
    public function getConfig($entry = null)
    {
    	if (!$this->config) {
    		$this->config = $this->event->getParam('application')->getConfig();
    	}
    
    	if ($entry)
    		return $this->config[$entry];
    		return $this->config;
    }
    
    protected function assertAuth($ctrl)
    {	
    	if (!$this->authservice->hasIdentity())
    		return $ctrl->redirect()->toRoute('login');
    }
}
<?php

namespace Application\Model;

use Zend\Authentication\Storage;

class AuthStorage extends Storage\Session
{
    public function setRememberMe($rememberMe = 1, $time = 20)
    {
        
        if ($rememberMe == 1) {
            $sessionManager = $this->session->getManager();
            $config = $sessionManager->getConfig();
//            var_dump($config);
            if (!$config->getUseCookies()) {
                return;
            }

            $config->setCookieLifetime($time);

            if ($sessionManager->sessionExists()) {                
                $sessionManager->regenerateId(false);
            }
        }
    }
    
    public function forgetMe()
    {
        $this->session->getManager()->forgetMe();
        $this->session->getManager()->destroy();
    }    
}
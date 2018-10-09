<?php

namespace Application\Form;

use Zend\Form\Form;

class Login extends Form
{

    public function __construct()
    {
        parent::__construct('LoginForm', null);

        $this->add(array(
            'name' => 'username',
            'type' => 'Text',
            'required' => true,
            'options' => array(
                'label' => 'Login *',
            ),
            'attributes' => array(
        				'class' => 'form-control',
                        'id' => 'username',
            		),
        ));

        $this->add(array(
            'name' => 'password',
            'type' => 'Password',
            'required' => true,
            'options' => array(
                'label' => 'Mot de passe *',
            ),
        		'attributes' => array(
        				'class' => 'form-control',
                        'id' => 'password',
        		),
        ));
        
        $this->add(array(
            'name' => 'submit',
            'attributes' => array(
                'type' => 'Submit',
                'value' =>  'Connexion',
                'class' => 'btn btn-primary input-shadow',
                'onmouseover' => 'changeButton();',
                'onmouseout' => 'resetButton();',
                'style' => 'margin:auto;display:block;margin-top: 15px;',
                'id' => 'loginbtn',
            ),
        ));
    }
}
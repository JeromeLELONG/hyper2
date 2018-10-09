<?php

namespace Application\Form;

use Zend\Form\Form;

class UserForm extends Form
{
    public function __construct($name = null)
    {
        // We will ignore the name provided to the constructor
        parent::__construct('salle');

        $this->add([
            'name' => 'username',
            'type' => 'text',
        		'options' => [
        				'label' => 'Identifiant',
        		],
        ]);
        $this->add([
            'name'    => 'password',
            'type'    => 'text',
            'options' => [
                'label' => 'Mot de passe',
            ],
        ]);
        $this->add([
        		'name'    => 'service',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Service',
        		],
        ]);
        $this->add([
        		'name'    => 'nom',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Nom',
        		],
        ]);
        $this->add([
        		'name'    => 'prenom',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Prénom',
        		],
        ]);
        $this->add([
        		'name'    => 'email',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Email',
        		],
        ]);
        $this->add([
        		'name'    => 'role',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Rôle',
        		],
        ]);
       
      
    }
}

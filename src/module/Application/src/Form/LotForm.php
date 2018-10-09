<?php

namespace Application\Form;

use Zend\Form\Form;

class LotForm extends Form
{
    public function __construct($name = null)
    {
        // We will ignore the name provided to the constructor
        parent::__construct('lot');

        $this->add([
            'name' => 'id',
            'type' => 'text',
        		'options' => [
        				'label' => 'Identifiant',
        		],
        ]);
        $this->add([
            'name'    => 'nolot',
            'type'    => 'text',
            'options' => [
                'label' => 'Numéro de lot',
            ],
        ]);
        $this->add([
        		'name'    => 'nofiche',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Numéro de fiche',
        		],
        ]);
        $this->add([
        		'name'    => 'username',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Identifiant Utilisateur',
        		],
        ]);
    }
}

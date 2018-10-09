<?php

namespace Application\Form;

use Zend\Form\Form;

class SalleForm extends Form
{
    public function __construct($name = null)
    {
        // We will ignore the name provided to the constructor
        parent::__construct('salle');

        $this->add([
            'name' => 'id',
            'type' => 'text',
        		'options' => [
        				'label' => 'Identifiant',
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
        		'name'    => 'famille',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Famille',
        		],
        ]);
        $this->add([
        		'name'    => 'capa',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Capacité',
        		],
        ]);
        $this->add([
        		'name'    => 'nbocc',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Nombre occupé',
        		],
        ]);
        $this->add([
        		'name'    => 'occ',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Taux d\'occupation',
        		],
        ]);
        $this->add([
        		'name'    => 'prop',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Propriétaire',
        		],
        ]);
        $this->add([
        		'name'    => 'code',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Code de la salle',
        		],
        ]);
        $this->add([
        		'name'    => 'prop',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Numéro',
        		],
        ]);
      
    }
}

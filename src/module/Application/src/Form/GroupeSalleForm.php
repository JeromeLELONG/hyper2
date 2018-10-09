<?php

namespace Application\Form;

use Zend\Form\Form;

class GroupeSalleForm extends Form
{
    public function __construct($name = null)
    {
        // We will ignore the name provided to the constructor
        parent::__construct('groupesalle');

        $this->add([
            'name' => 'code',
            'type' => 'text',
        		'options' => [
        				'label' => 'Code',
        		],
        ]);
        $this->add([
            'name'    => 'num_groupe',
            'type'    => 'text',
            'options' => [
                'label' => 'Numéro de groupe',
            ],
        ]);
        $this->add([
        		'name'    => 'lib_groupe',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Libellé du groupe de salle',
        		],
        ]);
        $this->add([
        		'name'    => 'lib_groupe_long',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Libellé du groupe de salle (long)',
        		],
        ]);
        $this->add([
        		'name'    => 'id_groupe_salle',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Identifiant',
        		],
        ]);
    }
}

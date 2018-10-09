<?php

namespace Application\Form;

use Zend\Form\Form;

class CoursForm extends Form
{
    public function __construct($name = null)
    {
        // We will ignore the name provided to the constructor
        parent::__construct('album');

        $this->add([
            'name' => 'numero',
            'type' => 'text',
        		'options' => [
        				'label' => 'Numéro',
        		],
        ]);
        $this->add([
            'name'    => 'id',
            'type'    => 'text',
            'options' => [
                'label' => 'Identifiant',
            ],
        ]);
        $this->add([
            'name'    => 'duree',
            'type'    => 'text',
            'options' => [
                'label' => 'Durée',
            ],
        ]);
        $this->add([
        		'name'    => 'cumul',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Cumul',
        		],
        ]);
        $this->add([
        		'name'    => 'ddebut',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Date de début',
        		],
        ]);
        $this->add([
        		'name'    => 'dfin',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Date de fin',
        		],
        ]);
        $this->add([
        		'name'    => 'nbsem',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Nombre de semaine',
        		],
        ]);
        $this->add([
        		'name'    => 'jour',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Jour de la semaine',
        		],
        ]);
        $this->add([
        		'name'    => 'hdebut',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Heure de début',
        		],
        ]);
        $this->add([
        		'name'    => 'hfin',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Heure de fin',
        		],
        ]);
        $this->add([
        		'name'    => 'type',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Type de cours',
        		],
        ]);
        $this->add([
        		'name'    => 'codemat',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Code matière',
        		],
        ]);
        $this->add([
        		'name'    => 'matiere',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Matière',
        		],
        ]);
        $this->add([
        		'name'    => 'enseignant',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Enseignant',
        		],
        ]);
        $this->add([
        		'name'    => 'codeenseignant',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Code enseignant',
        		],
        ]);
        $this->add([
        		'name'    => 'codediplome',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Code diplôme',
        		],
        ]);
        $this->add([
        		'name'    => 'libdiplome',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Libellé diplôme',
        		],
        ]);
        $this->add([
        		'name'    => 'codelibdiplome',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Code libellé de diplôme',
        		],
        ]);
        $this->add([
        		'name'    => 'codesalle',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Code Salle',
        		],
        ]);
        $this->add([
        		'name'    => 'salle',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Salle',
        		],
        ]);
        $this->add([
        		'name'    => 'pond',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Pondération',
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
        		'name'    => 'memo',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Mémo',
        		],
        ]);
        $this->add([
        		'name'    => 'date_modif',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Date de modification',
        		],
        ]);
        $this->add([
            'name'       => 'submit',
            'type'       => 'submit',
            'attributes' => [
                'value' => 'Go',
                'id'    => 'submitbutton',
            ],
        ]);
    }
}

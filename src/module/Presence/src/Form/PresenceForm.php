<?php

namespace Presence\Form;

use Zend\Form\Form;

class PresenceForm extends Form
{
    public function __construct($name = null)
    {
        // We will ignore the name provided to the constructor
        parent::__construct('presence');

        $this->add([
            'name' => 'nolot',
            'type' => 'hidden',
        ]);
        
        $this->add([
            'name'    => 'nofiche',
            'type'    => 'text',
            'options' => [
                'label' => 'Numéro de fiche',
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
        		'name'    => 'dateraw',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Date timestamp',
        		],
        ]);
        $this->add([
        		'name'    => 'datesem',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Date',
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
        		'name'    => 'codesalle',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Code de la salle',
        		],
        ]);
        $this->add([
        		'name'    => 'codeue',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Code de l\'UE',
        		],
        ]);
        $this->add([
        		'name'    => 'codepole',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Code du pôle',
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
        		'name'    => 'enseignant',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Enseignant',
        		],
        ]);
        $this->add([
        		'name'    => 'appariteur',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Appariteur',
        		],
        ]);
        $this->add([
        		'name'    => 'rem_ens',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Remarque Enseignant',
        		],
        ]);
        $this->add([
        		'name'    => 'rem_app',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Remarque Appariteur',
        		],
        ]);
        $this->add([
        		'name'    => 'nbpresents',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Nombre de présents',
        		],
        ]);
        $this->add([
        		'name'    => 'chaire',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Chaire',
        		],
        ]);
        $this->add([
        		'name'    => 'valide',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Etat de la fiche',
        		],
        ]);
        $this->add([
        		'name'    => 'type',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Type de réservation',
        		],
        ]);
        $this->add([
        		'name'    => 'groupe',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Groupe de rattachement',
        		],
        ]);
        $this->add([
        		'name'    => 'annule',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Témoin d\'annulation',
        		],
        ]);
        $this->add([
        		'name'    => 'hdebut_reel',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Heure de début réelle',
        		],
        ]);
        $this->add([
        		'name'    => 'hfin_reel',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Heure de fin réelle',
        		],
        ]);
        $this->add([
        		'name'    => 'datefichier',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Heure de la base de données lors de l\'édition',
        		],
        ]);
        $this->add([
        		'name'    => 'video',
        		'type'    => 'text',
        		'options' => [
        				'label' => 'Vidéoprojecteur',
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

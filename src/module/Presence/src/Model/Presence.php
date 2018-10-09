<?php

namespace Presence\Model;

use DomainException;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class Presence {
	public $nolot;
	public $nofiche;
	public $id;
	public $dateraw;
	public $datesem;
	public $hdebut;
	public $hfin;
	public $codesalle;
	public $codeue;
	public $codepole;
	public $jour;
	public $enseignant;
	public $appariteur;
	public $rem_ens;
	public $rem_app;
	public $nbpresents;
	public $chaire;
	public $valide;
	public $type;
	public $groupe;
	public $annule;
	public $hdebut_reel;
	public $hfin_reel;
	public $datefichier;
	public $video;
	private $inputFilter;
	public function exchangeArray(array $data) {
		$this->id = (! empty ( $data ['id'] )) ? $data ['id'] : null;
		$this->nolot = (! empty ( $data ['nolot'] )) ? $data ['nolot'] : null;
		$this->nofiche = (! empty ( $data ['nofiche'] )) ? $data ['nofiche'] : null;
		$this->dateraw = (! empty ( $data ['dateraw'] )) ? $data ['dateraw'] : null;
		$this->datesem = (! empty ( $data ['datesem'] )) ? $data ['datesem'] : null;
		$this->hdebut = (! empty ( $data ['hdebut'] )) ? $data ['hdebut'] : null;
		$this->hfin = (! empty ( $data ['hfin'] )) ? $data ['hfin'] : null;
		$this->hfin = (! empty ( $data ['hfin'] )) ? $data ['hfin'] : null;
		$this->codesalle = (! empty ( $data ['codesalle'] )) ? $data ['codesalle'] : null;
		$this->codeue = (! empty ( $data ['codeue'] )) ? $data ['codeue'] : null;
		$this->codepole = (! empty ( $data ['codepole'] )) ? $data ['codepole'] : null;
		$this->jour = (! empty ( $data ['jour'] )) ? $data ['jour'] : null;
		$this->enseignant = (! empty ( $data ['enseignant'] )) ? $data ['enseignant'] : null;
		$this->appariteur = (! empty ( $data ['appariteur'] )) ? $data ['appariteur'] : null;
		$this->rem_ens = (! empty ( $data ['rem_ens'] )) ? $data ['rem_ens'] : null;
		$this->rem_app = (! empty ( $data ['rem_app'] )) ? $data ['rem_app'] : null;
		$this->nbpresents = (! empty ( $data ['nbpresents'] )) ? $data ['nbpresents'] : null;
		$this->chaire = (! empty ( $data ['chaire'] )) ? $data ['chaire'] : null;
		$this->valide = (! empty ( $data ['valide'] )) ? $data ['valide'] : null;
		$this->type = (! empty ( $data ['type'] )) ? $data ['type'] : null;
		$this->groupe = (! empty ( $data ['groupe'] )) ? $data ['groupe'] : null;
		$this->annule = (! empty ( $data ['annule'] )) ? $data ['annule'] : null;
		$this->hdebut_reel = (! empty ( $data ['hdebut_reel'] )) ? $data ['hdebut_reel'] : null;
		$this->hfin_reel = (! empty ( $data ['hfin_reel'] )) ? $data ['hfin_reel'] : null;
		$this->datefichier = (! empty ( $data ['datefichier'] )) ? $data ['datefichier'] : null;
		$this->video = (! empty ( $data ['video'] )) ? $data ['video'] : null;
	}
	public function getArrayCopy() {
		return [ 
				'nolot' => $this->nolot,
				'nofiche' => $this->nofiche,
				'id' => $this->id,
				'dateraw' => $this->dateraw,
				'datesem' => $this->datesem,
				'hdebut' => $this->hdebut,
				'hfin' => $this->hfin,
				'codesalle' => $this->codesalle,
				'codeue' => $this->codeue,
				'codepole' => $this->codepole,
				'jour' => $this->jour,
				'enseignant' => $this->enseignant,
				'appariteur' => $this->appariteur,
				'rem_ens' => $this->rem_ens,
				'rem_app' => $this->rem_app,
				'nbpresents' => $this->nbpresents,
				'chaire' => $this->chaire,
				'valide' => $this->valide,
				'type' => $this->type,
				'groupe' => $this->groupe,
				'annule' => $this->annule,
				'hdebut_reel' => $this->hdebut_reel,
				'hfin_reel' => $this->hfin_reel,
				'datefichier' => $this->datefichier,
				'video' => $this->video
		];
	}
	public function getArrayISOCopy() {
		return [
				'nolot' => utf8_decode($this->nolot),
				'nofiche' => utf8_decode($this->nofiche),
				'id' => utf8_decode($this->id),
				'dateraw' => utf8_decode($this->dateraw),
				'datesem' => utf8_decode($this->datesem),
				'hdebut' => utf8_decode($this->hdebut),
				'hfin' => utf8_decode($this->hfin),
				'codesalle' => utf8_decode($this->codesalle),
				'codeue' => utf8_decode($this->codeue),
				'codepole' => utf8_decode($this->codepole),
				'jour' => utf8_decode($this->jour),
				'enseignant' => utf8_decode($this->enseignant),
				'appariteur' => utf8_decode($this->appariteur),
				'rem_ens' => utf8_decode($this->rem_ens),
				'rem_app' => utf8_decode($this->rem_app),
				'nbpresents' => utf8_decode($this->nbpresents),
				'chaire' => utf8_decode($this->chaire),
				'valide' => utf8_decode($this->valide),
				'type' => utf8_decode($this->type),
				'groupe' => utf8_decode($this->groupe),
				'annule' => utf8_decode($this->annule),
				'hdebut_reel' => utf8_decode($this->hdebut_reel),
				'hfin_reel' => utf8_decode($this->hfin_reel),
				'datefichier' => utf8_decode($this->datefichier),
				'video' => utf8_decode($this->video)
		];
	}
	public function setInputFilter(InputFilterInterface $inputFilter) {
		throw new DomainException ( sprintf ( '%s does not allow injection of an alternate input filter', __CLASS__ ) );
	}
	public function getInputFilter() {
		if ($this->inputFilter) {
			return $this->inputFilter;
		}
		
		$inputFilter = new InputFilter ();
		
		$inputFilter->add ( [ 
				'name' => 'nolot',
				'required' => false,
				'filters' => [ 
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [ 
						[ 'name' => 'StringLength',
						  'options' => [ 'encoding' => 'UTF-8',
										  'min' => 1,
										  'max' => 6 ] ] 
				] 
		] );
		
		$inputFilter->add ( [ 
				'name' => 'nofiche',
				'required' => false,
				'filters' => [ 
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim'] 
				],
				'validators' => [ 
						[ 'name' => 'StringLength',
						  'options' => [ 'encoding' => 'UTF-8',
										  'min' => 1,
										  'max' => 10 ] ] 
				] 
		] );
		
		$inputFilter->add ( [ 
				'name' => 'id',
				'required' => true,
				'filters' => [ 
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [ 
						[ 'name' => 'StringLength',
						  'options' => [ 'encoding' => 'UTF-8',
										 'min' => 1,
										 'max' => 128 ] ] 
				] 
		] );
		
		$inputFilter->add ( [
				'name' => 'dateraw',
				'required' => true,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 20 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'datesem',
				'required' => true,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 20 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'hdebut',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 20 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'hfin',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 20 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'codesalle',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 30 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'codeue',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 40 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'codepole',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 40 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'jour',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 20 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'enseignant',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 40 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'appariteur',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 40 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'rem_ens',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 200 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'rem_app',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 200 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'nbpresents',
				'required' => false,
				'filters'  => array(
						array('name' => 'Int'),
				),
		] );
		$inputFilter->add ( [
				'name' => 'chaire',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'valide',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 1 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'type',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'groupe',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 65 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'annule',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 1 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'hdebut_reel',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'hfin_reel',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'datefichier',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		$inputFilter->add ( [
				'name' => 'video',
				'required' => false,
				'filters' => [
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim']],
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 'encoding' => 'UTF-8',
										'min' => 1,
										'max' => 16 ] ]
				]
		] );
		
		$this->inputFilter = $inputFilter;
		
		return $this->inputFilter;
	}
}

<?php

namespace Application\Model;

use DomainException;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class Cours {
	public $numero;
	public $id;
	public $duree;
	public $cumul;
	public $ddebut;
	public $dfin;
	public $nbsem;
	public $jour;
	public $hdebut;
	public $hfin;
	public $type;
	public $codemat;
	public $matiere;
	public $enseignant;
	public $codeenseignant;
	public $codediplome;
	public $libdiplome;
	public $codesalle;
	public $salle;
	public $pond;
	public $prop;
	public $memo;
	public $date_modif;
	private $inputFilter;
	public function exchangeArray(array $data) {
		$this->numero = (! empty ( $data ['numero'] )) ? $data ['numero'] : null;
		$this->id = (! empty ( $data ['id'] )) ? $data ['id'] : null;
		$this->duree = (! empty ( $data ['duree'] )) ? $data ['duree'] : null;
		$this->cumul = (! empty ( $data ['cumul'] )) ? $data ['cumul'] : null;
		$this->ddebut = (! empty ( $data ['ddebut'] )) ? $data ['ddebut'] : null;
		$this->dfin = (! empty ( $data ['dfin'] )) ? $data ['dfin'] : null;
		$this->nbsem = (! empty ( $data ['nbsem'] )) ? $data ['nbsem'] : null;
		$this->jour = (! empty ( $data ['jour'] )) ? $data ['jour'] : null;
		$this->hdebut = (! empty ( $data ['hdebut'] )) ? $data ['hdebut'] : null;
		$this->hfin = (! empty ( $data ['hfin'] )) ? $data ['hfin'] : null;
		$this->type = (! empty ( $data ['type'] )) ? $data ['type'] : null;
		$this->codemat = (! empty ( $data ['codemat'] )) ? $data ['codemat'] : null;
		$this->matiere = (! empty ( $data ['matiere'] )) ? $data ['matiere'] : null;
		$this->enseignant = (! empty ( $data ['enseignant'] )) ? $data ['enseignant'] : null;
		$this->codeenseignant = (! empty ( $data ['codeenseignant'] )) ? $data ['codeenseignant'] : null;
		$this->codediplome = (! empty ( $data ['codediplome'] )) ? $data ['codediplome'] : null;
		$this->libdiplome = (! empty ( $data ['libdiplome'] )) ? $data ['libdiplome'] : null;
		$this->codesalle = (! empty ( $data ['codesalle'] )) ? $data ['codesalle'] : null;
		$this->salle = (! empty ( $data ['salle'] )) ? $data ['salle'] : null;
		$this->pond = (! empty ( $data ['pond'] )) ? $data ['pond'] : null;
		$this->prop = (! empty ( $data ['prop'] )) ? $data ['prop'] : null;
		$this->memo = (! empty ( $data ['memo'] )) ? $data ['memo'] : null;
		$this->date_modif = (! empty ( $data ['date_modif'] )) ? $data ['date_modif'] : null;
	}
	public function getArrayCopy() {
		return [ 
				'numero' => $this->numero,
				'id' => $this->id,
				'duree' => $this->duree,
				'cumul' => $this->cumul,
				'ddebut' => $this->ddebut,
				'dfin' => $this->dfin,
				'nbsem' => $this->nbsem,
				'jour' => $this->jour,
				'hdebut' => $this->hdebut,
				'hfin' => $this->hfin,
				'type' => $this->type,
				'codemat' => $this->codemat,
				'matiere' => $this->matiere,
				'enseignant' => $this->enseignant,
				'codeenseignant' => $this->codeenseignant,
				'codediplome' => $this->codediplome,
				'libdiplome' => $this->libdiplome,
				'codesalle' => $this->codesalle,
				'salle' => $this->salle,
				'pond' => $this->pond,
				'prop' => $this->prop,
				'memo' => $this->memo,
				'date_modif' => $this->date_modif,
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
				'name' => 'numero',
				'required' => false,
				'validators' => [ 
						[ 'name' => 'StringLength',
						  'options' => [ 
										  'min' => 1,
										  'max' => 128 ] ] 
				] 
		] );
		
		$inputFilter->add ( [ 
				'name' => 'id',
				'required' => true,
				'validators' => [ 
						[ 'name' => 'StringLength',
						  'options' => [ 
										  'min' => 1,
										  'max' => 128 ] ] 
				] 
		] );
		
		$inputFilter->add ( [ 
				'name' => 'duree',
				'required' => false,
				'validators' => [ 
						[ 'name' => 'StringLength',
						  'options' => [ 
										 'min' => 1,
										 'max' => 128 ] ] 
				] 
		] );
		
		$inputFilter->add ( [
				'name' => 'cumul',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'ddebut',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'dfin',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'nbsem',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'jour',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'hdebut',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'hfin',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'type',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'codemat',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'matiere',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'enseignant',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'codeenseignant',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'codediplome',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'libdiplome',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		

		
		$inputFilter->add ( [
				'name' => 'codesalle',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'salle',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'pond',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'prop',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'memo',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'date_modif',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [ 
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		
		$this->inputFilter = $inputFilter;
		
		return $this->inputFilter;
	}
}

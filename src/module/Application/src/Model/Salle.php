<?php

namespace Application\Model;

use DomainException;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class Salle {
	public $id;
	public $nom;
	public $famille;
	public $capa;
	public $nbocc;
	public $occ;
	public $prop;
	public $code;
	public $numero;
	private $inputFilter;
	public function exchangeArray(array $data) {
		$this->id = (! empty ( $data ['id'] )) ? $data ['id'] : null;
		$this->nom = (! empty ( $data ['nom'] )) ? $data ['nom'] : null;
		$this->famille = (! empty ( $data ['famille'] )) ? $data ['famille'] : null;
		$this->capa = (! empty ( $data ['capa'] )) ? $data ['capa'] : null;
		$this->nbocc = (! empty ( $data ['nbocc'] )) ? $data ['nbocc'] : null;
		$this->occ = (! empty ( $data ['occ'] )) ? $data ['occ'] : null;
		$this->prop = (! empty ( $data ['prop'] )) ? $data ['prop'] : null;
		$this->code = (! empty ( $data ['code'] )) ? $data ['code'] : null;
		$this->numero = (! empty ( $data ['numero'] )) ? $data ['numero'] : null;
	}
	public function getArrayCopy() {
		return [
				'id' => $this->id,
				'nom' => $this->nom,
				'famille' => $this->famille,
				'capa' => $this->capa,
				'nbocc' => $this->nbocc,
				'occ' => $this->occ,
				'prop' => $this->prop,
				'code' => $this->code,
				'numero' => $this->numero,
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
				'name' => 'id',
				'required' => true,
				'filters'  => array(
						array('name' => 'Int'),
				),
		] );
		
		$inputFilter->add ( [
				'name' => 'nom',
				'required' => true,
				'validators' => [
						[ 'name' => 'StringLength',
						  'options' => [
						  		'min' => 1,
						  		'max' => 128 ] ]
				]
		] );

		$inputFilter->add ( [
				'name' => 'famille',
				'required' => true,
				'validators' => [
						[ 'name' => 'StringLength',
						  'options' => [
						  		'min' => 1,
						  		'max' => 128 ] ]
				]
		] );

		$inputFilter->add ( [
				'name' => 'capa',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
						  'options' => [
						  		'min' => 1,
						  		'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'nbocc',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'occ',
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
				'name' => 'code',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [
										'min' => 1,
										'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'numero',
				'required' => false,
				'filters'  => array(
						array('name' => 'Int'),
				),
		] );



		$this->inputFilter = $inputFilter;

		return $this->inputFilter;
	}
}

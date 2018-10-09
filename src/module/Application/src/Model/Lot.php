<?php

namespace Application\Model;

use DomainException;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class Lot {
	public $nolot;
	public $nofiche;
	public $id;
	public $heure_edition;
	public $username;
	public $groupe;
	private $inputFilter;
	public function exchangeArray(array $data) {
		$this->nolot = (! empty ( $data ['nolot'] )) ? $data ['nolot'] : null;
		$this->nofiche = (! empty ( $data ['nofiche'] )) ? $data ['nofiche'] : null;
		$this->id = (! empty ( $data ['id'] )) ? $data ['id'] : null;
		$this->heure_edition = (! empty ( $data ['heure_edition'] )) ? $data ['heure_edition'] : null;
		$this->username = (! empty ( $data ['username'] )) ? $data ['username'] : null;
		$this->groupe = (! empty ( $data ['groupe'] )) ? $data ['groupe'] : null;
	}
	public function getArrayCopy() {
		return [ 
				'nolot' => $this->nolot,
				'nofiche' => $this->nofiche,
				'id' => $this->id,
				'heure_edition' => $this->heure_edition,
				'username' => $this->username,
		        'groupe' => $this->groupe,
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
				'filters'  => array(
						array('name' => 'Int'),
				),
		] );
		
		$inputFilter->add ( [ 
				'name' => 'nofiche',
				'required' => false,
				'filters'  => array(
						array('name' => 'Int'),
				),
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
				'name' => 'heure_edition',
				'required' => false,

		] );
		
		$inputFilter->add ( [
				'name' => 'username',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [
										'min' => 1,
										'max' => 40 ] ]
				]
		] );
		
		$inputFilter->add ( [
		    'name' => 'groupe',
		    'required' => false,
		    'validators' => [
		        [ 'name' => 'StringLength',
		            'options' => [
		                'min' => 1,
		                'max' => 40 ] ]
		    ]
		] );
		
		$this->inputFilter = $inputFilter;
		
		return $this->inputFilter;
	}
}

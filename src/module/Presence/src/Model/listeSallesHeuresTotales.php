<?php

namespace Presence\Model;

use DomainException;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class listeSallesHeuresTotales {
	public $nombreHeures;
	public $codesalle;
	
	private $inputFilter;
	public function exchangeArray(array $data) {
		$this->nombreHeures = (! empty ( $data ['nombreHeures'] )) ? $data ['nombreHeures'] : null;
		$this->codesalle = (! empty ( $data ['codesalle'] )) ? $data ['codesalle'] : null;
	}
	public function getArrayCopy() {
		return [ 
				'nombreHeures' => $this->nombreHeures,
				'codesalle' => $this->codesalle,
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
				'name' => 'nombreHeures',
				'required' => false,
				'filters'  => array(
						array('name' => 'Int'),
				),
		] );
		
		$inputFilter->add ( [ 
				'name' => 'codesalle',
				'required' => false,
				'filters' => [ 
						[ 'name' => 'StripTags' ],
						[ 'name' => 'StringTrim'] 
				],
				'validators' => [ 
						[ 'name' => 'StringLength',
						  'options' => [ 'encoding' => 'UTF-8',
										  'min' => 1,
										  'max' => 128 ] ] 
				] 
		] );
		
		
		$this->inputFilter = $inputFilter;
		
		return $this->inputFilter;
	}
}

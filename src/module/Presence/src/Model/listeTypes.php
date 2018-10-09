<?php

namespace Presence\Model;

use DomainException;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class listeTypes {
	public $nombre;
	public $type;
	
	private $inputFilter;
	public function exchangeArray(array $data) {
		$this->nombre = (! empty ( $data ['nombre'] )) ? $data ['nombre'] : null;
		$this->type = (! empty ( $data ['type'] )) ? $data ['type'] : null;
	}
	public function getArrayCopy() {
		return [ 
				'nombre' => $this->nombre,
				'type' => $this->type,
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
				'name' => 'nombre',
				'required' => false,
				'filters'  => array(
						array('name' => 'Int'),
				),
		] );
		
		$inputFilter->add ( [ 
				'name' => 'type',
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

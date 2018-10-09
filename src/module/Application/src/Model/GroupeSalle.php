<?php

namespace Application\Model;

use DomainException;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class GroupeSalle {
	public $code;
	public $num_groupe;
	public $lib_groupe;
	public $lib_groupe_long;
	public $id_groupesalle;
	private $inputFilter;
	
	public function exchangeArray(array $data) {
		$this->code = (! empty ( $data ['code'] )) ? $data ['code'] : null;
		$this->num_groupe = (! empty ( $data ['num_groupe'] )) ? $data ['num_groupe'] : null;
		$this->lib_groupe = (! empty ( $data ['lib_groupe'] )) ? $data ['lib_groupe'] : null;
		$this->lib_groupe_long = (! empty ( $data ['lib_groupe_long'] )) ? $data ['lib_groupe_long'] : null;
		$this->id_groupesalle = (! empty ( $data ['id_groupesalle'] )) ? $data ['id_groupesalle'] : null;

	}
	public function getArrayCopy() {
		return [
				'code' => $this->code,
				'num_groupe' => $this->num_groupe,
				'lib_groupe' => $this->lib_groupe,
				'lib_groupe_long' => $this->lib_groupe_long,
				'id_groupesalle' => $this->id_groupesalle,

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
				'name' => 'code',
				'required' => true,
				'validators' => [
						[ 'name' => 'StringLength',
						  'options' => [
						  		'min' => 1,
						  		'max' => 128 ] ]
				]
		] );

		$inputFilter->add ( [
				'name' => 'num_groupe',
				'required' => false,
				'filters'  => array(
						array('name' => 'Int'),
				),
		] );

		$inputFilter->add ( [
				'name' => 'lib_groupe',
				'required' => true,
				'validators' => [
						[ 'name' => 'StringLength',
						  'options' => [
						  		'min' => 1,
						  		'max' => 65 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'lib_groupe_long',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [
										'min' => 1,
										'max' => 65 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'id_groupesalle',
				'required' => false,
				'filters'  => array(
						array('name' => 'Int'),
				),
		] );




		$this->inputFilter = $inputFilter;

		return $this->inputFilter;
	}
}

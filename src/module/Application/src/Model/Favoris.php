<?php

namespace Application\Model;

use DomainException;
use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class Favoris {
	public $id_favoris;
	public $username;
	public $libelle;
	public $routerlink;
	public $params;
	private $inputFilter;
	public function exchangeArray(array $data) {
		$this->id_favoris = (! empty ( $data ['id_favoris'] )) ? $data ['id_favoris'] : null;
		$this->username = (! empty ( $data ['username'] )) ? $data ['username'] : null;
		$this->libelle = (! empty ( $data ['libelle'] )) ? $data ['libelle'] : null;
		$this->routerlink = (! empty ( $data ['routerlink'] )) ? $data ['routerlink'] : null;
		$this->params = (! empty ( $data ['params'] )) ? $data ['params'] : null;
	}
	public function getArrayCopy() {
		return [
				'id_favoris' => $this->id_favoris,
				'username' => $this->username,
				'libelle' => $this->libelle,
				'routerlink' => $this->routerlink,
				'params' => $this->params,
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
				'name' => 'id_favoris',
				'required' => true,
				'filters'  => array(
						array('name' => 'Int'),
				),
		] );
		
		$inputFilter->add ( [
				'name' => 'username',
				'required' => true,
				'validators' => [
						[ 'name' => 'StringLength',
						  'options' => [
						  		'min' => 1,
						  		'max' => 40 ] ]
				]
		] );

		$inputFilter->add ( [
				'name' => 'libelle',
				'required' => true,
				'validators' => [
						[ 'name' => 'StringLength',
						  'options' => [
						  		'min' => 1,
						  		'max' => 128 ] ]
				]
		] );

		$inputFilter->add ( [
				'name' => 'routerlink',
				'required' => true,
				'validators' => [
						[ 'name' => 'StringLength',
						  'options' => [
						  		'min' => 1,
						  		'max' => 128 ] ]
				]
		] );
		
		$inputFilter->add ( [
				'name' => 'params',
				'required' => false,
				'validators' => [
						[ 'name' => 'StringLength',
								'options' => [
										'min' => 1,
										'max' => 1024 ] ]
				]
		] );
		



		$this->inputFilter = $inputFilter;

		return $this->inputFilter;
	}
}

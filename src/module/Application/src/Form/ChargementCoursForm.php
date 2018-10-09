<?php

namespace Application\Form;

use Zend\Form\Form;
use Zend\Form\Element;
use Zend\InputFilter;

class ChargementCoursForm extends Form
{
	public function __construct($name = null, $options = array())
	{
		parent::__construct($name, $options);
		$this->addElements();
		$this->setInputFilter($this->createInputFilter());
	}
	
	public function addElements()
	{
		// File Input
		$file = new Element\File('file');
		$file
		->setLabel('Le fichier doit être au format gzip')
		->setAttributes(array(
				'id' => 'file',
		));
		$this->add($file);
	
	}
	
	public function createInputFilter()
	{
		$inputFilter = new InputFilter\InputFilter();
	
		// File Input
		$file = new InputFilter\FileInput('file');
		$file->setRequired(true);
		$file->getFilterChain()->attachByName(
				'filerenameupload',
				array(
						'target'          => '/tmp/',
						'overwrite'       => true,
						'use_upload_name' => true,
				)
				);
		$inputFilter->add($file);
	
	
		return $inputFilter;
	}
}

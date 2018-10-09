<?php

namespace Application\Model;

use Zend\InputFilter\InputFilter;
use Zend\InputFilter\InputFilterAwareInterface;
use Zend\InputFilter\InputFilterInterface;

class User implements InputFilterAwareInterface
{
    public $username;
    public $password;
    public $service;
    public $nom;
    public $prenom;
    public $email;
    public $role;
    protected $inputFilter;

    public function exchangeArray($data)
    {
        $this->username     = (!empty($data['username'])) ? $data['username'] : null;
        $this->password     = (!empty($data['password'])) ? $data['password'] : null;
        $this->service = (!empty($data['service'])) ? $data['service'] : null;
        $this->nom  = (!empty($data['nom'])) ? $data['nom'] : null;
        $this->prenom  = (!empty($data['prenom'])) ? $data['prenom'] : null;
        $this->email  = (!empty($data['email'])) ? $data['email'] : null;
        $this->role  = (!empty($data['role'])) ? $data['role'] : null;
    }

    public function setInputFilter(InputFilterInterface $inputFilter)
    {
        throw new \Exception("Not used");
    }

    public function getInputFilter()
    {
        if (!$this->inputFilter) {
            $inputFilter = new InputFilter();

            $inputFilter->add(array(
                'name'     => 'username',
                'required' => false,
                'filters'  => array(
                    array('name' => 'StripTags'),
                ),
                'validators' => array(
                    array(
                        'name'    => 'StringLength',
                        'options' => array(
                            'encoding' => 'UTF-8',
                            'min'      => 1,
                            'max'      => 40,
                        ),
                    ),
                ),
            ));

            $inputFilter->add(array(
            		'name'     => 'password',
            		'required' => false,
            		'filters'  => array(
            				array('name' => 'StripTags'),
            		),
            		'validators' => array(
            				array(
            						'name'    => 'StringLength',
            						'options' => array(
            								'encoding' => 'UTF-8',
            								'min'      => 1,
            								'max'      => 40,
            						),
            				),
            		),
            ));
            
            
            $inputFilter->add(array(
                'name'     => 'service',
                'required' => false,
                'filters'  => array(
                    array('name' => 'Int'),
                ),
            ));

            $inputFilter->add(array(
                'name'     => 'nom',
                'required' => false,
                'filters'  => array(
                    array('name' => 'StripTags'),
                    array('name' => 'StringTrim'),
                ),
                'validators' => array(
                    array(
                        'name'    => 'StringLength',
                        'options' => array(
                            'encoding' => 'UTF-8',
                            'min'      => 1,
                            'max'      => 40,
                        ),
                    ),
                ),
            ));
            
            $inputFilter->add(array(
                'name'     => 'prenom',
                'required' => false,
                'filters'  => array(
                    array('name' => 'StripTags'),
                    array('name' => 'StringTrim'),
                ),
                'validators' => array(
                    array(
                        'name'    => 'StringLength',
                        'options' => array(
                            'encoding' => 'UTF-8',
                            'min'      => 1,
                            'max'      => 40,
                        ),
                    ),
                ),
            ));
            
            $inputFilter->add(array(
                'name'     => 'email',
                'required' => false,
                'filters'  => array(
                    array('name' => 'StripTags'),
                    array('name' => 'StringTrim'),
                ),
                'validators' => array(
                    array(
                        'name'    => 'StringLength',
                        'options' => array(
                            'encoding' => 'UTF-8',
                            'min'      => 1,
                            'max'      => 250,
                        ),
                    ),
                ),
            ));
            
            $inputFilter->add(array(
                'name'     => 'role',
                'required' => false,
                'filters'  => array(
                    array('name' => 'StripTags'),
                    array('name' => 'StringTrim'),
                ),
                'validators' => array(
                    array(
                        'name'    => 'StringLength',
                        'options' => array(
                            'encoding' => 'UTF-8',
                            'min'      => 1,
                            'max'      => 40,
                        ),
                    ),
                ),
            ));

            $this->inputFilter = $inputFilter;
        }

        return $this->inputFilter;
    }
}
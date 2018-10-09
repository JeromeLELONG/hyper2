<?php

namespace Application\Model;

use RuntimeException;
use Zend\Db\TableGateway\TableGatewayInterface;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Sql;
use Zend\Db\TableGateway\TableGateway;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;
use Zend\Db\Sql\Expression;

class LotTable
{
    private $tableGateway;

    public function __construct(TableGatewayInterface $tableGateway)
    {
        $this->tableGateway = $tableGateway;
    }

    public function fetchAll($paginated = false)
    {
        if ($paginated) {
            return $this->fetchPaginatedResults();
        }

        return $this->tableGateway->select();
    }

    private function fetchPaginatedResults()
    {
        // Create a new Select object for the table:
        $select = new Select($this->tableGateway->getTable());

        // Create a new result set based on the Lot entity:
        $resultSetPrototype = new ResultSet();
        $resultSetPrototype->setArrayObjectPrototype(new Lot());

        // Create a new pagination adapter object:
        $paginatorAdapter = new DbSelect(
        // our configured select object:
            $select,
            // the adapter to run it against:
            $this->tableGateway->getAdapter(),
            // the result set to hydrate:
            $resultSetPrototype
        );

        $paginator = new Paginator($paginatorAdapter);

        return $paginator;
    }

    public function getLotAvecNumero($nolot)
    {
    	// Create a new Select object for the table:
    	$select = new Select($this->tableGateway->getTable());
    	$select->where(array('nolot' => $nolot))->order(array ('nofiche'));
    	// Create a new result set based on the Lot entity:
    	$resultSetPrototype = new ResultSet();
    	$resultSetPrototype->setArrayObjectPrototype(new Lot());
    
    	// Create a new pagination adapter object:
    	$paginatorAdapter = new DbSelect(
    			// our configured select object:
    			$select,
    			// the adapter to run it against:
    			$this->tableGateway->getAdapter(),
    			// the result set to hydrate:
    			$resultSetPrototype
    			);
    
    	$paginator = new Paginator($paginatorAdapter);
    
    	return $paginator;
    }
    
    public function getWithUsername($username)
    {
    	// Create a new Select object for the table:
    	$select = new Select($this->tableGateway->getTable());
    	$select->where(array('username' => $username));
    	// Create a new result set based on the Lot entity:
    	$resultSetPrototype = new ResultSet();
    	$resultSetPrototype->setArrayObjectPrototype(new Lot());
    
    	// Create a new pagination adapter object:
    	$paginatorAdapter = new DbSelect(
    			// our configured select object:
    			$select,
    			// the adapter to run it against:
    			$this->tableGateway->getAdapter(),
    			// the result set to hydrate:
    			$resultSetPrototype
    			);
    
    	$paginator = new Paginator($paginatorAdapter);
    
    	return $paginator;
    }
    
    public function getLot($id,$nolot)
    {
        $id     = $id;
        $rowset = $this->tableGateway->select(['id' => $id, 'nolot' => $nolot]);
        $row    = $rowset->current();
        if (!$row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %s',
                $id
            ));
        }

        return $row;
    }
    
    public function getFiche($id,$nolot,$nofiche)
    {
    	$rowset = $this->tableGateway->select(['id' => $id,
    			'nolot' => $nolot,
    			'nofiche' => $nofiche]
    			);
    	$row    = $rowset->current();
    	if (!$row) {
    		throw new RuntimeException(sprintf(
    				'Could not find row with identifier %s %s %s',
    				$id, $nolot, $nofiche
    				));
    	}
    
    	return $row;
    }

    public function saveLot(Lot $lot)
    {
        $data = [
            	'nolot' => $lot->nolot,
				'nofiche' => $lot->nofiche,
				'id' => $lot->id,
        		'username' => $lot->username,
        ];

        $id = $lot->id;

        if ($id == 0) {
            $this->tableGateway->insert($data);
            $id = $this->tableGateway->getLastInsertValue();
            return $id;
        }

        if (!$this->getLot($id)) {
            throw new RuntimeException(sprintf(
                'Cannot update lot with identifier %s; does not exist',
                $id
            ));
        }

        return $this->getFiche($lot->id,$lot->nolot,$lot->nofiche);
    }
    
    public function fetchFromListeID($listeID)
    {

    	//echo $selectGroupe->getSqlString();
    	// Create a new Select object for the table:
    	$select = new Select($this->tableGateway->getTable());
    	// Create a new result set based on the Cours entity:
    	$resultSetPrototype = new ResultSet();
    	$resultSetPrototype->setArrayObjectPrototype(new Lot());
    	$where = new \Zend\Db\Sql\Where();
    	$where->in('id',$listeID);
    	$select->where($where);

    		// Create a new pagination adapter object:
    		$paginatorAdapter = new DbSelect(
    				// our configured select object:
    				$select,
    				// the adapter to run it against:
    				$this->tableGateway->getAdapter(),
    				// the result set to hydrate:
    				$resultSetPrototype
    				);
    		 
    		$paginator = new Paginator($paginatorAdapter);
    		 
    		return $paginator;
    }
    
    public function getNouveauNumLot()
    {
    	$sql = new Sql($this->tableGateway->getAdapter());
    	$select = $this->tableGateway->getSql()->select();
    	$select->columns(array(
    			'nolot' => new Expression('MAX(nolot) + 1')
    	));
    	$resultSet = $this->tableGateway->selectWith($select);
    	$row = $resultSet->current();
    	return $row->nolot;
    }
    
    public function createFiche(Lot $lot)
    {
    	$data = [
    			'nolot' => $lot->nolot,
    			'nofiche' => $lot->nofiche,
    			'id' => $lot->id,
    			'heure_edition' => new \Zend\Db\Sql\Expression("NOW()"),
    			'username' => $lot->username,
    	        'groupe' => $lot->groupe,
    	];

    	$id = $lot->id;
    	$sql = new Sql($this->tableGateway->getAdapter());
    	$insert = $sql->insert('lot');
    	//$this->tableGateway->insert($data);
    	$insert->columns(array('id', 'nolot','nofiche','username','groupe'));
    	$insert->values($data);
    	//$selectString = $sql->buildSqlString($insert);
    	$statement = $sql->prepareStatementForSqlObject($insert);
    	
    	try {
    		$result = $statement->execute();
    		$entry = $this->getLot($id,$lot->nolot);
    		return $entry;
    	
    	} catch (\Exception $f) {
    		throw new RuntimeException(sprintf(
    				'Ne peut pas créer la fiche %s '.$f->getMessage(),
    				$id
    				));
    	}

    	return $id;

    }

    public function deleteLot($id)
    {
        $this->tableGateway->delete(['id' => $id]);
    }
    
    public function deleteFiche($id,$nolot,$nofiche)
    {
    	$this->tableGateway->delete(['id' => $id,'nolot' => $nolot, 'nofiche' => $nofiche]);
    }
    

}

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

class SalleTable
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

        // Create a new result set based on the Salle entity:
        $resultSetPrototype = new ResultSet();
        $resultSetPrototype->setArrayObjectPrototype(new Salle());

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

    public function getSallesDispos($num_groupe)
    {
    	$selectGroupe = new Select();
    	$selectGroupe->from('groupesalle')->columns(array('code'))->where->like('groupesalle.num_groupe',$num_groupe);
    	$selectGroupe->quantifier('DISTINCT');
    	//echo $selectGroupe->getSqlString();
    	// Create a new Select object for the table:
    	$select = new Select($this->tableGateway->getTable());
    	// Create a new result set based on the Cours entity:
    	$resultSetPrototype = new ResultSet();
    	$resultSetPrototype->setArrayObjectPrototype(new Salle());
    	$select->where->notIn('code',$selectGroupe);
    	$select->order(array ('code'));
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
    
    public function getSalle($id)
    {
        $id     = (int) $id;
        $rowset = $this->tableGateway->select(['id' => $id]);
        $row    = $rowset->current();
        if (!$row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function saveSalle(Salle $salle)
    {
        $data = [
				'id' => $salle->id,
        		'nom' => $salle->nom,
        		'famille' => $salle->famille,
        		'capa' => $salle->capa,
        		'nbocc'=> $salle->nbocc,
        		'occ' => $salle->occ,
        		'prop' => $salle->prop,
        		'code' => $salle->code,
        		'numero' => $salle->numero,
        ];
        $id = $salle->id;

        if ($id == 0) {
            $this->tableGateway->insert($data);
            $id = $this->tableGateway->getLastInsertValue();
            return $id;
        }

        if (!$this->getSalle($id)) {
            throw new RuntimeException(sprintf(
                'Cannot update salle with identifier %d; does not exist',
                $id
            ));
        }

        $this->tableGateway->update($data, ['id' => $id]);
        return $id;
    }

    public function deleteSalle($id)
    {
        $this->tableGateway->delete(['id' => $id]);
    }
    
    public function truncateSalle()
    {
    	$statement = $this->tableGateway->getAdapter()->createStatement('TRUNCATE TABLE '.$this->tableGateway->getTable());
    	$result = $statement->execute();
    }
    
    public function getCapacite($codeSalle)
    {
    	$sql = new Sql($this->tableGateway->getAdapter());
    	$select = $this->tableGateway->getSql()->select();
    	$select->columns(array(
    			'capa')
    	)->where->equalTo('code', $codeSalle);
    	$resultSet = $this->tableGateway->selectWith($select);
    	$row = $resultSet->current();
    	if($row)
    	return $row->capa;
    	else return 0;
    }

	
}

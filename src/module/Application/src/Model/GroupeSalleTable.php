<?php

namespace Application\Model;

use RuntimeException;
use Zend\Db\TableGateway\TableGatewayInterface;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Insert;
use Zend\Db\Sql\Sql;
use Zend\Db\Adapter\Adapter;
use Zend\Db\TableGateway\TableGateway;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;
use Zend\Db\Sql\Expression;

class GroupeSalleTable
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

        // Create a new result set based on the GroupeSalle entity:
        $resultSetPrototype = new ResultSet();
        $resultSetPrototype->setArrayObjectPrototype(new GroupeSalle());

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

    public function getGroupeDistinct()
    {
    	$sql = new Sql($this->tableGateway->getAdapter());
    	$select = $this->tableGateway->getSql()->select();
    	$select->quantifier('DISTINCT');
    	$select->columns(array('num_groupe','lib_groupe'));
    	$select->where->isNotNull('lib_groupe');
    	$select->order(array ('lib_groupe'));
    	$resultSet = $this->tableGateway->selectWith($select);
    	return $resultSet;
    }

    public function getSallesAffectees($num_groupe)
    {
    	$sql = new Sql($this->tableGateway->getAdapter());
    	$select = $this->tableGateway->getSql()->select();
    	$select->quantifier('DISTINCT');
    	$select->columns(array('code','id_groupesalle'));
    	$select->where(array('num_groupe' => $num_groupe));
    	$select->order(array ('code'));
    	$resultSet = $this->tableGateway->selectWith($select);
    	return $resultSet;
    }
    
    public function getNouveauNumGroupe()
    {
    	$sql = new Sql($this->tableGateway->getAdapter());
    	$select = $this->tableGateway->getSql()->select();
    	$select->columns(array(
    			'num_groupe' => new Expression('MAX(num_groupe) + 1')
    	));
    	$resultSet = $this->tableGateway->selectWith($select);
    	$row = $resultSet->current();
    	return $row->num_groupe;
    }
   
    
    public function getGroupeSalle($id)
    {
        $id     = (int) $id;
        $rowset = $this->tableGateway->select(['id_groupesalle' => $id]);
        $row    = $rowset->current();
        if (!$row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function getGroupeSalleCodeNum($code,$groupe)
    {
    	$rowset = $this->tableGateway->select(['code' => $code,'num_groupe' => $groupe]);
    	$row    = $rowset->current();
    	if (!$row) {
    		throw new RuntimeException(sprintf(
    				'Could not find row with identifier %s',$code
    				));
    	}
    
    	return $row;
    }
    
    public function saveGroupeSalle(GroupeSalle $groupesalle)
    {
        $data = [
            	'code' => $groupesalle->code,
        		'num_groupe' => $groupesalle->num_groupe,
        		'lib_groupe' => $groupesalle->lib_groupe,
        		'lib_groupe_long' => $groupesalle->lib_groupe_long,
        		'id_groupesalle' => $groupesalle->id_groupesalle,
        ];

        $id = $groupesalle->id_groupesalle;

        if ($id == 0) {
			if($groupesalle->num_groupe == 0)
        	{
        	$sql = new Sql($this->tableGateway->getAdapter());
        	$insert = $this->tableGateway->getSql()->insert();
        	$insert->into('groupesalle');
        	$insert->columns(array('code','num_groupe','lib_groupe','lib_groupe_long'));
        	$insert->values(array($groupesalle->code,$this->getNouveauNumGroupe(),
        			$groupesalle->lib_groupe,$groupesalle->lib_groupe_long));
        	$selectString = $sql->buildSqlString($insert,$this->tableGateway->getAdapter());
        	$results = $this->tableGateway->getAdapter()->query($selectString, Adapter::QUERY_MODE_EXECUTE);
        	$id = $this->tableGateway->adapter->getDriver()->getLastGeneratedValue();
             }
        	else
        	{
            $this->tableGateway->insert($data);
            $id = $this->tableGateway->getLastInsertValue();
        	}
            return $id;
        }

        if (!$this->getGroupeSalle($id)) {
            throw new RuntimeException(sprintf(
                'Cannot update groupesalle with identifier %d; does not exist',
                $id
            ));
        }

        $this->tableGateway->update($data, ['id' => $id]);
        return $id;
    }

    public function deleteGroupeSalle($id)
    {
        $this->tableGateway->delete(['id_groupesalle' => $id]);
    }
    
    public function deleteGroupeTotal($num_groupe)
    {
    	$this->tableGateway->delete(['num_groupe' => $num_groupe]);
    }
    
    
}

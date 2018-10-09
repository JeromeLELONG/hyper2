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

class FavorisTable
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
        $resultSetPrototype->setArrayObjectPrototype(new Favoris());

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

    
    public function getFavori($id)
    {
        $id     = (int) $id;
        $rowset = $this->tableGateway->select(['id_favoris' => $id]);
        $row    = $rowset->current();
        if (!$row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %d',
                $id
            ));
        }

        return $row;
    }

    public function saveFavori(Favoris $favoris)
    {
        $data = [
				'id_favoris' => $favoris->id_favoris,
        		'username' => $favoris->username,
        		'libelle' => $favoris->libelle,
        		'routerlink' => $favoris->routerlink,
        		'params'=> $favoris->params,
        ];
        $id = $favoris->id_favoris;

        if ($id == 0) {
            $this->tableGateway->insert($data);
            $id = $this->tableGateway->getLastInsertValue();
            return $id;
        }

        if (!$this->getFavori($id)) {
            throw new RuntimeException(sprintf(
                'Cannot update favoris with identifier %d; does not exist',
                $id
            ));
        }

        $this->tableGateway->update($data, ['id_favoris' => $id]);
        return $id;
    }

    public function deleteFavori($id)
    {
        $this->tableGateway->delete(['id_favoris' => $id]);
    }
    
    public function getWithUsername($username)
    {
    	// Create a new Select object for the table:
    	$select = new Select($this->tableGateway->getTable());
    	$select->where(array('username' => $username));
    	$resultSet = $this->tableGateway->selectWith($select);
    	return $resultSet;
    }

	
}

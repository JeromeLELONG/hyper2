<?php

namespace Presence\Model;

use RuntimeException;
use Zend\Db\TableGateway\TableGatewayInterface;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Expression;
use Zend\Db\Sql\Predicate;
use Zend\Db\Sql\Where;
use Zend\Db\Sql\Sql;
use Zend\Db\TableGateway\TableGateway;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;

class PresenceTable {
	private $tableGateway;
	public function __construct(TableGatewayInterface $tableGateway) {
		$this->tableGateway = $tableGateway;
	}
	public function fetchAll($paginated = false) {
		if ($paginated) {
			return $this->fetchPaginatedResults ();
		}
		
		return $this->tableGateway->select ();
	}
	private function fetchPaginatedResults() {
		// Create a new Select object for the table:
		$select = new Select ( $this->tableGateway->getTable () );
		
		// Create a new result set based on the Presence entity:
		$resultSetPrototype = new ResultSet ();
		$resultSetPrototype->setArrayObjectPrototype ( new Presence () );
		
		// Create a new pagination adapter object:
		$paginatorAdapter = new DbSelect ( 
				// our configured select object:
				$select, 
				// the adapter to run it against:
				$this->tableGateway->getAdapter (), 
				// the result set to hydrate:
				$resultSetPrototype );
		
		$paginator = new Paginator ( $paginatorAdapter );
		
		return $paginator;
	}
	public function getPresence($id) {
		$rowset = $this->tableGateway->select ( [ 
				'id' => $id 
		] );
		$row = $rowset->current ();
		if (! $row) {
			throw new RuntimeException ( sprintf ( 'Could not find row with identifier %s', $id ) );
		}

		return $row;
	}
	
	public function getListePresenceAvecDate($ddebut,$dfin,$listeSalles,$listeEnseignants,$listeMatieres)
	{
		// Transformation de la date HyperPlanning format dd/mm/YYYY vers YYYYmmdd
		$ddebut_modif = substr($ddebut,6,4).substr($ddebut,3,2).substr($ddebut,0,2);
		$dfin_modif = substr($dfin,6,4).substr($dfin,3,2).substr($dfin,0,2);
		$predicate = new Where();
		$sql = new Sql($this->tableGateway->getAdapter());
		$select = $this->tableGateway->getSql()->select();
		$where = new \Zend\Db\Sql\Where();
		$where->greaterThanOrEqualTo(
				new Expression("concat(substring(datesem,7,4),substring(datesem,4,2),substring(datesem,1,2))"), 
				$ddebut_modif)->AND->lessThanOrEqualTo(
				new Expression("concat(substring(datesem,7,4),substring(datesem,4,2),substring(datesem,1,2))"), 
				$dfin_modif);
		if(count($listeEnseignants) > 0)
					$where->AND->in('enseignant',$listeEnseignants);
		if(count($listeMatieres) > 0)
			$where->AND->in('codeue',$listeMatieres);
		if(count($listeSalles) > 0)
				$where->AND->in('codesalle',$listeSalles);
		$select->where($where)->order(array ('datesem'));
		$resultSet = $this->tableGateway->selectWith($select);
		return $resultSet;
	}
	
	public function getTauxOccupationAvecDate($ddebut,$dfin,$listeSalles)
	{
		/*
		select avg(((nbpresents/capa)*100)),codesalle,datesem from presence,salle where presence.codesalle = salle.code
		and concat(substring(datesem,7,4),substring(datesem,4,2),substring(datesem,1,2)) > '20170101'
		and concat(substring(datesem,7,4),substring(datesem,4,2),substring(datesem,1,2)) < '20170131'
		and codesalle='31.1.01'
		*/
		$ddebut_modif = substr($ddebut,6,4).substr($ddebut,3,2).substr($ddebut,0,2);
		$dfin_modif = substr($dfin,6,4).substr($dfin,3,2).substr($dfin,0,2);
		$predicate = new Where();
		$sql = new Sql($this->tableGateway->getAdapter());
		$select = $this->tableGateway->getSql()->select();
		$select->from('presence')->join('salle', 'presence.codesalle = salle.code')->columns(array(new Expression("avg(((nbpresents/capa)*100))"),'codesalle'));
		$where = new \Zend\Db\Sql\Where();
		$where->greaterThan(
				new Expression("concat(substring(datesem,7,4),substring(datesem,4,2),substring(datesem,1,2))"),
				$ddebut_modif)->AND->lessThanOrEqualTo(
						new Expression("concat(substring(datesem,7,4),substring(datesem,4,2),substring(datesem,1,2))"),
						$dfin_modif);
		$where->AND->in('codesalle',$listeSalles);
		$select->where($where)->order(array ('codesalle'));
		$resultSet = $this->tableGateway->selectWith($select);
		return $resultSet;
	}
	
	public function fetchFromListeID($listeID)
	{
		$predicate = new Where();
		$sql = new Sql($this->tableGateway->getAdapter());
		$select = $this->tableGateway->getSql()->select();
		$select->where->in('id', $listeID);
		$resultSet = $this->tableGateway->selectWith($select);
		return $resultSet;
	}
	
	public function ListeEnseignantsDistinct($search_motif)
	{
		$sql = new Sql($this->tableGateway->getAdapter());
		$select = $this->tableGateway->getSql()->select();
		$select->quantifier('DISTINCT');
		$select->columns(array('enseignant'));
		$select->where->like('enseignant', '%'.$search_motif.'%')->and->isNotNull('enseignant')->and->notEqualTo('enseignant','');
		$select->order(array ('enseignant'))->limit(20);
		$resultSet = $this->tableGateway->selectWith($select);
		return $resultSet;
	}
	
	public function ListeTypesSeances()
	{
		$sql = new Sql($this->tableGateway->getAdapter()); // Zend\Db\Sql\Sql
		$select = $this->tableGateway->getSql()->select();
		$select->columns(array(new Expression('count(*) as nombre'),'type'));
		$select->group('type');
		$select->order(array (new Expression('count(*) DESC')));
		$query = $sql->prepareStatementForSqlObject($select);
		$resutl = $query->execute();
		$resultSet = new ResultSet(); // Zend\Db\ResultSet\ResultSet
		$resultSet->setArrayObjectPrototype(new listeTypes());
		$resultSet->initialize($resutl);
		return $resultSet;
		
		
	}
	
	public function ListeSallesParNombreHeures($ddebut,$dfin,$groupe)
	{
		//select SUM(STR_TO_DATE(concat(substring(datesem,7,4),'/',substring(datesem,4,2),'/',substring(datesem,1,2),' ',substring(hfin,1,2),':',substring(hfin,4,2),':00'), '%Y/%m/%d %H:%i:%s')-
		//		STR_TO_DATE(concat(substring(datesem,7,4),'/',substring(datesem,4,2),'/',substring(datesem,1,2),' ',substring(hdebut,1,2),':',substring(hdebut,4,2),':00'), '%Y/%m/%d %H:%i:%s')) as nombreHeures,
		//		codesalle from presence group by codesalle order by nombreHeures DESC
		$selectGroupe = new Select();
		$selectGroupe->from('groupesalle')->columns(array('code'))->where->like('groupesalle.lib_groupe',$groupe);
		$selectGroupe->quantifier('DISTINCT');
		$where = new \Zend\Db\Sql\Where();
		$sql = new Sql($this->tableGateway->getAdapter()); // Zend\Db\Sql\Sql
		$select = $this->tableGateway->getSql()->select();
		$select->columns(array(new Expression("sum(time_to_sec(STR_TO_DATE(concat(substring(datesem,7,4),'/',substring(datesem,4,2),'/',substring(datesem,1,2),' ',substring(hfin,1,2),':',substring(hfin,4,2),':00'),
'%Y/%m/%d %H:%i:%s'))-
time_to_sec(STR_TO_DATE(concat(substring(datesem,7,4),'/',substring(datesem,4,2),'/',substring(datesem,1,2),' ',substring(hdebut,1,2),':',substring(hdebut,4,2),':00'), 
'%Y/%m/%d %H:%i:%s')))/3600  as nombreHeures"),'codesalle'));
		$ddebut_modif = substr($ddebut,6,4).substr($ddebut,3,2).substr($ddebut,0,2);
		$dfin_modif = substr($dfin,6,4).substr($dfin,3,2).substr($dfin,0,2);
		$where->greaterThan(
				new Expression("concat(substring(datesem,7,4),substring(datesem,4,2),substring(datesem,1,2))"),
				$ddebut_modif)->AND->lessThanOrEqualTo(
						new Expression("concat(substring(datesem,7,4),substring(datesem,4,2),substring(datesem,1,2))"),
						$dfin_modif);
		if($groupe != 'undefined' && $groupe != '(toutes les salles')
			$where->AND->in('codesalle',$selectGroupe);
		$select->where($where);
		$select->group('codesalle');
		$select->order(array (new Expression('nombreHeures DESC')));
		//echo $select->getSqlString();
		$query = $sql->prepareStatementForSqlObject($select);
		$resutl = $query->execute();
		$resultSet = new ResultSet();
		$resultSet->setArrayObjectPrototype(new listeSallesHeuresTotales());
		$resultSet->initialize($resutl);
		return $resultSet;
	}
	
	public function ListeMatieresDistinct($search_motif)
	{
		$sql = new Sql($this->tableGateway->getAdapter());
		$select = $this->tableGateway->getSql()->select();
		$select->quantifier('DISTINCT');
		$select->columns(array('codeue'));
		$select->where->like('codeue', '%'.$search_motif.'%');
		$select->order(array ('codeue'))->limit(20);
		$resultSet = $this->tableGateway->selectWith($select);
		return $resultSet;
	}
	
	public function savePresence(Presence $presence) {
        $data = [
            'nolot' => $presence->nolot,
            'nofiche'  => $presence->nofiche,
        	'id'  => $presence->id,
        	'dateraw'  => $presence->dateraw,
        	'datesem'  => $presence->datesem,
        	'hdebut'  => $presence->hdebut,
        	'hfin'  => $presence->hfin,
        	'codesalle'  => $presence->codesalle,
        	'codeue'  => $presence->codeue,
        	'codepole'  => $presence->codepole,
        	'jour'  => $presence->jour,
        	'enseignant'  => $presence->enseignant,
        	'appariteur'  => $presence->appariteur,
        	'rem_ens'  => $presence->rem_ens,
        	'rem_app'  => $presence->rem_app,
        	'nbpresents'  => $presence->nbpresents,
        	'chaire'  => $presence->chaire,
        	'valide'  => $presence->valide,
        	'type'  => $presence->type,
        	'groupe'  => $presence->groupe,
        	'annule'  => $presence->annule,
        	'hdebut_reel'  => $presence->hdebut_reel,
        	'hfin_reel'  => $presence->hfin_reel,
        	'datefichier'  => $presence->datefichier,
        	'video'  => $presence->video,
        ];
		$id =  $presence->id;
		
		try {
			$entry = $this->getPresence($id);
			if(isset($entry))
			{
				$this->tableGateway->update ( $data, [
						'id' => $id
				] );
				return $id;
			}

		} catch (\Exception $f) {
			$this->tableGateway->insert ( $data );
			$id = $this->tableGateway->getLastInsertValue ();
			return $id;
		}
		
		
		if (! $this->getPresence ( $id )) {
			throw new RuntimeException ( sprintf ( 'Cannot update presence with identifier %d; does not exist', $id ) );
		}
		

		return $id;
	}
	public function deletePresence($id) {
		$this->tableGateway->delete ( [ 
				'id' =>  $id 
		] );
	}
}

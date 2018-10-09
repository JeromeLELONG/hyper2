<?php

namespace Application\Model;

use RuntimeException;
use Zend\Db\TableGateway\TableGatewayInterface;
use Zend\Db\ResultSet\ResultSet;
use Zend\Db\Sql\Select;
use Zend\Db\Sql\Sql;
use Zend\Db\Sql\Predicate;
use Zend\Db\TableGateway\TableGateway;
use Zend\Paginator\Adapter\DbSelect;
use Zend\Paginator\Paginator;
use Zend\Db\Sql\Expression;
use Zend\Db\Sql\Combine;
use Zend\Db\Adapter\Driver\Pdo\Statement;

class CoursTable
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

        // Create a new result set based on the Cours entity:
        $resultSetPrototype = new ResultSet();
        $resultSetPrototype->setArrayObjectPrototype(new Cours());

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

    public function getCours($id)
    {
        $id     =  $id;
        $rowset = $this->tableGateway->select(['id' => $id]);
        $row    = $rowset->current();
        if (!$row) {
            throw new RuntimeException(sprintf(
                'Could not find row with identifier %s',
                $id
            ));
        }
        return $row;
    }

    public function ListeMatieresDistinct($search_motif)
    {
    	$sql = new Sql($this->tableGateway->getAdapter());
    	$select = $this->tableGateway->getSql()->select();
    	$select->quantifier('DISTINCT');
    	$select->columns(array('codemat'));
    	$select->where->like('codemat', '%'.$search_motif.'%');
    	$select->order(array ('codemat'))->limit(20);
    	$resultSetPrototype = new ResultSet();
    	$resultSetPrototype->setArrayObjectPrototype(new Cours());
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
    
    public function ListeEnseignantsDistinct($search_motif)
    {
    	$sql = new Sql($this->tableGateway->getAdapter());
    	$select = $this->tableGateway->getSql()->select();
    	$select->quantifier('DISTINCT');
    	$select->columns(array('enseignant'));
    	$select->where->like('enseignant', '%'.$search_motif.'%')->and->isNotNull('enseignant')->and->notEqualTo('enseignant','');
    	$select->order(array ('enseignant'))->limit(20);
    	$resultSetPrototype = new ResultSet();
    	$resultSetPrototype->setArrayObjectPrototype(new Cours());
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
    
    public function getCoursDateEtGroupe($date,$groupe,$trancheHoraire = 3)
    {
    	// $trancheHoraire : 1 -> journée
    	//					 2 -> soirée
    	//                   3 -> jour complet
    	$selectGroupe = new Select();
    	$selectGroupe->from('groupesalle')->columns(array('code'))->where->like('groupesalle.num_groupe',$groupe);
    	$selectGroupe->quantifier('DISTINCT');
    	//echo $selectGroupe->getSqlString();
    	// Create a new Select object for the table:
    	$select = new Select($this->tableGateway->getTable());
    	// Create a new result set based on the Cours entity:
    	$resultSetPrototype = new ResultSet();
    	$resultSetPrototype->setArrayObjectPrototype(new Cours());
    	$where = new \Zend\Db\Sql\Where();
    	if($groupe == '%')
    		$where->equalTo('ddebut', $date);
    	else
    		$where->equalTo('ddebut', $date)->AND->in('codesalle',$selectGroupe);
    	if($trancheHoraire == 1)
    	    $where->AND->lessThan(new Expression("cast(substring(hdebut,1,2) as unsigned)*100 + cast(substring(hdebut,4,5) as unsigned)"), 1630);
    	elseif($trancheHoraire == 2)
    	$where->AND->greaterThanOrEqualTo(new Expression("cast(substring(hdebut,1,2) as unsigned)*100 + cast(substring(hdebut,4,5) as unsigned)"), 1630);
    	$select->where($where)->order(array(new Expression('concat(substring(ddebut,7,4),substring(ddebut,4,2),substring(ddebut,1,2))'),
    			new Expression('concat(substring(hdebut,1,2),substring(hdebut,4,2))'),'codesalle'));
    	//echo $select->getSqlString();
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
    
    public function getMateriel($numero,$typemateriel)
    {
    	$sql = new Sql($this->tableGateway->getAdapter());
    	$select = $this->tableGateway->getSql()->select();
    	$select->where->equalTo(new Expression('SUBSTRING_INDEX(cours.numero, \'.\', 2)'), new Expression('SUBSTRING_INDEX(\''.$numero.'\', \'.\', 2)'))
    	->and->like('salle','%'.$typemateriel.'%');
    	$resultSet = $this->tableGateway->selectWith($select);
    	$row = $resultSet->current();
    	if($row)
    		return $row->salle;
    	else return "";
    }
    
    public function getRessourcesDateEtGroupe($date,$groupe,$search_motif,$trancheHoraire = 3)
    {
    	/*
    	SELECT * from cours WHERE
    	SUBSTRING_INDEX(cours.numero, '.', 2) IN (
    			SELECT SUBSTRING_INDEX(cours.numero, '.', 2) FROM cours
    			WHERE ddebut = '24/02/2017' AND codesalle IN
    			(SELECT DISTINCT groupesalle.code AS code FROM groupesalle
    					WHERE groupesalle.num_groupe LIKE '37') AND cast(substring(hdebut,1,2) as unsigned) < '17'
    			)
    			AND cours.salle like '%VP%'
    			UNION
    			SELECT * from cours WHERE
    			SUBSTRING_INDEX(cours.numero, '.', 2) IN (
    					SELECT SUBSTRING_INDEX(cours.numero, '.', 2) FROM cours
    					WHERE ddebut = '24/02/2017' AND codesalle IN
    					(SELECT DISTINCT groupesalle.code AS code FROM groupesalle
    							WHERE groupesalle.num_groupe LIKE '37') AND cast(substring(hdebut,1,2) as unsigned) < '17'
    					)
    					AND cours.salle like '%einte%'
    					UNION
    					SELECT * from cours WHERE
    					SUBSTRING_INDEX(cours.numero, '.', 2) IN (
    							SELECT SUBSTRING_INDEX(cours.numero, '.', 2) FROM cours
    							WHERE ddebut = '24/02/2017' AND codesalle IN
    							(SELECT DISTINCT groupesalle.code AS code FROM groupesalle
    									WHERE groupesalle.num_groupe LIKE '37') AND cast(substring(hdebut,1,2) as unsigned) < '17'
    							)
    							AND cours.salle like '%projecteur%'
    			*/						
    	$selectGroupe = new Select();
    	$selectGroupe->from('groupesalle')->columns(array('code'))->where->like('groupesalle.num_groupe',$groupe);
    	$selectGroupe->quantifier('DISTINCT');
    	//echo $selectGroupe->getSqlString();
    	// Create a new Select object for the table:
    	$selectNumero = new Select($this->tableGateway->getTable());
    	$selectNumero->columns(array(new Expression('SUBSTRING_INDEX(cours.numero, \'.\', 2) as numero')));
    	// Create a new result set based on the Cours entity:
    	$resultSetPrototype = new ResultSet();
    	$resultSetPrototype->setArrayObjectPrototype(new Cours());
    	$where = new \Zend\Db\Sql\Where();
    	$where->equalTo('ddebut', $date)->AND->in('codesalle',$selectGroupe);
    	if($trancheHoraire == 1)
    		$where->AND->lessThan(new Expression("cast(substring(hdebut,1,2) as unsigned)"), 17);
    	elseif($trancheHoraire == 2)
    		$where->AND->greaterThanOrEqualTo(new Expression("cast(substring(hdebut,1,2) as unsigned)"), 17);
    		$selectNumero->where($where);
    	
    	$select = new Select($this->tableGateway->getTable());
    	$select->where->in(new Expression('SUBSTRING_INDEX(cours.numero, \'.\', 2)'), $selectNumero)
    	->and->like('salle','%'.$search_motif.'%');


    	//echo $select->getSqlString();
    		// Create a new pagination adapter object:
    		
    		$paginatorAdapter = new DbSelect(
    				$select,
    				$this->tableGateway->getAdapter(),
    				$resultSetPrototype
    				);
    		 
    		$paginator = new Paginator($paginatorAdapter);
    		 
    		return $paginator; 
    }
    
    public function getCoursDateEtSalle($datedebut,$datefin,$listeSalles,$listeEnseignants,$listeMatieres)
    {
    	// $trancheHoraire : 1 -> journée
    	//					 2 -> soirée
    	//                   3 -> jour complet

    	//echo $selectGroupe->getSqlString();
    	// Create a new Select object for the table:
    	$select = new Select($this->tableGateway->getTable());
    	// Create a new result set based on the Cours entity:
    	$resultSetPrototype = new ResultSet();
    	$resultSetPrototype->setArrayObjectPrototype(new Cours());
    	$where = new \Zend\Db\Sql\Where();
    	$where->greaterThanOrEqualTo(new Expression('concat(substring(ddebut,7,4),substring(ddebut,4,2),substring(ddebut,1,2))'), substr($datedebut,6,4).substr($datedebut,3,2).substr($datedebut,0,2))
    	->AND->lessThanOrEqualTo(new Expression('concat(substring(dfin,7,4),substring(dfin,4,2),substring(dfin,1,2))'), substr($datefin,6,4).substr($datefin,3,2).substr($datefin,0,2));
    	if(count($listeSalles) > 0)
    		$where->AND->in('codesalle',$listeSalles);
    	if(count($listeEnseignants) > 0)
    		$where->AND->in('enseignant',$listeEnseignants);
    	if(count($listeMatieres) > 0)
    		$where->AND->in('codemat',$listeMatieres);
    	$select->where($where)->order(array(new Expression('concat(substring(ddebut,7,4),substring(ddebut,4,2),substring(ddebut,1,2))'),
    				new Expression('concat(substring(hdebut,1,2),substring(hdebut,4,2))'),'codesalle'));
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

    public function saveCours(Cours $cours)
    {
        $data = [
            				'numero' => $cours->numero,
				'id' => $cours->id,
				'duree' => $cours->duree,
				'cumul' => $cours->cumul,
				'ddebut' => $cours->ddebut,
				'dfin' => $cours->dfin,
				'nbsem' => $cours->nbsem,
				'jour' => $cours->jour,
				'hdebut' => $cours->hdebut,
				'hfin' => $cours->hfin,
				'type' => $cours->type,
				'codemat' => $cours->codemat,
				'matiere' => $cours->matiere,
				'enseignant' => $cours->enseignant,
				'codeenseignant' => $cours->codeenseignant,
				'codediplome' => $cours->codediplome,
				'libdiplome' => $cours->libdiplome,
				'codesalle' => $cours->codesalle,
				'salle' => $cours->salle,
				'pond' => $cours->pond,
				'prop' => $cours->prop,
				'memo' => $cours->memo,
				'date_modif' => $cours->date_modif,
        ];
        $id =  $cours->id;

        try {
        	$entry = $this->getCours($id);
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
        
        
        if (! $this->getCours ( $id )) {
        	throw new RuntimeException ( sprintf ( 'Cannot update cours with identifier %s; does not exist', $id ) );
        }
        
        
        return $id;
    }

    public function deleteCours($id)
    {
        $this->tableGateway->delete(['id' => $id]);
    }
    
    public function setLatin1()
    {
    // Changement du jeu de caract�res pour le chargement des cours depuis un fichier texte
    $query = $this->tableGateway->getAdapter()->query('SET NAMES \'latin1\'');
    $query->execute();
	}
	
    public function truncateCours()
    {
    	$statement = $this->tableGateway->getAdapter()->createStatement('TRUNCATE TABLE '.$this->tableGateway->getTable());
    	$result = $statement->execute();
    	//$statement->closeCursor();
    	/*
    	$query = $this->tableGateway->getAdapter()->query('TRUNCATE TABLE '.$this->tableGateway->getTable());
    	$query->execute();
    	*/
    }
    
    public function DropPrimaryKey()
    {
    	$query = $this->tableGateway->getAdapter()->query("SHOW INDEXES FROM cours WHERE Key_name = 'PRIMARY'");
    	$result = $query->execute();
		if($result->count() == 1)
    	try{
    	$query = $this->tableGateway->getAdapter()->query('ALTER TABLE cours DROP PRIMARY KEY');
    	$query->execute();
    	$query = $this->tableGateway->getAdapter()->query("ALTER TABLE  `cours` CHANGE  `id`  `id` VARCHAR( 128 ) NULL");
    	$query->execute();
    	}
    	catch(Exception $e)
    	{
    		print_r($e);
    	}
    }
    
    public function traitementCoursTable()
    {
    	
    	$query = $this->tableGateway->getAdapter()->query("DELETE FROM `cours` WHERE codesalle = ''");
    	$query->execute();
    	$query = $this->tableGateway->getAdapter()->query("DELETE FROM `cours` WHERE hdebut = '' or hfin = ''");
    	$query->execute();
    	$query = $this->tableGateway->getAdapter()->query("UPDATE cours SET id = md5(concat(ddebut,hdebut,hfin,codemat,codesalle,codediplome,libdiplome))");
    	$query->execute();
    	$query = $this->tableGateway->getAdapter()->query("CREATE TABLE cours_nodup AS SELECT * FROM cours WHERE 1 GROUP BY id, ddebut, hdebut, hfin, codemat, codesalle, codediplome, libdiplome");
    	$query->execute();
    	$query = $this->tableGateway->getAdapter()->query("DELETE FROM cours");
    	$query->execute();
    	$query = $this->tableGateway->getAdapter()->query("INSERT INTO cours SELECT * FROM cours_nodup");
    	$query->execute();
    	$query = $this->tableGateway->getAdapter()->query("DROP TABLE cours_nodup");
    	$query->execute();
    	$query = $this->tableGateway->getAdapter()->query("ALTER TABLE `cours` ADD PRIMARY KEY(`id`)");
    	$query->execute();
    }
    
    public function getAdapter()
    {
    	return $this->tableGateway->getAdapter();
    }
    
    public function LoadCours()
    {    
    	$config = new \Zend\Config\Config( include __DIR__.'/../../../../config/autoload/'.$_SERVER['APPLICATION_ENV'].'.local.php' );
    	$mysql = new \MySQLi($config->db->host, $config->db->username, $config->db->password, $config->db->database);
    	if($_SERVER['APPLICATION_ENV'] == 'development' || $_SERVER['APPLICATION_ENV'] == 'integration')
    	$res = $mysql->query("LOAD DATA CONCURRENT LOCAL INFILE '/var/www/html/applications/hyper/data/EXP_CRS.txt'
    		INTO TABLE cours
    		CHARACTER SET UTF8
    		FIELDS
    		TERMINATED BY ';'
    		LINES TERMINATED BY '\n'
    		IGNORE 1 LINES ");
    	else
    	    $res = $mysql->query("LOAD DATA CONCURRENT LOCAL INFILE '/var/www/html/applications/hyper2/data/EXP_CRS.txt'
    		INTO TABLE cours
    		CHARACTER SET UTF8
    		FIELDS
    		TERMINATED BY ';'
    		LINES TERMINATED BY '\n'
    		IGNORE 1 LINES ");

        	
    }
}

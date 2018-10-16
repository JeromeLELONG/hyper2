<?php

namespace Presence\Controller;

use Zend\Session\Container;
use Presence\Form\PresenceForm;
use Presence\Model\Presence;
use Application\Model\CoursTable;
use Application\Model\Cours;
use Application\Model\SalleTable;
use Application\Model\Salle;
use Presence\Model\PresenceTable;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\JsonModel;
use HTML2PDF;
use mikehaertl\wkhtmlto\Pdf;
use Zend\Form\Annotation\Object;
use Zend\View\Model\ViewModel;
use PHPExcel;
use PHPExcel_IOFactory;

class PresenceController extends AbstractActionController {
	private $presenceTable;
	private $coursTable;
	private $salleTable;
	public function __construct(PresenceTable $presencetable, CoursTable $courstable, SalleTable $salletable) {
		$this->presenceTable = $presencetable;
		$this->coursTable = $courstable;
		$this->salleTable = $salletable;
	}
	public function indexAction() {
	}
	
	public function creerficheAction() {
		$nolot = $this->params()->fromQuery('nolot');
		$nofiche = $this->params()->fromQuery('nofiche');
		$id = $this->params()->fromQuery('id');
		$heure_edition = $this->params()->fromQuery('heure_edition');
		
		$containerLot = new Container("base");
		if($nofiche == 1){
			$html2pdf = new HTML2PDF ( 'P', 'A4', 'fr', true, 'UTF-8' );
			$containerLot->offsetSet('lot', $html2pdf);
		}
			
		$html2pdf = $containerLot->offsetGet('lot');
		$fiche = (object) [];
		$fiche->id = $id;
		$fiche->nolot = $nolot;
		$fiche->nofiche = $nofiche;
		$fiche->heure_edition = $heure_edition;
		$cours = $this->coursTable->getCours ( $fiche->id );
		$materiel = $this->coursTable->getMateriel($cours->numero, 'VP').
					$this->coursTable->getMateriel($cours->numero, 'projecteur').
					$this->coursTable->getMateriel($cours->numero, 'einte');
		$html2pdf = $this->writeFiche($fiche,$cours,$materiel,$html2pdf);
		$containerLot->offsetSet('lot', $html2pdf);
		return new JsonModel(array($nolot,$nofiche,$id));
	}
	
	public function sauvegarderlotAction() {
		$containerLot = new Container("base");
		$html2pdf = $containerLot->offsetGet('lot');
		$html2pdf->Output ( 'lot.pdf' );
	}
	
	public function genererlotAction() {
		
		set_time_limit ( 160 );
		$cours = new Cours ();
		$html2pdf = new HTML2PDF ( 'P', 'A4', 'fr', true, 'UTF-8' );
		$request = $this->getRequest ();
		$lotJSON = $request->getPost ( 'lot' );
		$lot = json_decode ( $lotJSON );
		$showCut = 0;
		
		foreach ( $lot as $fiche ) {
			$cours = $this->coursTable->getCours ( $fiche->id );
			$html2pdf = $this->writeFiche($fiche,$cours,$html2pdf,$showCut);
			if (! $showCut)
				$showCut ++;
			else
				$showCut = 0;
		}
		
		$html2pdf->Output ( 'lot.pdf' );
		
	}
	
	public function writeFiche($fiche,$cours,$materiel,$html2pdf){

		$styleRoundCorners = 'table {border-collapse:separate;border:solid black 0.4px;border-radius:6px;-moz-border-radius:6px;
		}td, th {border-left:solid black 0px;border-top:solid black 0.4px;}th {background-color: blue;}td:first-child, th:first-child {
     	border-left: none;}';
		$html = '';
		//if ($_SERVER['APPLICATION_ENV'] == 'development' || $_SERVER['APPLICATION_ENV'] == 'integration')
		//	$application_path = '/var/www/html/applications/hyper/';
		//else
		//	$application_path = '/var/www/html/applications/hyper2/';
		$application_path = = __DIR__.'/../../../../';
		$html .= '<table  style="' . $styleRoundCorners . '">
    		<tr><td width="740" style="border: 0.3px solid black;">' . '<table  align="center">
    				<tr>
    				<td width="150" align="left"><img src="'.$application_path.'public/img/cnam.png">
    				<br><br>lot n° : ' . $fiche->nolot . '</td>
    				<td width="400" align="center"><h3>' . $cours->jour . ' ' . $cours->ddebut . '-' . $cours->codemat . '</h3></td>
    				<td width="150" align="right">Edité le : ' . $fiche->heure_edition . '<br><br>n° fiche : ' . $fiche->nofiche . '</td>
    				</tr></table>' . '</td></tr>
    	    <tr><td >
    	    <table border="0" align="center"><tr><td><h3>' . $cours->type . '-' . $cours->matiere . '-' .substr(strip_tags($cours->codediplome),0,42). '</h3></td></tr></table>
    		<table border="0" align="center" border="0">
    				<tr>
    				<td width="500" align="center">Semaine du ' . date ( "d/m/Y", strtotime ( 'monday this week', strtotime ( date_format ( date_create_from_format ( 'd/m/Y', $cours->ddebut ), 'Y/m/d' ) ) ) ) . ' au ' . date ( "d/m/Y", strtotime ( 'sunday this week', strtotime ( date_format ( date_create_from_format ( 'd/m/Y', $cours->ddebut ), 'Y/m/d' ) ) ) ) . '</td>
    				<td width="70">Présents:</td><td><table><tr><td style="' . $styleRoundCorners . ';width: 100px; height:25px;"></td></tr></table></td>
    				</tr>
    				</table>
    		<table border="0" align="center" border="0">
    				<tr>
    				<td width="240" align="center" ><h3>Horaire prévu</h3></td>
    				<td width="240" align="center" ><h3>' . $cours->hdebut . '</h3></td>
    				<td width="240" align="center" ><h3>' . $cours->hfin . '</h3></td>
    				</tr>
    				<tr>
    				<td width="240" align="center">Horaire réel</td>
    				<td width="240" align="center"><table align="center"><tr><td style="' . $styleRoundCorners . ';width: 120px; height:25px;"></td></tr></table></td>
    				<td width="240" align="center"><table align="center"><tr><td style="' . $styleRoundCorners . ';width: 120px; height:25px;"></td></tr></table></td>
    				</tr>
    		</table>
    	    <table border="0" style="padding: 0px 0px 0px 0px; margin: 0px 0px 0px 0px;">
    				<tr>
    				<td width="70" align="right"><h3>Salle:</h3></td>
    				<td width="85"><h3>' . $cours->codesalle . '</h3></td>
    				<td width="300"><h3>' . $cours->salle . '</h3></td>
    				<td width="80" align="right"><h3>Matériel:</h3></td>
    				<td width="70"><h3>' . $materiel . '</h3></td>
    				</tr>
    				</table>
    		<table border="0" style="padding: 0px 0px 0px 0px; margin: 0px 0px 0px 0px;">
    				<tr>
    				<td width="160" align="right">Capacité : </td>
    				<td width="200" align="left">' . $this->salleTable->getCapacite ( $cours->codesalle ) . '</td>
    				<td width="200" align="right">Cours annulé:</td>
    				<td width="100" align="center"><table><tr><td style="' . $styleRoundCorners . ';width: 15px; height:15px;"></td></tr></table></td>
    				</tr>
    		</table>
    		<table style="padding: 0px 0px 0px 0px; margin: 0px 0px 0px 0px;">
    				<tr>
    				<td width="350" align="center">Surveillant</td>
    				<td width="350" align="center">Enseignant</td>
    				</tr>
    				<tr>
    				<td width="350" align="center">
    				<table>
    				<tr>
    				<td width="100">Nom:
    				</td>
    				<td width="250" border="1" style="' . $styleRoundCorners . ';height:25px;">
    				</td>
    				</tr>
    				<tr>
    				<td width="100">Signature:
    				</td>
    				<td width="250" border="1" style="' . $styleRoundCorners . ';height:32px;">
    				</td>
    				</tr>
    				<tr>
    				<td width="100">Remarques:
    				</td>
    				<td width="250" border="1" style="' . $styleRoundCorners . ';height:32px;">
    				</td>
    				</tr>
    				</table>
    				</td>
    				<td width="350" align="center">
    				<table>
    				<tr>
    				<td width="100">Nom:
    				</td>
    				<td width="250" border="1" style="' . $styleRoundCorners . ';height:25px;">
    						' . $cours->enseignant . '
    				</td>
    				</tr>
    				<tr>
    				<td width="100">Signature:
    				</td>
    				<td width="250" border="1" style="' . $styleRoundCorners . ';height:32px;">
    				</td>
    				</tr>
    				<tr>
    				<td width="100">Remarques:
    				</td>
    				<td width="250" border="1" style="' . $styleRoundCorners . ';height:32px;">
    				</td>
    				</tr>
    				</table>
    				</td>
    				</tr>
    	    </table>
    		</td></tr></table>';
			
		if ($fiche->nofiche%2)
			$html .= '<img src="'.$application_path.'public/img/cut.gif">';
	$html2pdf->writeHTML ( $html, false );
	return $html2pdf;
	}
	
	public function extraireAction()
	{
		$dirTmp = __DIR__.'/../../../../data/';
		ini_set('memory_limit', '1024M');
		set_time_limit(160);
		$session = new Container('admin');
		$connectionToken = md5($session->offsetGet("login")).'_'.date("Ymd_His");
		$results = $this->presenceTable->fetchAll();
		$outputfile = @fopen( $dirTmp.$connectionToken.'.csv', 'w' );
		foreach($results as $result) {
			fputcsv($outputfile, $result->getArrayISOCopy(),';');
		}
		
		$filter     = new \Zend\Filter\Compress(array(
				'adapter' => 'Zip',
				'options' => array(
						'archive' => $dirTmp.$connectionToken.'.zip'
				),
		));
		$compressed = $filter->filter($dirTmp.$connectionToken.'.csv');
		
		$file = $dirTmp.$connectionToken.'.zip';
		$response = new \Zend\Http\Response\Stream();
		$response->setStream(fopen($file, 'r'));
		$response->setStatusCode(200);
		/*
		$response->setStreamName(basename($file));
		$headers = new \Zend\Http\Headers();
		$headers->addHeaders(array(
				'Content-Disposition' => 'attachment; filename="' . basename($file) .'"',
				'Content-Type' => 'application/octet-stream',
				'Content-Length' => filesize($file),
				'Expires' => '@0', // @0, because zf2 parses date as string to \DateTime() object
				'Cache-Control' => 'must-revalidate',
				'Pragma' => 'public'
		));
		$response->setHeaders($headers);
		*/
		return $response;
	}
	
	public function extraireExcelAction()
	{
		$dirTmp = __DIR__.'/../../../../data/';
		ini_set('memory_limit', '6092M');
		set_time_limit(520);
		$request = $this->getRequest ();
		$datedebut = $request->getPost ( 'datedebut' );
		$datefin = $request->getPost ( 'datefin' );
		$session = new Container('admin');
		$connectionToken = md5($session->offsetGet("login")).'_'.date("Ymd_His");
		
		$objPHPExcel = new PHPExcel();
		$listData = $this->presenceTable->getListePresenceAvecDate($datedebut,$datefin,null,null,null);
		$objPHPExcel->createSheet();
		$objPHPExcel->getActiveSheet()->setCellValue('A1', 'nolot');
		$objPHPExcel->getActiveSheet()->setCellValue('B1', 'nofiche');
		$objPHPExcel->getActiveSheet()->setCellValue('C1', 'id');
		$objPHPExcel->getActiveSheet()->setCellValue('D1', 'dateraw');
		$objPHPExcel->getActiveSheet()->setCellValue('E1', 'datesem');
		$objPHPExcel->getActiveSheet()->setCellValue('F1', 'hdebut');
		$objPHPExcel->getActiveSheet()->setCellValue('G1', 'hfin');
		$objPHPExcel->getActiveSheet()->setCellValue('H1', 'codesalle');
		$objPHPExcel->getActiveSheet()->setCellValue('I1', 'codeue');
		$objPHPExcel->getActiveSheet()->setCellValue('J1', 'codepole');
		$objPHPExcel->getActiveSheet()->setCellValue('K1', 'jour');
		$objPHPExcel->getActiveSheet()->setCellValue('L1', 'enseignant');
		$objPHPExcel->getActiveSheet()->setCellValue('M1', 'appariteur');
		$objPHPExcel->getActiveSheet()->setCellValue('N1', 'rem_ens');
		$objPHPExcel->getActiveSheet()->setCellValue('O1', 'rem_app');
		$objPHPExcel->getActiveSheet()->setCellValue('P1', 'nbpresents');
		$objPHPExcel->getActiveSheet()->setCellValue('Q1', 'chaire');
		$objPHPExcel->getActiveSheet()->setCellValue('R1', 'valide');
		$objPHPExcel->getActiveSheet()->setCellValue('S1', 'type');
		$objPHPExcel->getActiveSheet()->setCellValue('T1', 'groupe');
		$objPHPExcel->getActiveSheet()->setCellValue('U1', 'annule');
		$objPHPExcel->getActiveSheet()->setCellValue('V1', 'hdebut_reel');
		$objPHPExcel->getActiveSheet()->setCellValue('W1', 'hfin_reel');
		$objPHPExcel->getActiveSheet()->setCellValue('X1', 'datefichier');
		$objPHPExcel->getActiveSheet()->setCellValue('Y1', 'video');
		$line = 2;
		foreach ($listData as $entry)
		{
			$objPHPExcel->getActiveSheet()->setCellValue('A'.$line, $entry->nolot);
			$objPHPExcel->getActiveSheet()->setCellValue('B'.$line, $entry->nofiche);
			$objPHPExcel->getActiveSheet()->setCellValue('C'.$line, $entry->id);
			$objPHPExcel->getActiveSheet()->setCellValue('D'.$line, $entry->dateraw);
			$objPHPExcel->getActiveSheet()->setCellValue('E'.$line, $entry->datesem);
			$objPHPExcel->getActiveSheet()->setCellValue('F'.$line, $entry->hdebut);
			$objPHPExcel->getActiveSheet()->setCellValue('G'.$line, $entry->hfin);
			$objPHPExcel->getActiveSheet()->setCellValue('H'.$line, $entry->codesalle);
			$objPHPExcel->getActiveSheet()->setCellValue('I'.$line, $entry->codeue);
			$objPHPExcel->getActiveSheet()->setCellValue('J'.$line, $entry->codepole);
			$objPHPExcel->getActiveSheet()->setCellValue('K'.$line, $entry->jour);
			$objPHPExcel->getActiveSheet()->setCellValue('L'.$line, $entry->enseignant);
			$objPHPExcel->getActiveSheet()->setCellValue('M'.$line, $entry->appariteur);
			$objPHPExcel->getActiveSheet()->setCellValue('N'.$line, $entry->rem_ens);
			$objPHPExcel->getActiveSheet()->setCellValue('O'.$line, $entry->rem_app);
			$objPHPExcel->getActiveSheet()->setCellValue('P'.$line, $entry->nbpresents);
			$objPHPExcel->getActiveSheet()->setCellValue('Q'.$line, $entry->chaire);
			$objPHPExcel->getActiveSheet()->setCellValue('R'.$line, $entry->valide);
			$objPHPExcel->getActiveSheet()->setCellValue('S'.$line, $entry->type);
			$objPHPExcel->getActiveSheet()->setCellValue('T'.$line, $entry->groupe);
			$objPHPExcel->getActiveSheet()->setCellValue('U'.$line, $entry->annule);
			$objPHPExcel->getActiveSheet()->setCellValue('V'.$line, $entry->hdebut_reel);
			$objPHPExcel->getActiveSheet()->setCellValue('W'.$line, $entry->hfin_reel);
			$objPHPExcel->getActiveSheet()->setCellValue('X'.$line, $entry->datefichier);
			$objPHPExcel->getActiveSheet()->setCellValue('Y'.$line, $entry->video);
			$line++;
		}
		
		$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, "Excel2007");
		$objWriter->save($dirTmp.$connectionToken.".xlsx");
		

	
		$filter     = new \Zend\Filter\Compress(array(
				'adapter' => 'Zip',
				'options' => array(
						'archive' => $dirTmp.$connectionToken.'.zip'
				),
		));
		$compressed = $filter->filter($dirTmp.$connectionToken.".xlsx");
	
		$file = $dirTmp.$connectionToken.'.zip';
		$response = new \Zend\Http\Response\Stream();
		$response->setStream(fopen($file, 'r'));
		$response->setStatusCode(200);
		/*
			$response->setStreamName(basename($file));
			$headers = new \Zend\Http\Headers();
			$headers->addHeaders(array(
			'Content-Disposition' => 'attachment; filename="' . basename($file) .'"',
			'Content-Type' => 'application/octet-stream',
			'Content-Length' => filesize($file),
			'Expires' => '@0', // @0, because zf2 parses date as string to \DateTime() object
			'Cache-Control' => 'must-revalidate',
			'Pragma' => 'public'
			));
			$response->setHeaders($headers);
			*/
		return $response;
	}
	
}

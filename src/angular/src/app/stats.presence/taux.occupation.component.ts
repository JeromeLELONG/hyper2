import { Component , OnInit  ,style, animate, transition, state, trigger, Inject, ViewChild} from '@angular/core';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Globals } from './../globals';
import { Observable } from 'rxjs/Rx';
import { GroupeSalleService } from './../services/groupe.salles.service';
import { GroupeSalle } from './../interfaces/groupe.salle';
import { Salle } from './../interfaces/salle';
import { SalleService } from './../services/salle.service';
import { Presence } from './../interfaces/presence';
import { PresenceService } from './../services/presence.service';
import * as moment from 'moment';
import {BaseChartDirective} from 'ng2-charts/ng2-charts';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'taux-occ',
  templateUrl: './taux.occupation.component.html',
  providers: [ Globals , GroupeSalleService , SalleService, PresenceService ],
  styles: [`>>> .modal-xl { width: 960px; },
            `],
  animations: [
               trigger('fadeIn', [
                   state('*', style({'opacity': 1})),
                   transition('void => *', [
                       style({'opacity': 0}),
                       animate('800ms linear')
                   ])
               ]),
           ]
})
export class TauxOccupationComponent implements OnInit {
    listeGroupes: GroupeSalle[] = [];
@ViewChild(BaseChartDirective) chart: BaseChartDirective;
@ViewChild('modal2') modal2: ModalComponent;
errorMessage: string = '';
isLoading: boolean = true;
groupIsSelected: boolean = false;
salleIsSelected: boolean = false;
listeSallesAffectees: GroupeSalle[] = [];
listeSalles: Salle[] = [];
presences: Presence[] = [];
tauxOccupations = [];
firstDay: Date;
dateDebutString: string;
lastDay: Date;
dateFinString: string;
firstDaySelect: Date;
lastDaySelect: Date;
numeroGroupe: string;
closable: boolean = false;
loading: boolean = false;
resizable: boolean = false;
modalOpened: boolean = false;
tauxSallesAffectees: any[] = [];
rangeValues: number[] = [1,20];
oldRangeValues: number[] = [1,20];
nbSelectionDate: number;
dateSelect: Date;
dateDisabled: boolean = false;
changeDate: boolean = false;
salleSelected: string;
modal: boolean = false;
nbSeances: number = 0;
animation: boolean = true;
output: string;
selected: string;
tableSeances: any[];
tableSeancesDisplay: any[];
selectionSeances: any[]; 
copieSeances: string = "";
dialogSeanceIsVisible: boolean= false;
toutesLesSeances: boolean = false;
sommePresents: number;
tauxMoyen: number;
dateDebutClass: string = "col-md-10 fade-animation";
dateFinClass: string = "col-md-10 fade-animation";
backdrop: any;
keyboard: any;
items: any;
styleBoutonAnnuler: string = "btn btn-default input-shadow";
styleBoutonTelecharger: string = "btn btn-primary input-shadow center-block";

public lineChartData:Array<any> = [
                                   {data: [], label: ''},
                                 ];
public lineChartLabels:Array<any>;
public lineChartOptions:any = {
                                    responsive: true,
                                   scales: {
                                       yAxes: [{
                                         ticks: {
                                           beginAtZero: true,
                                           max: 100,
                                           min: 0,
                                           stepSize: 25
                                         },
                                         gridLines: {
                                           color: 'rgba(171,171,171,1)',
                                           lineWidth: 0.5
                                         }
                                       }]
                                     },
                                     plotOptions: {
                                         series: {
                                         states: {
                                                   hover: {
                                                       enabled: false
                                                   }
                                               }
                                       }
                                     },

                                     tooltip: {
                                         enabled: false
                                     },
                                 };
                                 public lineChartColors:Array<any> = [
                                   { // grey
                                     backgroundColor: 'rgba(148,159,177,0.2)',
                                     borderColor: 'rgba(148,159,177,1)',
                                     pointBackgroundColor: 'rgba(148,159,177,1)',
                                     pointBorderColor: '#fff',
                                     pointHoverBackgroundColor: '#fff',
                                     pointHoverBorderColor: 'rgba(148,159,177,0.8)'
                                   },
                                   { // dark grey
                                     backgroundColor: 'rgba(77,83,96,0.2)',
                                     borderColor: 'rgba(77,83,96,1)',
                                     pointBackgroundColor: 'rgba(77,83,96,1)',
                                     pointBorderColor: '#fff',
                                     pointHoverBackgroundColor: '#fff',
                                     pointHoverBorderColor: 'rgba(77,83,96,1)'
                                   },
                                   { // grey
                                     backgroundColor: 'rgba(148,159,177,0.2)',
                                     borderColor: 'rgba(148,159,177,1)',
                                     pointBackgroundColor: 'rgba(148,159,177,1)',
                                     pointBorderColor: '#fff',
                                     pointHoverBackgroundColor: '#fff',
                                     pointHoverBorderColor: 'rgba(148,159,177,0.8)'
                                   }
                                 ];
                                 public lineChartLegend:boolean = true;
                                 public lineChartType:string = 'line';

  constructor(private globals: Globals, @Inject(GroupeSalleService) private groupeSalleService: GroupeSalleService,
          @Inject(SalleService) private salleService: SalleService,@Inject(PresenceService) private presenceService: PresenceService){  
  
      var date = new Date();
      this.firstDay = new Date(date.getFullYear(), date.getMonth()-2, 1);
      this.lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      let chartsLabels = [];
      var start = moment(this.lastDay);
      var end = moment(this.firstDay);
      this.nbSelectionDate = start.diff(end, "days");
      this.firstDaySelect = this.firstDay;
      this.lastDaySelect = this.lastDay;
      let dateDebut: Date;
      for(var i=0, len=20; i < len; i++)
      {
      dateDebut = new Date(this.firstDaySelect);
      dateDebut.setDate(dateDebut.getDate() + i);
      chartsLabels.push(moment(dateDebut).format('DD/MM/YYYY'));
      }
      if (this.chart && this.chart.chart && this.chart.chart.config) {
          this.chart.chart.config.data.labels = this.lineChartLabels;
          this.chart.chart.update();
      }
      this.lineChartLabels = chartsLabels;
      this.dateSelect = new Date();
  }



  ngOnInit(){ 

      

      this.loading = true;
      this.groupeSalleService
      .getListeGroupes()
      .subscribe(
          
         c => {this.listeGroupes = c;
          this.groupeSalleService
          .getAll()
          .subscribe(
             c => {this.listeSallesAffectees = c;
             this.salleService
             .getAll()
             .subscribe(
                     
                 c => { this.listeSalles = c;
                 this.loading = false;},
                 e => this.errorMessage = e,
                 () => this.isLoading = false); 
             },
             e => this.errorMessage = e,
             () => this.isLoading = false);},
          e => this.errorMessage = e,
          () => this.isLoading = false);
      
      this.tableSeances = [];
      this.selectionSeances = [];
      this.dateDebutString = this.getDateDebutSelect();
      this.dateFinString = this.getDateFinSelect();
  }
  
  groupeSelect(num_groupe: string){
      if(this.numeroGroupe != num_groupe)
          {
      this.groupIsSelected = true;
      this.salleIsSelected = false;
      this.loading = true;
      this.numeroGroupe = num_groupe;
      this.updateDonneesPresence();
      
  }
  }
   updateDonneesPresence()
   {
       this.firstDay = new Date(this.dateSelect.getFullYear(), this.dateSelect.getMonth()-2, 1);
       this.lastDay = new Date(this.dateSelect.getFullYear(), this.dateSelect.getMonth() + 1, 0);
       this.presenceService
       .getListDateSalleEnseignant(moment(this.firstDay).format('DD/MM/YYYY'),moment(this.lastDay).format('DD/MM/YYYY'),this.listeSallesAffectees.filter(function(item){ 
           return item.num_groupe === this.numeroGroupe;}, this).map(function(a) {return a.code;}),[],[] )
       .subscribe(
          (p: Presence[]) => {                  
              this.presences = p.filter(function(item){ 
                  if((item.valide == "Y") || (item.valide == "Q"))
                      return true;
                  else
                      return false;
              }).filter(function(item){ 
                  return !item.annule;
              });
              this.presences.forEach(function(element) {
                  element.id = element.id.substring(0,7)+'...';
                });
              let tauxOcc: number;
              this.tauxOccupations = [];
              this.tauxOccupations = this.presences.map(function(a) { 
                  let salle = this.listeSalles.find(x => x.code === a.codesalle);
                  let tauxOcc: number;
                  if(!a.hdebut) a.hdebut = '8h00';
                  if(!a.hfin) a.hfin = '18h00';
                  
                  if(salle)
                      {
                      if(salle.capa)
                          tauxOcc = (a.nbpresents / salle.capa)*100; 
                      else
                          tauxOcc = 0;
                      }
                  else
                      tauxOcc = 0;
                  return { 
                      id: a.id,
                      tauxOcc: tauxOcc,
                      codesalle:a.codesalle,
                      dateCours: new Date(a.datesem.split("/")[2]+"-"+a.datesem.split("/")[1]+"-"+a.datesem.split("/")[0]+"T"
                      +a.hdebut.split("h")[0]+":"+a.hdebut.split("h")[1]+":00"),
                      };},
                      this);
              this.updateTauxOccupation();
          },
          e => this.errorMessage = e,
          () => this.isLoading = false);
   }
      
  getTauxMoyenParSalle(dateDebut,dateFin, codesalle: string){
      var newArr = this.tauxOccupations.filter(function(item){ 
          return item.codesalle === codesalle;
          }).filter(function(item){ 
              return item.dateCours >= dateDebut;
          },dateDebut).filter(function(item){ 
              return item.dateCours <= dateFin;
          },dateFin);
      let tauxMoyen = (newArr.reduce(function (a,b) { return a + b.tauxOcc; }, 0))/newArr.length;
      if(isNaN(tauxMoyen)) tauxMoyen = 0;
      return tauxMoyen;
  }
  
  getTauxMoyenDuGroupe(dateDebut,dateFin){
      var newArr = this.tauxOccupations.filter(function(item){ 
              return item.dateCours >= dateDebut;
          },dateDebut).filter(function(item){ 
              return item.dateCours <= dateFin;
          },dateFin);

      let tauxMoyen = (newArr.reduce(function (a,b) { return a + b.tauxOcc; }, 0))/newArr.length;
      if(isNaN(tauxMoyen)) tauxMoyen = 0;
      return tauxMoyen;
  }
  
  getTauxMoyenDuGroupeJournalier(dateSelect){
      var newArr = this.tauxOccupations.filter(function(item){ 
              return moment(dateSelect).format('DD/MM/YYYY') == moment(item.dateCours).format('DD/MM/YYYY');
          },dateSelect);
      
      if(this.salleIsSelected)
          newArr = newArr.filter(function(item){ 
          return item.codesalle === this.salleSelected;
          },this);
      this.nbSeances = this.nbSeances + newArr.length;
      
      this.tableSeances = this.tableSeances.concat(newArr.map(function(a) {
          let presence = this.presences.find(x => x.id === a.id);
          let salle = this.listeSalles.find(x => x.code === presence.codesalle);
          let capacite = 0;
          let taux = 0;
          let nbpresents: number;
          if(presence.nbpresents) nbpresents = presence.nbpresents;
          else nbpresents = 0;
          if(salle)
              capacite = salle.capa;
          if(capacite)
              taux = (nbpresents / capacite) * 100;
          return  {id: presence.id, 
              jour: presence.jour, 
              dateSeance: presence.datesem, 
              heureDebut: presence.hdebut, 
              heureFin: presence.hfin,
              codeSalle:presence.codesalle,
              nomEnseignant:presence.enseignant,
              nbPresents: nbpresents,
              capacite: capacite,
              taux: taux,
              tauxArrondi: Math.round(taux*100)/100}
              ;}, this));
      
      let tauxMoyen = (newArr.reduce(function (a,b) { return a + b.tauxOcc; }, 0))/newArr.length;
      if(isNaN(tauxMoyen)) tauxMoyen = 0;
      return tauxMoyen;
  }
  getFinMoisPeriode(mois){
  var lastDay = new Date(this.firstDay.getFullYear(), this.firstDay.getMonth() + mois, 0);
  return lastDay;
  }
  
  getDebutMoisPeriode(mois){
      var firstDay = new Date(this.firstDay);
      firstDay.setMonth(firstDay.getMonth()+mois);
      return firstDay;
      }
 
  getFinSemainePeriode(semaine){
      var lastDay = new Date(this.firstDaySelect);
      lastDay.setDate(lastDay.getDate() + (semaine*7)-1);
      return lastDay;
      }
      
  getDebutSemainePeriode(semaine){
          var firstDay = new Date(this.firstDaySelect);
          firstDay.setDate(firstDay.getDate() + (semaine*7));
          return firstDay;
          }

  getDateDebutSelect(){
     let dateDebut = new Date(this.firstDay);
     dateDebut.setDate(dateDebut.getDate() + this.rangeValues[0]);
      return dateDebut.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).charAt(0).toUpperCase()+dateDebut.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).substring(1);
  }
  getDateFinSelect(){
      let dateFin = new Date(this.firstDay);
      dateFin.setDate(dateFin.getDate() + this.rangeValues[1]);
       return dateFin.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).charAt(0).toUpperCase()+dateFin.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).substring(1);
  }

  updateTauxOccupation(){
      this.tableSeances = [];
      this.nbSeances = 0;
      this.loading = true;
      this.firstDay = new Date(this.dateSelect.getFullYear(), this.dateSelect.getMonth()-2, 1);
      this.lastDay = new Date(this.dateSelect.getFullYear(), this.dateSelect.getMonth() + 1, 0);
      setTimeout(() => {
      this.lineChartData = [
                            {data: [], label: this.listeGroupes.find(x => x.num_groupe === this.numeroGroupe).lib_groupe},
                            ];
      
   
      let dateDebut = new Date(this.firstDay);
      dateDebut.setDate(dateDebut.getDate() + this.rangeValues[0]);
      let dateFin = new Date(this.firstDay);
      dateFin.setDate(dateFin.getDate() + this.rangeValues[1]);
      
      this.firstDaySelect = dateDebut;
      this.lastDaySelect = dateFin;
      
      let chartsData = [];
      let taux: number;
      var start = moment(this.lastDaySelect);
      var end = moment(this.firstDaySelect);
      let diff = start.diff(end, "days");
      let chartsLabels = [];
      for(var i=0, len=diff; i < len; i++)
      {
          
          dateDebut = new Date(this.firstDaySelect);
          dateDebut.setDate(dateDebut.getDate() + i);
          taux = Math.round(this.getTauxMoyenDuGroupeJournalier(dateDebut)*100)/100;
          chartsData.push(taux);
          chartsLabels.push(moment(dateDebut).format('DD/MM/YYYY'));
      }
      this.lineChartLabels = [];
      this.lineChartLabels = chartsLabels;
      this.lineChartData  = [
                             {data: chartsData, label: this.listeGroupes.find(x => x.num_groupe === this.numeroGroupe).lib_groupe},
                             ];
      
      if(this.salleIsSelected)
          {
          this.lineChartData[0].label = this.salleSelected;
          }
      this.tauxSallesAffectees = [];
      let tauxSallesAffectees = this.listeSallesAffectees.filter(function(item){ 
          return item.num_groupe === this.numeroGroupe;},this).map(function(a) {return {code:a.code,taux:this.getTauxMoyenParSalle(this.firstDaySelect,this.lastDaySelect,a.code),
              tauxArrondi:Math.round(this.getTauxMoyenParSalle(this.firstDaySelect,this.lastDaySelect,a.code)*100)/100};}, this)
              .sort(function (a, b) {return b.taux - a.taux;});

     for(let i = 0; i < tauxSallesAffectees.length; i++)
             setTimeout(() => { 
                      this.tauxSallesAffectees.push(tauxSallesAffectees[i]);
             }, 200*(i+1));
              


      this.chart.chart.config.data.labels = this.lineChartLabels;
      this.chart.chart.update();
      this.dateDebutString = this.getDateDebutSelect();
      this.dateFinString = this.getDateFinSelect();
      this.dateDebutClass = "col-md-10 fade-animation";
      this.dateFinClass = "col-md-10 fade-animation";
      this.loading = false;
      this.changeDate = false;
      },1000);
     
  }


      changeDates()
      { 

          if(this.oldRangeValues[0] != this.rangeValues[0])
          {
              this.oldRangeValues[0] = this.rangeValues[0];
              this.dateDebutClass = "col-md-10 fadeEnd-animation";
          }
          if(this.oldRangeValues[1] != this.rangeValues[1])
          {   
              this.oldRangeValues[1] = this.rangeValues[1];
              this.dateFinClass = "col-md-10 fadeEnd-animation";
          }
          this.changeDate = true;
          this.updateDonneesPresence();

      }
      
      selectDate()
      {
          this.dateDebutClass = "col-md-10 fadeEnd-animation";
          this.dateFinClass = "col-md-10 fadeEnd-animation";
          this.updateDonneesPresence();
      }
      
      salleSelect(codesalle: string)
      {
          this.groupIsSelected = false;
          this.salleIsSelected = true;
          this.salleSelected = codesalle;
          this.updateTauxOccupation();
      }
      
      opened() {
          this.output = '(opened)';
      }

      dismissed() {
          this.modalOpened = false;
          this.output = '(dismissed)';
      }
      closed() {
          this.output = '(closed) ' + this.selected;
      }
      
      voirSeances(codesalle = null){
          this.selectionSeances = [];
          
          if(codesalle)
              this.tableSeancesDisplay = this.tableSeances.filter(function(a) {
                  return a.codeSalle == codesalle;
              },codesalle);
          else
              this.tableSeancesDisplay = this.tableSeances.map( a => a);
          this.sommePresents = Math.round(this.sommePresentsSelection());
          this.tauxMoyen = Math.round(this.tauxMoyenSelection()*100)/100;
          this.modalOpened = true;
          this.modal2.open();
      
      }
      selectSeancesClosable: boolean = false;
      selectSeancesHeader:boolean = false;
      copierSeances()
      {
          this.copieSeances = "";
          this.selectionSeances.map(function(a) { 
              this.copieSeances = this.copieSeances + a.id + "\t"+a.jour+"\t" + a.dateSeance + "\t"
              + a.heureDebut + "\t"+a.heureFin +"\t" +a.nomEnseignant+ "\t"+a.codeSalle+
              "\t" +a.nbPresents+ "\t"+a.capacite+ "\t"+a.taux+ "\r\n";
              return true;},this);
          setTimeout(() => {this.dialogSeanceIsVisible = false;},3000);
      }


      showDialogCopie() {
          this.copieSeances = "";
          this.dialogSeanceIsVisible = true;

      }
      
      selectionnerTout(event){
          if(this.toutesLesSeances){
              this.selectionSeances = this.tableSeancesDisplay.map( a => a);
              
          }
          else
              this.selectionSeances = [];
      }
      
      sommePresentsSelection(){
          if(this.selectionSeances.length > 0) 
          return this.selectionSeances.reduce(function (a,b) { 
              return parseInt(a) + parseInt(b.nbPresents); }, 0);
          else if(this.tableSeancesDisplay)
          return this.tableSeancesDisplay.reduce(function (a,b) { 
              return parseInt(a) + parseInt(b.nbPresents); }, 0);
          else
              return 0;
      }
      tauxMoyenSelection(){
          if(this.selectionSeances.length > 0) 
              return (this.selectionSeances.reduce(function (a,b) { 
                  return a + b.taux; }, 0))/this.selectionSeances.length;
         else if(this.tableSeancesDisplay)
              return (this.tableSeancesDisplay.reduce(function (a,b) { 
                  return a + b.taux; }, 0))/this.tableSeancesDisplay.length;
         else
             return 0;
      }
      getProgressClass(taux)
      {
          if(taux < 20) return "progress-bar progress-bar-danger";
          else if(taux >= 20 && taux < 40) return "progress-bar progress-bar-warning";
          else if(taux >= 40 && taux < 60) return "progress-bar progress-bar-info";
          else return "progress-bar progress-bar-success";
      }
      removeDecimals(taux)
      {
          return Math.round(taux*100)/100;
      }
      
      selectionChange(){
          this.sommePresents = Math.round(this.sommePresentsSelection());
          this.tauxMoyen = Math.round(this.tauxMoyenSelection()*100)/100;
      }
      
      telechargerSelection()
      {
          this.copieSeances = "";
          this.selectionSeances.map(function(a) { 
              this.copieSeances = this.copieSeances + a.id + ";"+a.jour+";" + a.dateSeance + ";"
              + a.heureDebut + ";"+a.heureFin +";" +a.nomEnseignant+ ";"+a.codeSalle+
              ";" +a.nbPresents+ ";"+a.capacite+ ";"+a.taux+ "\r\n";
              return true;},this);
          
          FileSaver.saveAs(new Blob([this.copieSeances], {type: 'text/csv'}), 'ExportTaux_'+moment(new Date()).format('DD-MM-YYYY_hhmmss')+'.csv');
      }
}

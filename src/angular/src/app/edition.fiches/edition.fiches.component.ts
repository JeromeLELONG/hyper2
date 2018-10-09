import { NgModule, Component, OnInit  , style, animate, transition, state, trigger, ViewChild,
group,AnimationTransitionEvent, Inject} from '@angular/core';
import { Cours } from './../interfaces/cours';
import { CoursService } from './../services/cours.service';
import { Lot } from './../interfaces/lot';
import { LotService } from './../services/lot.service';
import { GroupeSalleService } from './../services/groupe.salles.service';
import { SelectItem } from 'primeng/primeng';
import { FormsModule }   from '@angular/forms';
import { GroupeSalle } from './../interfaces/groupe.salle';
import { Observable } from 'rxjs/Rx';
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';
import * as moment from 'moment';
import { PresenceService } from './../services/presence.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Presence } from './../interfaces/presence';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Globals } from './../globals';
import { ActivatedRoute } from '@angular/router';
import { FavorisService } from './../services/favoris.service';
import { Favoris } from './../interfaces/favoris';
import * as FileSaver from 'file-saver';
var latinize = require('latinize');

//import { routerTransition } from './router.animations';

@Component({
    templateUrl: './edition.fiches.component.html',
  providers: [CoursService , GroupeSalleService, PresenceService, LotService , Globals ,  FavorisService ],
  animations: [
               trigger('fadeIn', [
                   state('*', style({'opacity': 1})),
                   state('void', style({'opacity': 0})),
                   transition('void => *', [
                       style({'opacity': 0}),
                       animate('800ms linear')
                   ]),
                   transition('* => void', [
                                            style({'opacity': 1}),
                                            animate('800ms linear')
                                        ])
               ]),
                trigger('flyInOut', [
                 state('in', style({width: 120, transform: 'translateX(0)', opacity: 1})),
                 transition('void => *', [
                   style({width: 10, transform: 'translateX(-50px)', opacity: 0}),
                   group([
                     animate('0.3s 0.1s ease', style({
                       transform: 'translateX(0)',
                       width: 120
                     })),
                     animate('0.3s ease', style({
                       opacity: 1
                     }))
                   ])
                 ]),
                 transition('* => void', [
                   group([
                     animate('0.3s ease', style({
                       transform: 'translateX(-50px)',
                       width: 10
                     })),
                     animate('0.3s 0.2s ease', style({
                       opacity: 0
                     }))
                   ])
                 ])
               ])
           ]

})
export class EditionFichesComponent implements OnInit{
    @ViewChild('modal') modal: ModalComponent;
    styleDialogFavoris: string = "panel-shadow";
    styleBoutonCreation: string = "ui-button-danger input-shadow";
    iconCreation: string = 'fa-close'; //'fa-check'
    dateSelect: Date;
    cours: Cours[] = [];
    ressources: Cours[] = [];
    groupesalle: GroupeSalle[] = [];
    currentGroupe: string;
    errorMessage: string = '';
    isLoading: boolean = true;
    selectedType: string;
    checked: boolean = false; 
    types: SelectItem[];
    trancheHoraire: boolean = true;
    isNotValid: boolean = true;
    selectionFiches: string[];
    selectionnerTout: string[] = [];
    output: string;
    animation: boolean = true;
    selected: string;
    lot: Lot[];
    numeroLot: number;
    checkLot: Lot[];
    loading: boolean = false;
    failed: boolean = false;
    texte = "Le fichier est en cours de préparation...";
    dateDisabled: boolean = false;
    trancheHoraireDisabled: boolean = false;
    groupeDisabled: boolean = false;
    private sub: any;
    displaySuccessFavoris: boolean = false;
    favori: Favoris;
    favoriButtonDisabled: boolean = true;
    dateSelectString: string;
    downloadDisabled: boolean = true;
    backdrop: any;
    keyboard: any;
    cssClass: any;
    styleBoutonAnnuler: string = "btn btn-default input-shadow";
    styleBoutonTelecharger: string = "btn btn-primary input-shadow";
    

  constructor(@Inject(CoursService) private coursService : CoursService, @Inject(GroupeSalleService)private groupeSalleService: GroupeSalleService,
          @Inject(PresenceService) private presenceService: PresenceService, @Inject(LotService) private lotService: LotService,
          @Inject(Http) private http : Http, private slimLoadingBarService: SlimLoadingBarService,
          public globals: Globals,private route: ActivatedRoute, @Inject(FavorisService) private favorisService: FavorisService){   
    
      this.types = [];
      this.lot = [];
      this.checkLot = [];
      this.types.push({label:'Tous', value:'%'});
      this.dateSelect = new Date();
      this.dateSelectString = this.dateSelect.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      .charAt(0).toUpperCase()+this.dateSelect.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).substring(1);
      //this.slimLoadingBarService.height = '10px';
  
  }

  ngOnInit(){
      this.loading = false;
      this.failed = false;
      
      this.groupeSalleService
      .getListeGroupes()
      .subscribe(
        c => {this.groupesalle = c;
                               for(var i=0, len=c.length; i < len; i++)
                                   {
                                   if(c[i].lib_groupe)
                                   this.types.push({label:c[i].lib_groupe, value:c[i].num_groupe});
                                   };
              
               this.sub = this.route
                                   .queryParams
                                   .subscribe(params => {
                                       if(params['groupe'])
                                       {
                                           this.selectedType = params['groupe'];
                                       }
                                   });   
               this.getCours();
       },
        e => this.errorMessage = e,
        () => this.isLoading = false);
  }
  
  getCours() {
      if(this.selectedType == '%' || this.selectedType == undefined) this.favoriButtonDisabled = true;
      else this.favoriButtonDisabled = false;
      this.dateSelectString = this.dateSelect.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      .charAt(0).toUpperCase()+this.dateSelect.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).substring(1);
      this.dateDisabled = true;
      this.trancheHoraireDisabled = true;
      this.groupeDisabled = true;
      this.isNotValid = true;
      this.iconCreation = 'fa-close';
      this.styleBoutonCreation = "ui-button-danger input-shadow";
      this.lot = [];
      var datestring: string;
      datestring =    moment(this.dateSelect).format('DD/MM/YYYY');
      
      this.coursService.getRessourcesWithDateAndGroup(datestring,this.selectedType,this.trancheHoraire,'VP')
      .subscribe((ressourcesVP: Cours[]) => { this.ressources = ressourcesVP
          this.coursService.getRessourcesWithDateAndGroup(datestring,this.selectedType,this.trancheHoraire,'einte')
          .subscribe((ressourcesEnceintes: Cours[]) => { this.ressources = this.ressources.concat(ressourcesEnceintes);
          this.coursService.getRessourcesWithDateAndGroup(datestring,this.selectedType,this.trancheHoraire,'projecteur')
          .subscribe((ressourcesProjecteur: Cours[]) => { this.ressources = this.ressources.concat(ressourcesProjecteur);


      this.coursService
      .getWithDateAndGroup(datestring,this.selectedType,this.trancheHoraire)
      .subscribe(
         (c: Cours[]) => { 
             if(c.length == 0)
                 {
                 if(this.selectedType != undefined) this.styleBoutonCreation = "ui-button-danger wobble-animation input-shadow";
                 this.dateDisabled = false;
                 this.trancheHoraireDisabled = false;
                 this.groupeDisabled = false;
                 }
             let listeID:string[] = [];
             for(let i = 0; i < c.length; i++)
                 listeID.push(c[i].id);
             this.lotService.getFromListeID(listeID).subscribe((l: Lot[]) => this.checkLot = l);
             
             this.selectionFiches = [];                    

             this.cours = [];
             for(let i = 0; i < c.length; i++){
                 
                     
                 setTimeout(() => { 
                     this.selectionFiches.push(c[i].id);
                     this.cours.push(c[i]);
                     if((this.cours.length == (c.length-1)) || (c.length == 1) )
                         {
                         this.dateDisabled = false;
                         this.trancheHoraireDisabled = false;
                         this.groupeDisabled = false;
                         if(c.length > 0) 
                         {
                             this.isNotValid = false;
                             this.iconCreation = 'fa-check';
                             this.styleBoutonCreation = "ui-button-success input-shadow";
                             }
                         else 
                             {
                             this.iconCreation = 'fa-close';
                             this.isNotValid = true;
                             this.styleBoutonCreation = "ui-button-danger input-shadow";
                             }
                        }
                 }, 100*(i+1));
                 
             }
             

         },
         e => this.errorMessage = e,
         () => this.isLoading = false);
          },
          e => this.errorMessage = e,
          () => this.isLoading = false);
           },
          e => this.errorMessage = e,
          () => this.isLoading = false);
       },
      e => this.errorMessage = e,
      () => this.isLoading = false);
  }
  
  getMateriel(numero: string)
  {
      let identifiant = numero.split(".")[0]+'.'+numero.split(".")[1];
      let ressource = this.ressources.find(x => (x.numero.split(".")[0]+'.'+x.numero.split(".")[1]) === identifiant);
      if(ressource)
      return ressource.salle;
  }
  
  creationLot() {
    this.downloadDisabled = false;
    console.log(this.downloadDisabled);
      this.lotService.create(this.selectionFiches,this.globals.donneesConnexion.uid,this.types.find(x => x.value === this.selectedType).label).subscribe((dataResponse: Lot[]) => { 
          this.lot = dataResponse;
          this.numeroLot = this.lot[0].nolot;
          });
          //console.log(this.types.find(x => x.value === this.selectedType).label);
      this.presenceService.createLot(this.selectionFiches,this.types.find(x => x.value === this.selectedType).label).subscribe((dataResponse: Presence[]) => {
          
      });
      // Ouverture du Modal Bootstrap
      this.modal.open();
  }
  
  getCoursWithID(id: string): Cours{
      return this.cours.find(x => x.id === id);
  }
  
  lancerEdition() {
      this.loading = true;
      this.failed = false;
      this.presenceService.downloadFile(this.lot).subscribe((dataResponse) => {
          this.loading = false;
          this.modal.close();
      });
  }
  
  lancerProgressEdition()  {
      let queryArr = JSON.parse(JSON.stringify(this.lot));
      this.loading = true;
      this.failed = false;
      this.slimLoadingBarService.reset();
      this.slimLoadingBarService.start();
      return     this.makeRequest(queryArr).subscribe(
             () => {
                 this.telechargerFichier(this.lot).subscribe((dataResponse) => {
                     this.loading = false;
                     this.downloadDisabled = true;
                     this.modal.close();
                 });
             });
  }


  makeRequest(queryArr, previousObservable=null){
      if (queryArr.length) {
        let payload = JSON.stringify(queryArr[0]);
        let headers = new Headers();
        let lot = queryArr[0];
        queryArr.splice(0,1);

        var observable = null;
        if (previousObservable) {
          observable = previousObservable.flatMap(() => {
            return this.http.post(`${this.globals.appUrl}presence/creerfiche?id=`+lot.id+
                    `&nolot=`+lot.nolot+`&nofiche=`+lot.nofiche+`&cut=1&heure_edition=`+lot.heure_edition, payload,{
                headers:headers
              })
              .map((res:Response) => res.json())
              .do(() => { 
                  this.slimLoadingBarService.progress = (parseInt(lot.nofiche)/(this.lot.length))*100;
              });
          });
        } else {
            observable = this.http.post(`${this.globals.appUrl}presence/creerfiche?id=`+lot.id+
                  `&nolot=`+lot.nolot+`&nofiche=`+lot.nofiche+`&cut=1&heure_edition=`+lot.heure_edition, payload, {
            headers:headers
          })
            .map((res:Response) => res.json())
            .do(() => {
            });
        }

        return this.makeRequest(queryArr, observable);
      } else {
        return previousObservable;
      }
    }
  
  telechargerFichier(lot: Lot[]): Observable<File> {
      let groupe: string =  '';
      if(this.selectedType != '%')
          groupe = latinize(this.groupesalle.find(x => x.num_groupe === this.selectedType).lib_groupe).toUpperCase().replace(' ','_');
 
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 
          'MyApp-Application' : 'AppName', 'Accept': 'application/pdf' });
      let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
   return this.http.post(`${this.globals.appUrl}presence/sauvegarderlot`, 'lot='+JSON.stringify(lot), options)
       .map(function(res: Response) {
           let blob: Blob = res.blob();
       FileSaver.saveAs(blob, 'LOT_NO_'+this.numeroLot.toString()+'_'+groupe+'_'+moment(this.dateSelect).format('DDMMYYYY')+'_'+this.lot[0].id+'.pdf');
       },this)
       .catch(this.handleError);
   }
  
  
   private handleError (error: any) {
       // log error
       // could be something more sofisticated
       let errorMsg = error.message || `Malaise! le webservice ne peut être joint`
       console.error(errorMsg);

       // throw an application level error
       return Observable.throw(errorMsg);
     }
   
  styleLineCours(id:string)
  {
      if(this.checkLot.findIndex(item => item.id === id) != -1)
      return "already-edited";
      else
          return "";
  }
   
  opened() {
      this.output = '(opened)';
  }
  
  dismissed() {
      this.output = '(dismissed)';
  }
  closed() {
      this.output = '(closed) ' + this.selected;
      this.downloadDisabled = true;
      this.modal.dismiss();
  }
  
  
  isValid() {
      if(this.selectionFiches.length > 0) 
          {
          this.isNotValid = false;
          this.iconCreation = 'fa-check';
          this.styleBoutonCreation = "ui-button-success input-shadow";
          }
      else 
          {
          this.iconCreation = 'fa-close';
          this.isNotValid = true;
          this.styleBoutonCreation = "ui-button-danger input-shadow";
          }
  }
  animationStarted(event: AnimationTransitionEvent) {
     // console.warn('Animation started: ', event);
    }

  animationDone(event: AnimationTransitionEvent) {
      //console.warn('Animation done: ', event);
    }
  
  creerFavoris() {
      this.currentGroupe = this.groupesalle.find(x => x.num_groupe === this.selectedType).lib_groupe;
      this.favorisService.create(this.globals.donneesConnexion.uid,'Edition des fiches '+
              this.currentGroupe, '/edition',
              `{"groupe": "${this.selectedType}"}`).subscribe((dataResponse: Favoris) => { 
                  this.favori = dataResponse;
                  this.displaySuccessFavoris = true;
                  setTimeout(() => { 
                      this.styleDialogFavoris = "fadeEnd-animation panel-shadow";
                      setTimeout(() => { this.displaySuccessFavoris = false;
                      this.styleDialogFavoris = "panel-shadow";
                      },1000);
                  }, 1800);
              });
  }
  
  SelectAll()
  {
      if(this.selectionnerTout.length > 0) this.selectionFiches = this.cours.map(function(a) {return a.id;});
      else
          this.selectionFiches = [];
      this.isValid();
  }
}
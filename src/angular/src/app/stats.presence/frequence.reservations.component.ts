import { Component , OnInit  ,style, animate, transition, state, trigger, Inject } from '@angular/core';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Globals } from './../globals';
import { Observable , Subscription  } from 'rxjs/Rx';
import { Presence } from './../interfaces/presence';
import { PresenceService } from './../services/presence.service';
import * as d3 from 'd3';
import { colorSets as ngxChartsColorsets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { GroupeSalleService } from './../services/groupe.salles.service';
import { GroupeSalle } from './../interfaces/groupe.salle';
import * as moment from 'moment';
import {Router} from "@angular/router";

@Component({
  selector: 'frequence-reserv',
  templateUrl: './frequence.reservations.component.html',
  providers: [ Globals , PresenceService , GroupeSalleService],
 
})
export class FrequenceReservationsComponent implements OnInit {
    view: any[];
    colorScheme: any;
    selectedColorScheme: string;
    errorMessage: string = '';
    isLoading: boolean = true;
    sallesNombreHeures: any[];
    schemeType: string = 'ordinal';
    gradient = false;
    showXAxisLabel = true;
    xAxisLabel = 'Nombre d\'heures';
    showYAxisLabel = true;
    yAxisLabel = 'Code de la salle';
    showLegend = true;
    showXAxis = true;
    showYAxis = true;
    showGridLines = true;
    barPadding = 8;
    roundDomains = false;
    listeGroupes: string[] = [ '(toutes les salles)' ];
    selectedGroupe: any;
    dateDebut: Date;
    dateFin: Date;
    isReloaded : boolean = false;
    subscription : Subscription;
    timeOutPresence : any = [];
    heightValue: number = 100;
    closable: boolean = false;
    display: boolean = false;
    loading: boolean = false;
    resizable: boolean = false;

    
single = [
          {
              "name": "Salle",
              "value": 0
            },
        ];

  constructor(public globals: Globals,@Inject(PresenceService) private presenceService: PresenceService
          , @Inject(GroupeSalleService) private groupeSalleService: GroupeSalleService,private router: Router){  
      this.setColorScheme('cool');
      this.dateDebut = moment(new Date()).subtract(6,'months').startOf("month").utc().toDate();
      this.dateFin = moment(new Date()).endOf("month").utc().toDate();
  }

  ngOnInit(){
      this.groupeSalleService
      .getListeGroupes()
      .subscribe(
          
         c => {this.listeGroupes = this.listeGroupes.concat(c.map(g => g.lib_groupe));
         
         this.getPresence();
         },
          e => this.errorMessage = e,
          () => this.isLoading = false);

  }
  
  onLegendLabelClick(entry) {
      console.log('Legend clicked', entry);
    }

  select(data) {
      this.router.navigate(['/viewgraphics',{salles: data.name}]);
    }
  
  setColorScheme(name) {
      this.selectedColorScheme = name;
      this.colorScheme = ngxChartsColorsets.find(s => s.name === name);
    }
  getPresence() {
      this.isReloaded = true;
      this.display = true;
      this.loading = true;
      this.single = [];
      this.heightValue = 100;
      this.timeOutPresence.map(a => clearTimeout(a));
      if(this.subscription)
          this.subscription.unsubscribe();
      this.subscription =  this.presenceService
      .getListeSallesParNombreHeures(moment(this.dateDebut).format('DD/MM/YYYY'),moment(this.dateFin).format('DD/MM/YYYY'),this.selectedGroupe)
      .subscribe( 
         (sallesNombreHeures) => {  
             this.sallesNombreHeures = [];
             this.timeOutPresence = [];
             this.sallesNombreHeures = sallesNombreHeures.map(function(a) {
             if(!a.codesalle) return {codesalle:"non défini",nombreHeures:a.nombreHeures};
             else return a;
         });
             this.sallesNombreHeures = this.sallesNombreHeures.map(function(a) {
                 return {name:a.codesalle,value:Math.floor(a.nombreHeures)+(((a.nombreHeures*60)%60)/100)};
                 });
             this.display = false;
             this.loading = false;
          for(let i = 0; i < this.sallesNombreHeures.length; i++){
                 
              this.timeOutPresence.push( setTimeout(() => { 
                  this.single = this.sallesNombreHeures.slice(0,i+1);
                  this.heightValue += 10;
                 }, 100*(i+1)) );
                 
             }
         },
         e => this.errorMessage = e,
         () => this.isLoading = false);

  }

}

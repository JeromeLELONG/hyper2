import { NgModule, Component, OnInit,Renderer , style, animate, transition, state, trigger, Inject } from '@angular/core';
import { Presence } from './../interfaces/presence';
import { PresenceService } from './../services/presence.service';
import { SalleService } from './../services/salle.service';
import { Salle } from './../interfaces/salle';
import { GroupeSalle } from './../interfaces/groupe.salle';
import { Observable } from 'rxjs/Rx';
//import { routerTransition } from './router.animations';
import { Http,ResponseContentType,Response } from '@angular/http';
import * as moment from 'moment';
import { Globals } from './../globals';
import { ActivatedRoute } from '@angular/router';
import { FavorisService } from './../services/favoris.service';
import { Favoris } from './../interfaces/favoris';
import { SelectItem } from 'primeng/primeng';
import * as d3 from 'd3';
import { colorSets as ngxChartsColorsets } from '@swimlane/ngx-charts/release/utils/color-sets';

@Component({
    templateUrl: './view.graphics.component.html',
  providers: [PresenceService,SalleService, Globals , FavorisService ],
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
               ])
           ]
  //animations: [routerTransition("fadeIn")],
  //host: {'[@routerTransition]': ''}
})
export class ViewGraphicsComponent implements OnInit{

  errorMessage: string = '';
  isLoading: boolean = true;
dateDebut: Date;
dateFin: Date;
listeSalles: Salle[] = [];
salleInit: Salle;
closable: boolean = false;
display: boolean = false;
loading: boolean = false;
resizable: boolean = false;
private sub: any;
displaySuccessFavoris: boolean = false;
styleDialogFavoris: string = "panel-shadow";
favori: Favoris;

salles: SelectItem[] = [];
selectedSalles: string[] = [];
view: any[];
colorScheme: any;
schemeType: string = 'ordinal';
selectedColorScheme: string;
dateDebutString: string;
dateFinString: string;

// options
showXAxis = true;
showYAxis = true;
gradient = false;
showLegend = false;
showXAxisLabel = true;
xAxisLabel = 'Jour';
showYAxisLabel = true;
yAxisLabel = 'Nombre de présents';
showGridLines = true;
innerPadding = 0;
barPadding = 1;
groupPadding = 0;
roundDomains = false;
maxRadius = 10;
minRadius = 3;
xAxisTickFormatting: any;
yAxisTickFormatting: any;

multi = [];


  constructor(@Inject(Http)private http:Http, private renderer:Renderer, @Inject(PresenceService) private presenceService : PresenceService,@Inject(SalleService) private salleService: SalleService,
          private route: ActivatedRoute, @Inject(FavorisService) private favorisService: FavorisService,public globals: Globals){ 
      this.setColorScheme('cool');
      this.dateDebut = moment().subtract(1,'months').startOf('month').utc().toDate();
      this.dateFin = moment().endOf("month").utc().toDate();
      this.dateDebutString = this.dateDebut.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      .charAt(0).toUpperCase()+this.dateDebut.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).substring(1);
      this.dateFinString = this.dateFin.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
      .charAt(0).toUpperCase()+this.dateFin.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).substring(1);
      this.salleService
      .getAll()
      .subscribe(
         c => { this.listeSalles = c;
         this.salles = c.map(function(a) {
                 return {label:a.code,value:a.code};
             });
                            
         this.selectedSalles.push(this.listeSalles[0].code);
         if(this.route.snapshot.params.salles)
         {
             let salles = [];
             salles = this.route.snapshot.params.salles.split(',');
             this.selectedSalles = salles;
             this.getPresence("null");
         }
         else
                             this.sub = this.route
                             .queryParams
                             .subscribe(params => {
                                 if(params['salles'])
                                 {
                                     let salles = [];
                                     salles = params['salles'].split(',');
                                     this.selectedSalles = salles;
                                 }
                             });   
                             this.getPresence("null");
                             },
         e => this.errorMessage = e,
         () => this.isLoading = false);
      
  }


  
  ngOnInit(){

    }

  selectData(event){
      console.log(event);
  }
  
  onLegendLabelClick(event) {
      console.log('Legend clicked', event);
    }
  
  setColorScheme(name) {
      this.selectedColorScheme = name;
      this.colorScheme = ngxChartsColorsets.find(s => s.name === name);
    }
  
       
  public getPresence(event){
            this.display = true;
            this.loading = true;
            this.dateDebutString = this.dateDebut.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            .charAt(0).toUpperCase()+this.dateDebut.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).substring(1);
            this.dateFinString = this.dateFin.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
            .charAt(0).toUpperCase()+this.dateFin.toLocaleDateString('fr-FR',{ weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).substring(1);
           return this.presenceService
            .getListDateEtSalle(
                    moment(this.dateDebut).format('DD/MM/YYYY'),
                    moment(this.dateFin).format('DD/MM/YYYY'),
                    this.selectedSalles
                    )
            .subscribe(
                p =>  {

                   let newData = [];
                   
                   if((this.dateDebut && this.dateFin) && (this.dateDebut < this.dateFin))
                   {
                      let startDate: moment.Moment;
                      let endDate: moment.Moment;
                      let series: any[] = [];
                      startDate = moment(this.dateDebut);
                      endDate = moment(this.dateFin);
                      while(moment(startDate).format('MM/D/YYYY') !== moment(endDate).format('MM/D/YYYY')) 
                      {
                       series = [];
                       startDate = moment(startDate).add(1, 'days');

                       for(var i=0, len=this.selectedSalles.length; i < len; i++)
                       {
                           let totalPresents = 0;
                           let salle = this.selectedSalles[i];
                           let jour = moment(startDate).format('DD/MM/YYYY')
                           totalPresents = p.filter(function(item){ 
                               return item.codesalle == salle;}, salle).filter(function(item){ 
                                   return item.datesem == jour;}, jour).reduce(function (a,b) 
                                           { return a + +b.nbpresents; }, 0);
                           series.push({name: this.selectedSalles[i], value: totalPresents});
                       }
                       newData.push({ name: moment(startDate).format('DD/MM/YYYY'),
                           series: series
                         });
                      }
                      
                   }
                   this.multi = newData;
                   
                   this.display = false;
                   this.loading = false;
               },
                e => this.errorMessage = e,
                () => this.isLoading = false);
        } 

        creerFavoris() {
            this.favorisService.create(this.globals.donneesConnexion.uid,'Graphiques '+
                    JSON.stringify(this.selectedSalles).replace('[','').replace(']','').replace(/"/g, ''), '/viewgraphics',
                    `{"salles": `+JSON.stringify(this.selectedSalles)+` }`).subscribe((dataResponse: Favoris) => { 
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
}
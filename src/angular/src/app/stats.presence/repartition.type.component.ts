import { Component , OnInit  ,style, animate, transition, state, trigger, Inject } from '@angular/core';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Globals } from './../globals';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import * as d3 from 'd3';
import { colorSets as ngxChartsColorsets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { Presence } from './../interfaces/presence';
import { PresenceService } from './../services/presence.service';
import * as moment from 'moment';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'repart-type',
  templateUrl: './repartition.type.component.html',
  providers: [ Globals, PresenceService  ],
 
})
export class RepartitionTypeComponent implements OnInit {

    single = [];
    chartType = 'bar-vertical';
    view: any[];
    colorScheme: any;
    schemeType: string = 'ordinal';
    selectedColorScheme: string;
    errorMessage: string = '';
    isLoading: boolean = true;
    dateDebut: Date;
    dateFin: Date;
    types: SelectItem[] = [];

    selectedTypes: string[] = [];

    
    // options
    showXAxis = true;
    showYAxis = true;
    gradient = false;
    showLegend = true;
    showXAxisLabel = true;
    xAxisLabel = 'Type de la séance';
    showYAxisLabel = true;
    yAxisLabel = 'Nombre de séances';
    showGridLines = true;
    innerPadding = 8;
    barPadding = 8;
    groupPadding = 16;
    roundDomains = false;
    maxRadius = 10;
    minRadius = 3;
    xAxisTickFormatting: any;
    yAxisTickFormatting: any;

    showLabels = true;
    explodeSlices = false;
    doughnut = false;
    arcWidth = 0.25;
    display: boolean = false;
    loading: boolean = false;
    
  constructor(public globals: Globals,@Inject(PresenceService) private presenceService: PresenceService){  
      this.setColorScheme('cool');
      this.dateDebut = moment(new Date()).subtract(1,'months').startOf('month').utc().toDate();
      this.dateFin = moment(new Date()).endOf("month").utc().toDate();
      //this.dateFin.setDate(this.dateFin.getDate() - 25);
  }




  ngOnInit(){
      this.presenceService
      .getListeTypes()
      .subscribe(
         (types) => {
         this.types = types.map(function(a) {
             if(a.type)
                 return {label:a.type,value:a.type};
             else
                 return {label:"(vide)",value:"(vide)"};
             });
         this.selectedTypes = this.types.slice(0,10).map(function(a) {
         if(!a.value) return "(vide)";
         else
         return a.value;
         });
         
         this.getPresence();
         },
         e => this.errorMessage = e,
         () => this.isLoading = false);
      

  }
  
  selectData(data){
      console.log(data);
  }
  
  onLegendLabelClick(entry) {
      console.log('Legend clicked', entry);
    }
  
  setColorScheme(name) {
      this.selectedColorScheme = name;
      this.colorScheme = ngxChartsColorsets.find(s => s.name === name);
    }
  
  getPresence()
  {
      this.display = true;
      this.loading = true;
      this.selectedTypes = this.selectedTypes.map(function(a) {
          if(!a) return "(vide)";
          else
          return a;
          });
          
      this.presenceService
      .getListDateSalleEnseignant(moment(this.dateDebut).format('DD/MM/YYYY'),moment(this.dateFin).format('DD/MM/YYYY'),[],[],[] )
      .subscribe(
         (p: Presence[]) => {   
             let newData = [];
             this.selectedTypes.map(function(a) {
                 let typeEvenement: string;
                 typeEvenement = a;
                 newData.push({name:typeEvenement,value:p.filter(function(item){ 
                     if(typeEvenement == "(vide)") return !item.typecours;
                     else
                     return item.typecours == typeEvenement;
                     }, this).length});
                 return a;
                 },newData);
             this.single = newData.filter(function(item){ if(item.value) return item;});
             this.display = false;
             this.loading = false;
         },
         e => this.errorMessage = e,
         () => this.isLoading = false);
  }
  
  

}

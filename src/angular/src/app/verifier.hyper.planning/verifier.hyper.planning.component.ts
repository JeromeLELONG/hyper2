import { Component, OnInit, style, animate, transition, state, trigger,ViewChild , Inject} from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { SalleHP } from './../interfaces/ressources.hp';
import { HyperService } from './../services/hyper.service';
import { Salle } from './../interfaces/salle';
import { SalleService } from './../services/salle.service';
import { Globals } from './../globals';
import {GridOptions} from "ag-grid/main";

@Component({
    templateUrl: './verifier.hyper.planning.component.html',
    animations: [
               trigger('fadeIn', [
                   state('*', style({'opacity': 1})),
                   transition('void => *', [
                       style({'opacity': 0}),
                       animate('800ms linear')
                   ])
               ])
           ],
providers: [ HyperService, SalleService , Globals],
styles: ['>>> .modal-xl { width: 1000px; }'],
  //animations: [routerTransition("fadeIn")],
  //host: {'[@routerTransition]': ''}
})
export class VerifierHyperPlanningComponent {
    @ViewChild('modal') modal: ModalComponent;
    animation: boolean = true;
    output: string;
    selected: string;
    listeSallesHP: SalleHP[] = [];
    listeSalles: Salle[] = [];
    listeSallesCreees: Salle[] = [];
    listeSallesSupprimees: Salle[] = [];
    errorMessage: string = '';
    isLoading: boolean = true;
    SallesHPgridOptions:GridOptions = [];
    SallesGridOptions:GridOptions = [];
    backdrop: any;
    keyboard: any;
    styleBoutonMiseAJour: string = "btn btn-primary input-shadow";
    styleBoutonAnnuler: string = "btn btn-default input-shadow";
    styleBoutonValider: string = "btn btn-primary input-shadow";


    sallesHPcolumnDefs: any = [
                 {headerName: 'Code', field: "code" ,width:68},
                 {headerName: 'ID', field: "numero" ,width:44},
                 {headerName: 'Nom', field: "nom", width: 80 },
                 {headerName: 'Famille', field: "famille" ,width:70},
                 {headerName: 'Capacité', field: "capa" ,width:75},
                 {headerName: 'Propriétaire', field: "prop" ,width:75}
             ];
    
    constructor(@Inject(HyperService) private hyperService : HyperService,private globals: Globals,
            @Inject(SalleService) private salleService : SalleService) {
       
        let localeText = {
                contains: 'Contient',
                equals: 'Egal à',
                notEquals: 'Différent de',
                startsWith: 'Débute avec',
                endsWith: 'Termine avec',
        };
        this.SallesHPgridOptions = <GridOptions>{
            rowData: this.listeSallesHP,
            columnDefs: this.sallesHPcolumnDefs,
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            localeText: localeText
        }
        
        this.SallesGridOptions = <GridOptions>{
            rowData: this.listeSalles,
            columnDefs: this.sallesHPcolumnDefs,
            enableColResize: true,
            enableSorting: true,
            enableFilter: true,
            localeText: localeText
        }
        
}
    
    NgOnInit(){

    }

controleSallesHP() {
    this.listeSallesCreees = [];
    this.listeSallesSupprimees = [];
    this.hyperService
    .getSallesHP()
    .subscribe(
        c => {   
           this.listeSallesHP = c;   
           this.SallesHPgridOptions.api.setRowData(this.listeSallesHP);
           
           this.salleService
           .getAll()
           .subscribe(
              c => { 
              this.listeSalles = c;
              this.SallesGridOptions.api.setRowData(this.listeSalles);
              for(var i=0, len=this.listeSallesHP.length; i < len; i++)
                  if(this.listeSallesHP[i].code && !(this.listeSallesHP[i].code.substring(0,2) == "VP") && 
                          !(this.listeSallesHP[i].code.substring(0,2) == "TV") &&
                          !(this.listeSallesHP[i].code.substring(0,8) == "Enceinte") &&
                          !(this.listeSallesHP[i].code.substring(0,10) == "paperboard"))
                      //if((this.listeSalles.findIndex(x => x.numero == this.listeSallesHP[i].numero)) == -1)
                      if((this.listeSalles.findIndex(x => x.code == this.listeSallesHP[i].code)) == -1)
                          this.listeSallesCreees.push({id: 0,nom:this.listeSallesHP[i].nom,famille:this.listeSallesHP[i].famille,
                           capa:this.listeSallesHP[i].capa,nbocc:this.listeSallesHP[i].nbocc,occ:this.listeSallesHP[i].occ,
                           prop:this.listeSallesHP[i].prop,code:this.listeSallesHP[i].code,numero:this.listeSallesHP[i].numero});
              
              for(var i=0, len=this.listeSalles.length; i < len; i++)
                      if((this.listeSallesHP.findIndex(x => x.code == this.listeSalles[i].code)) == -1)
                          this.listeSallesSupprimees.push(this.listeSalles[i]);
              },
              e => this.errorMessage = e,
              () => this.isLoading = false);
           },
        e => this.errorMessage = e,
        () => this.isLoading = false);

    this.modal.open();
}
opened() {
    this.output = '(opened)';
}

dismissed() {
    this.output = '(dismissed)';
}
closed() {
    this.output = '(closed) ' + this.selected;
}

MajSallesHP(){
    this.hyperService
    .doMajSalles()
    .subscribe(
        c => {},
        e => this.errorMessage = e,
        () => this.isLoading = false);
    this.modal.close();
}

}

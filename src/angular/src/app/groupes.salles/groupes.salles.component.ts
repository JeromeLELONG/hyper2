import { NgModule,OnInit ,Component, style, animate, transition, state, trigger, ViewChild ,Input ,Inject } from '@angular/core';
//import { routerTransition } from './router.animations';
import { GroupeSalleService } from './../services/groupe.salles.service';
import { SalleService } from './../services/salle.service';
import { GroupeSalle } from './../interfaces/groupe.salle';
import { Salle } from './../interfaces/salle';
import { SelectItem, ConfirmationService } from 'primeng/primeng';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Response } from '@angular/http';
import { Globals } from './../globals';

@Component({
    templateUrl: './groupes.salles.component.html',
      providers: [GroupeSalleService, SalleService,ConfirmationService , Globals],
      animations: [
               trigger('fadeIn', [
                   state('*', style({'opacity': 1})),
                   transition('void => *', [
                       style({'opacity': 0}),
                       animate('800ms linear')
                   ])
               ]),
               trigger('fadeInSallesGroupe', [
                 state('shown' , style({ opacity: 1 })),
                 state('hidden', style({ opacity: 0 })),
                 transition('* => *', animate('.5s'))
               ])
           ]
  //animations: [routerTransition("fadeIn")],
  //host: {'[@routerTransition]': ''}
})
export class GroupesSallesListComponent implements OnInit{
    groupes: SelectItem[] = [];
    groupeSelected: string;
    sallesDuGroupe: SelectItem[] = [];
    salleSelect: string;
    sallesDispos: SelectItem[] = [];
    salleDispoSelect: string;
    groupesalle: GroupeSalle[] = [];
    errorMessage: string = '';
    isLoading: boolean = true;
    backdrop: any;
    keyboard: any;
    cssClass: any;
    @ViewChild('modal') modal: ModalComponent;
    output: string;
    selected: string;
    animation: boolean = true;
    groupeActif: GroupeSalle;
    listeSalles: Salle[] = [];
    salleInit: Salle;
    groupesDisabled: boolean = false;
    styleBoutonCreation: string = "btn btn-primary input-shadow";
    styleBoutonSuppression: string = "btn btn-danger input-shadow";
    styleBoutonAnnuler: string = "btn btn-default input-shadow";
    styleBoutonSauvegarder: string = "btn btn-primary input-shadow";

    @Input() isVisible : boolean = true;
    visibility = 'shown';
    
    Shown() {
        this.visibility = 'shown';
     }
    Hidden() {
        this.visibility = 'hidden';
     }
    
    constructor(@Inject(GroupeSalleService) private groupeSalleService: GroupeSalleService,
            @Inject(SalleService) private salleService: SalleService,
            @Inject(ConfirmationService) private confirmationService: ConfirmationService) {
        this.groupeActif = <GroupeSalle>({
            code: '',
            num_groupe: '',
            lib_groupe: '',
            lib_groupe_long: '', 
            id_groupesalle: 0,
            });
        this.groupes = [];
        this.sallesDuGroupe = [];
        this.sallesDispos = [];
    }
    
    ngOnInit(){
        this.salleService
        .getAll()
        .subscribe(
           /* happy path */ c => { this.listeSalles = c;},
           /* error path */ e => this.errorMessage = e,
           /* onComplete */ () => this.isLoading = false);
        this.groupeSalleService
        .getListeGroupes()
        .subscribe(
           /* happy path */ c => {this.groupesalle = c;
                                   for(var i=0, len=c.length; i < len; i++)
                                      {
                                      if(c[i].lib_groupe)
                                      this.groupes.push({label:c[i].lib_groupe, value:c[i].num_groupe});
                                      };
                                   },
           /* error path */ e => this.errorMessage = e,
           /* onComplete */ () => this.isLoading = false);

    }
    
    groupeSelect()
    {   
        setTimeout(() => {
            for(var i=0, len=this.groupes.length; i < len; i++)
                if(this.groupes[i].value == this.groupeSelected) this.groupeActif.lib_groupe = this.groupes[i].label;
            this.groupeSalleService
            .getSallesAffectees(this.groupeSelected)
            .subscribe(
               /* happy path */ c => {this.sallesDuGroupe = [];
                                       for(var i=0, len=c.length; i < len; i++)
                                          {
                                          this.sallesDuGroupe.push({label:c[i].code, value:c[i].code});
                                          };
                                       },
               /* error path */ e => this.errorMessage = e,
               /* onComplete */ () => this.isLoading = false);
            this.salleService
            .getSallesDispos(this.groupeSelected)
            .subscribe(
               /* happy path */ c => { this.sallesDispos = [];
                                       for(var i=0, len=c.length; i < len; i++)
                                          {
                                          this.sallesDispos.push({label:c[i].code, value:c[i].code});
                                          }
               },
               /* error path */ e => this.errorMessage = e,
               /* onComplete */ () => this.isLoading = false);
            this.Shown();
            
        }, 1000);

        this.Hidden();
    }
    removeSalle()
    {   

        this.groupeSalleService
        .getId(this.groupeSelected,this.salleSelect)
        .subscribe(
          (r: GroupeSalle) => this.groupeActif = r);
        
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer la salle du groupe '+this.getLabelGroupe(this.groupeSelected)+'?',
            accept: () => {
                this.groupeSalleService
                .deleteSalle(this.groupeActif.id_groupesalle)
                .subscribe(
                  (r: GroupeSalle) => {});
                        for(var i=0, len=this.sallesDuGroupe.length; i < len; i++)
                          if(this.sallesDuGroupe[i].value == this.salleSelect)
                          {
                              this.sallesDispos.push({label:this.sallesDuGroupe[i].label, value:this.sallesDuGroupe[i].value});
                              this.sallesDispos.sort(function (a, b) {
                                  return a.value - b.value;
                              });
                              this.sallesDuGroupe.splice(i,1);
                              break;
                          }
                  }
                //Actual logic to perform a confirmation
                  //);
                
            //}
        }); 
    }
    addSalle()
    {

        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment ajouter cette salle au groupe '+this.getLabelGroupe(this.groupeSelected)+'?',
            accept: () => {
                this.groupeActif.num_groupe = this.groupeSelected;
                this.groupeActif.code = this.salleDispoSelect;
                this.groupeActif.lib_groupe = this.getLabelGroupe(this.groupeSelected);
                this.groupeActif.id_groupesalle = 0;
                this.groupeSalleService
                .create(this.groupeActif)
                .subscribe(
                  (r: GroupeSalle) => {
                      }
                );
                for(var i=0, len=this.sallesDispos.length; i < len; i++)
                    if(this.sallesDispos[i].value == this.salleDispoSelect)
                        {
                        this.sallesDuGroupe.push({label:this.sallesDispos[i].label,value:this.sallesDispos[i].value});
                        this.sallesDuGroupe.sort(function (a, b) {
                            return a.value - b.value;
                        });
                        this.sallesDispos.splice(i,1);
                        break;
                        }
                
            }
        });
        
    }
    
    opened() {
        this.output = '(opened)';
    }
    onSubmit() {

    }
    
    dismissed() {
        this.output = '(dismissed)';
    }
    closed() {
        this.output = '(closed) ' + this.selected;
    }
    saveGroupe(){
        this.groupeSalleService
        .create(this.groupeActif)
        .subscribe(
          (r: GroupeSalle) => {this.groupes.push({label:r.lib_groupe, value:r.num_groupe});
              }
        );
     this.modal.close();
    }
    
    getLabelGroupe(num_groupe: string){
        for(var i=0, len=this.groupes.length; i < len; i++)
            if(this.groupes[i].value == num_groupe)
                return this.groupes[i].label;
    }
    
    deleteGroupe(){
       
        this.confirmationService.confirm({
            message: 'Voulez-vous vraiment supprimer le groupe '+this.getLabelGroupe(this.groupeSelected)+'?',
            accept: () => {
                let groupesTemp: SelectItem[] = [];
                this.groupeSalleService
                .deleteGroupe(this.groupeSelected)
                .subscribe(
                  (r: Response) => {
                  for(var i=0, len=this.groupes.length; i < len; i++)
                      if(this.groupes[i].value != this.groupeSelected)
                          groupesTemp.push(this.groupes[i]);
                  this.groupes = groupesTemp;
                  this.sallesDuGroupe = [];
                  this.sallesDispos = [];

                  }
                );
            }
        });
        
    }
}

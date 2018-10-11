import { Component, OnInit, style, animate, transition, state, trigger,ViewChild , Inject} from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Globals } from './../globals';
import { UserService } from './../services/user.service';
import { User } from './../interfaces/user';

@Component({
    templateUrl: './admin.users.component.html',
    animations: [
               trigger('fadeIn', [
                   state('*', style({'opacity': 1})),
                   transition('void => *', [
                       style({'opacity': 0}),
                       animate('800ms linear')
                   ])
               ])
           ],
providers: [ UserService,Globals],
styles: [`>>> .modal-xl { width: 960px; },
         ng2-auto-complete, input {
             display: block; border: 1px solid #ccc; width: 300px;
           }`],
  //animations: [routerTransition("fadeIn")],
  //host: {'[@routerTransition]': ''}
})
export class AdminUsersComponent implements OnInit{
    @ViewChild('modal') modal: ModalComponent;
    animation: boolean = true;
    output: string;
    selected: string;
    errorMessage: string = '';
    isLoading: boolean = true;
    backdrop: any;
    keyboard: any;
    adduser: User;
    listeutilisateurs: User[] = [];
    enseignant = {nom_enseignant: ""};
    ListeEnseignants: string = `${this.globals.appUrl}ldapservice?nom=:nom_enseignant&uid=true`;
    styleBoutonAjouter: string = "btn btn-primary input-shadow";
    stylesDelete: string[] = [];

    
    constructor(@Inject(UserService) private userService: UserService,
            private globals: Globals) {
        if(location.host.search('localhost') == 0)
            this.ListeEnseignants = `${this.globals.appUrl}ldapservice?nom=:nom_enseignant&uid=true`;
        else
            this.ListeEnseignants = "/ldapservice?nom=:nom_enseignant&uid=true";
        
        this.adduser = <User>({
            username: '',
            password: '',
            service: '',
            nom: '', 
            prenom: '',
            email: '',
            role: '',
            });
        
}
    
    ngOnInit(){
        this.getListeUtilisateurs();
    }
    setNomUtilisateur(){
        if((typeof this.enseignant) === "string")
            {
            this.enseignant = {nom_enseignant: this.enseignant.toString()};
        this.globals.getDonneesUtilisateur(this.enseignant.nom_enseignant.substring(0,this.enseignant.nom_enseignant.indexOf(" - ")))
        .subscribe((data: User) => {
            this.adduser = data;
        });
            }
    }
    
    ajouterUtilisateur() {
        this.adduser.role = "gest";
        this.userService.create(this.adduser).subscribe((dataResponse: any) => { 
            
            this.getListeUtilisateurs();
            });
    }
    
    supprimerUtilisateur(username: string) {
        this.userService.delete(username).subscribe((dataResponse: any) => { 
            
            this.getListeUtilisateurs();
            });
    }
    
    getListeUtilisateurs() {
        this.userService
        .getAll()
        .subscribe(
          c => {this.listeutilisateurs = c;
          this.stylesDelete = [];
          for(let i =0, len =this.listeutilisateurs.length; i < len; i++)
          {
              this.stylesDelete.push('btn btn-danger input-shadow');
          }
         },
          e => this.errorMessage = e,
          () => this.isLoading = false);
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


}

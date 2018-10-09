//import * as jQuery from 'jquery';
import { Component , OnInit  ,style, animate, transition, state, trigger, Inject} from '@angular/core';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Globals } from './globals';
import { Observable } from 'rxjs/Rx';
import { LoginData } from './interfaces/logindata';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [ Globals ],
  animations: [
               trigger('fadeIn', [
                   state('*', style({'opacity': 1})),
                   transition('void => *', [
                       style({'opacity': 0}),
                       animate('800ms linear')
                   ])
               ]),
               trigger('SlideFromTop', [
                                            state('void', style({position:'absolute', width:'100%', height:'100%'}) ),
                                            state('*', style({position:'absolute', width:'100%', height:'100%'}) ),
                                            transition(':enter', [
                                              style({transform: 'translateY(-100%)'}),
                                              animate('1.2s ease-in-out', style({transform: 'translateY(0%)'}))
                                            ]),
                                            transition(':leave', [
                                              style({transform: 'translateY(0%)'}),
                                              animate('1.2s ease-in-out', style({transform: 'translateY(100%)'}))
                                            ])
             ]),
             trigger('SlideFromRight', [
                                          state('void', style({position:'absolute', width:'100%'}) ),
                                          state('*', style({position:'absolute', width:'100%'}) ),
                                          transition(':enter', [
                                            style({transform: 'translateX(100%)'}),
                                            animate('1.2s ease-in-out', style({transform: 'translateX(0%)'}))
                                          ]),
                                          transition(':leave', [
                                            style({transform: 'translateX(0%)'}),
                                            animate('1.2s ease-in-out', style({transform: 'translateX(-100%)'}))
                                          ])
                 ]),
             trigger('SlideFromLeft', [
                                           state('void', style({position:'absolute', width:'100%'}) ),
                                           state('*', style({position:'absolute', width:'100%'}) ),
                                           transition(':enter', [
                                             style({transform: 'translateX(-100%)'}),
                                             animate('1.5s ease-in-out', style({transform: 'translateX(0%)'}))
                                           ]),
                                           transition(':leave', [
                                             style({transform: 'translateX(0%)'}),
                                             animate('1.5s ease-in-out', style({transform: 'translateX(100%)'}))
                                           ])
              ])    
           ]
})
export class AppComponent {
  title = 'Outil de gestion des présences HP';
  styleAccueilButton = "barrenav-shadow";
  styleEditionButton = "barrenav-shadow";
  styleGraphicButton = "barrenav-shadow";
  styleGroupesButton = "barrenav-shadow";
  stylePlanningButton = "barrenav-shadow";
  styleHyperButton = "barrenav-shadow";
  styleSaisieButton = "barrenav-shadow";
  styleStatsButton = "barrenav-shadow";
  styleExportButton = "barrenav-shadow";
  styleSuiviButton = "barrenav-shadow";
  styleUsersButton = "barrenav-shadow";
  styleLogoutButton = "barrenav-shadow";
  labelInit: string = "";
  label: string = "2018 - Direction des Systèmes d'Information - ";
  labelLogo1Init: string = "";
  labelLogo1: string = "le cn";
  labelLogo2Init: string = "";
  labelLogo2: string = "am";
  label2Init: string = "";
  label2: string = "Paris";
  width: number;
  constructor(public globals: Globals){  
      for(let i = 0; i < this.label.length; i++)
      {
          setTimeout(() => { 
              this.labelInit += this.label.substring(i,i+1);
          }, 80*(i+1));
          
      }
      this.width = window.innerWidth;
      for(let i = 0; i < this.labelLogo1.length; i++)
      {
      setTimeout(() => { 
          this.labelLogo1Init += this.labelLogo1.substring(i,i+1);
      }, 80*(i+47));
      }
      
      for(let i = 0; i < this.labelLogo2.length; i++)
      {
      setTimeout(() => { 
          this.labelLogo2Init += this.labelLogo2.substring(i,i+1);
      }, 80*(i+52));
      }
      
      for(let i = 0; i < this.label2.length; i++)
      {
      setTimeout(() => { 
          this.label2Init += this.label2.substring(i,i+1);
      }, 80*(i+55));
      }
  }

  onResize(event) {
      this.width = event.target.innerWidth;
    }
  
  isActive(page)
  {
      return (page == window.location.pathname || '/app'+page == window.location.pathname);
  }
    
  ngOnInit(){ 

  
  }
  
  logout() {
      window.location.href='logout';
  }
}

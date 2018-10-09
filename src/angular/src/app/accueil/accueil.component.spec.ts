/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Injectable, Inject } from '@angular/core';
import { AccueilComponent } from './accueil.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpModule} from '@angular/http';
import { LoginData } from '../interfaces/logindata';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Globals } from '../globals';
import { ChartModule as HighChartModule } from 'angular2-highcharts';
import { FormsModule } from '@angular/forms';
import { PaginatorModule,CheckboxModule,CalendarModule,SelectButtonModule,TabViewModule,
  ChartModule,
  ListboxModule,ConfirmDialogModule,ButtonModule,InputSwitchModule,ScheduleModule,
  RadioButtonModule, DialogModule,TabMenuModule,SliderModule,GrowlModule,DataTableModule,SharedModule,
  ContextMenuModule, OverlayPanelModule, DataGridModule,PanelModule,MultiSelectModule} from 'primeng/primeng';
import { Observable } from 'rxjs/Rx';
import { LotService } from './../services/lot.service';
import { FavorisService } from './../services/favoris.service';
import { PresenceService } from './../services/presence.service';
import { Favoris } from './../interfaces/favoris';
import { Lot } from './../interfaces/lot';

  Injectable()
  class MockFavoris { 


    constructor(@Inject(Http) private http : Http){ 

    }
    
    getWithUsername(username: string): Observable<Favoris[]>{
      return Observable.of(<Favoris[]>([{"id_favoris":1,"username":"lelongj","libelle":"Graphiques 31.2.85   et salles perso","routerlink":"\/viewgraphics","params":"{\u0022salles\u0022:[\u002231.2.85\u0022,\u0022\u0022,\u0022\u0022,\u0022\u0022]}"},
      {"id_favoris":2,"username":"lelongj","libelle":"Mes salles test","routerlink":"\/viewgraphics","params":"{\u0022salles\u0022:[\u002231.2.85\u0022,\u002231.2.89\u0022,\u002231.3.10\u0022,\u002235.1.53\u0022]}"}]));
    }
  }

  Injectable()
  class MockLot { 


    constructor(@Inject(Http) private http : Http){ 

    }
    
    getWithUsername(username: string): Observable<Lot[]>{
      return Observable.of(<Lot[]>([{"nolot":63085,"nofiche":1,"id":"47db892205d84c6e558a0d46bff97940","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":2,"id":"58e55dea693cf327158fa6229e482b27","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":3,"id":"8547b2678691bceadeb6148b5e1b2493","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":4,"id":"c63e29f7949419354cb31fb70448b033","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":5,"id":"c600bd382a66bd1745b3676b9d01029a","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":6,"id":"a9df0cfcc6d66f3c672947b136db21a3","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":7,"id":"14fd52ec301908175ab161dc291c6a1a","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":8,"id":"105ea562e98f83e1530db17925af9b21","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":9,"id":"b11d4d9167bfde91e2dc6bd514491d22","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":10,"id":"9aed71285a76b75501a22b464b0e97e4","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":11,"id":"3c460a9dfaeaf78fab6129eb27ae5d48","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":12,"id":"575528e31971bcd1c36918e14b528e4b","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":13,"id":"db26e6db5cd3fda411fe0afc084fd005","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":14,"id":"53c014c9bdba813a7fab8bd40d02271a","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":15,"id":"c75cf1895c69f0dba194df07668e1acc","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":16,"id":"a8e8c3a556a29455e8dd7b97bcd1e2fd","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":17,"id":"c8f960a99d37fff25155c3925d190956","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":18,"id":"e67f69b34f5f1049d3f1ccd13337dea7","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":19,"id":"43f958b1089442499c4bd1dcb58e4d4e","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":20,"id":"b9cf14690fdf9fde11a57cfab0b0eb16","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":21,"id":"deeaf56503117cf9dd4ded13f951488b","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":22,"id":"6612f0fd7477bd1ae78c1bc3be5db920","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"},
      {"nolot":63085,"nofiche":23,"id":"e034cec3bbe16305df0b821a291f6856","heure_edition":new Date("2018-07-10 15:04:59"),"username":"lelongj"}]));
    }
  }

  
  Injectable()
  class MockGlobals { 
    donneesConnexion: LoginData;
    constructor(@Inject(Http) private http : Http){ 
      this.getDonneesConnexion().subscribe((data: LoginData[]) => {
        this.donneesConnexion = <LoginData>data[0];
      });
    }

    public getDonneesConnexion(): Observable<LoginData[]> {
      return Observable.of(<LoginData[]>([{acl: [ ' ' ],
      attributbase: '',
      bureau:'',
      casecourrier:'',
      civilite:'',
      cn:'John Viller',
      cnamlinkoffice:'',
      cnammailbox:'',
      codebureau:'',
      codedirection:'',
      codeservice:'',
      codestructure:'',
      datefin:'',
      datenaissance:'',
      dialupaccess:'',
      direction:'',
      dirxml_associations:[ ' ' ],
      dn:'',
      edupersonprincipalname:'',
      facsimiletelephonenumber:'',
      fonction:'',
      fullname:'',
      gecos:'',
      gidnumber:'',
      givenname:'',
      grade:'',
      groupadmin:[ ' ' ],
      homedirectory:'',
      idvirtualia:'',
      indice:'',
      lecnamnet_login:'',
      lecnamnet_mail:'',
      loginshell:'',
      logintime:'',
      loginunix_courant:'',
      mail:'',
      mailalternateaddress:[ ' ' ],
      mailforwardingaddress:'',
      mailhost:'',
      mailmessagestore:'',
      mailquota:'',
      manager:'',
      mobile:'',
      numerobadge:'',
      objectclass:[ ' ' ],
      passwordallowchange:'',
      passwordminimumlength:'',
      passwordrequired:'',
      passworduniquerequired:'',
      patronyme:'',
      position:'',
      precedence1:'',
      precedence2:'',
      precedence3:'',
      precedence4:'',
      preferredlanguage:'',
      radiustunnelmediumtype:'',
      radiustunnelprivategroupid:'',
      radiustunneltype:'',
      roomnumber:'',
      sapid:'',
      sapsncname:'',
      sapusername:'',
      service:'',
      servicepath:'',
      sn:'',
      statut:'',
      structure:'',
      supannactivite:'',
      supanncivilite:'',
      supannempcorps:'',
      telephonenumber:'',
      title:'',
      uid:'testuser',
      uidnumber:'',
      vpnallowed:'',
      watchdog:''}]));
      }
  }


describe('AccueilComponent', () => {
  let service: MockGlobals;
  let component: AccueilComponent;
  let fixture;
  beforeEach(() => {
    
    service = new MockGlobals(null);
    TestBed.configureTestingModule({
      declarations: [
        AccueilComponent
      ],
      imports: [PaginatorModule,CheckboxModule,CalendarModule,SelectButtonModule,TabViewModule,FormsModule,
        ChartModule,HttpModule,RouterTestingModule,BrowserAnimationsModule,
        ListboxModule,ConfirmDialogModule,ButtonModule,InputSwitchModule,ScheduleModule,
        RadioButtonModule, DialogModule,TabMenuModule,SliderModule,GrowlModule,DataTableModule,SharedModule,
        ContextMenuModule, OverlayPanelModule, DataGridModule,PanelModule,MultiSelectModule,HighChartModule]
    }).overrideComponent(AccueilComponent, {
      set: {
        providers : [ {provide: Globals, useClass: MockGlobals},{provide: LotService, useClass: MockLot},{provide: FavorisService, useClass: MockFavoris},PresenceService],
      }
    });;
     fixture = TestBed.createComponent(AccueilComponent);
     component = fixture.componentInstance
    TestBed.compileComponents();
  });

  afterEach(() => {
    service = null;
    component = null;
  });

  it('should return favorites', async((done) => {
    fixture.detectChanges();
    expect(component.favoris[0]).toEqual({id_favoris: 1, username: 'lelongj', libelle: 'Graphiques 31.2.85   et salles perso', routerlink: '/viewgraphics', params: '{"salles":["31.2.85","","",""]}'});
  }));
/*
  it(`should have as title 'app works!'`, async((done) => {
    expect(component.title).toEqual('Outil de gestion des présences HP');
  }));

  it('should render title in a h1 tag', async((done) => {
    //let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('Gestion du suivi des présences');
  }));
  */
});

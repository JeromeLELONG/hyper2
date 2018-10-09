/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Injectable, Inject } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpModule} from '@angular/http';
import { LoginData } from './interfaces/logindata';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { RouterTestingModule } from '@angular/router/testing';
import { Globals } from './globals';
import { PaginatorModule,CheckboxModule,CalendarModule,SelectButtonModule,TabViewModule,
  ChartModule,
  ListboxModule,ConfirmDialogModule,ButtonModule,InputSwitchModule,ScheduleModule,
  RadioButtonModule, DialogModule,TabMenuModule,SliderModule,GrowlModule,DataTableModule,SharedModule,
  ContextMenuModule, OverlayPanelModule, DataGridModule,PanelModule,MultiSelectModule} from 'primeng/primeng';
import { Observable } from 'rxjs/Rx';

  Injectable()
  class MockGlobals { 
    donneesConnexion: LoginData;

    constructor(@Inject(Http) private http : Http){ 
      this.getDonneesConnexion().subscribe((data: LoginData) => {
        this.donneesConnexion = data;
      });
    }

    public getDonneesConnexion(): Observable<LoginData> {
      return Observable.of(<LoginData>({acl: [ ' ' ],
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
      uid:'',
      uidnumber:'',
      vpnallowed:'',
      watchdog:''}));
      }
  }

describe('AppComponent', () => {
  let service: MockGlobals;
  let component: AppComponent;
  let fixture;
  beforeEach(() => {
    
    service = new MockGlobals(null);
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [PaginatorModule,CheckboxModule,CalendarModule,SelectButtonModule,TabViewModule,
        ChartModule,HttpModule,RouterTestingModule,BrowserAnimationsModule,
        ListboxModule,ConfirmDialogModule,ButtonModule,InputSwitchModule,ScheduleModule,
        RadioButtonModule, DialogModule,TabMenuModule,SliderModule,GrowlModule,DataTableModule,SharedModule,
        ContextMenuModule, OverlayPanelModule, DataGridModule,PanelModule,MultiSelectModule]
    }).overrideComponent(AppComponent, {
      set: {
        providers : [ {provide: Globals, useClass: MockGlobals}],
      }
    });;
     fixture = TestBed.createComponent(AppComponent);
     component = fixture.componentInstance
    TestBed.compileComponents();
  });

  afterEach(() => {
    service = null;
    component = null;
  });

  it('should create the app', async((done) => {
    expect(component.globals.donneesConnexion.cn).toEqual('John Viller');
  }));

  it(`should have as title 'app works!'`, async((done) => {
    expect(component.title).toEqual('Outil de gestion des présences HP');
  }));

  it('should render title in a h1 tag', async((done) => {
    //let fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    let compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('Gestion du suivi des présences');
  }));
});

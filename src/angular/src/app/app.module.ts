import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import {
  PaginatorModule, CheckboxModule, CalendarModule, SelectButtonModule, TabViewModule,
  ChartModule as PrimengChartModule,
  ListboxModule, ConfirmDialogModule, ButtonModule, InputSwitchModule, ScheduleModule,
  RadioButtonModule, DialogModule, TabMenuModule, SliderModule, GrowlModule, DataTableModule, SharedModule,
  ContextMenuModule, OverlayPanelModule, DataGridModule, PanelModule, MultiSelectModule, TooltipModule
} from 'primeng/primeng';
import { AppComponent } from './app.component';
import { GroupesSallesListComponent } from './groupes.salles/groupes.salles.component';
import { StatsPresenceComponent } from './stats.presence/stats.presence.component';
import { TauxOccupationComponent } from './stats.presence/taux.occupation.component';
import { VerifierHyperPlanningComponent } from './verifier.hyper.planning/verifier.hyper.planning.component';
import { SuiviSaisieComponent } from './suivi.saisie/suivi.saisie.component';
import { PageNotFoundComponent } from './page.not.found.component';
import { ViewGraphicsComponent } from './view.graphics/view.graphics.component';
import { AdminUsersComponent } from './admin.users/admin.users.component';
import { ViewPlanningComponent } from './view.planning/view.planning.component';
import { SaisieFichesComponent } from './saisie.fiches/saisie.fiches.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { EditionFichesComponent } from './edition.fiches/edition.fiches.component';
import { LoaderComponent } from './loader/loader.component';
import { SlimLoadingBarModule } from 'ng2-slim-loading-bar';
import { TimeSelectDebut } from './saisie.fiches/pttimeselectdebut';
import { TimeSelectFin } from './saisie.fiches/pttimeselectfin';
import { PopoverModule } from "ngx-popover";
// bug sur ce module, modifier le répertoire d'import
import { UiSwitchModule } from '../../node_modules/angular2-ui-switch/src';
import { AccueilComponent } from './accueil/accueil.component';
import { Globals } from './globals';
import { AgGridModule } from 'ag-grid-ng2/main';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import { MultiselectDropdownCustomModule } from './multiselect-custom/multiselect-custom';
import { ClipboardDirective } from './stats.presence/clipboard.directive';
import { FrequenceReservationsComponent } from './stats.presence/frequence.reservations.component';
import { RepartitionTypeComponent } from './stats.presence/repartition.type.component';
import { SuiviDonneesComponent } from './stats.presence/suivi.donnees.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ExportComponent } from './export/export.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
export function highchartsFactory() {
  const hc = require('highcharts');
  const hcm = require('highcharts/modules/exporting');
  const exp = require('highcharts/highcharts-3d');

  hcm(hc);
  exp(hc);
  return hc;
}

const appRoutes: Routes = [
  { path: 'edition', component: EditionFichesComponent },
  { path: 'groupes-salles', component: GroupesSallesListComponent },
  { path: 'hyper-planning', component: VerifierHyperPlanningComponent },
  { path: 'stats-presence', component: StatsPresenceComponent },
  { path: 'viewplanning', component: ViewPlanningComponent },
  { path: 'saisie-fiches', component: SaisieFichesComponent },
  { path: 'viewgraphics', component: ViewGraphicsComponent },
  { path: 'accueil', component: AccueilComponent },
  { path: 'export', component: ExportComponent },
  { path: 'adminusers', component: AdminUsersComponent },
  { path: 'suivi', component: SuiviSaisieComponent },
  { path: 'app', redirectTo: '/accueil', pathMatch: 'full', },
  { path: '', redirectTo: '/accueil', pathMatch: 'full', },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    GroupesSallesListComponent,
    StatsPresenceComponent,
    ViewGraphicsComponent,
    ViewPlanningComponent,
    PageNotFoundComponent,
    VerifierHyperPlanningComponent,
    SaisieFichesComponent,
    EditionFichesComponent,
    AdminUsersComponent,
    TauxOccupationComponent,
    LoaderComponent,
    TimeSelectDebut,
    TimeSelectFin,
    AccueilComponent,
    ExportComponent,
    ClipboardDirective,
    FrequenceReservationsComponent,
    RepartitionTypeComponent,
    SuiviDonneesComponent,
    SuiviSaisieComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    Ng2Bs3ModalModule,
    FormsModule,
    HttpModule,
    TabMenuModule,
    CheckboxModule,
    GrowlModule,
    ChartsModule,
    BrowserAnimationsModule,
    PaginatorModule,
    DataGridModule,
    PanelModule,
    DataTableModule,
    SharedModule,
    Ng2AutoCompleteModule,
    CalendarModule,
    SelectButtonModule,
    TabViewModule,
    PrimengChartModule,
    ListboxModule,
    OverlayPanelModule,
    ConfirmDialogModule,
    ButtonModule,
    SliderModule,
    InputSwitchModule,
    ScheduleModule,
    SlimLoadingBarModule,
    RadioButtonModule,
    PopoverModule,
    UiSwitchModule,
    DialogModule,
    MultiSelectModule,
    ContextMenuModule,
    NgxChartsModule,
    MultiselectDropdownCustomModule,
    TooltipModule,
    MultiselectDropdownModule,
    NgxDatatableModule,
    AgGridModule.withComponents(
      [
        VerifierHyperPlanningComponent
      ]),
    ChartModule
  ],
  providers: [Globals, {
    provide: HighchartsStatic,
    useFactory: highchartsFactory
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
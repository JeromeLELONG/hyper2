import { NgModule, Component, OnInit, OnDestroy, style, animate, transition, state, trigger, ViewChild, Inject } from '@angular/core';
import { Cours } from './../interfaces/cours';
import { CoursService } from './../services/cours.service';
import { PresenceService } from './../services/presence.service';
import { UIChart, Schedule } from 'primeng/primeng';
import { FormsModule } from '@angular/forms';
import { Globals } from './../globals';
import { SalleService } from './../services/salle.service';
import { Salle } from './../interfaces/salle';
import { ActivatedRoute } from '@angular/router';
import { Presence } from './../interfaces/presence';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import {
    IMultiSelectOptionCustom, IMultiSelectSettingsCustom, IMultiSelectTextsCustom,
    IMultiSelectOptionSelectedCustom
} from './../multiselect-custom/multiselect-custom';
import { FavorisService } from './../services/favoris.service';
import { Favoris } from './../interfaces/favoris';
import * as moment from 'moment';



//import { routerTransition } from './router.animations';

export class MyEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean = true;
}

@Component( {
    templateUrl: './view.planning.component.html',
    providers: [CoursService, Globals, SalleService, PresenceService, FavorisService],
    animations: [
        trigger( 'fadeIn', [
            state( '*', style( { 'opacity': 1 } ) ),
            state( 'void', style( { 'opacity': 0 } ) ),
            transition( 'void => *', [
                style( { 'opacity': 0 } ),
                animate( '800ms linear' )
            ] ),
            transition( '* => void', [
                style( { 'opacity': 1 } ),
                animate( '800ms linear' )
            ] )
        ] )
    ],

} )
export class ViewPlanningComponent implements OnInit {
    @ViewChild( "chart" ) chart: UIChart;
    cours: Cours[] = [];
    coursActif: Cours = <Cours>( {
        numero: '',
        id: '',
        duree: '',
        cumul: '',
        ddebut: '',
        dfin: '',
        nbsem: '',
        jour: '',
        hdebut: '',
        hfin: '',
        typecours: '',
        codemat: '',
        matiere: '',
        enseignant: '',
        codeenseignant: '',
        codediplome: '',
        libdiplome: '',
        codesalle: '',
        salle: '',
        pond: '',
        prop: '',
        memo: '',
        date_modif: '',
    } );
    presences: Presence[] = [];
    presence: Presence = <Presence>( {
        nolot: 0,
        nofiche: '',
        id: '',
        dateraw: '',
        datesem: '',
        hdebut: '',
        hfin: '',
        codesalle: '',
        codeue: '',
        codepole: '',
        jour: '',
        enseignant: '',
        appariteur: '',
        rem_ens: '',
        rem_app: '',
        nbpresents: 0,
        chaire: '',
        valide: '',
        typecours: '',
        groupe: '',
        annule: '',
        hdebut_reel: '',
        hfin_reel: '',
        datefichier: '',
        video: '',
    } );
    errorMessage: string = '';
    isLoading: boolean = true;
    events: any[] = [];
    listeSalles: any[] = [];
    start: Date;
    fr: any;
    headerConfig: any;
    private sub: any;
    sourceIsPresence: boolean = false;
    event: MyEvent = <MyEvent>( {
        id: '',
        title: '',
        start: '',
        end: '',
        allDay: true
    } );
    dialogVisible: boolean = false;
    closable: boolean = false;
    display: boolean = false;
    loading: boolean = false;
    resizable: boolean = false;
    mouseOnEventDialog: boolean = false;
    searchEnseignantComplete = 0;
    marginLeftDialog: string = "0";
    searchMatiere: string = "";
    initPlanning = 0;
    favori: Favoris;
    displaySuccessFavoris: boolean = false;
    styleDialogFavoris: string = "panel-shadow";

    idMatiere: number = 1;
    public optionsMatieres: IMultiSelectOptionCustom[] = [];
    public selectedOptionsMatieres: IMultiSelectOptionSelectedCustom;

    idEnseignant: number = 1;
    public optionsEnseignants: IMultiSelectOptionCustom[] = [];
    public selectedOptionsEnseignants: IMultiSelectOptionSelectedCustom;

    idSalle: number = 1;
    public optionsSalles: IMultiSelectOptionCustom[] = [];
    public selectedOptionsSalles: IMultiSelectOptionSelectedCustom;

    public parametresSelection: IMultiSelectSettingsCustom = {
        pullRight: false,
        enableSearch: true,
        checkedStyle: 'glyphicon',
        buttonClasses: 'btn btn-default btn-custom input-shadow',
        selectionLimit: 0,
        closeOnSelect: false,
        showCheckAll: false,
        showUncheckAll: false,
        dynamicTitleMaxItems: 3,
        maxHeight: '300px',
    };

    public textesSelection: IMultiSelectTextsCustom = {
        checkAll: 'Sélectionner tout',
        uncheckAll: 'Déselectionné tout',
        checked: 'sélectionné',
        checkedPlural: 'sélectionnés',
        searchPlaceholder: 'Recherche...',
        defaultTitle: 'Selectionner',
    };

    data: any;


    constructor( @Inject( CoursService ) private coursService: CoursService, @Inject( SalleService ) private salleService: SalleService,
        private route: ActivatedRoute, @Inject( PresenceService ) private presenceService: PresenceService,
        private globals: Globals, @Inject( FavorisService ) private favorisService: FavorisService ) {

        this.presence = <Presence>{
            nolot: 0, nofiche: '', id: '', dateraw: '', datesem: '',
            hdebut: '', hfin: '', codesalle: '', codeue: '', codepole: '', jour: '', enseignant: '', appariteur: '', rem_ens: '', rem_app: '', nbpresents: 0,
            chaire: '', valide: '', typecours: '', groupe: '', annule: '', hdebut_reel: '', hfin_reel: '', datefichier: '', video: ''
        };
        this.start = new Date();
        this.headerConfig = {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        };

    }


    ngOnInit() {
        /*
              this.fr = {
                      monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet',
                          'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
                      monthNamesShort: [ "jan","fév","mar","avr","mai","jun","jui","aut","sep","oct","nov","déc" ],
                      dayNamesMin: [ "D","L","M","m","J","V","S" ],
                      dayNamesShort: [ "dim","lun","mar","mer","jeu","ven","sam" ],
                      dayNames: [ "Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi" ],
                      buttonText: {
                          today:    `Aujourd'hui`,
                          month:    'Mois',
                          week:     'Semaine',
                          day:      'Jour',
                          list:     'Liste'
                      },
                      timeFormat: 'H(:mm)'
                  };
          */
        this.fr = "fr";
        this.salleService
            .getAll()
            .subscribe(
            c => {
            this.listeSalles = c;
                for ( let i = 0; i < c.length; i++ )
                    this.optionsSalles.push( { id: this.idSalle++, name: c[i].code } );
                this.optionsSalles.sort( function( a, b ) {
                    return a.name.localeCompare( b.name );
                } );
                let event = { type: "change" };
                this.sub = this.route
                    .queryParams
                    .subscribe( params => {
                        if ( params['salles'] ) {
                            let salles = [];
                            salles = params['salles'].split( ',' );
                            this.selectedOptionsSalles = <IMultiSelectOptionSelectedCustom>( { selectedOptions: [], filter: '', event: 'init' } );
                            for ( let i = 0; i < salles.length; i++ ) {
                                this.optionsSalles.push( { id: this.idSalle, name: salles[i] } );
                                this.selectedOptionsSalles.selectedOptions.push( this.idSalle++ );
                            }

                        }
                        if ( params['enseignants'] ) {
                            let enseignants = [];
                            enseignants = params['enseignants'].split( ',' );
                            this.selectedOptionsEnseignants = <IMultiSelectOptionSelectedCustom>( { selectedOptions: [], filter: '', event: 'init' } );
                            for ( let i = 0; i < enseignants.length; i++ ) {
                                this.optionsEnseignants.push( { id: this.idEnseignant, name: enseignants[i] } );
                                this.selectedOptionsEnseignants.selectedOptions.push( this.idEnseignant++ );
                            }
                        }
                        if ( params['matieres'] ) {
                            let matieres = [];
                            matieres = params['matieres'].split( ',' );
                            this.selectedOptionsMatieres = <IMultiSelectOptionSelectedCustom>( { selectedOptions: [], filter: '', event: 'init' } );
                            for ( let i = 0; i < matieres.length; i++ ) {
                                this.optionsMatieres.push( { id: this.idMatiere, name: matieres[i] } );
                                this.selectedOptionsMatieres.selectedOptions.push( this.idMatiere++ );
                            }
                        }
                        this.getCours( event );
                    } );
            },
            e => this.errorMessage = e,
            () => this.isLoading = false );

        this.coursService
            .getListeMatieres( '' )
            .subscribe(
            ( p: string[] ) => {
                for ( let i = 0; i < p.length; i++ )
                    this.optionsMatieres.push( { id: this.idMatiere++, name: p[i] } );
            },
            e => this.errorMessage = e,
            () => this.isLoading = false );

        this.coursService
            .getListeEnseignants( '' )
            .subscribe(
            ( p: string[] ) => {
                for ( let i = 0; i < p.length; i++ )
                    this.optionsEnseignants.push( { id: this.idEnseignant++, name: p[i] } );
            },
            e => this.errorMessage = e,
            () => this.isLoading = false );
    }



    afficherDetailSeance( e ) {
        if ( e.calEvent.start._d.getDay() == 3 )
            this.marginLeftDialog = "210px";
        else if ( e.calEvent.start._d.getDay() == 2 )
            this.marginLeftDialog = "50px";
        else if ( e.calEvent.start._d.getDay() == 4 )
            this.marginLeftDialog = "-200px";
        else if ( e.calEvent.start._d.getDay() == 5 )
            this.marginLeftDialog = "-200px";
        else
            this.marginLeftDialog = "0";


        this.event = new MyEvent();
        this.event.title = e.calEvent.title;
        if ( this.sourceIsPresence ) {
            this.presence = this.presences.find( x => x.id === e.calEvent.id );
            if ( this.presence ) {
                let capacite: number = 0;
                let presents: number = 0;
                let capacitedispo: number;
                if ( this.presence.nbpresents ) presents = this.presence.nbpresents;
                let salle = this.listeSalles.find( x => x.code == this.presence.codesalle );
                if ( salle ) capacite = salle.capa;
                capacitedispo = capacite - presents;
                if ( capacitedispo < 0 ) capacitedispo = 0;
                this.data = {
                    labels: ['Capacité dispo: ' + ( capacitedispo ), 'Présents: ' + presents],
                    datasets: [
                        {
                            data: [capacitedispo, presents],
                            backgroundColor: [
                                "#FF6384",
                                "#36A2EB"
                            ],
                            hoverBackgroundColor: [
                                "#FF6384",
                                "#36A2EB"
                            ]
                        }]
                };
            }
            if ( !this.presence ) this.presence = <Presence>{
                nolot: 0, nofiche: '', id: '', dateraw: '', datesem: '',
                hdebut: '', hfin: '', codesalle: '', codeue: '', codepole: '', jour: '', enseignant: '', appariteur: '', rem_ens: '', rem_app: '', nbpresents: 0,
                chaire: '', valide: '', typecours: '', groupe: '', annule: '', hdebut_reel: '', hfin_reel: '', datefichier: '', video: ''
            };
        }
        else {
            this.coursActif = this.cours.find( x => x.id === e.calEvent.id );
            if ( !this.coursActif ) this.coursActif = <Cours>{
                numero: '', id: '', duree: '', cumul: '', ddebut: '',
                dfin: '', nbsem: '', jour: '', hdebut: '', hfin: '', typecours: '', codemat: '', matiere: '',
                enseignant: '', codeenseignant: '', codediplome: '', libdiplome: '', codesalle: '', salle: '', pond: '',
                prop: '', memo: '', date_modif: ''
            };
        }
        let start = e.calEvent.start;
        let end = e.calEvent.end;
        if ( e.view.name === 'month' ) {
            start.stripTime();
        }

        if ( end ) {
            end.stripTime();
            this.event.end = end.format();
        }

        this.event.id = e.calEvent.id;
        this.event.start = start.format();
        this.event.allDay = e.calEvent.allDay;
        this.dialogVisible = true;
    }


    switchSource( action ) {
        if ( this.sourceIsPresence ) this.sourceIsPresence = false;
        else this.sourceIsPresence = true;
        let event = { type: "change" };
        this.getCours( event );
    }



    getCours( event ) {

        if ( this.initPlanning++ == 0 ) return;
        let matieresSelectionnees: string[] = [];
        if ( this.selectedOptionsMatieres )
            for ( let i = 0; i < this.selectedOptionsMatieres.selectedOptions.length; i++ )
                matieresSelectionnees.push( this.optionsMatieres.find( x => x.id === this.selectedOptionsMatieres.selectedOptions[i] ).name );

        let enseignantsSelectionnes: string[] = [];
        if ( this.selectedOptionsEnseignants )
            for ( let i = 0; i < this.selectedOptionsEnseignants.selectedOptions.length; i++ )
                enseignantsSelectionnes.push( this.optionsEnseignants.find( x => x.id === this.selectedOptionsEnseignants.selectedOptions[i] ).name );

        let sallesSelectionnees: string[] = [];
        if ( this.selectedOptionsSalles )
            for ( let i = 0; i < this.selectedOptionsSalles.selectedOptions.length; i++ )
                sallesSelectionnees.push( this.optionsSalles.find( x => x.id === this.selectedOptionsSalles.selectedOptions[i] ).name );

        this.display = true;
        this.loading = true;
        var datedebut: string;
        var datefin: string;
        if ( event.type != "change" )
            this.start = event.view.intervalStart._d;
        datedebut = moment( this.start ).format( 'DD/MM/YYYY' );
        let end = new Date( this.start );
        end.setDate( end.getDate() + 31 );
        datefin = moment( end ).format( 'DD/MM/YYYY' );

        if ( this.sourceIsPresence )
            this.presenceService
                .getListDateSalleEnseignant( datedebut, datefin, sallesSelectionnees, enseignantsSelectionnes, matieresSelectionnees )
                .subscribe(
                ( p: Presence[] ) => {
                    this.presences = p;
                    this.events = [];
                    for ( let i = 0; i < p.length; i++ ) {
                        var dateparts = p[i].datesem.split( "/" );
                        var hdebutparts = p[i].hdebut.split( "h" );
                        var hfinparts = p[i].hfin.split( "h" );
                        if ( p[i].typecours == "ED" )
                            this.events.push( {
                                id: p[i].id, title: p[i].codeue + ' - ' + p[i].codesalle + ' - ' + ( p[i].nbpresents ? p[i].nbpresents.toString() : "0" ) + ' présents', start: dateparts[2] + '-' + dateparts[1] + '-' + dateparts[0] + "T" + hdebutparts[0] + ":" + hdebutparts[1] + ":00",
                                end: dateparts[2] + '-' + dateparts[1] + '-' + dateparts[0] + "T" + hfinparts[0] + ":" + hfinparts[1] + ":00",
                                backgroundColor: '#FF0000',
                                borderColor: '#EE0000'
                            } );
                        else
                            this.events.push( {
                                id: p[i].id, title: p[i].codeue + ' - ' + p[i].codesalle + ' - ' + ( p[i].nbpresents ? p[i].nbpresents.toString() : "0" ) + ' présents', start: dateparts[2] + '-' + dateparts[1] + '-' + dateparts[0] + "T" + hdebutparts[0] + ":" + hdebutparts[1] + ":00",
                                end: dateparts[2] + '-' + dateparts[1] + '-' + dateparts[0] + "T" + hfinparts[0] + ":" + hfinparts[1] + ":00"
                            } );
                    }
                    this.display = false;
                    this.loading = false;
                },
                e => this.errorMessage = e,
                () => this.isLoading = false );
        else
            this.coursService
                .getWithDateAndLocation( datedebut, datefin, sallesSelectionnees, enseignantsSelectionnes, matieresSelectionnees )
                .subscribe(
                ( c: Cours[] ) => {
                    this.cours = c;
                    this.events = [];
                    for ( let i = 0; i < c.length; i++ ) {
                        var dateparts = c[i].ddebut.split( "/" );
                        var hdebutparts = c[i].hdebut.split( "h" );
                        var hfinparts = c[i].hfin.split( "h" );
                        if ( c[i].typecours == "ED" )
                            this.events.push( {
                                id: c[i].id, title: c[i].codemat + ' - ' + c[i].codesalle, start: dateparts[2] + '-' + dateparts[1] + '-' + dateparts[0] + "T" + hdebutparts[0] + ":" + hdebutparts[1] + ":00",
                                end: dateparts[2] + '-' + dateparts[1] + '-' + dateparts[0] + "T" + hfinparts[0] + ":" + hfinparts[1] + ":00",
                                backgroundColor: '#FF0000',
                                borderColor: '#EE0000'
                            } );
                        else
                            this.events.push( {
                                id: c[i].id, title: c[i].codemat + ' - ' + c[i].codesalle, start: dateparts[2] + '-' + dateparts[1] + '-' + dateparts[0] + "T" + hdebutparts[0] + ":" + hdebutparts[1] + ":00",
                                end: dateparts[2] + '-' + dateparts[1] + '-' + dateparts[0] + "T" + hfinparts[0] + ":" + hfinparts[1] + ":00"
                            } );

                    }
                    this.display = false;
                    this.loading = false;
                },
                e => this.errorMessage = e,
                () => this.isLoading = false );

    }


    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    modifFilterMatiere() {
        if ( this.selectedOptionsMatieres.event == "keypress" )
            if ( this.sourceIsPresence )
                this.presenceService
                    .getListeMatieres( this.selectedOptionsMatieres.filter )
                    .subscribe(
                    ( p: string[] ) => {
                        let TempArray: IMultiSelectOptionCustom[] = [];
                        for ( let i = 0; i < this.optionsMatieres.length; i++ )
                            if ( this.selectedOptionsMatieres.selectedOptions.indexOf( this.optionsMatieres[i].id ) >= 0 )
                                TempArray.push( this.optionsMatieres[i] );
                        this.optionsMatieres = TempArray;
                        for ( let i = 0; i < p.length; i++ )
                            this.optionsMatieres.push( { id: this.idMatiere++, name: p[i] } );
                    },
                    e => this.errorMessage = e,
                    () => this.isLoading = false );
            else
                this.coursService
                    .getListeMatieres( this.selectedOptionsMatieres.filter )
                    .subscribe(
                    ( p: string[] ) => {
                        let TempArray: IMultiSelectOptionCustom[] = [];
                        for ( let i = 0; i < this.optionsMatieres.length; i++ )
                            if ( this.selectedOptionsMatieres.selectedOptions.indexOf( this.optionsMatieres[i].id ) >= 0 )
                                TempArray.push( this.optionsMatieres[i] );
                        this.optionsMatieres = TempArray;
                        for ( let i = 0; i < p.length; i++ )
                            this.optionsMatieres.push( { id: this.idMatiere++, name: p[i] } );
                    },
                    e => this.errorMessage = e,
                    () => this.isLoading = false );
        else {
            let event = { type: "change" };
            this.getCours( event );
        }
    }


    modifFilterEnseignant() {
        if ( this.selectedOptionsEnseignants.event == "keypress" )
            if ( this.sourceIsPresence )
                this.presenceService
                    .getListeEnseignants( this.selectedOptionsEnseignants.filter )
                    .subscribe(
                    ( p: string[] ) => {
                        let TempArray: IMultiSelectOptionCustom[] = [];
                        for ( let i = 0; i < this.optionsEnseignants.length; i++ )
                            if ( this.selectedOptionsEnseignants.selectedOptions.indexOf( this.optionsEnseignants[i].id ) >= 0 )
                                TempArray.push( this.optionsEnseignants[i] );
                        this.optionsEnseignants = TempArray;
                        for ( let i = 0; i < p.length; i++ )
                            this.optionsEnseignants.push( { id: this.idEnseignant++, name: p[i] } );
                    },
                    e => this.errorMessage = e,
                    () => this.isLoading = false );
            else
                this.coursService
                    .getListeEnseignants( this.selectedOptionsEnseignants.filter )
                    .subscribe(
                    ( p: string[] ) => {
                        let TempArray: IMultiSelectOptionCustom[] = [];
                        for ( let i = 0; i < this.optionsEnseignants.length; i++ )
                            if ( this.selectedOptionsEnseignants.selectedOptions.indexOf( this.optionsEnseignants[i].id ) >= 0 )
                                TempArray.push( this.optionsEnseignants[i] );
                        this.optionsEnseignants = TempArray;
                        for ( let i = 0; i < p.length; i++ )
                            this.optionsEnseignants.push( { id: this.idEnseignant++, name: p[i] } );
                    },
                    e => this.errorMessage = e,
                    () => this.isLoading = false );
        else {
            let event = { type: "change" };
            this.getCours( event );
        }
    }

    modifFilterSalle() {
        if ( this.selectedOptionsSalles.event == "select" ) {
            let event = { type: "change" };
            this.getCours( event );
        }
    }

    getEnseignantsSelectionnes() {
        let enseignantsSelectionnes: string[] = [];
        if ( this.selectedOptionsEnseignants )
            for ( let i = 0; i < this.selectedOptionsEnseignants.selectedOptions.length; i++ )
                enseignantsSelectionnes.push( this.optionsEnseignants.find( x => x.id === this.selectedOptionsEnseignants.selectedOptions[i] ).name );
        return enseignantsSelectionnes;
    }

    getSallesSelectionnees() {
        let sallesSelectionnees: string[] = [];
        if ( this.selectedOptionsSalles )
            for ( let i = 0; i < this.selectedOptionsSalles.selectedOptions.length; i++ )
                sallesSelectionnees.push( this.optionsSalles.find( x => x.id === this.selectedOptionsSalles.selectedOptions[i] ).name );
        return sallesSelectionnees;
    }

    getMatieresSelectionnees() {
        let matieresSelectionnees: string[] = [];
        if ( this.selectedOptionsMatieres )
            for ( let i = 0; i < this.selectedOptionsMatieres.selectedOptions.length; i++ )
                matieresSelectionnees.push( this.optionsMatieres.find( x => x.id === this.selectedOptionsMatieres.selectedOptions[i] ).name );
        return matieresSelectionnees;
    }

    creerFavoris() {
        this.favorisService.create( this.globals.donneesConnexion.uid, 'Planning salles ' +
            this.getSallesSelectionnees().join( ' ' ), '/viewplanning',
            `{"salles": ` + JSON.stringify( this.getSallesSelectionnees() ) + `,"enseignants": ` + JSON.stringify( this.getEnseignantsSelectionnes() ) + `,"matieres": ` + JSON.stringify( this.getMatieresSelectionnees() ) + `}` ).subscribe(( dataResponse: Favoris ) => {
                this.favori = dataResponse;
                this.displaySuccessFavoris = true;
                setTimeout(() => {
                    this.styleDialogFavoris = "panel-shadow fadeEnd-animation";
                    setTimeout(() => {
                    this.displaySuccessFavoris = false;
                        this.styleDialogFavoris = "panel-shadow";
                    }, 1000 );
                }, 1800 );
            } );
    }
}

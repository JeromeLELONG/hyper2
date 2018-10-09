import { Component, OnInit, style, animate, transition, state, trigger, Inject, ViewChild } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Globals } from './../globals';
import { Observable } from 'rxjs/Rx';
import { Presence } from './../interfaces/presence';
import { PresenceService } from './../services/presence.service';
import { SelectItem, MenuItem } from 'primeng/primeng';
import { SalleService } from './../services/salle.service';
import { Salle } from './../interfaces/salle';
import * as moment from 'moment';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import * as FileSaver from 'file-saver';
import { GroupeSalleService } from './../services/groupe.salles.service';

@Component( {
    selector: 'suivi-donnees',
    templateUrl: './suivi.donnees.component.html',
    styles: ['#modal { width: 500px; }'],
    providers: [Globals, PresenceService, SalleService, GroupeSalleService],

} )
export class SuiviDonneesComponent implements OnInit {
    @ViewChild( 'modal' ) modal: ModalComponent;
    rows = [];
    selected = [];
    expanded = {};
    timeout: any;
    errorMessage: string = '';
    isLoading: boolean = true;
    dateDebut: Date;
    dateFin: Date;
    salles: SelectItem[] = [];
    selectedSalles: string[] = [];
    listeSalles: Salle[] = [];
    sallesDuGroupe: string[] = [];
    margin: string = "0";
    messages: any = {
        emptyMessage: 'Aucune donnée disponibles',
        totalMessage: 'totaux',
        selectedMessage: 'selectionnées'
    };
    dateDebutString: string;
    dateFinString: string;
    styleDatatable: string = "material striped fade-animation";
    animation: boolean = true;
    output: string;
    private items: MenuItem[];
    tableHover: boolean = false;
    backdrop: any;
    keyboard: any;
    cssClass: any;
    sm: any;
    selectedGroupe: any;
    listeGroupes: SelectItem[] = [];
    display: boolean = false;
    loading: boolean = false;

    constructor( public globals: Globals, @Inject( PresenceService ) private presenceService: PresenceService,
        @Inject( SalleService ) private salleService: SalleService, @Inject( GroupeSalleService ) private groupeSalleService: GroupeSalleService ) {
        this.dateDebut = moment().subtract( 1, 'months' ).startOf( 'month' ).utc().toDate();
        this.dateFin = moment().endOf( "month" ).utc().toDate();
        this.dateDebutString = this.dateDebut.toLocaleDateString( 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } )
            .charAt( 0 ).toUpperCase() + this.dateDebut.toLocaleDateString( 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } ).substring( 1 );
        this.dateFinString = this.dateFin.toLocaleDateString( 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } )
            .charAt( 0 ).toUpperCase() + this.dateFin.toLocaleDateString( 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } ).substring( 1 );

        this.salleService
            .getAll()
            .subscribe(
            c => {
                this.listeSalles = c;
                this.salles = c.map( function( a ) {
                    return { label: a.code, value: a.code };
                } );

                this.selectedSalles.push( this.listeSalles[0].code );
                this.getPresence();
            },
            e => this.errorMessage = e,
            () => this.isLoading = false );


    }

    ngOnInit() {
        this.items = [
            {
                label: 'Exporter la sélection',
                icon: 'fa-file-o',
                command: ( event ) => this.telechargerSelection()
            },
            {
                label: 'Exporter tout',
                icon: 'fa-file-o',
                command: ( event ) => this.telechargerTout( event )
            }
        ];

        this.groupeSalleService
            .getListeGroupes()
            .subscribe(

            c => {
                this.listeGroupes = c.map(function(a) {return {label: a.lib_groupe,value:a.num_groupe};})
            },
            e => this.errorMessage = e,
            () => this.isLoading = false );
    }

    onPage( event ) {
        clearTimeout( this.timeout );
        this.timeout = setTimeout(() => {
            console.log( 'paged!', event );
        }, 100 );
    }

    public selectGroupe() {
        this.styleDatatable = "material striped fadeEnd-animation";
        this.groupeSalleService
            .getSallesAffectees( this.selectedGroupe )
            .subscribe(
           /* happy path */ c => {
            this.sallesDuGroupe = [];
                for ( var i = 0, len = c.length; i < len; i++ ) {
                    this.sallesDuGroupe.push(c[i].code);
                };
                this.selectedSalles = this.sallesDuGroupe;
                this.getPresence();
            },
           /* error path */ e => this.errorMessage = e,
           /* onComplete */() => this.isLoading = false );

    }

    public getPresence() {
        this.display = true;
        this.loading = true;
        return this.presenceService
            .getListDateEtSalle(
            moment( this.dateDebut ).format( 'DD/MM/YYYY' ),
            moment( this.dateFin ).format( 'DD/MM/YYYY' ),
            this.selectedSalles
            )
            .subscribe(
            p => {
                this.rows = p.map( function( a ) {
                    return {
                        nolot: a.nolot,
                        nofiche: a.nofiche,
                        id: a.id,
                        datesysteme: a.dateraw,
                        datetexte: a.datesem,
                        heuredebut: a.hdebut,
                        heurefin: a.hfin,
                        codesalle: a.codesalle,
                        codematiere: a.codeue,
                        libellematiere: a.codepole,
                        jour: a.jour,
                        enseignant: a.enseignant,
                        appariteur: a.appariteur,
                        remarqueenseignant: a.rem_ens,
                        remarqueappariteur: a.rem_app,
                        presents: a.nbpresents,
                        chaire: a.chaire,
                        valide: a.valide,
                        typecours: a.typecours,
                        groupe: a.groupe,
                        annule: a.annule,
                        heuredebutreel: a.hdebut_reel,
                        heurefinreel: a.hfin_reel,
                        datefichier: a.datefichier,
                        video: a.video
                    };
                } );
                setTimeout(() => {
                    this.styleDatatable = "material striped fade-animation";
                }, 1000 );
                this.display = false;
                this.loading = false;
            },
            e => this.errorMessage = e,
            () => this.isLoading = false );
    }

    SelectDate() {
        this.dateDebutString = this.dateDebut.toLocaleDateString( 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } )
            .charAt( 0 ).toUpperCase() + this.dateDebut.toLocaleDateString( 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } ).substring( 1 );
        this.dateFinString = this.dateFin.toLocaleDateString( 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } )
            .charAt( 0 ).toUpperCase() + this.dateFin.toLocaleDateString( 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } ).substring( 1 );
        this.styleDatatable = "material striped fadeEnd-animation";
        this.margin = '0';
        this.getPresence();
    }

    SelectSalles() {
        this.styleDatatable = "material striped fadeEnd-animation";
        this.getPresence();
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

    ContextMenu( event ) {
        //console.log(event);
        //this.modal.open();
    }

    telechargerSelection() {


        FileSaver.saveAs( new Blob( ["nolot;nofiche;id;datesysteme;datetexte;heuredebut;heurefin;codesalle;codematiere;libellematiere;jour;enseignant;appariteur;remarqueenseignant;" +
            "remarqueappariteur;presents;chaire;valide;typecours;groupe;annule;heuredebutreel;heurefinreel;datefichier;video\n"].concat( this.selected.map( function( a ) {
                return ( a.nolot ? a.nolot : '' ) + ';' + ( a.nofiche ? a.nofiche : '' ) + ';' + ( a.id ? a.id : '' ) + ';' + ( a.datesysteme ? a.datesysteme : '' ) + ';' +
                    ( a.datetexte ? a.datetexte : '' ) + ';' + ( a.heuredebut ? a.heuredebut : '' ) + ';' + ( a.heurefin ? a.heurefin : '' ) + ';' + ( a.codesalle ? a.codesalle : '' ) + ';' +
                    ( a.codematiere ? a.codematiere : '' ) + ';' + ( a.libellematiere ? a.libellematiere : '' ) + ';' + ( a.jour ? a.jour : '' ) + ';' + ( a.enseignant ? a.enseignant : '' ) + ';' +
                    ( a.appariteur ? a.appariteur : '' ) + ';' + ( a.remarqueenseignant ? a.remarqueenseignant : '' ) + ';' + ( a.remarqueappariteur ? a.remarqueappariteur : '' ) + ';' +
                    ( a.presents ? a.presents : '' ) + ';' + ( a.chaire ? a.chaire : '' ) + ';' + ( a.valide ? a.valide : '' ) + ';' + ( a.typecours ? a.typecours : '' ) + ';' +
                    ( a.groupe ? a.groupe : '' ) + ';' + ( a.annule ? a.annule : '' ) + ';' + ( a.heuredebutreel ? a.heuredebutreel : '' ) + ';' +
                    ( a.heurefinreel ? a.heurefinreel : '' ) + ';' + ( a.datefichier ? a.datefichier : '' ) + ';' + ( a.video ? a.video : '' ) + '\n'
            } ) ) ), 'ExportPresence_' + moment( new Date() ).format( 'DD-MM-YYYY_hhmmss' ) + '.csv' );
        //this.modal.close();
    }
    telechargerTout( event ) {


        FileSaver.saveAs( new Blob( ["nolot;nofiche;id;datesysteme;datetexte;heuredebut;heurefin;codesalle;codematiere;libellematiere;jour;enseignant;appariteur;remarqueenseignant;" +
            "remarqueappariteur;presents;chaire;valide;typecours;groupe;annule;heuredebutreel;heurefinreel;datefichier;video\n"].concat( this.rows.map( function( a ) {
                return ( a.nolot ? a.nolot : '' ) + ';' + ( a.nofiche ? a.nofiche : '' ) + ';' + ( a.id ? a.id : '' ) + ';' + ( a.datesysteme ? a.datesysteme : '' ) + ';' +
                    ( a.datetexte ? a.datetexte : '' ) + ';' + ( a.heuredebut ? a.heuredebut : '' ) + ';' + ( a.heurefin ? a.heurefin : '' ) + ';' + ( a.codesalle ? a.codesalle : '' ) + ';' +
                    ( a.codematiere ? a.codematiere : '' ) + ';' + ( a.libellematiere ? a.libellematiere : '' ) + ';' + ( a.jour ? a.jour : '' ) + ';' + ( a.enseignant ? a.enseignant : '' ) + ';' +
                    ( a.appariteur ? a.appariteur : '' ) + ';' + ( a.remarqueenseignant ? a.remarqueenseignant : '' ) + ';' + ( a.remarqueappariteur ? a.remarqueappariteur : '' ) + ';' +
                    ( a.presents ? a.presents : '' ) + ';' + ( a.chaire ? a.chaire : '' ) + ';' + ( a.valide ? a.valide : '' ) + ';' + ( a.typecours ? a.typecours : '' ) + ';' +
                    ( a.groupe ? a.groupe : '' ) + ';' + ( a.annule ? a.annule : '' ) + ';' + ( a.heuredebutreel ? a.heuredebutreel : '' ) + ';' +
                    ( a.heurefinreel ? a.heurefinreel : '' ) + ';' + ( a.datefichier ? a.datefichier : '' ) + ';' + ( a.video ? a.video : '' ) + '\n'
            } ) ) ), 'ExportPresence_' + moment( new Date() ).format( 'DD-MM-YYYY_hhmmss' ) + '.csv' );
        //this.modal.close();
    }
}

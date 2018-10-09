import {
    Component, OnInit, style, animate, transition, state, trigger, ChangeDetectorRef, ViewChild, Inject,
    NgZone, AfterContentChecked, ElementRef, AfterViewInit
} from '@angular/core';
import { Response } from '@angular/http';
import { Presence } from './../interfaces/presence';
import { PresenceService } from './../services/presence.service';
import { LotService } from './../services/lot.service';
import { routerTransition } from './../router.animations';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Globals } from './../globals';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { Lot } from './../interfaces/lot';
import * as moment from 'moment';
//import {BrowserDomAdapter } from '@angular/platform-browser/src/browser/browser_adapter';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'jquery';
import 'bootstrap';

declare var jQuery: any;
import * as $ from 'jquery';

type Orientation = ( "prev" | "next" | "none" );

@Component( {
    templateUrl: './saisie.fiches.component.html',
    styles: [`
                 ng2-auto-complete, input {
                   display: block; border: 1px solid #ccc; width: 300px;
                 }
               `],
    animations: [
        trigger( 'fadeIn', [
            state( '*', style( { 'opacity': 1 } ) ),
            transition( 'void => *', [
                style( { 'opacity': 0 } ),
                animate( '800ms linear' )
            ] )
        ] ),
        trigger(
            "ficheAnimation",
            [
                transition(
                    "void => prev", // ---> Entering --->
                    [
                        // In order to maintain a zIndex of 2 throughout the ENTIRE
                        // animation (but not after the animation), we have to define it
                        // in both the initial and target styles. Unfortunately, this 
                        // means that we ALSO have to define target values for the rest
                        // of the styles, which we wouldn't normally have to.
                        style( {
                            left: -100,
                            opacity: 0.0,
                            zIndex: 2
                        } ),
                        animate(
                            "200ms ease-in-out",
                            style( {
                                left: 0,
                                opacity: 1.0,
                                zIndex: 2
                            } )
                        )
                    ]
                ),
                transition(
                    "prev => void", // ---> Leaving --->
                    [
                        animate(
                            "200ms ease-in-out",
                            style( {
                                left: 100,
                                opacity: 0.0
                            } )
                        )
                    ]
                ),
                transition(
                    "void => next", // <--- Entering <---
                    [
                        // In order to maintain a zIndex of 2 throughout the ENTIRE
                        // animation (but not after the animation), we have to define it
                        // in both the initial and target styles. Unfortunately, this 
                        // means that we ALSO have to define target values for the rest
                        // of the styles, which we wouldn't normally have to.
                        style( {
                            left: 100,
                            opacity: 0.0,
                            zIndex: 2
                        } ),
                        animate(
                            "200ms ease-in-out",
                            style( {
                                left: 0,
                                opacity: 1.0,
                                zIndex: 2
                            } )
                        )
                    ]
                ),
                transition(
                    "next => void", // <--- Leaving <---
                    [
                        animate(
                            "200ms ease-in-out",
                            style( {
                                left: -100,
                                opacity: 0.0
                            } )
                        )
                    ]
                )
            ]
        )
    ],
    providers: [LotService, PresenceService, Globals]
    //animations: [routerTransition("fadeIn")],
    //host: {'[@routerTransition]': ''}
} )
export class SaisieFichesComponent implements OnInit {
    public orientation: Orientation;
    public selectedFiche: Presence;
    private changeDetectorRef: ChangeDetectorRef;
    private fiches: Presence[];
    enseignant = { nom_enseignant: "" };
    ListeEnseignants: string = `${this.globals.appUrl}ldapservice?nom=:nom_enseignant`;
    @ViewChild( 'modal' ) modal: ModalComponent;
    output: string;
    selected: string;
    animation: boolean = true;
    lotInvalid: boolean = true;
    numeroLot: number;
    showMainForm: boolean = false;
    lot: Lot[] = [];
    backdrop: any;
    keyboard: any;
    cssClass: any;
    verifNolot: any;
    //dom: BrowserDomAdapter;
    hdebut = "8h00";
    hfin = "22h00";
    private sub: any;
    styleBoutonAnnuler: string = "btn btn-default input-shadow";
    styleBoutonValider: string = "btn btn-primary input-shadow";
    styleBoutonSuivante: string = "btn btn-success input-shadow";
    styleBoutonPrecedente: string = "btn btn-primary input-shadow";

    constructor( changeDetectorRef: ChangeDetectorRef, public globals: Globals,
        private _sanitizer: DomSanitizer,
        @Inject( LotService ) private lotService: LotService,
        @Inject( PresenceService ) private presenceService: PresenceService,
        private el: ElementRef, public zone: NgZone, private route: ActivatedRoute, ) {
        if ( location.host.search( 'localhost' ) == 0 )
            this.ListeEnseignants = `${this.globals.appUrl}ldapservice?nom=:nom_enseignant`;
        else
            this.ListeEnseignants = "/ldapservice?nom=:nom_enseignant";

        this.changeDetectorRef = changeDetectorRef;
        this.orientation = "none";

        this.fiches = <Presence[]>[<Presence>( { nolot: 0 } )];
        this.selectedFiche = this.fiches[0];
        this.el = el.nativeElement;
        //this.dom = new BrowserDomAdapter();
    }

    ngOnInit() {
        this.modal.open();
        this.sub = this.route
            .queryParams
            .subscribe( params => {
                if ( params['lot'] ) {
                    this.numeroLot = params['lot'];
                    this.lotService
                        .getLot( params['lot'] )
                        .subscribe(
                        ( l: Lot[] ) => {
                            let listeID: string[] = [];
                            for ( let i = 0; i < l.length; i++ )
                                listeID.push( l[i].id );
                            this.lot = [];
                            this.lot = l;
                            if ( l.length > 0 )
                                this.presenceService.getFromListeID( listeID ).subscribe(( p: Presence[] ) => {
                                    this.fiches = [];
                                    let fiche: Presence;
                                    if ( p.length > 0 )
                                        for ( let i = 0; i < this.lot.length; i++ ) {
                                            fiche = p.find( x => x.id === this.lot[i].id );
                                            this.fiches.push( fiche );
                                        }
                                    this.confirmLot();
                                } );
                        } );
                }
            } );
    }

    verifNumLot( event ) {

        this.lotService
            .getLot( event )
            .subscribe(
            ( l: Lot[] ) => {
                let listeID: string[] = [];
                for ( let i = 0; i < l.length; i++ )
                    listeID.push( l[i].id );
                this.lot = [];
                this.lot = l;
                if ( l.length > 0 )
                    this.presenceService.getFromListeID( listeID ).subscribe(( p: Presence[] ) => {
                        this.fiches = [];
                        let fiche: Presence;
                        if ( p.length > 0 )
                            for ( let i = 0; i < this.lot.length; i++ ) {
                                fiche = p.find( x => x.id === this.lot[i].id );
                                this.fiches.push( fiche );
                            }
                    } );
                if ( this.lot.length > 0 )
                    this.lotInvalid = false;
                else
                    this.lotInvalid = true;
            } );
    }

    getFiche( id ) {
        return this.lot.find( x => x.id === id );
    }

    getPresence( id ) {
        return this.fiches.find( x => x.id === id );
    }

    json( obj ) {
        return JSON.stringify( obj );
    }
    confirmLot() {
        this.showMainForm = true;
        this.lotInvalid = false;
        this.fiches.forEach( function( element ) {
            if ( !element.appariteur || element.appariteur == "" ) element.appariteur = this.globals.donneesConnexion.cn;
        }, this );
        this.selectedFiche = this.fiches[0];
        if ( this.selectedFiche.enseignant )
            this.enseignant.nom_enseignant = this.selectedFiche.enseignant;
        else this.enseignant.nom_enseignant = "";
        this.setHeuresReelles();
        this.modal.close();
    }

    setHeuresReelles() {
        if ( this.selectedFiche.hdebut_reel )
            this.hdebut = this.selectedFiche.hdebut_reel;
        else this.hdebut = "";

        if ( this.selectedFiche.hfin_reel )
            this.hfin = this.selectedFiche.hfin_reel;
        else this.hfin = "";
    }
    setNomEnseignant() {
        if ( ( typeof this.enseignant ) == "string" ) this.enseignant = { nom_enseignant: this.enseignant.toString() };
    }
    public showNextFiche(): void {
        this.selectedFiche.valide = "Y";
        this.selectedFiche.enseignant = this.enseignant.nom_enseignant;
        this.selectedFiche.hdebut_reel = this.hdebut;
        this.selectedFiche.hfin_reel = this.hfin;
        this.presenceService.save( this.selectedFiche ).subscribe(( r: Response ) => { } );
        // Change the "state" for our animation trigger.
        this.orientation = "next";
        this.changeDetectorRef.detectChanges();
        // Find the currently selected index.
        var index = this.fiches.indexOf( this.selectedFiche );
        if ( index == -1 ) index = 0;
        this.fiches[index] = this.selectedFiche;
        // Move the rendered element to the next index - this will cause the current item
        // to enter the ( "next" => "void" ) transition and this new item to enter the 
        // ( "void" => "next" ) transition.
        this.selectedFiche = this.fiches[index + 1]
            ? this.fiches[index + 1]
            : this.fiches[0];
        this.enseignant = { nom_enseignant: "" };
        if ( this.selectedFiche.enseignant )
            this.enseignant.nom_enseignant = this.selectedFiche.enseignant;
        else this.enseignant.nom_enseignant = "";
        this.setHeuresReelles();
    }

    onHeureDebutChange( time ) {
        if ( time != "" ) {
            this.selectedFiche.hdebut_reel = time;
            this.hdebut = time;
        }
    }

    onHeureFinChange( time ) {
        if ( time != "" ) {
            this.selectedFiche.hfin_reel = time;
            this.hfin = time;
        }
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
    cancel() {
        window.location.href = '/';
    }

    onSubmit() {
        if ( !this.lotInvalid ) this.confirmLot();
    }
    // I cycle to the previous fiche in the collection.
    public showPrevFiche(): void {

        this.orientation = "prev";
        this.changeDetectorRef.detectChanges();
        // Find the currently selected index.
        var index = this.fiches.indexOf( this.selectedFiche );

        // Move the rendered element to the previous index - this will cause the current 
        // item to enter the ( "prev" => "void" ) transition and this new item to enter
        // the ( "void" => "prev" ) transition.
        this.selectedFiche = this.fiches[index - 1]
            ? this.fiches[index - 1]
            : this.fiches[this.fiches.length - 1];
        this.enseignant = { nom_enseignant: "" };
        if ( this.selectedFiche.enseignant )
            this.enseignant.nom_enseignant = this.selectedFiche.enseignant;
        else this.enseignant.nom_enseignant = "";
        this.setHeuresReelles();
    }
    getMonday( timestamp ) {
        return moment.unix( timestamp ).isoWeekday( 1 ).format( "DD/MM/YYYY" );
    }

    getSunday( timestamp ) {
        return moment.unix( timestamp ).isoWeekday( 7 ).format( "DD/MM/YYYY" );
    }
    EnterForm( event ) {
        if ( event.keyCode == 13 ) {
            this.showNextFiche();
        }
    }
}
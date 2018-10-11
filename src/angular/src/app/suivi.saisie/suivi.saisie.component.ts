import { Component, OnInit, style, animate, transition, state, trigger, ViewChild, Inject } from '@angular/core';
import { Salle } from './../interfaces/salle';
import { Globals } from './../globals';
import * as moment from 'moment';
import { GroupeSalleService } from './../services/groupe.salles.service';
import { PresenceService } from './../services/presence.service';
import { Presence } from './../interfaces/presence';
import { SelectItem } from 'primeng/primeng';
import { LoginData } from './../interfaces/logindata';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './suivi.saisie.component.html',
    animations: [
        trigger('fadeIn', [
            state('*', style({ 'opacity': 1 })),
            transition('void => *', [
                style({ 'opacity': 0 }),
                animate('800ms linear')
            ])
        ])
    ],
    providers: [Globals, PresenceService, GroupeSalleService],
    //animations: [routerTransition("fadeIn")],
    //host: {'[@routerTransition]': ''}
})
export class SuiviSaisieComponent {
    selectedSemaine: Date;
    semaines: any[];
    jours: any[];
    dateSelect: any;
    semaineStart: Date;
    presences: Presence[];
    selectedSalles: string[] = [];
    errorMessage: string = '';
    isLoading: boolean = true;
    listeGroupes: any[] = [];
    sallesDuGroupe: string[] = [];
    selectedGroupe: number;
    jourSelect: number;
    semaineSelect: number;
    styleTable: string = "table table-striped table-responsive panel-shadow";
    private sub: any;
    loading: boolean = false;
    display: boolean = false;

    constructor(public globals: Globals, @Inject(PresenceService) private presenceService: PresenceService,
        @Inject(GroupeSalleService) private groupeSalleService: GroupeSalleService, private route: ActivatedRoute) {
        this.semaines = [];
        this.jours = [];
        this.presences = [];
        this.listeGroupes = [{ label: "Toutes les salles", value: 0, num_groupe: '%' }];
        this.selectedGroupe = 0;
        this.sub = this.route
            .queryParams
            .subscribe(params => {
                var initDate;
                if (params['date']) {
                    initDate = new Date(params['date']);
                    this.dateSelect = initDate;
                    this.semaineStart = moment(this.dateSelect).startOf('week').add(1, 'day').utc().toDate();

                }
                else {
                    initDate = new Date();
                    this.dateSelect = initDate;
                    this.semaineStart = moment(this.dateSelect).startOf('week').add(1, 'day').utc().toDate();
                }

                var j = 0;
                for (let i = 42; i > 0; i--) {
                    var semaineItem = new Date();
                    semaineItem = moment(this.dateSelect).startOf('week').add(1, 'day').utc().subtract(i, 'day').utc().toDate();
                    i = i - 6;
                    this.semaines.push({ label: moment(semaineItem).format('DD/MM/YYYY'), value: j, madate: semaineItem });
                    j++;
                }
                for (let i = 0; i <= 42; i++) {
                    var semaineItem = new Date();
                    semaineItem = moment(this.dateSelect).startOf('week').add(1, 'day').utc().add(i, 'day').utc().toDate();
                    i = i + 6;
                    this.semaines.push({ label: moment(semaineItem).format('DD/MM/YYYY'), value: j, madate: semaineItem });
                    j++;
                }
                this.semaineSelect = 6;
                for (let i = 0; i < 7; i++) {
                    var jourItem = moment(this.dateSelect).startOf('week').add(1, 'day').utc().add(i, 'day').utc().toDate();
                    this.jours.push({ label: jourItem.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), value: i, madate: jourItem });
                    if (jourItem.getDate() == initDate.getDate())
                        this.jourSelect = i;
                }
                /*
                for ( let i = -42; i <= 42; i++ ) {
    
                    var semaineItem = new Date();
                    semaineItem.setDate( this.semaineStart.getDate() + i );
                    i = i + 6;
                    this.semaines.push( { label: moment( semaineItem ).format( 'DD/MM/YYYY' ), value: j, madate: semaineItem } );
                    var verifDate = moment( this.dateSelect ).startOf( 'week' ).add( 1, 'day' ).utc().toDate();
                    if ( verifDate.getDate() == semaineItem.getDate() ) this.semaineSelect = j;
                    j++;
    
                }
    
    
                for ( let i = 0; i < 7; i++ ) {
                    var jourItem = new Date();
                    jourItem.setDate( this.semaineStart.getDate() + i );
                    this.jours.push( { label: jourItem.toLocaleDateString( 'fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' } ), value: i, madate: jourItem } );
                    if ( jourItem.getDate() == initDate.getDate() )
                        this.jourSelect = i;
                }
                */
                this.groupeSalleService
                    .getListeGroupes()
                    .subscribe(

                        c => {
                            let n = 1;
                            this.listeGroupes = this.listeGroupes.concat(c.map(function (a) { return { label: a.lib_groupe, value: n++, num_groupe: a.num_groupe }; }));
                        },
                        e => this.errorMessage = e,
                        () => this.isLoading = false);
                this.getPresence();

                this.globals.getDonneesConnexion().subscribe((data: LoginData) => {
                    this.globals.donneesConnexion = <LoginData>data[0];
                });
            });



    }

    NgOnInit() {
    }

    selectSemaine(index: number) {
        this.semaineSelect = index;
        this.jours = [];
        this.dateSelect = this.semaines[this.semaineSelect].madate;
        this.semaines = [];
        this.semaineStart = moment(this.dateSelect).startOf('week').add(1, 'day').utc().toDate();
        var j = 0;
        for (let i = 42; i > 0; i--) {
            var semaineItem = new Date();
            semaineItem = moment(this.dateSelect).subtract(i, 'day').utc().toDate();
            i = i - 6;
            this.semaines.push({ label: moment(semaineItem).format('DD/MM/YYYY'), value: j, madate: semaineItem });
            j++;
        }
        for (let i = 0; i <= 42; i++) {
            var semaineItem = new Date();
            semaineItem = moment(this.dateSelect).add(i, 'day').utc().toDate();
            i = i + 6;
            this.semaines.push({ label: moment(semaineItem).format('DD/MM/YYYY'), value: j, madate: semaineItem });
            j++;
        }
        this.semaineSelect = 6;
        for (let i = 0; i < 7; i++) {
            let jourItem = moment(this.dateSelect).add(i, 'day').utc().toDate();
            this.jours.push({ label: jourItem.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), value: i, madate: jourItem });
        }
        this.jourSelect = 0;
        this.getPresence();
    }

    selectJour() {
        this.dateSelect = this.jours[this.jourSelect].madate;
        this.getPresence();
    }

    getPresence() {
        this.isLoading = true;
        this.display = true;
        this.loading = true;
        this.styleTable = "table table-striped table-responsive panel-shadow";
        return this.presenceService
            .getListDateEtSalle(
                moment(this.dateSelect).format('DD/MM/YYYY'),
                moment(this.dateSelect).format('DD/MM/YYYY'),
                this.selectedSalles
            )
            .subscribe(
                p => {
                    this.presences = <Presence[]>p.map(

                        function (a) {
                            return <Presence>({
                                nolot: a.nolot,
                                nofiche: a.nofiche,
                                id: a.id,
                                dateraw: a.dateraw,
                                datesem: a.datesem,
                                hdebut: a.hdebut,
                                hfin: a.hfin,
                                codesalle: a.codesalle,
                                codeue: a.codeue,
                                codepole: a.codepole,
                                jour: a.jour,
                                enseignant: a.enseignant,
                                appariteur: a.appariteur,
                                rem_ens: a.rem_ens,
                                rem_app: a.rem_app,
                                nbpresents: a.nbpresents,
                                chaire: a.chaire,
                                valide: a.valide,
                                typecours: a.typecours,
                                groupe: a.groupe,
                                annule: a.annule,
                                hdebut_reel: a.hdebut_reel,
                                hfin_reel: a.hfin_reel,
                                datefichier: a.datefichier,
                                video: a.video
                            });
                        });
                    this.styleTable = "table table-striped table-responsive panel-shadow zoomIn";
                    this.isLoading = false;
                    this.display = false;
                    this.loading = false;
                    setTimeout(() => {
                        //this.styleDatatable = "material striped fade-animation";
                    }, 1);
                },
                e => this.errorMessage = e,
                () => this.isLoading = false);
    }

    selectGroupe() {

        this.groupeSalleService
            .getSallesAffectees(this.listeGroupes[this.selectedGroupe].num_groupe)
            .subscribe(
       /* happy path */ c => {
                    this.sallesDuGroupe = [];
                    for (let i = 0, len = c.length; i < len; i++) {
                        this.sallesDuGroupe.push(c[i].code);
                    };
                    this.selectedSalles = this.sallesDuGroupe;
                    this.getPresence();
                },
       /* error path */ e => this.errorMessage = e,
       /* onComplete */() => this.isLoading = false);
    }

    refreshData() {
        this.jours = [];
        this.semaines = [];
        this.semaineStart = moment(this.dateSelect).startOf('week').add(1, 'day').utc().toDate();

        let j = 0;
        for (let i = 42; i > 0; i--) {
            let semaineItem = new Date();
            semaineItem = moment(this.dateSelect).startOf('week').add(1, 'day').utc().subtract(i, 'day').utc().toDate();
            i = i - 6;
            this.semaines.push({ label: moment(semaineItem).format('DD/MM/YYYY'), value: j, madate: semaineItem });
            j++;
        }
        for (let i = 0; i <= 42; i++) {
            let semaineItem = new Date();
            semaineItem = moment(this.dateSelect).startOf('week').add(1, 'day').utc().add(i, 'day').utc().toDate();
            i = i + 6;
            this.semaines.push({ label: moment(semaineItem).format('DD/MM/YYYY'), value: j, madate: semaineItem });
            j++;
        }
        this.semaineSelect = 6;
        for (let i = 0; i < 7; i++) {
            let jourItem = moment(this.dateSelect).startOf('week').add(1, 'day').utc().add(i, 'day').utc().toDate();
            this.jours.push({ label: jourItem.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), value: i, madate: jourItem });
            if (jourItem.getDate() === this.dateSelect.getDate())
                this.jourSelect = i;
        }
        this.getPresence();
    }


}

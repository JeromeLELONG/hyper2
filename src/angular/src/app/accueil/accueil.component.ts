import * as jQuery from 'jquery';
import { Component, OnInit, style, animate, transition, state, trigger, Inject } from '@angular/core';
import { Globals } from './../globals';
import { Lot } from './../interfaces/lot';
import { Favoris } from './../interfaces/favoris';
import { LotService } from './../services/lot.service';
import { FavorisService } from './../services/favoris.service';
import { LoginData } from './../interfaces/logindata';
import { Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';
import { Presence } from './../interfaces/presence';
import { PresenceService } from './../services/presence.service';

@Component({
    templateUrl: './accueil.component.html',
    providers: [Globals, LotService, FavorisService, PresenceService],
    animations: [
        trigger('fadeIn', [
            state('*', style({ 'opacity': 1 })),
            state('void', style({ 'opacity': 0 })),
            transition('void => *', [
                style({ 'opacity': 0 }),
                animate('800ms linear')
            ]),
            transition('* => void', [
                style({ 'opacity': 1 }),
                animate('800ms linear')
            ])
        ]),
        trigger('SlideFromLeft', [
            state('void', style({ width: '100%' })),
            state('*', style({ width: '100%' })),
            transition(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate('1.5s ease-in-out', style({ transform: 'translateX(0%)' }))
            ]),
            transition(':leave', [
                style({ transform: 'translateX(0%)' }),
                animate('1.5s ease-in-out', style({ transform: 'translateX(100%)' }))
            ])
        ]),
        trigger('SlideFromTop', [
            state('void', style({ width: '100%', height: '100%' })),
            state('*', style({ width: '100%', height: '100%' })),
            transition(':enter', [
                style({ transform: 'translateY(-100%)' }),
                animate('1.2s ease-in-out', style({ transform: 'translateY(0%)' }))
            ]),
            transition(':leave', [
                style({ transform: 'translateY(0%)' }),
                animate('1.2s ease-in-out', style({ transform: 'translateY(100%)' }))
            ])
        ]),
        trigger('SlideFromRight', [
            state('void', style({ width: '100%' })),
            state('*', style({ width: '100%' })),
            transition(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('1.2s ease-in-out', style({ transform: 'translateX(0%)' }))
            ]),
            transition(':leave', [
                style({ transform: 'translateX(0%)' }),
                animate('1.2s ease-in-out', style({ transform: 'translateX(-100%)' }))
            ])
        ]),
        trigger('SlideFromBottom', [
            state('void', style({ width: '100%', height: '100%' })),
            state('*', style({ width: '100%', height: '100%' })),
            transition(':enter', [
                style({ transform: 'translateY(-100%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateY(0%)' }))
            ]),
            transition(':leave', [
                style({ transform: 'translateY(0%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateY(100%)' }))
            ])
        ])
    ]
})
export class AccueilComponent implements OnInit {
    lotUtilisateur: Lot[] = [];
    favoris: Favoris[];
    lotStyleList: string[] = [];
    stylesFavoris: string[] = [];
    stylesModify: string[] = [];
    stylesDelete: string[] = [];
    displayEditFavoris: boolean = false;
    activeFavori: Favoris;
    styleDialogFavoris: string = "panel-shadow";
    options: Object;
    showGraph: boolean = false;

    constructor(private globals: Globals, @Inject(LotService) private lotService: LotService, @Inject(FavorisService) private favorisService: FavorisService,
        @Inject(PresenceService) private presenceService: PresenceService) {
        this.activeFavori = <Favoris>({
            id_favoris: 0,
            username: "",
            libelle: "",
            routerlink: "",
            params: ""
        });
        //this.getListeLotsAsync();

    }

    ngOnInit() {

        this.globals.getDonneesConnexion().subscribe((data: LoginData) => {
            this.globals.donneesConnexion = <LoginData>data[0];
            this.getListeLots(this.globals.donneesConnexion.uid);
            this.getFavoris(this.globals.donneesConnexion.uid);
        });

    }
    async getListeLotsAsync() {
        let lots = await this.lotService.getWithUsername('lelongj').toPromise();
        //console.log(lots);
    }
    getListeLots(uid: string) {
        this.lotService.getWithUsername(uid).subscribe((l: Lot[]) => {
            this.lotUtilisateur = l.reverse();
            let styles = ['list-group-item list-group-item-success', 'list-group-item list-group-item-info',
                'list-group-item list-group-item-warning', 'list-group-item list-group-item-danger',
                'list-group-item list-group-item-custom1'];
            for (var i = 0, j = 0, len = this.getLotsUtilisateur().length; i < len; i++) {
                /*
                if(i > 0)
                    if(this.lotUtilisateur[i].nolot != this.lotUtilisateur[i-1].nolot)
                        {
                        if(j == 4) j = 0;
                        else
                                j++;
                        }
                */
                if (j == 4) j = 0;
                else
                    j++;
                this.lotStyleList.push(styles[j]);

            }
            return this.lotUtilisateur;
        });

    }

    getFormatedDate(dateParam: string) {
        let dateLot = new Date(dateParam);
        return dateLot.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' à ' + (dateLot.toLocaleTimeString('fr-FR'));
    }

    getFavoris(uid: string) {
        this.favorisService.getWithUsername(uid).subscribe((l: Favoris[]) => {
            this.stylesFavoris = [];
            this.favoris = l;
            for (var i = 0, len = this.favoris.length; i < len; i++) {
                this.stylesFavoris.push("btn btn-primary btn-block input-shadow");
                this.stylesModify.push("btn btn-info input-shadow");
                this.stylesDelete.push("btn btn-danger input-shadow");
            }
            return this.favoris;
        });

    }


    getFavoriString(listEntry) {
        if (listEntry) return listEntry.join();
        return "";
    }
    getLotsUtilisateur() {
        return this.lotUtilisateur.filter(function (x) { return x.nofiche == 1; });
    }

    nbFiches(nolot) {
        var nbFiches = this.lotUtilisateur.filter(row => row.nolot == nolot).length;
        return nbFiches;
    }


    supprimerFavori(idFavori: number, index: number) {
        this.stylesFavoris[index] = "btn btn-primary btn-block shake-animation input-shadow";
        setTimeout(() => {
            this.favorisService
                .delete(idFavori)
                .subscribe(
                    (r: Response) => {
                        this.getFavoris(this.globals.donneesConnexion.uid);
                    });
        }, 1000);
    }

    editerFavori(Favori: Favoris) {
        this.activeFavori = Favori;
        this.displayEditFavoris = true;
    }

    saveFavori() {

        this.favorisService.save(this.activeFavori).subscribe((dataResponse: Favoris) => {
            this.activeFavori = dataResponse;
            this.styleDialogFavoris = "fadeEnd-animation panel-shadow";
            setTimeout(() => {
            this.displayEditFavoris = false;
                this.styleDialogFavoris = "panel-shadow";
            }, 1000);
        });
    }

    closeLot(i) {
        this.lotStyleList[i] = this.lotStyleList[i].substring(0, this.lotStyleList[i].length - 6);
        this.showGraph = false;
    }
    showLot(nolot, i) {
        this.lotStyleList[i] = this.lotStyleList[i] + ' focus';
        // console.log(nolot);
        // console.log(this.lotUtilisateur);
        this.presenceService.getFromListeID(this.lotUtilisateur.filter(function (item) {
            return item.nolot === nolot;
        }, nolot).map(function (a) { return a.id; })).subscribe((p: Presence[]) => {
            // console.log(p);
            const data = p.map(function (a) {
                return [a.codesalle, Number(a.nbpresents)];
            });
            this.options = {
                chart: {
                    type: 'pie',
                    height: 350,
                    borderRadius: 20,
                    backgroundColor: {
                        linearGradient: [0, 0, 500, 500],
                        stops: [
                            [0, 'rgb(255, 255, 255)'],
                            [1, 'rgb(200, 200, 255)']
                        ]
                    },
                    width: 350,
                    options3d: {
                        enabled: true,
                        alpha: 45,
                        beta: 0
                    }
                },
                credits: { enabled: false },
                exporting: { enabled: false },
                title: {
                    text: 'Répartition des présents pour le lot ' + nolot
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        depth: 35,
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}'
                        }
                    }
                },
                series: [{
                    type: 'pie',
                    name: 'Browser share',
                    data: data
                }]
            };

            this.showGraph = true;
        });

    }
}

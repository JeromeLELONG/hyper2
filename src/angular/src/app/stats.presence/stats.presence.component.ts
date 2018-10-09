import { Component,style, OnInit, animate, transition, state, trigger } from '@angular/core';
import {TabMenuModule,MenuItem} from 'primeng/primeng';


@Component({
    templateUrl: './stats.presence.component.html',
    animations: [
                 trigger('fadeIn', [
                     state('*', style({'opacity': 1})),
                     transition('void => *', [
                         style({'opacity': 0}),
                         animate('800ms linear')
                     ])
                 ])
             ]
})
export class StatsPresenceComponent {
    public items: MenuItem[];
    public choixItem: string;

    ngOnInit() {
    this.choixItem = "tauxocc";
        this.items = [
        {label: 'Taux d\'occupation des salles', icon: 'fa-bar-chart', command: (event) => {
            this.choixItem = "tauxocc";
        }},
        {label: 'Fréquence de réservations', icon: 'fa-bar-chart',command: (event) => {
            this.choixItem = "frequencereserv";
        }},
        {label: 'Répartition par type d\'évènement', icon: 'fa-bar-chart',command: (event) => {
            this.choixItem = "repartevent";
        }},
        {label: 'Table de suivi des données', icon: 'fa-th-list',command: (event) => {
            this.choixItem = "suividonnees";
        }},
    ];
}

}

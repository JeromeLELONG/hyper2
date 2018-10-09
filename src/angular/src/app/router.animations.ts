import {trigger, state, animate, style, transition} from '@angular/core';

export function routerTransition(typeTransition: string) {
    if(typeTransition == "right")
  return slideToRight();
    if(typeTransition == "left")
        return slideToLeft();
    if(typeTransition == "top")
        return slideToTop();
}

function fadeIn() {
return trigger('fadeIn', [
                   state('*', style({'opacity': 1})),
                   state('void', style({'opacity': 0})),
                   transition('void => *', [
                       style({'opacity': 0}),
                       animate('800ms linear')
                   ]),
                   transition('* => void', [
                                            style({'opacity': 1}),
                                            animate('800ms linear')
                                        ])
               ]);
}

function slideToRight() {
  return trigger('routerTransition', [
    state('void', style({position:'absolute', width:'100%'}) ),
    state('*', style({position:'absolute', width:'100%'}) ),
    transition(':enter', [
      style({transform: 'translateX(-100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(100%)'}))
    ])
  ]);
}

function slideToLeft() {
  return trigger('routerTransition', [
    state('void', style({position:'absolute', width:'100%'}) ),
    state('*', style({position:'absolute', width:'100%'}) ),
    transition(':enter', [
      style({transform: 'translateX(100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateX(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateX(-100%)'}))
    ])
  ]);
}

function slideToBottom() {
  return trigger('routerTransition', [
    state('void', style({position:'absolute', width:'100%', height:'100%'}) ),
    state('*', style({position:'absolute', width:'100%', height:'100%'}) ),
    transition(':enter', [
      style({transform: 'translateY(-100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateY(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(100%)'}))
    ])
  ]);
}

function slideToTop() {
  return trigger('routerTransition', [
    state('void', style({position:'absolute', width:'100%', height:'100%'}) ),
    state('*', style({position:'absolute', width:'100%', height:'100%'}) ),
    transition(':enter', [
      style({transform: 'translateY(100%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
    ]),
    transition(':leave', [
      style({transform: 'translateY(0%)'}),
      animate('0.5s ease-in-out', style({transform: 'translateY(-100%)'}))
    ])
  ]);
}


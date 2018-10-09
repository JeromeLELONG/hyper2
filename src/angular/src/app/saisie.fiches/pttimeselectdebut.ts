import {Input, Output,EventEmitter, ViewChild, ElementRef, AfterViewInit, Component } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'heuredebut',
  template: `<input #heuredebut type="text" style="width: 60px;" [value]="value">`
})
export class TimeSelectDebut implements AfterViewInit {
  @ViewChild('heuredebut') input: ElementRef;
  @Input() value = '';
  @Output() timeChange = new EventEmitter();
  
  ngAfterViewInit() {
      
      
    jQuery(this.input.nativeElement)
    .timepicker({
        hourText: 'Heures',
        minuteText: 'Minutes',
        showPeriodLabels: false,
        // Min and Max time
        minTime: {  
            hour: 8,
            minute: 0
        },
        maxTime: {      
            hour: 22,      
            minute: 60
        },
        onSelect: (value) => {
        this.value = value;
        this.timeChange.next(value);
      },
      timeSeparator: 'h',
    });

  }
  
}
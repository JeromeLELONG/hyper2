/*
 * Angular 2 Dropdown Multiselect for Bootstrap
 *
 * Simon Lindh
 * https://github.com/softsimon/angular-2-dropdown-multiselect
 */

import {
  NgModule,
  Component,
  Pipe,
  OnInit,
  DoCheck,
  HostListener,
  Input,
  ElementRef,
  Output,
  EventEmitter,
  forwardRef,
  IterableDiffers
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

const MULTISELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MultiselectDropdownCustom),
  multi: true
};

export interface IMultiSelectOptionCustom {
  id: any;
  name: string;
}

export interface IMultiSelectOptionSelectedCustom {
    selectedOptions: number[];
    filter: string;
    event: string;
  }

export interface IMultiSelectSettingsCustom {
  pullRight?: boolean;
  enableSearch?: boolean;
  checkedStyle?: 'checkboxes' | 'glyphicon' | 'fontawsome';
  buttonClasses?: string;
  selectionLimit?: number;
  closeOnSelect?: boolean;
  autoUnselect?: boolean;
  showCheckAll?: boolean;
  showUncheckAll?: boolean;
  dynamicTitleMaxItems?: number;
  maxHeight?: string;
}

export interface IMultiSelectTextsCustom {
  checkAll?: string;
  uncheckAll?: string;
  checked?: string;
  checkedPlural?: string;
  searchPlaceholder?: string;
  defaultTitle?: string;
}

@Pipe({
  name: 'searchFilter'
})
export class MultiSelectSearchFilterCustom {
  transform(options: Array<IMultiSelectOptionCustom>, args: string): Array<IMultiSelectOptionCustom> {
      return options.filter((option: IMultiSelectOptionCustom) =>
      option.name 
        .toLowerCase()
        .indexOf((args || '').toLowerCase()) > -1);
  }
}

@Component({
  selector: 'ss-multiselect-custom',
  providers: [MULTISELECT_VALUE_ACCESSOR],
  styles: [`
       a { outline: none !important; }
  `],
  template: `
    <div class="dropdown">
        <button type="button" class="dropdown-toggle" [ngClass]="settings.buttonClasses"
        (click)="toggleDropdown()">{{ title }}&nbsp;<span class="caret"></span></button>
        <ul *ngIf="isVisible" class="dropdown-menu" [class.pull-right]="settings.pullRight" [class.dropdown-menu-right]="settings.pullRight"
        [style.max-height]="settings.maxHeight" style="display: block; height: auto; overflow-y: auto;">
        <li class="dropdown-item" *ngIf="settings.enableSearch">
            <div class="input-group input-group-sm">
            <span class="input-group-addon" id="sizing-addon3"><i class="fa fa-search"></i></span>
            <input type="text" class="form-control" placeholder="{{ texts.searchPlaceholder }}" 
            aria-describedby="sizing-addon3" [(ngModel)]="model.filter" (ngModelChange)="updateModel($event)">
            <span class="input-group-btn" *ngIf="model.filter.length > 0">
                <button class="btn btn-default" type="button" (click)="clearSearch()"><i class="fa fa-times"></i></button>
            </span>
            </div>
        </li>
        <li class="dropdown-divider divider" *ngIf="settings.enableSearch"></li>
        <li class="dropdown-item" *ngIf="settings.showCheckAll">
            <a href="javascript:;" role="menuitem" tabindex="-1" (click)="checkAll()">
            <span style="width: 16px;" class="glyphicon glyphicon-ok"></span>
            {{ texts.checkAll }}
            </a>
        </li>
        <li class="dropdown-item" *ngIf="settings.showUncheckAll">
            <a href="javascript:;" role="menuitem" tabindex="-1" (click)="uncheckAll()">
            <span style="width: 16px;" class="glyphicon glyphicon-remove"></span>
            {{ texts.uncheckAll }}
            </a>
        </li>
        <li *ngIf="settings.showCheckAll || settings.showUncheckAll" class="dropdown-divider divider"></li>
        <li class="dropdown-item" style="cursor: pointer;"  *ngFor="let option of options | searchFilter:model.filter" (click)="setSelected($event, option)">
            <a href="javascript:;" role="menuitem" tabindex="-1">
            <input *ngIf="settings.checkedStyle === 'checkboxes'" type="checkbox" [checked]="isSelected(option)" />
            <span *ngIf="settings.checkedStyle === 'glyphicon'" style="width: 16px;"
            class="glyphicon" [class.glyphicon-ok]="isSelected(option)"></span>
            <span *ngIf="settings.checkedStyle === 'fontawsome'" style="width: 16px;display: inline-block;">
                <i *ngIf="isSelected(option)" class="fa fa-check" aria-hidden="true"></i>
            </span>
            {{ option.name }}
            </a>
        </li>
        </ul>
    </div>
`
})
export class MultiselectDropdownCustom implements OnInit, DoCheck, ControlValueAccessor {

  @Input() options: Array<IMultiSelectOptionCustom>;
  @Input() settings: IMultiSelectSettingsCustom;
  @Input() texts: IMultiSelectTextsCustom;
  @Output() selectionLimitReached = new EventEmitter();
  @Output() dropdownClosed = new EventEmitter();

  @HostListener('document: click', ['$event.target'])
  onClick(target: HTMLElement) {
    let parentFound = false;
    while (target != null && !parentFound) {
      if (target === this.element.nativeElement) {
        parentFound = true;
      }
      target = target.parentElement;
    }
    if (!parentFound) {
      this.isVisible = false;
    }
  }

  model: IMultiSelectOptionSelectedCustom = <IMultiSelectOptionSelectedCustom>({selectedOptions: [],filter: '',event: 'init'});
  title: string;
  differ: any;
  numSelected: number = 0;
  isVisible: boolean = false;
  defaultSettings: IMultiSelectSettingsCustom = {
    pullRight: false,
    enableSearch: false,
    checkedStyle: 'checkboxes',
    buttonClasses: 'btn btn-default btn-secondary',
    selectionLimit: 0,
    closeOnSelect: false,
    autoUnselect: false,
    showCheckAll: false,
    showUncheckAll: false,
    dynamicTitleMaxItems: 3,
    maxHeight: '300px',
  };
  defaultTexts: IMultiSelectTextsCustom = {
    checkAll: 'Cocher tout',
    uncheckAll: 'Décocher tout',
    checked: 'sélectionné',
    checkedPlural: 'sélectionnés',
    searchPlaceholder: 'Recherche...',
    defaultTitle: 'Select',
  };

  constructor(private element: ElementRef,
    differs: IterableDiffers) {
      this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this.settings = Object.assign(this.defaultSettings, this.settings);
    this.texts = Object.assign(this.defaultTexts, this.texts);
    this.title = this.texts.defaultTitle;
  }

  onModelChange: Function = (_: any) => { };
  onModelTouched: Function = () => { };


  writeValue(value: any): void {
    if (value !== undefined) {
      this.model.selectedOptions = value;
    }
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  ngDoCheck() {
    if(Object.prototype.toString.call( this.model.selectedOptions ) == '[object Object]') 
        this.model.selectedOptions = [];
    let changes = this.differ.diff(this.model.selectedOptions);
    if (changes) {
      this.updateNumSelected();
      this.updateTitle();
    }
  }

  clearSearch() {
    this.model.filter = '';
  }

  toggleDropdown() {
    this.isVisible = !this.isVisible;
    if (!this.isVisible) {
      this.dropdownClosed.emit();
    }
  }
  
  updateModel(event)
  {
      if(!this.model.selectedOptions) this.model.selectedOptions = [];
      this.model.filter = event;
      this.model.event = "keypress";
      this.onModelChange(this.model);
  }
  
  isSelected(option: IMultiSelectOptionCustom): boolean {
    return this.model.selectedOptions && this.model.selectedOptions.indexOf(option.id) > -1;
  }

  setSelected(event: Event, option: IMultiSelectOptionCustom) {
    if (!this.model.selectedOptions) {
      this.model.selectedOptions = [];
    }
    let index = this.model.selectedOptions.indexOf(option.id);
    if (index > -1) {
      this.model.selectedOptions.splice(index, 1);
    } else {
      if (this.settings.selectionLimit === 0 || this.model.selectedOptions.length < this.settings.selectionLimit) {
        this.model.selectedOptions.push(option.id);
      } else {
        if (this.settings.autoUnselect) {
          this.model.selectedOptions.push(option.id);
          this.model.selectedOptions.shift();
        } else {
          this.selectionLimitReached.emit(this.model.selectedOptions.length);
          return;
        }
      }
    }
    if (this.settings.closeOnSelect) {
      this.toggleDropdown();
    }
    this.model.event = "select";
    this.onModelChange(this.model);
  }

  updateNumSelected() {
    this.numSelected = this.model.selectedOptions && this.model.selectedOptions.length || 0;
  }

  updateTitle() {
    if (this.numSelected === 0) {
      this.title = this.texts.defaultTitle;
    } else if (this.settings.dynamicTitleMaxItems >= this.numSelected) {
      this.title = this.options
        .filter((option: IMultiSelectOptionCustom) =>
          this.model.selectedOptions && this.model.selectedOptions.indexOf(option.id) > -1
        )
        .map((option: IMultiSelectOptionCustom) => option.name)
        .join(', ');
    } else {
      this.title = this.numSelected
        + ' '
        + (this.numSelected === 1 ? this.texts.checked : this.texts.checkedPlural);
    }
  }

  checkAll() {
    this.model.selectedOptions = this.options.map(option => option.id);
    this.onModelChange(this.model);
  }

  uncheckAll() {
    this.model.selectedOptions = [];
    this.onModelChange(this.model);
  }
}

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [MultiselectDropdownCustom],
  declarations: [MultiselectDropdownCustom, MultiSelectSearchFilterCustom],
})
export class MultiselectDropdownCustomModule {}
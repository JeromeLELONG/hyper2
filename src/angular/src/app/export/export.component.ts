import { Component , OnInit  ,style, animate, transition, state, trigger, Inject} from '@angular/core';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Globals } from '../globals';
import { Observable } from 'rxjs/Rx';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';

@Component({
  templateUrl: './export.component.html',
  providers: [ Globals ],
  animations: [
               trigger('fadeIn', [
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
               ]),
               ]
})
export class ExportComponent {
    closable: boolean = false;
    display: boolean = false;
    loading: boolean = false;
    resizable: boolean = false;
    annee: number = 2007;
    styleBoutonExporter: string = "btn btn-primary input-shadow";
    styleBoutonExporterExcel: string = "btn btn-primary input-shadow";
  
  constructor(private globals: Globals,@Inject(Http) private http : Http){  
  }


  ngOnInit(){ 
  }
  
  telechargerCSV() {
      this.telechargerFichierCSV().subscribe((dataResponse) => {
          this.loading = false;
      });
  }
  
  telechargerFichierCSV(): Observable<File> {
      this.display = true;
      this.loading = true;
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 
          'MyApp-Application' : 'AppName', 'Accept': 'application/octet-stream' });
      let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
      return this.http.post(`${this.globals.appUrl}presence/extraire`, 'date=ok',options) 
       .map(function(res: Response) {
           let blob: Blob = res.blob();
           FileSaver.saveAs(blob, 'ExportPresence_'+moment(new Date()).format('DD-MM-YYYY_hhmmss')+'.zip');
           this.display = false;
           this.loading = false;
       },this)
       .catch(this.handleError);
  }

  telechargerExcel() {
      this.telechargerFichierExcel().subscribe((dataResponse) => {
          this.loading = false;
      });
  }
  
  telechargerFichierExcel(): Observable<File> {
      this.display = true;
      this.loading = true;
      let anneeSuivante: number = +this.annee + 1;
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 
          'MyApp-Application' : 'AppName', 'Accept': 'application/octet-stream' });
      let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
      return this.http.post(`${this.globals.appUrl}presence/extraire-excel`, `datedebut=01/08/${this.annee}&datefin=31/07/${anneeSuivante}`,options) 
       .map(function(res: Response) {
           let blob: Blob = res.blob();
           FileSaver.saveAs(blob, 'ExportPresence_'+moment(new Date()).format('DD-MM-YYYY_hhmmss')+'.zip');
           this.display = false;
           this.loading = false;
       },this)
       .catch(this.handleError);
  }
  
  private handleError (error: any) {
      // log error
      // could be something more sofisticated
      let errorMsg = error.message || `Malaise! le webservice ne peut être joint`
      console.error(errorMsg);

      // throw an application level error
      return Observable.throw(errorMsg);
    }
}

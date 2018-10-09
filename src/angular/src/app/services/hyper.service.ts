import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Globals } from './../globals';
import { SalleHP} from '../interfaces/ressources.hp';



@Injectable()
export class HyperService{
  public baseUrl: string;
  public fileUrl: string;
  constructor(@Inject(Http) private http : Http,private globals: Globals){
          this.baseUrl = `${this.globals.appUrl}hyperplanningservice`;
  }

  getSallesHP(): Observable<SalleHP[]>{
    let salle$ = this.http
      .get(`${this.baseUrl}/getsalles`, {headers: this.getHeaders()})
      .map(mapSallesHP)
      .catch(this.handleError);
      return salle$;
  }
  
  doMajSalles(){
      return this.http
        .get(`${this.globals.appUrl}maj-des-salles-hp`, {headers: this.getHeaders()})
        .map((res:Response) => {})
        .catch(this.handleError);
    }
  
  getSalleHP(salle: number): Observable<SalleHP[]>{
      let salle$ = this.http
        .get(`${this.baseUrl}?salle=`+salle, {headers: this.getHeaders()})
        .map(mapSalleHP)
        .catch(this.handleError);
        return salle$;
    }
  

  private getHeaders(){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    return headers;
  }
   

   private handleError (error: any) {

     let errorMsg = error.message || `Malaise! le webservice ne peut être joint`
     console.error(errorMsg);

     return Observable.throw(errorMsg);
   }
}

function mapSallesHP(response:Response){
   return response.json().map(toSalleHP)
}

function toSalleHP(r:any): SalleHP{
  let salle = <SalleHP>({
      nom: r.nom,
  famille: r.famille,
  capa: r.capa,
  nbocc: r.nbocc,  
  occ: r.occ,
  prop: r.prop,
  code: r.code,
  numero: r.numero
  });

  return salle;
}


function mapSalleHP(response:Response): SalleHP{
  return toSalleHP(response.json());
}



import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Lot } from './../interfaces/lot';
import { Globals } from './../globals';


@Injectable()
export class LotService{
  public baseUrl: string;
  public fileUrl: string;
  constructor(@Inject(Http) private http : Http,private globals: Globals){
          this.baseUrl = `${this.globals.appUrl}lotservice`;
  }

  getAll(): Observable<Lot[]>{
    let lot$ = this.http
      .get(`${this.baseUrl}/`, {headers: this.getHeaders()})
      .map(mapLots)
      .catch(this.handleError);
      return lot$;
  }
  
  getLot(nolot: number): Observable<Lot[]>{
      let lot$ = this.http
        .get(`${this.baseUrl}?nolot=`+nolot, {headers: this.getHeaders()})
        .map(mapLots)
        .catch(this.handleError);
        return lot$;
    }
  
  getWithUsername(username: string): Observable<Lot[]>{
      let lot$ = this.http
        .get(`${this.baseUrl}?username=`+username, {headers: this.getHeaders()})
        .map(mapLots)
        .catch(this.handleError);
        return lot$;
    }
  
  getFromListeID(listeID: string[]): Observable<Lot[]>{
      let listeIDParam = {"data":listeID};
      let lot$ = this.http
        .get(`${this.baseUrl}?listeID=`+JSON.stringify(listeIDParam), {headers: this.getHeaders()})
        .map(mapLots)
        .catch(this.handleError);
        return lot$;
    }

  get(id: number): Observable<Lot> {
    let lot$ = this.http
      .get(`${this.baseUrl}/${id}`, {headers: this.getHeaders()})
      .map(mapLot);
      return lot$;
  }

  save(lot: Lot) : Observable<Response>{
    return this.http
      .put(`${this.baseUrl}/${lot.id}`, JSON.stringify(lot), {headers: this.getHeaders()});
  }
  
  create(listeID: string[],username: string,groupe: string) : Observable<Lot[]>{
      let lot$ =  this.http
        .post(`${this.baseUrl}`, JSON.stringify({listeID: listeID, username: username, groupe: groupe}), {headers: this.getHeaders()})
        .map(mapLots)
      .catch(this.handleError);
      return lot$;
    }

  private getHeaders(){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    return headers;
  }
   
// this could also be a private method of the component class
   private handleError (error: any) {
     // log error
     // could be something more sofisticated
     let errorMsg = error.message || `Malaise! le webservice ne peut être joint`
     console.error(errorMsg);

     // throw an application level error
     return Observable.throw(errorMsg);
   }
}

function mapLots(response:Response): Lot[]{
   // uncomment to simulate error:
   // throw new Error('ups! Force choke!');

   // The response of the API has a results
   // property with the actual results
   return response.json().data.map(toLot)
}

function toLot(r:any): Lot{
  let lot = <Lot>({
    nolot: r.nolot,
  nofiche: r.nofiche,
  id: r.id,
  heure_edition: r.heure_edition,
  username: r.username,
  groupe: r.groupe,
  });

  return lot;
}


function mapLot(response:Response): Lot{
  // toPerson looks just like in the previous example
  return toLot(response.json());
}



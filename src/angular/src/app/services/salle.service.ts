import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Salle } from './../interfaces/salle';
import { Globals } from './../globals';

@Injectable()
export class SalleService{
  public baseUrl: string;
  public fileUrl: string;
  constructor(@Inject(Http) private http : Http,private globals: Globals){
          this.baseUrl = `${this.globals.appUrl}salleservice`;
  }

  getAll(): Observable<Salle[]>{
    let salle$ = this.http
      .get(`${this.baseUrl}/`, {headers: this.getHeaders()})
      .map(mapSalles)
      .catch(this.handleError);
      return salle$;
  }
  
  getSallesDispos(groupe: string): Observable<Salle[]>{
      let salle$ = this.http
        .get(`${this.baseUrl}?groupe=${groupe}`, {headers: this.getHeaders()})
        .map(mapSalles)
        .catch(this.handleError);
        return salle$;
    }

  get(id: number): Observable<Salle> {
    let salle$ = this.http
      .get(`${this.baseUrl}/${id}`, {headers: this.getHeaders()})
      .map(mapSalle);
      return salle$;
  }

  save(salle: Salle) : Observable<Response>{
    return this.http
      .put(`${this.baseUrl}/${salle.id}`, JSON.stringify(salle), {headers: this.getHeaders()});
  }
  
  create(salle: Salle) : Observable<Response>{
      return this.http
        .post(`${this.baseUrl}`, JSON.stringify(salle), {headers: this.getHeaders()});
    }

  private getHeaders(){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
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

function mapSalles(response:Response): Salle[]{
   // uncomment to simulate error:
   // throw new Error('ups! Force choke!');

   // The response of the API has a results
   // property with the actual results
   return response.json().data.map(toSalle)
}

function toSalle(r:any): Salle{
  let salle = <Salle>({
    id: r.id,
  nom: r.nom,
  famille: r.famille,
  capa: r.capa,
  nbocc: r.nbocc,
  occ: r.occ,
  prop: r.prop,
  code: r.code,
  numero: r.numero,
  });

  return salle;
}

// to avoid breaking the rest of our app
// I extract the id from the person url
function extractId(salleData:any){
  //let extractedId = albumData.url.replace('http://zf3-restful.localhost/testrestful/','').replace('/','');
    let extractedId = salleData.id;
  return parseInt(extractedId);
}

function mapSalle(response:Response): Salle{
  // toPerson looks just like in the previous example
  return toSalle(response.json());
}



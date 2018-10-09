import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Favoris } from './../interfaces/favoris';
import { Globals } from './../globals';


@Injectable()
export class FavorisService{
  public baseUrl: string;
  public fileUrl: string;
  constructor(@Inject(Http) private http : Http,private globals: Globals){
          this.baseUrl = `${this.globals.appUrl}favorisservice`;
  }

  getAll(): Observable<Favoris[]>{
    let favoris$ = this.http
      .get(`${this.baseUrl}/`, {headers: this.getHeaders()})
      .map(mapFavoris)
      .catch(this.handleError);
      return favoris$;
  }
  
  getFavoris(id: number): Observable<Favoris[]>{
      let favori$ = this.http
        .get(`${this.baseUrl}?id=`+id, {headers: this.getHeaders()})
        .map(mapFavoris)
        .catch(this.handleError);
        return favori$;
    }
  
  getWithUsername(username: string): Observable<Favoris[]>{
      let favoris$ = this.http
        .get(`${this.baseUrl}?username=`+username, {headers: this.getHeaders()})
        .map(mapFavoris)
        .catch(this.handleError);
        return favoris$;
    }
  

  get(id: number): Observable<Favoris> {
    let favori$ = this.http
      .get(`${this.baseUrl}/${id}`, {headers: this.getHeaders()})
      .map(mapFavori);
      return favori$;
  }

  save(favori: Favoris) : Observable<Favoris>{
    return this.http
      .put(`${this.baseUrl}/${favori.id_favoris}`, JSON.stringify(favori), {headers: this.getHeaders()})
      .map((res:Response) => res.json().data)
      .catch(this.handleError);;
  }
  
  create(username : string,libelle : string, routerlink : string, params : string) : Observable<Favoris>{
      let favori$ =  this.http
        .post(`${this.baseUrl}`, JSON.stringify({username: username, libelle: libelle, routerlink: routerlink, params: params}), {headers: this.getHeaders()})
        .map((res:Response) => res.json().data)
      .catch(this.handleError);
      return favori$;
    }

  delete(id:number): Observable<Response> {
      return this.http.delete(`${this.baseUrl}/${id}`) // ...using put request
                       .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
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
     return Observable.throw(errorMsg);
   }
}

function mapFavoris(response:Response): Favoris[]{
   return response.json().data.map(toFavori)
}

function toFavori(r:any): Favoris{
  let favori = <Favoris>({
    id_favoris: r.id_favoris,
  username: r.username,
  libelle: r.libelle,
  routerlink: r.routerlink,
  params: JSON.parse(r.params),
  });

  return favori;
}


function mapFavori(response:Response): Favoris{
  return toFavori(response.json());
}



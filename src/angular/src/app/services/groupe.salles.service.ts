import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { GroupeSalle } from './../interfaces/groupe.salle';
import { Globals } from './../globals';

@Injectable()
export class GroupeSalleService{
  public baseUrl: string;
  public fileUrl: string;
  constructor(@Inject(Http) private http : Http,private globals: Globals){

          this.baseUrl = `${this.globals.appUrl}groupesalleservice`;
  }

  getAll(): Observable<GroupeSalle[]>{
    let groupesalle$ = this.http
      .get(`${this.baseUrl}/`, {headers: this.getHeaders()})
      .map(mapGroupeSalles)
      .catch(this.handleError);
      return groupesalle$;
  }
  
  getListeGroupes(): Observable<GroupeSalle[]>{
      let groupesalle$ = this.http
        .get(`${this.baseUrl}?distinct=true`, {headers: this.getHeaders()})
        .map(mapGroupeSalles)
        .catch(this.handleError);
        return groupesalle$;
    }
  
  getSallesAffectees(groupe: string): Observable<GroupeSalle[]>{
      
      let groupesalle$ = this.http
        .get(`${this.baseUrl}?groupe=${groupe}`, {headers: this.getHeaders()})
        .map(mapGroupeSalles)
        .catch(this.handleError);
        return groupesalle$;
    }

  getId(num_groupe:string,code:string): Observable<GroupeSalle>{
      let groupesalle$ = this.http
      .get(`${this.baseUrl}/0?groupe=${num_groupe}&code=${code}`, {headers: this.getHeaders()})
      .map(mapGroupeSalle);
      return groupesalle$;
  }
  
  get(id: number): Observable<GroupeSalle> {
    let groupesalle$ = this.http
      .get(`${this.baseUrl}/${id}`, {headers: this.getHeaders()})
      .map(mapGroupeSalle);
      return groupesalle$;
  }

  save(groupesalle: GroupeSalle) : Observable<Response>{
      let headersPost      = new Headers({ 'Content-Type': 'application/json' }); 
      return this.http
      .put(`${this.baseUrl}/${groupesalle.id_groupesalle}`, JSON.stringify(groupesalle), {headers: headersPost});
  }
  
  deleteGroupe(groupe:string): Observable<Response> {
      return this.http.delete(`${this.baseUrl}/0?groupe=${groupe}`) // ...using put request
                       .map((res:Response) => res.json()) // ...and calling .json() on the response to return data
                       .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
  deleteSalle(id:number): Observable<GroupeSalle>{
      let groupesalle$ = this.http.delete(`${this.baseUrl}/${id}`) // ...using put request
              .map((res: Response) => res.json().data).catch(this.handleError);
      return groupesalle$;
                //.map(res => res.json()).catch(this.handleError);
      //.catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }
  
  create(groupesalle: GroupeSalle) : Observable<GroupeSalle>{
      let headersPost = new Headers({
          "X-HTTP-Method-Override": "POST",
          'Content-Type': 'application/json',
      });
      let options = new RequestOptions({ headers: headersPost });
      let groupesalle$ = this.http
        .post(`${this.baseUrl}/`,JSON.stringify(groupesalle), options)
        //.map(mapGroupeSalle)
        .map((res:Response) => res.json().data)
        .catch(this.handleError);
      return groupesalle$;
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

function mapGroupeSalles(response:Response): GroupeSalle[]{
   // uncomment to simulate error:
   // throw new Error('ups! Force choke!');

   // The response of the API has a results
   // property with the actual results
   return response.json().data.map(toGroupeSalle)
}

function toGroupeSalle(r:any): GroupeSalle{
  let groupesalle = <GroupeSalle>({
    code: r.code,
  num_groupe: r.num_groupe,
  lib_groupe: r.lib_groupe,
  lib_groupe_long: r.lib_groupe_long, 
  id_groupesalle: r.id_groupesalle,
  });
  return groupesalle;
}

// to avoid breaking the rest of our app
// I extract the id from the person url
function extractId(groupesalleData:any){
  //let extractedId = albumData.url.replace('http://zf3-restful.localhost/testrestful/','').replace('/','');
    let extractedId = groupesalleData.id;
  return parseInt(extractedId);
}

function mapGroupeSalle(response:Response): GroupeSalle{
  // toPerson looks just like in the previous example
  return toGroupeSalle(response.json());
}



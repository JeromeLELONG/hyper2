import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Presence } from './../interfaces/presence';
import { Lot } from './../interfaces/lot';
import { Globals } from './../globals';


@Injectable()
export class PresenceService{
  public baseUrl: string;
  public fileUrl: string;
  public downloadUrl: string;
  constructor(@Inject(Http) private http : Http,private globals: Globals){

          this.downloadUrl = `${this.globals.appUrl}presence/genererlot`;
          this.baseUrl = `${this.globals.appUrl}presenceservice`;
  }

  getAll(): Observable<Presence[]>{
    let presence$ = this.http
      .get(`${this.baseUrl}/`, {headers: this.getHeaders()})
      .map(mapPresences)
      .catch(this.handleError);
      return presence$;
  }
  
  getListDateEtSalle(date_debut: string, date_fin:string,salles:string[]): Observable<Presence[]>{
      let presence$ = this.http
        .get(`${this.baseUrl}?date_fin=${date_fin}&date_debut=${date_debut}&salles=`+JSON.stringify(salles), {headers: this.getHeaders()})
        .map(mapPresences)
        .catch(this.handleError);
        return presence$;
    }

  getListeMatieres(searchToken:string): Observable<string[]>{
      let matieres$ = this.http
        .get(`${this.baseUrl}?getlistematieres=`+searchToken, {headers: this.getHeaders()})
        .map(mapListeMatieres)
        .catch(this.handleError);
        return matieres$;
    }
  
  getListeTypes(): Observable<any[]>{
      let types$ = this.http
        .get(`${this.baseUrl}?getlistetypes=true`, {headers: this.getHeaders()})
        .map( types => types.json().data)
        .catch(this.handleError);
        return types$;
    }
  
  getListeEnseignants(searchToken:string): Observable<string[]>{
      let matieres$ = this.http
        .get(`${this.baseUrl}?getlisteenseignants=`+JSON.stringify(searchToken), {headers: this.getHeaders()})
        .map(mapListeEnseignants)
        .catch(this.handleError);
        return matieres$;
    }
  
  getListeSallesParNombreHeures(date_debut: string, date_fin:string,groupe:string): Observable<any[]>{
      let sallesNombreHeures$ = this.http
        .get(`${this.baseUrl}?getlistesallesparheure=true&date_fin=${date_fin}&date_debut=${date_debut}&groupe=${groupe}`, {headers: this.getHeaders()})
        .map(salles => salles.json().data)
        .catch(this.handleError);
        return sallesNombreHeures$;
    }
  
  getListDateSalleEnseignant(date_debut: string, date_fin:string,salles:string[], enseignants:string[],matieres: string[] = []): Observable<Presence[]>{
      let presence$ = this.http
        .get(`${this.baseUrl}?date_fin=${date_fin}&date_debut=${date_debut}&salles=`+JSON.stringify(salles)+`&enseignants=`+JSON.stringify(enseignants)
                +`&matieres=`+JSON.stringify(matieres), {headers: this.getHeaders()})
        .map(mapPresences)
        .catch(this.handleError);
        return presence$;
    }
  
  getFromListeID(listeID: string[]): Observable<Presence[]>{
      let listeIDParam = {"data":listeID};
      let presence$ = this.http
        .get(`${this.baseUrl}?listeID=`+JSON.stringify(listeIDParam), {headers: this.getHeaders()})
        .map(mapPresences)
        .catch(this.handleError);
        return presence$;
    }
  
  get(id: number): Observable<Presence> {
    let presence$ = this.http
      .get(`${this.baseUrl}/${id}`, {headers: this.getHeaders()})
      .map(mapPresence);
      return presence$;
  }

  save(presence: Presence) : Observable<Response>{
   return this.http
      .put(`${this.baseUrl}/${presence.id}`, JSON.stringify(presence), {headers: this.getHeaders()});
  }

  createLot(listeID: string[],groupeLabel: string) : Observable<Presence[]>{
      let presences$ =  this.http
        .post(`${this.baseUrl}?groupe=`+groupeLabel, JSON.stringify(listeID), {headers: this.getHeaders()})
        .map(mapPresences)
      .catch(this.handleError);
      return presences$;
    }
  
  private getHeaders(){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    return headers;
  }
  
  downloadFile(lot: Lot[]): Observable<File> {
      let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded', 
          'MyApp-Application' : 'AppName', 'Accept': 'application/pdf' });
      let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
   return this.http.post(`${this.downloadUrl}`, 'lot='+JSON.stringify(lot), options)
       .map(this.extractContent)
       .catch(this.handleError);
   }
  
   private extractContent(res: Response) {
       let blob: Blob = res.blob();
       window['saveAs'](blob, 'test.pdf');
   }
   
// this could also be a private method of the component class
   private handleError (error: any) {
     // log error
     // could be something more sofisticated
     let errorMsg = error.message || `Malaise! le webservice ne peut être joint`
     console.error(errorMsg);
     window.location.replace(`login`);
     // throw an application level error
     return Observable.throw(errorMsg);
   }
}

function mapPresences(response:Response): Presence[]{
   // uncomment to simulate error:
   // throw new Error('ups! Force choke!');

   // The response of the API has a results
   // property with the actual results
   return response.json().data.map(toPresence)
}

function mapListeMatieres(response:Response): string[]{
        // uncomment to simulate error:
        // throw new Error('ups! Force choke!');

        // The response of the API has a results
        // property with the actual results
        return response.json().data.map((res) => res.codeue)
     }

function mapListeEnseignants(response:Response): string[]{
        // uncomment to simulate error:
        // throw new Error('ups! Force choke!');

        // The response of the API has a results
        // property with the actual results
        return response.json().data.map((res) => res.enseignant)
     }

function toPresence(r:any): Presence{
  let presence = <Presence>({
    id: r.id,
    nolot: r.nolot,
    nofiche: r.nofiche,
    dateraw: r.dateraw,  
    datesem: r.datesem,
    hdebut: r.hdebut,
    hfin: r.hfin,
    codesalle: r.codesalle,
    codeue: r.codeue,
    codepole: r.codepole,
    jour: r.jour,
    enseignant: r.enseignant,
    appariteur: r.appariteur,
    rem_ens: r.rem_ens,
    rem_app: r.rem_app,
    nbpresents: r.nbpresents,
    chaire: r.chaire,
    valide: r.valide,
    typecours: r.type,
    groupe: r.groupe,
    annule: r.annule,
    hdebut_reel: r.hdebut_reel,
    hfin_reel: r.hfin_reel,
    datefichier: r.datefichier,
    video: r.video
  });
  //console.log('Parsed presence:', presence);
  return presence;
}

// to avoid breaking the rest of our app
// I extract the id from the person url
function extractId(presenceData:any){
  //let extractedId = albumData.url.replace('http://zf3-restful.localhost/testrestful/','').replace('/','');
    let extractedId = presenceData.id;
  return parseInt(extractedId);
}

function mapPresence(response:Response): Presence{
  // toPerson looks just like in the previous example
  return toPresence(response.json());
}



import { Injectable,Inject  } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Cours } from './../interfaces/cours';
import { Globals } from './../globals';

@Injectable()
export class CoursService{
  public baseUrl: string;
  constructor(@Inject(Http) private http : Http,private globals: Globals){ 
           this.baseUrl = `${this.globals.appUrl}coursservice`;
  }

  getAll(): Observable<Cours[]>{
    let cours$ = this.http
      .get(`${this.baseUrl}/`, {headers: this.getHeaders()})
      .map(mapCours)
      .catch(handleError);
    
      return cours$;
  }
  
  getWithDateAndGroup(dateSelect: string,groupSelect :string, trancheHoraire:boolean): Observable<Cours[]>{
    let cours$ = this.http
      .get(`${this.baseUrl}?date=`+dateSelect+`&groupe=`+groupSelect+`&tranche=`+trancheHoraire, {headers: this.getHeaders()})
      .map(mapCours)
      .catch(handleError);
    
      return cours$;
  }
  
  getRessourcesWithDateAndGroup(dateSelect: string,groupSelect :string, trancheHoraire:boolean,ressource: string): Observable<Cours[]>{
      let cours$ = this.http
        .get(`${this.baseUrl}?date=`+dateSelect+`&groupe=`+groupSelect+`&tranche=`+trancheHoraire+`&getressources=`+ressource, {headers: this.getHeaders()})
        .map(mapCours)
        .catch(handleError);
      
        return cours$;
    }
  
  getListeMatieres(searchToken:string): Observable<string[]>{
      let matieres$ = this.http
        .get(`${this.baseUrl}?getlistematieres=`+searchToken, {headers: this.getHeaders()})
        .map(mapListeMatieres)
        .catch(handleError);
        return matieres$;
    }
  getListeEnseignants(searchToken:string): Observable<string[]>{
      let matieres$ = this.http
        .get(`${this.baseUrl}?getlisteenseignants=`+JSON.stringify(searchToken), {headers: this.getHeaders()})
        .map(mapListeEnseignants)
        .catch(handleError);
        return matieres$;
    }
  
  getWithDateAndLocation(datedebut: string,datefin :string, salles: string[], enseignants: string[],
          matieres: string[]): Observable<Cours[]>{
      let cours$ = this.http
        .get(`${this.baseUrl}?datedebut=`+datedebut+`&datefin=`+datefin+`&salles=`+JSON.stringify(salles)+`&enseignants=`+JSON.stringify(enseignants)+`&matieres=`+JSON.stringify(matieres), {headers: this.getHeaders()})
        .map(mapCours)
        .catch(handleError);
      
        return cours$;
    }
  
  getRowNumber() {
      return this.http.get(`${this.baseUrl}/`)
          .map(data => {
              data.json();
              // the console.log(...) line prevents your code from working 
              // either remove it or add the line below (return ...)
              return data.json();
      });
  }

  
  getAllPaginated(page: number): Observable<Cours[]>{
      let cours$ = this.http
        .get(`${this.baseUrl}?page=`+page+`/`, {headers: this.getHeaders()})
        .map(mapCours)
        .catch(handleError);
        return cours$;
    }

  get(id: string): Observable<Cours> {
    let cours$ = this.http
      .get(`${this.baseUrl}/${id}`, {headers: this.getHeaders()})
      .map(mapCoursElement);
      return cours$;
  }

  save(cours: Cours) : Observable<Response>{
    return this.http
      .put(`${this.baseUrl}/${cours.id}`, JSON.stringify(cours), {headers: this.getHeaders()});
  }

  private getHeaders(){
    let headers = new Headers();
    headers.append('Accept', 'application/json');
    return headers;
  }
}

function mapCoursElement(response:Response): Cours{
        // uncomment to simulate error:
        // throw new Error('ups! Force choke!');

        // The response of the API has a results
        // property with the actual results
        return response.json().data.map(toCours)
     }

function mapCours(response:Response): Cours[]{
   // uncomment to simulate error:
   // throw new Error('ups! Force choke!');

   // The response of the API has a results
   // property with the actual results
   return response.json().data.map(toCours)
}

function mapListeMatieres(response:Response): string[]{
        return response.json().data.map((res) => res.codemat)
     }

function mapListeEnseignants(response:Response): string[]{
        return response.json().data.filter(entry => entry.enseignant != null).map((res) => res.enseignant)
     }

function toCours(r:any): Cours{
  let cours = <Cours>({
    numero: r.numero,
    id: r.id,
    duree: r.duree,
    cumul: r.cumul,
    ddebut: r.ddebut,
    dfin: r.dfin,
    nbsem: r.nbsem,
    jour: r.jour,
    hdebut: r.hdebut,
    hfin: r.hfin,
    typecours: r.type,
    codemat: r.codemat,
    matiere: r.matiere,
    enseignant: r.enseignant,
    codeenseignant: r.codeenseignant,
    codediplome: r.codediplome,
    libdiplome: r.libdiplome,
    codelibdiplome: r.codelibdiplome,
    codesalle: r.codesalle,
    salle: r.salle,
    pond: r.pond,
    prop: r.prop,
    memo: r.memo,
    date_modif: r.date_modif
  });
  //console.log('Parsed cours:', cours);
  return cours;
}

// to avoid breaking the rest of our app
// I extract the id from the person url
function extractId(presenceData:any){
    let extractedId = presenceData.id;
  return parseInt(extractedId);
}


// this could also be a private method of the component class
function handleError (error: any) {
  // log error
  // could be something more sofisticated
  let errorMsg = error.message || `Erreur! Le webservice ne peut être joint`
  console.error(errorMsg);
  window.location.replace(`login`);
  // throw an application level error
  return Observable.throw(errorMsg);
}

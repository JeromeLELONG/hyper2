import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers,RequestOptions,ResponseContentType} from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { User } from './../interfaces/user';
import { Globals } from './../globals';


@Injectable()
export class UserService{
  public baseUrl: string;
  public fileUrl: string;
  constructor(@Inject(Http) private http : Http,private globals: Globals){
          this.baseUrl = `${this.globals.appUrl}userservice`;
  }

  getAll(): Observable<User[]>{
    let user$ = this.http
      .get(`${this.baseUrl}/`, {headers: this.getHeaders()})
      .map(mapUsers)
      .catch(this.handleError);
      return user$;
  }
  
  getUser(username: string): Observable<User[]>{
      let user$ = this.http
        .get(`${this.baseUrl}?username=`+username, {headers: this.getHeaders()})
        .map(mapUsers)
        .catch(this.handleError);
        return user$;
    }
  

  get(id: number): Observable<User> {
    let user$ = this.http
      .get(`${this.baseUrl}/${id}`, {headers: this.getHeaders()})
      .map(mapUser);
      return user$;
  }

  save(user: User) : Observable<Response>{
    return this.http
      .put(`${this.baseUrl}/${user.username}`, JSON.stringify(user), {headers: this.getHeaders()});
  }
  
  create(user: User) : Observable<Response>{
      let user$ =  this.http
        .post(`${this.baseUrl}`, JSON.stringify({user: user}), {headers: this.getHeaders()})
      .catch(this.handleError);
      return user$;
    }
  
  delete(username:string): Observable<Response> {
      return this.http.delete(`${this.baseUrl}/`+username) 
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

     // throw an application level error
     return Observable.throw(errorMsg);
   }
}

function mapUsers(response:Response): User[]{
   // uncomment to simulate error:
   // throw new Error('ups! Force choke!');

   // The response of the API has a results
   // property with the actual results
   return response.json().data.map(toUser)
}

function toUser(r:any): User{
  let user = <User>({
    username: r.username,
  password: r.password,
  service: r.service,
  nom: r.nom,
  prenom: r.prenom,
  email: r.email,
  role: r.role
  });

  return user;
}


function mapUser(response:Response): User{
  // toPerson looks just like in the previous example
  return toUser(response.json());
}



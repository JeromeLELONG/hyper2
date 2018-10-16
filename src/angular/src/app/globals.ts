import { Injectable, Inject } from '@angular/core';
import { LoginData } from './interfaces/logindata';
import { User } from './interfaces/user';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';


Injectable()
export class Globals {
    public appUrl: string;
    public role: string = "";
    donneesConnexion: LoginData = <LoginData>({
        acl: [' '],
        attributbase: '',
        bureau: '',
        casecourrier: '',
        civilite: '',
        cn: '',
        cnamlinkoffice: '',
        cnammailbox: '',
        codebureau: '',
        codedirection: '',
        codeservice: '',
        codestructure: '',
        datefin: '',
        datenaissance: '',
        dialupaccess: '',
        direction: '',
        dirxml_associations: [' '],
        dn: '',
        edupersonprincipalname: '',
        facsimiletelephonenumber: '',
        fonction: '',
        fullname: '',
        gecos: '',
        gidnumber: '',
        givenname: '',
        grade: '',
        groupadmin: [' '],
        homedirectory: '',
        idvirtualia: '',
        indice: '',
        lecnamnet_login: '',
        lecnamnet_mail: '',
        loginshell: '',
        logintime: '',
        loginunix_courant: '',
        mail: '',
        mailalternateaddress: [' '],
        mailforwardingaddress: '',
        mailhost: '',
        mailmessagestore: '',
        mailquota: '',
        manager: '',
        mobile: '',
        numerobadge: '',
        objectclass: [' '],
        passwordallowchange: '',
        passwordminimumlength: '',
        passwordrequired: '',
        passworduniquerequired: '',
        patronyme: '',
        position: '',
        precedence1: '',
        precedence2: '',
        precedence3: '',
        precedence4: '',
        preferredlanguage: '',
        radiustunnelmediumtype: '',
        radiustunnelprivategroupid: '',
        radiustunneltype: '',
        roomnumber: '',
        sapid: '',
        sapsncname: '',
        sapusername: '',
        service: '',
        servicepath: '',
        sn: '',
        statut: '',
        structure: '',
        supannactivite: '',
        supanncivilite: '',
        supannempcorps: '',
        telephonenumber: '',
        title: '',
        uid: '',
        uidnumber: '',
        vpnallowed: '',
        watchdog: '',
        role: ''
    });

    frLabel = {
        firstDayOfWeek: 1,
        dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        dayNamesShort: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
        dayNamesMin: ["D", "L", "M", "m", "J", "V", "S"],
        monthNames: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
        monthNamesShort: ["jan", "fév", "mar", "avr", "mai", "jun", "jui", "aut", "sep", "oct", "nov", "déc"]
    };

    constructor(@Inject(Http) private http: Http) {


        //if(location.host.search('localhost') == 0)
        //    this.appUrl = 'https://hyperdev.cnam.fr/';
        //else
        this.appUrl = '/api/';
        this.getDonneesConnexion().subscribe((data: LoginData) => {
            this.donneesConnexion = <LoginData>data[0];
        });
    }



    public getDonneesConnexion(): Observable<LoginData> {
        let opt: RequestOptions;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //headers.append('Content-Type',  'application/x-www-form-urlencoded');
        //headers.append('Accept', '*/*');
        //headers.append('Origin'   ,'http://localhost:4200');

        opt = new RequestOptions({
            headers: headers
        })
        return this.http.get(`${this.appUrl}ldapservice/donneesConnexion`, opt)
            .map((res: Response) => {
                return res.json()
            }).catch(this.handleError);
    }

    public getDonneesUtilisateur(username: string): Observable<User> {
        let opt: RequestOptions;
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //headers.append('Content-Type',  'application/x-www-form-urlencoded');
        //headers.append('Accept', '*/*');
        //headers.append('Origin'   ,'http://localhost:4200');

        opt = new RequestOptions({
            headers: headers
        })
        return this.http.get(`${this.appUrl}ldapservice/?username=` + username, opt)
            .map((res: Response) => {
                return res.json()
            }).catch(this.handleError);
    }

    public handleError(error: any) {
        // log error
        // could be something more sofisticated
        const errorMsg = error.message || `Erreur! Le webservice ne peut être joint`
        console.error(errorMsg);
        window.location.replace(`/login`);
        // throw an application level error
        return Observable.throw(errorMsg);
    }
}


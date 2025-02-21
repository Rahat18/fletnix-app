import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CollectionsResponse {
  collections: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CollectionsService {
  private apiUrl = 'http://localhost:5000/api/netflix';

  constructor(private http: HttpClient) { }

  getCollections(): Observable<CollectionsResponse> {
    return this.http.get<CollectionsResponse>(this.apiUrl);
  }

  addCollection(collection: Collection): Observable<any> {
    return this.http.post(this.apiUrl, collection);
  }
  getNetflixTitlesNoPagination(){
    // return this.http.get<{entries: NetflixTitle[]}>(`${this.apiUrl}/all`);
    return this.http.get<CollectionsResponse>(this.apiUrl);
  }
}
export interface Collection {
    name: string;
    description?: string;
    createdAt?: Date;
  }
  export interface CollectionsResponse {
    collectionNames: string[]; // Collections from MongoDB
    storedCollections: Collection[]; // Collections metadata stored in DB
  }
  export interface NetflixTitle {
    show_id: string;
    type: string;
    title: string;
    director?: string;
    country?: string;
    date_added?: string;
    release_year?: number;
    rating?: string;
    duration?: string;
    listed_in?: string;
    description?: string;
  }
  
  export interface NetflixResponse {
    entries: NetflixTitle[];
    total: number;
    page: number;
    pages: number;
  }
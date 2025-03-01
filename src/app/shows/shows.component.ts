import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { Collection, CollectionsResponse, CollectionsService, NetflixTitle } from '../services/collection.service';
import { AuthService } from '../services/auth-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-shows',
  templateUrl: './shows.component.html',
  styleUrls: ['./shows.component.scss']
})
export class ShowsComponent {
  collectionNames: string[] = [];
  storedCollections: Collection[] = [];
  newCollection: Collection = { name: '', description: '' };
  errorMessage: string = '';
  allTitles: any = [];
  displayedTitles: NetflixTitle[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 15;
  totalPages: number = 0;
  searchTerm: string = '';
  filterType: string = '';
  loading: boolean = true;
  dummyArray = new Array(15);
  showdetails: boolean = false;
  collectionDetails: any;
  constructor(private router: Router, private collectionsService: CollectionsService, private authService: AuthService, private http: HttpClient,) {


    this.collectionsService.getCollections().subscribe(
      (res: any) => {
        this.loading = false
        // console.log(res.entries.length);
        const flatArray = res.entries.reduce((acc: string | any[], curr: any) => acc.concat(curr), []);
        this.allTitles = flatArray;
        this.collectionNames = res.collections;
        this.storedCollections = res.storedCollections;
        this.allTitles = res.entries;
        this.applyFiltersAndPagination();
      },
      err => {
        console.error(err);
        this.errorMessage = 'Failed to load collections';
      }
    );

    this.getUserDetails()
  }
  searchQuery: string = '';
  results: string[] = [];
  searchSubject = new Subject<string>();

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxButtons = 7;
    const halfWindow = Math.floor(maxButtons / 2);

    // Always show the first page
    pages.push(1);

    // Determine the start and end of the window
    let start = this.currentPage - halfWindow;
    let end = this.currentPage + halfWindow;

    // Adjust if out of bounds
    if (start < 2) {
      start = 2;
      end = start + maxButtons - 1;
    }
    if (end > this.totalPages - 1) {
      end = this.totalPages - 1;
      start = end - maxButtons + 1;
      if (start < 2) {
        start = 2;
      }
    }

    // If there's a gap between first page and start, add ellipsis
    if (start > 2) {
      pages.push(-1); // Use -1 to denote ellipsis
    }

    // Add the window pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // If there's a gap between end and the last page, add ellipsis
    if (end < this.totalPages - 1) {
      pages.push(-1);
    }

    // Always show the last page if there's more than one page
    if (this.totalPages > 1) {
      pages.push(this.totalPages);
    }
    return pages;
  }

  applyFiltersAndPagination(): void {
    let filtered = this.allTitles;
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter((title: { title: string; director: string; }) =>
        (title.title && title.title.toLowerCase().includes(term)) ||
        (title.director && title.director.toLowerCase().includes(term))
      );
    }
    if (this.filterType && this.filterType.trim() !== '') {
      filtered = filtered.filter((title: { type: string; }) => title.type === this.filterType);
    }
    // Calculate user's age from DOB
    const userAge = this.calculateAge(this.user.dob);

    // If user is under 18, filter out items rated "R"
    if (userAge < 18) {
      filtered = filtered.filter((title: { rating: string; }) => title.rating !== 'R');
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedTitles = filtered.slice(startIndex, endIndex);
  }

  onSearchChange(): void {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }
  onFilterChange(): void {
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFiltersAndPagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFiltersAndPagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFiltersAndPagination();
    }
  }



  gotoHome() {
    this.router.navigate(['/']);
  }
  showDetails(item: any) {
    this.showdetails = true;
    this.collectionDetails = item
  }
  user: any;

  getUserDetails() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get('https://fletnix-app.onrender.com/api/auth/user', { headers })
      .subscribe(
        (response: any) => {
          this.user = response;
          // console.log("User:", response);
          localStorage.setItem('user', JSON.stringify(response));
        },
        (error) => {
          console.error('Error fetching user data', error);
        }
      );
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
  calculateAge(dobString: string): number {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }

}

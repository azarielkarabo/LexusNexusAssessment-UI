import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, filter, takeUntil } from 'rxjs/operators';

interface NavigationItem {
  icon: string;
  label: string;
  route: string;
  description: string;
  badge?: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) sidenav!: MatSidenav;
  
  private destroy$ = new Subject<void>();
  
  title = 'Inventory Management System';
  currentRoute = '/products';
  
  // Navigation items
  navigationItems: NavigationItem[] = [
    {
      icon: 'inventory_2',
      label: 'Products',
      route: '/products',
      description: 'Manage your product inventory',
      badge: 0
    },
    {
      icon: 'category',
      label: 'Categories',
      route: '/categories',
      description: 'Organize product categories'
    }
  ];

  // Check if mobile view
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    // Track route changes to update active navigation
    this.router.events
      .pipe(
        filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        this.currentRoute = event.url;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Navigate to route
  navigate(route: string): void {
    this.router.navigate([route]);
    
    // Close sidenav on mobile after navigation
    this.isHandset$.pipe(takeUntil(this.destroy$)).subscribe(isHandset => {
      if (isHandset && this.sidenav) {
        this.sidenav.close();
      }
    });
  }

  // Check if route is active
  isRouteActive(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route + '/');
  }

  // Toggle sidenav
  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  // User menu actions
  openProfile(): void {
    console.log('Open user profile');
    // Implement profile dialog or navigation
  }

  openSettings(): void {
    this.navigate('/settings');
  }

  logout(): void {
    console.log('User logout');
    // Implement logout logic
    // this.authService.logout();
    // this.router.navigate(['/login']);
  }

  // Get page title based on current route
  getPageTitle(): string {
    const activeItem = this.navigationItems.find(item => this.isRouteActive(item.route));
    return activeItem ? activeItem.label : 'Dashboard';
  }

  // Get page description based on current route
  getPageDescription(): string {
    const activeItem = this.navigationItems.find(item => this.isRouteActive(item.route));
    return activeItem ? activeItem.description : 'Welcome to your inventory management system';
  }
}
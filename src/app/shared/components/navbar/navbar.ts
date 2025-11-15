import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '@core/services/sidebar.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  // Expose as public so template can access it
  sidebarService = inject(SidebarService);
  private elementRef = inject(ElementRef);

  // Dropdown states
  searchDropdownOpen = signal(false);
  notificationsDropdownOpen = signal(false);
  userDropdownOpen = signal(false);
  activeNotificationTab = signal<'notifications' | 'messages'>('notifications');

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    // Check if click is outside the navbar component
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeAllDropdowns();
    }
  }

  toggleSidebar(): void {
    this.sidebarService.toggleSidebar();
  }

  toggleSearchDropdown(): void {
    this.searchDropdownOpen.update((value) => !value);
    this.notificationsDropdownOpen.set(false);
    this.userDropdownOpen.set(false);
  }

  toggleNotificationsDropdown(): void {
    this.notificationsDropdownOpen.update((value) => !value);
    this.searchDropdownOpen.set(false);
    this.userDropdownOpen.set(false);
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen.update((value) => !value);
    this.searchDropdownOpen.set(false);
    this.notificationsDropdownOpen.set(false);
  }

  closeAllDropdowns(): void {
    this.searchDropdownOpen.set(false);
    this.notificationsDropdownOpen.set(false);
    this.userDropdownOpen.set(false);
  }

  switchNotificationTab(tab: 'notifications' | 'messages'): void {
    this.activeNotificationTab.set(tab);
  }

  toggleFullscreen(): void {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }
}

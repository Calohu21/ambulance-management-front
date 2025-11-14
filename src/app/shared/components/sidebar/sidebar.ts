import { Component, inject } from '@angular/core';
import { SidebarService } from '@core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private sidebarService = inject(SidebarService);

  // Expose signals for template
  isSidebarOpen = this.sidebarService.isSidebarOpen;
  openDropdowns = this.sidebarService.openDropdowns;

  toggleDropdown(dropdownId: string): void {
    this.sidebarService.toggleDropdown(dropdownId);
  }

  closeSidebar(): void {
    this.sidebarService.closeSidebar();
  }
}

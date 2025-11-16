import { Component, inject } from '@angular/core';
import { SidebarService } from '@core/services/sidebar.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  private sidebarService = inject(SidebarService);

  isSidebarOpen = this.sidebarService.isSidebarOpen;
  openDropdowns = this.sidebarService.openDropdowns;

  toggleDropdown(dropdownId: string): void {
    this.sidebarService.toggleDropdown(dropdownId);
  }

  closeSidebar(): void {
    this.sidebarService.closeSidebar();
  }
}

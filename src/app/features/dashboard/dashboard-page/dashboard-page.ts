import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {
  isSidebarOpen = true;
  selectedDropdown: string | null = null;
  openDropdowns: { [key: string]: boolean } = {};

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  toggleDropdown(dropdownId: string): void {
    if (this.openDropdowns[dropdownId]) {
      this.openDropdowns[dropdownId] = false;
    } else {
      // Close all other dropdowns
      Object.keys(this.openDropdowns).forEach((key) => {
        this.openDropdowns[key] = false;
      });
      this.openDropdowns[dropdownId] = true;
    }
  }

  toggleNavDropdown(dropdownId: string): void {
    if (this.selectedDropdown === dropdownId) {
      this.selectedDropdown = null;
    } else {
      this.selectedDropdown = dropdownId;
    }
  }

  closeNavDropdown(): void {
    this.selectedDropdown = null;
  }
}

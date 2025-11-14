import { Component } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { StatCard } from '@shared/components/stat-card/stat-card';

@Component({
  selector: 'app-dashboard-page',
  imports: [CommonModule, NgOptimizedImage, StatCard],
  templateUrl: './dashboard-page.html',
})
export class DashboardPage {
  selectedDropdown: string | null = null;
  openDropdowns: { [key: string]: boolean } = {};

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

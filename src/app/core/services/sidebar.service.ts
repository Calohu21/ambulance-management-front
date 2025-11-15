import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  // Estado del sidebar usando signals
  isSidebarOpen = signal(true);
  openDropdowns = signal<{ [key: string]: boolean }>({});

  toggleSidebar(): void {
    this.isSidebarOpen.update((value) => !value);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  openSidebar(): void {
    this.isSidebarOpen.set(true);
  }

  toggleDropdown(dropdownId: string): void {
    this.openDropdowns.update((dropdowns) => {
      const newDropdowns: { [key: string]: boolean } = {};

      // Close all other dropdowns
      Object.keys(dropdowns).forEach((key) => {
        newDropdowns[key] = false;
      });

      // Toggle the selected dropdown
      newDropdowns[dropdownId] = !dropdowns[dropdownId];

      return newDropdowns;
    });
  }

  closeAllDropdowns(): void {
    this.openDropdowns.set({});
  }
}

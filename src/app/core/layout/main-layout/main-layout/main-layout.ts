import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardPage } from '@features/dashboard/dashboard-page/dashboard-page';
import { Navbar } from '@shared/components/navbar/navbar';
import { Sidebar } from '@shared/components/sidebar/sidebar';
import { SidebarService } from '@core/services/sidebar.service';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, DashboardPage, Navbar, Sidebar],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  private sidebarService = inject(SidebarService);

  // Expose signals for template
  isSidebarOpen = this.sidebarService.isSidebarOpen;
}

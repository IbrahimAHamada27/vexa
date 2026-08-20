import { Routes } from '@angular/router';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { adminGuard, doctorGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'organizations',
        loadComponent: () => import('./features/organizations/organization-list/organization-list.component').then(m => m.OrganizationListComponent)
      },
      {
        path: 'organizations/:id',
        loadComponent: () => import('./features/organizations/organization-detail/organization-detail.component').then(m => m.OrganizationDetailComponent)
      },
      {
        path: 'doctors/:id',
        loadComponent: () => import('./features/doctors/doctor-detail/doctor-detail.component').then(m => m.DoctorDetailComponent)
      },
      {
        path: 'booking',
        loadComponent: () => import('./features/booking/booking.component').then(m => m.BookingComponent)
      },
      {
        path: 'faq',
        loadComponent: () => import('./features/faq/faq.component').then(m => m.FaqComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'doctor-portal',
        loadComponent: () => import('./features/doctor-portal/doctor-portal.component').then(m => m.DoctorPortalComponent),
        canActivate: [doctorGuard]
      }
    ]
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'organization',
        loadComponent: () => import('./features/admin/admin-organization/admin-organization.component').then(m => m.AdminOrganizationComponent)
      },
      {
        path: 'departments',
        loadComponent: () => import('./features/admin/admin-departments/admin-departments.component').then(m => m.AdminDepartmentsComponent)
      },
      {
        path: 'doctors',
        loadComponent: () => import('./features/admin/admin-doctors/admin-doctors.component').then(m => m.AdminDoctorsComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./features/admin/admin-services/admin-services.component').then(m => m.AdminServicesComponent)
      },
      {
        path: 'appointments',
        loadComponent: () => import('./features/admin/admin-appointments/admin-appointments.component').then(m => m.AdminAppointmentsComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];

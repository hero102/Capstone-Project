// // src/main.ts
// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app';
// import { provideRouter } from '@angular/router';
// import { routes } from './app/app.routes';
// import { importProvidersFrom } from '@angular/core';
// import { HttpClientModule } from '@angular/common/http';

// if (typeof window !== 'undefined') {
//   bootstrapApplication(AppComponent, {
//     providers: [
//       provideRouter(routes),
//       importProvidersFrom(HttpClientModule),
//     ]
//   }).catch(err => console.error('Bootstrap (browser) error:', err));
// }


// ✅ src/main.ts
// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app';
// import { appConfig } from './app/app.config';

// if (typeof window !== 'undefined') {
//   bootstrapApplication(AppComponent, appConfig)
//     .catch(err => console.error('Bootstrap (browser) error:', err));
// }


import 'zone.js'; // 👈 add this
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error('Bootstrap error:', err));

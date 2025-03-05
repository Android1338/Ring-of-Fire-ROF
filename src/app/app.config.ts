import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideFirebaseApp(() => initializeApp({"projectId":"ring-of-fire-e746c","appId":"1:894265477103:web:33bf0db0da13a9de9bd81a","storageBucket":"ring-of-fire-e746c.firebasestorage.app","apiKey":"AIzaSyCEycyTUrvOzkwD3soqgbIFu0Qrb1RQeEU","authDomain":"ring-of-fire-e746c.firebaseapp.com","messagingSenderId":"894265477103"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};

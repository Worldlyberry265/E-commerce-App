import 'zone.js/testing';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

// Initializes Angular testing environment
TestBed.initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
);

// unit-tests-config.ts ensures that Angular's testing modules (BrowserDynamicTestingModule and platformBrowserDynamicTesting) are loaded
// and initialized, enabling Angular-specific features like dependency injection, component templates, and change detection in a test
// context.

// We also must add it to the files array in tsconfig.spec.json

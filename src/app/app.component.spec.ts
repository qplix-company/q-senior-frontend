import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, BrowserAnimationsModule],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should react to router data changes', fakeAsync(() => {
    const router = TestBed.inject(Router);
    const fixture = TestBed.createComponent(AppComponent);
    const component = fixture.componentInstance;

    router.initialNavigation();
    tick();

    router.navigateByUrl('/task2');
    tick();
    expect(component.title()).toBe('Improve selection performance');
    expect(component.description()).toContain('Select all');

    router.navigateByUrl('/task3');
    tick();
    expect(component.title()).toBe('Create a collectible asset dashboard');
    expect(component.description()).toContain('Asset Details');
  }));
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TutorMenuPage } from './tutor-menu.page';

describe('TutorMenuPage', () => {
  let component: TutorMenuPage;
  let fixture: ComponentFixture<TutorMenuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

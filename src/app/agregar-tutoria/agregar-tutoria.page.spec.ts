import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarTutoriaPage } from './agregar-tutoria.page';

describe('AgregarTutoriaPage', () => {
  let component: AgregarTutoriaPage;
  let fixture: ComponentFixture<AgregarTutoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarTutoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

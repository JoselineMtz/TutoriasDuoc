import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudTutoriaPage } from './solicitud-tutoria.page';

describe('SolicitudTutoriaPage', () => {
  let component: SolicitudTutoriaPage;
  let fixture: ComponentFixture<SolicitudTutoriaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudTutoriaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

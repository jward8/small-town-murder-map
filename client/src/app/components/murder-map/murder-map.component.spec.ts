import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MurderMapComponent } from './murder-map.component';

describe('MurderMapComponent', () => {
  let component: MurderMapComponent;
  let fixture: ComponentFixture<MurderMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MurderMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MurderMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

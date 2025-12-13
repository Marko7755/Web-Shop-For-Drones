import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountedDronesComponent } from './discounted-drones.component';

describe('DiscountedDronesComponent', () => {
  let component: DiscountedDronesComponent;
  let fixture: ComponentFixture<DiscountedDronesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscountedDronesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiscountedDronesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

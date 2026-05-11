import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AI } from './ai';

describe('AI', () => {
  let component: AI;
  let fixture: ComponentFixture<AI>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AI],
    }).compileComponents();

    fixture = TestBed.createComponent(AI);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProductDialogComponent } from './delete-product-dialog.component';

describe('DeleteProductDialogComponent', () => {
  let component: DeleteProductDialogComponent;
  let fixture: ComponentFixture<DeleteProductDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteProductDialogComponent]
    });
    fixture = TestBed.createComponent(DeleteProductDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

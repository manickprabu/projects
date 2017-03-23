/* tslint:disable:no-unused-variable */
import { async,ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement,Component } from '@angular/core';
import { FieldsComponent } from './fields.component';
import { FormGroup,FormsModule,ReactiveFormsModule,FormBuilder,FormControl,Validators,FormControlDirective,NgForm,FormGroupDirective,NgModel}        from '@angular/forms';

@Component({selector: 'app-fields',template: ''})
class FieldsComponentStub{}
describe('FieldsComponent', () => {
  let component: FieldsComponentStub;
  let fixture: ComponentFixture<FieldsComponentStub>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FieldsComponentStub ],
            imports:[FormsModule,ReactiveFormsModule]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldsComponentStub);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, OnChanges, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { FieldsModel } from './fields.model';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html'
})
export class FieldsComponent implements OnChanges {

  @Input() fieldData: Array<FieldsModel>;
  @Input() formGroup: FormGroup;

  constructor() { }

  ngOnChanges() {

    this.fieldData.forEach((field) => {
      this.updateFormControlOProperties(field);
    });
  }

  private updateFormControlOProperties(field: any) {

    const formControlField = this.formGroup.controls[field.name];
    let hasOptions;

    field.type = this.tranformType(field.type);

    if (field.defaultValue === null || field.defaultValue === undefined) {
      let val = (field.type == 'radio') ? false : '';
      formControlField.setValue(val);
    } else {
      formControlField.setValue(field.defaultValue);
    }

    if (field.updateable === false) {
      formControlField.disable();
    }

    if (field['format'] != null) {
      hasOptions = field['format'].indexOf('|') > -1;
    }

    if (hasOptions) {
      field['options'] = field['format'].split('|');
    }

    if (field.mandatory || field.format != '' && !hasOptions) {
      let validators = [];

      if (field.mandatory) {
        validators.push(Validators.required);
      }

      if (field.format != '' && !hasOptions) {
        validators.push(Validators.pattern(field.format));
      }

      formControlField.setValidators(Validators.compose(validators));
      formControlField.updateValueAndValidity();
    }

  }

  private tranformType(type: string): string {
    return fieldMap[type];
  }

}

const fieldMap = {
  Text: 'text',
  TextBox: 'text',
  Password: 'password',
  WholeNumber: 'number',
  Decimal: 'number',
  Date: 'date',
  DateTime: 'date',
  Selection: 'select',
  MultiSelection: 'select',
  RadioGroup: 'radio',
  Checkbox: 'checkbox',
  CheckboxGroup: 'checkbox'
};


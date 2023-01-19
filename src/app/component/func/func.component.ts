import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  buildFunc,
  parseParamsNames,
  renderWithParams,
} from 'src/app/func/build';

import { GraphFunc } from 'src/app/model/graph';

@Component({
  selector: 'app-func',
  templateUrl: './func.component.html',
  styleUrls: ['./func.component.scss'],
})
export class FuncComponent implements OnInit {
  @Input() func!: GraphFunc;
  @Output() funcChange = new EventEmitter<GraphFunc>();
  @Output() hasError = new EventEmitter<boolean>();

  @Input() edit = false;
  form!: FormGroup;
  protected error = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
    this.bindForm();
  }

  private buildForm() {
    const pg = this.fb.group({});
    const paramNames = parseParamsNames(this.func.raw);
    paramNames.forEach((name) => {
      pg.addControl(
        name,
        this.fb.control(this.func.params[name] || 1, [Validators.required])
      );
    });

    this.form = this.fb.group({
      label: this.fb.control(this.func.label, []),
      raw: this.fb.control(this.func.raw, [
        Validators.required,
        Validators.minLength(1),
      ]),
      params: pg,
    });
  }

  private bindForm() {
    // sync params form
    this.form.get('raw')?.valueChanges.subscribe((raw) => {
      const paramNames = parseParamsNames(raw);
      if (!this.syncRequired(paramNames)) {
        return;
      }

      const pg = this.fb.group({});
      paramNames.forEach((name) => {
        pg.addControl(
          name,
          this.fb.control(this.func.params[name] || 1, [Validators.required])
        );
      });
      this.form.setControl('params', pg);
    });

    this.form.valueChanges.subscribe((v) => {
      if (!this.form.valid) {
        this.hasError.emit(true);
        return;
      }

      try {
        buildFunc(v.raw, v.params);
        this.error = '';
        this.hasError.emit(!!this.error);
      } catch (error) {
        this.error = error + '';
        this.hasError.emit(!!this.error);
        return;
      }

      this.func.label = v.label;
      this.func.raw = v.raw;
      this.func.params = v.params;

      this.funcChange.emit(this.func);
    });
  }

  private syncRequired(newParams: string[]): boolean {
    const oldParams = this.paramNames;

    if (newParams.length != oldParams.length) {
      return true;
    }

    for (const name of newParams) {
      if (!oldParams.includes(name)) {
        return true;
      }
    }

    return false;
  }

  get render(): string {
    return renderWithParams(this.func.raw, this.func.params);
  }

  get paramNames(): string[] {
    return Object.keys(this.paramsCtl.controls);
  }

  get paramsCtl(): FormGroup {
    return this.form.get('params') as FormGroup;
  }
}

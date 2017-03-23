/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NotificationComponent } from './notification.component';

describe('NotificationComponent', () => {
  let component: NotificationComponent;
  let fixture: ComponentFixture<NotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set class to alert-success when success method is called', () => {
    const title = 'title is success';
    const msg = 'success message goes here';
    component.sucess(title, msg);
    expect(component.message.title).toBe(title);
    expect(component.message.message).toBe(msg);
    expect(component.message.msgType).toBe(0);
  });

  it('should set class to alert-info when info method is called', () => {
    const title = 'title is info';
    const msg = 'message info goes here';
    component.info(title, msg);
    expect(component.message.title).toBe(title);
    expect(component.message.message).toBe(msg);
    expect(component.message.msgType).toBe(1);
  });

  it('should set class to alert-warning when warning method is called', () => {
    const title = 'title is warning';
    const msg = 'warning message goes here';
    component.warning(title, msg);
    expect(component.message.title).toBe(title);
    expect(component.message.message).toBe(msg);
    expect(component.message.msgType).toBe(2);
  });

  it('should set class to alert-danger when danger method is called', () => {
    const title = 'title is danger';
    const msg = 'dangerous message goes here';
    component.danger(title, msg);
    expect(component.message.title).toBe(title);
    expect(component.message.message).toBe(msg);
    expect(component.message.msgType).toBe(3);
  });

  it('should set class depending on messagetype', () => {
    const title = 'title is danger';
    const msg = 'dangerous message goes here';
    component.danger(title, msg);
    const cls = component.getClass();
    expect(cls).toBe('alert alert-danger');
    expect(component.message.title).toBe(title);
    expect(component.message.message).toBe(msg);
    expect(component.message.msgType).toBe(3);
  });

});

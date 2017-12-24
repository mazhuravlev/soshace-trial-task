import { AppPage } from './app.po';
import {browser, by, element} from "protractor";
import uuid = require("uuid");

let USER = uuid.v4().toString();

by.addLocator('formControlName', function(value, opt_parentElement, opt_rootSelector) {
  const using = opt_parentElement || document;

  return using.querySelectorAll('[formControlName="' + value +'"]');
});

describe('app1 App', () => {
  let page: AppPage;

  beforeAll(() => {
    browser.manage().deleteAllCookies();
  });

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display app title', () => {
    page.navigateToRoot();
    expect(page.getTitleText()).toEqual('Jogging App');
  });

  it('can create an account', () => {
    page.navigateToRegister();
    expect(browser.getCurrentUrl()).toContain('/register');
    expect(element(by.css('app-register h3')).getText()).toEqual('Create an account');
    const registerComponent = element(by.css('app-register'));
    expect(registerComponent.isPresent()).toBeTruthy();
    registerComponent.element(by.formControlName('username')).sendKeys(USER);
    registerComponent.element(by.formControlName('password')).sendKeys(USER);
    registerComponent.element(by.formControlName('passwordConfirm')).sendKeys(USER);
    registerComponent.element(by.buttonText('Submit')).click();
    expect(browser.getCurrentUrl()).toContain('/dashboard/records');
  });

  it('can logout', () => {
    page.navigateToRoot();
    const logoutButton  = element(by.buttonText('Logout'));
    expect(logoutButton.isPresent()).toBeTruthy();
    logoutButton.click();
    expect(browser.getCurrentUrl()).toContain('/register');
  });

  it('can login', () => {
    page.navigateToRoot();
    const loginForm = element(by.css('form.login-form'));
    expect(loginForm.isPresent()).toBeTruthy();
    loginForm.element(by.css('input[name="email"]')).sendKeys(USER);
    loginForm.element(by.css('input[name="password"]')).sendKeys(USER);
    loginForm.element(by.buttonText('Log In')).click();
    expect(browser.getCurrentUrl()).toContain('/dashboard/records');
  });

  it('can open record form', () => {
    page.navigateToAddRecord();
    expect(browser.getCurrentUrl()).toContain('/add-record');
    expect(element(by.css('app-record-form h3')).getText()).toEqual('Add Record');
  });

  it('can add record', () => {
    page.navigateToAddRecord();
    const recordFormComponent = element(by.css('app-record-form'));
    expect(recordFormComponent.isPresent()).toBeTruthy();
    recordFormComponent.element(by.formControlName('distance')).sendKeys('1000');
    recordFormComponent.element(by.formControlName('duration')).sendKeys('00:03:00');
    recordFormComponent.element(by.buttonText('Submit')).click();
    expect(browser.getCurrentUrl()).toContain('/dashboard/records');
  });
});

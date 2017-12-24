import { browser, by, element } from 'protractor';

export class AppPage {
  navigateToRoot() {
    return browser.get('/');
  }

  navigateToAddRecord() {
    return browser.get('/add-record');
  }

  getTitleText() {
    return element(by.css('app-root .app-title')).getText();
  }

  navigateToRegister() {
    return browser.get('/register');
  }
}

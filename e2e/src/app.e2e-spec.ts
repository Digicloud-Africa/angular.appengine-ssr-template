import { browser, by, element, ElementArrayFinder, ElementFinder, logging } from 'protractor';

class User {
  id: number;
  name: string;

  // Factory methods

  // User from string formatted as '<id> <name>'.
  static fromString(s: string): User {
    return {
      id: +s.substr(0, s.indexOf(' ')),
      name: s.substr(s.indexOf(' ') + 1),
    };
  }

  // User from user list <li> element.
  static async fromLi(li: ElementFinder): Promise<User> {
    const stringsFromA = await li.all(by.css('a')).getText();
    const strings = stringsFromA[0].split(' ');
    return { id: +strings[0], name: strings[1] };
  }

  // User id and name from the given detail element.
  static async fromDetail(detail: ElementFinder): Promise<User> {
    // Get user id from the first <div>
    const id = await detail.all(by.css('div')).first().getText();
    // Get name from the h2
    const name = await detail.element(by.css('h2')).getText();
    return {
      id: +id.substr(id.indexOf(' ') + 1),
      name: name.substr(0, name.lastIndexOf(' '))
    };
  }
}

describe('Universal', () => {
  const expectedH1 = 'Tour of Users';
  const expectedTitle = `${expectedH1}`;
  const targetUser = { id: 15, name: 'Magneta' };
  const targetUserDashboardIndex = 3;
  const nameSuffix = 'X';
  const newUserName = targetUser.name + nameSuffix;

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    const severeLogs = logs.filter(entry => entry.level === logging.Level.SEVERE);
    expect(severeLogs).toEqual([]);
  });

  describe('Initial page', () => {
    beforeAll(() => browser.get(''));

    it(`has title '${expectedTitle}'`, () => {
      expect(browser.getTitle()).toEqual(expectedTitle);
    });

    it(`has h1 '${expectedH1}'`, () => {
        expectHeading(1, expectedH1);
    });

    const expectedViewNames = ['Dashboard', 'Users'];
    it(`has views ${expectedViewNames}`, () => {
      const viewNames = getPageElts().navElts.map((el: ElementFinder) => el.getText());
      expect(viewNames).toEqual(expectedViewNames);
    });

    it('has dashboard as the active view', () => {
      const page = getPageElts();
      expect(page.appDashboard.isPresent()).toBeTruthy();
    });
  });

  describe('Dashboard tests', () => {
    beforeAll(() => browser.get(''));

    it('has top users', () => {
      const page = getPageElts();
      expect(page.topUsers.count()).toEqual(4);
    });

    it(`selects and routes to ${targetUser.name} details`, dashboardSelectTargetUser);

    it(`updates user name (${newUserName}) in details view`, updateUserNameInDetailView);

    it(`cancels and shows ${targetUser.name} in Dashboard`, () => {
      element(by.buttonText('go back')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetUserlt = getPageElts().topUsers.get(targetUserDashboardIndex);
      expect(targetUserlt.getText()).toEqual(targetUser.name);
    });

    it(`selects and routes to ${targetUser.name} details`, dashboardSelectTargetUser);

    it(`updates user name (${newUserName}) in details view`, updateUserNameInDetailView);

    it(`saves and shows ${newUserName} in Dashboard`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

      const targetUserlt = getPageElts().topUsers.get(targetUserDashboardIndex);
      expect(targetUserlt.getText()).toEqual(newUserName);
    });
  });

  describe('Users tests', () => {
    beforeAll(() => browser.get(''));

    it('can switch to Users view', () => {
      getPageElts().appUsersHref.click();
      const page = getPageElts();
      expect(page.appUsers.isPresent()).toBeTruthy();
      expect(page.allUsers.count()).toEqual(10, 'number of users');
    });

    it('can route to user details', async () => {
      getUserLiEltById(targetUser.id).click();

      const page = getPageElts();
      expect(page.userDetail.isPresent()).toBeTruthy('shows user detail');
      const user = await User.fromDetail(page.userDetail);
      expect(user.id).toEqual(targetUser.id);
      expect(user.name).toEqual(targetUser.name.toUpperCase());
    });

    it(`updates user name (${newUserName}) in details view`, updateUserNameInDetailView);

    it(`shows ${newUserName} in Users list`, () => {
      element(by.buttonText('save')).click();
      browser.waitForAngular();
      const expectedText = `${targetUser.id} ${newUserName}`;
      expect(getUserAEltById(targetUser.id).getText()).toEqual(expectedText);
    });

    it(`deletes ${newUserName} from Users list`, async () => {
      const usersBefore = await toUserArray(getPageElts().allUsers);
      const li = getUserLiEltById(targetUser.id);
      li.element(by.buttonText('x')).click();

      const page = getPageElts();
      expect(page.appUsers.isPresent()).toBeTruthy();
      expect(page.allUsers.count()).toEqual(9, 'number of users');
      const usersAfter = await toUserArray(page.allUsers);
      // console.log(await User.fromLi(page.allUsers[0]));
      const expectedUsers =  usersBefore.filter(h => h.name !== newUserName);
      expect(usersAfter).toEqual(expectedUsers);
      // expect(page.selectedUserSubview.isPresent()).toBeFalsy();
    });

    it(`adds back ${targetUser.name}`, async () => {
      const updatedUserName = 'Alice';
      const usersBefore = await toUserArray(getPageElts().allUsers);
      const numUsers = usersBefore.length;

      element(by.css('input')).sendKeys(updatedUserName);
      element(by.buttonText('add')).click();

      const page = getPageElts();
      const usersAfter = await toUserArray(page.allUsers);
      expect(usersAfter.length).toEqual(numUsers + 1, 'number of users');

      expect(usersAfter.slice(0, numUsers)).toEqual(usersBefore, 'Old users are still there');

      const maxId = usersBefore[usersBefore.length - 1].id;
      expect(usersAfter[numUsers]).toEqual({id: maxId + 1, name: updatedUserName});
    });

    it('displays correctly styled buttons', async () => {
      element.all(by.buttonText('x')).then(buttons => {
        for (const button of buttons) {
          // Inherited styles from styles.css
          expect(button.getCssValue('font-family')).toBe('Arial');
          expect(button.getCssValue('border')).toContain('none');
          expect(button.getCssValue('padding')).toBe('5px 10px');
          expect(button.getCssValue('border-radius')).toBe('4px');
          // Styles defined in users.component.css
          expect(button.getCssValue('left')).toBe('194px');
          expect(button.getCssValue('top')).toBe('-32px');
        }
      });

      const addButton = element(by.buttonText('add'));
      // Inherited styles from styles.css
      expect(addButton.getCssValue('font-family')).toBe('Arial');
      expect(addButton.getCssValue('border')).toContain('none');
      expect(addButton.getCssValue('padding')).toBe('5px 10px');
      expect(addButton.getCssValue('border-radius')).toBe('4px');
    });
  });

  describe('Progressive user search', () => {
    beforeAll(() => browser.get(''));

    it(`searches for 'Ma'`, async () => {
      getPageElts().searchBox.sendKeys('Ma');
      browser.sleep(1000);

      expect(getPageElts().searchResults.count()).toBe(4);
    });

    it(`continues search with 'g'`, async () => {
      getPageElts().searchBox.sendKeys('g');
      browser.sleep(1000);
      expect(getPageElts().searchResults.count()).toBe(2);
    });

    it(`continues search with 'e' and gets ${targetUser.name}`, async () => {
      getPageElts().searchBox.sendKeys('n');
      browser.sleep(1000);
      const page = getPageElts();
      expect(page.searchResults.count()).toBe(1);
      const user = page.searchResults.get(0);
      expect(user.getText()).toEqual(targetUser.name);
    });

    it(`navigates to ${targetUser.name} details view`, async () => {
      const user = getPageElts().searchResults.get(0);
      expect(user.getText()).toEqual(targetUser.name);
      user.click();

      const page = getPageElts();
      expect(page.userDetail.isPresent()).toBeTruthy('shows user detail');
      const user2 = await User.fromDetail(page.userDetail);
      expect(user2.id).toEqual(targetUser.id);
      expect(user2.name).toEqual(targetUser.name.toUpperCase());
    });
  });

  // Helpers
  function addToUserName(text: string): Promise<void> {
    return element(by.css('input')).sendKeys(text) as Promise<void>;
  }

  async function dashboardSelectTargetUser(): Promise<void> {
    const targetUserlt = getPageElts().topUsers.get(targetUserDashboardIndex);
    expect(targetUserlt.getText()).toEqual(targetUser.name);
    targetUserlt.click();
    browser.waitForAngular(); // seems necessary to gets tests to pass for toh-pt6

    const page = getPageElts();
    expect(page.userDetail.isPresent()).toBeTruthy('shows user detail');
    const user = await User.fromDetail(page.userDetail);
    expect(user.id).toEqual(targetUser.id);
    expect(user.name).toEqual(targetUser.name.toUpperCase());
  }

  function expectHeading(hLevel: number, expectedText: string): void {
      const hTag = `h${hLevel}`;
      const hText = element(by.css(hTag)).getText();
      expect(hText).toEqual(expectedText, hTag);
  }

  function getUserAEltById(id: number): ElementFinder {
    const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
    return spanForId.element(by.xpath('..'));
  }

  function getUserLiEltById(id: number): ElementFinder {
    const spanForId = element(by.cssContainingText('li span.badge', id.toString()));
    return spanForId.element(by.xpath('../..'));
  }

  function getPageElts() {
    const navElts = element.all(by.css('app-root nav a'));

    return {
      navElts,

      appDashboardHref: navElts.get(0),
      appDashboard: element(by.css('app-root app-dashboard')),
      topUsers: element.all(by.css('app-root app-dashboard > div h4')),

      appUsersHref: navElts.get(1),
      appUsers: element(by.css('app-root app-users')),
      allUsers: element.all(by.css('app-root app-users li')),
      selectedUserSubview: element(by.css('app-root app-users > div:last-child')),

      userDetail: element(by.css('app-root app-user-detail > div')),

      searchBox: element(by.css('#search-box')),
      searchResults: element.all(by.css('.search-result li'))
    };
  }

  async function toUserArray(allUsers: ElementArrayFinder): Promise<User[]> {
    return await allUsers.map(User.fromLi);
  }

  async function updateUserNameInDetailView(): Promise<void> {
    // Assumes that the current view is the user details view.
    addToUserName(nameSuffix);

    const page = getPageElts();
    const user = await User.fromDetail(page.userDetail);
    expect(user.id).toEqual(targetUser.id);
    expect(user.name).toEqual(newUserName.toUpperCase());
  }
});

import { ESPOOGISUIPage } from './app.po';

describe('espoogisui App', function() {
  let page: ESPOOGISUIPage;

  beforeEach(() => {
    page = new ESPOOGISUIPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

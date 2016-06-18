var expect = require('chai').expect;
var create = require('../create.js');
var jsdomDocument = require('jsdom').jsdom();

var poll = {
  "_id":"573a3d2ed1bd031a0f000000",
  "title":"yoo",
  "valid_until":1463262225,
  "finished":true,
  "total_votes_count":1,
  "ip_has_voted":true,
  "answers":[
    {"_id":"573a3d2ed1bd031a0f000001","title":"sure","vote_count":1,"percent":100,"winner":true},
    {"_id":"573a3d2ed1bd031a0f000002","title":"nope","vote_count":0,"percent":0,"winner":false}
  ]
};

function createDefaultEl(createOptions) {
  var corsRequestFn = function(options) {
    return {
      get: function() {
        options.onSuccess(poll);
      },
      post: function() {
        options.onSuccess(poll);
      }
    };
  };

  var el = jsdomDocument.createElement('div');
  el.setAttribute('data-poll-id', '573a3d2ed1bd031a0f000000');
  create(Object.assign({
    element: el,
    corsRequestFn: corsRequestFn,
    locale: 'en',
    apiUrl: 'http://localhost:3000/'
  }, createOptions));
  return el;
}

describe('create poll', function () {
  this.slow(200);
  it('should render', function(){
    var corsRequestFn = function(options) {
      return {
        get: function(url) {
          expect(url).to.equal('http://localhost:3000/api/v1/polls/573a3d2ed1bd031a0f000000.json');
          options.onSuccess(poll);
        },
        post: function() {
          options.onSuccess(poll);
        }
      };
    };

    var el = jsdomDocument.createElement('div');
    el.setAttribute('data-poll-id', '573a3d2ed1bd031a0f000000');
    create({
      element: el,
      corsRequestFn: corsRequestFn,
      apiUrl: 'http://localhost:3000/',
      locale: 'en'
    });

    expect(el.querySelectorAll('li').length).to.equal(8);
    expect(el.querySelectorAll('input').length).to.equal(9);
  });


  it('should create', function(done){
    var el = jsdomDocument.createElement('div');
    var corsRequestFn = function(options) {
      return {
        get: function() {
          options.onSuccess(poll);
        },
        post: function(url, data) {
          try {
            expect(data.poll_title).to.equal('vawef');
            expect(data.answer_titles[0]).to.equal('answer 1');
            expect(data.answer_titles[1]).to.equal('answer 2');
            expect(url).to.equal('http://localhost:3000/api/v1/polls.json');
          }
          catch (e) {
            done(e);
            return;
          }
          options.onSuccess(poll);
          try {
            expect(el.querySelectorAll('input').length).to.equal(0);
          }
          catch (e) {
            done(e);
            return;
          }
          done();
        }
      };
    };

    create({
      element: el,
      corsRequestFn: corsRequestFn,
      locale: 'en',
      apiUrl: 'http://localhost:3000/',
      onCreate: function(poll){
        try {
          expect(poll._id).to.equal('573a3d2ed1bd031a0f000000');
        }
        catch (e) {
          done(e);
          return;
        }
      }
    });

    el.querySelector('.polldozer-js-title-input').value = 'vawef';
    el.querySelectorAll('input')[1].value = 'answer 1';
    el.querySelectorAll('input')[2].value = 'answer 2';
    var event = jsdomDocument.createEvent('HTMLEvents');
    event.initEvent('submit', true, true);
    el.querySelector('form').dispatchEvent(event);
  });

  it('should create with custom date', function(done){
    var corsRequestFn = function(options) {
      return {
        get: function() {
          options.onSuccess(poll);
        },
        post: function(url, data) {
          try {
            expect(data.date_offset.days).to.equal('3');
            expect(data.date_offset.hours).to.equal('10');
            expect(data.date_offset.minutes).to.equal('10');
          }
          catch (e) {
            done(e);
            return;
          }
          done();
        }
      };
    };

    var el = jsdomDocument.createElement('div');
    create({
      element: el,
      corsRequestFn: corsRequestFn,
      locale: 'en',
      apiUrl: 'http://localhost:3000/'
    });

    el.querySelector('.polldozer-js-title-input').value = 'vawef';
    el.querySelectorAll('input')[1].value = 'answer 1';
    el.querySelectorAll('input')[2].value = 'answer 2';

    el.querySelector('.polldozer-js-select-days').selectedIndex = 3;
    el.querySelector('.polldozer-js-select-hours').selectedIndex = 10;
    el.querySelector('.polldozer-js-select-minutes').selectedIndex = 10;

    var event = jsdomDocument.createEvent('HTMLEvents');
    event.initEvent('submit', true, true);
    el.querySelector('form').dispatchEvent(event);
  });

  it('should render errors on create', function(done){
    var el = jsdomDocument.createElement('div');
    var corsRequestFn = function(options) {
      return {
        get: function() {
          options.onSuccess(poll);
        },
        post: function() {
          options.onFailure({
            responseJSON: {
              errors: ['not created', 'foo bar']
            }
          });
          try {
            expect(el.querySelector('.polldozer-errors').innerHTML).to.equal('not created, foo bar');
            expect(el.querySelectorAll('input').length).to.equal(9);
          }
          catch (e) {
            done(e);
            return;
          }
          done();
        }
      };
    };

    el.setAttribute('data-poll-id', '573a3d2ed1bd031a0f000000');
    create({
      element: el,
      corsRequestFn: corsRequestFn,
      apiUrl: 'http://localhost:3000/',
      locale: 'en'
    });

    el.querySelector('.polldozer-js-title-input').value = 'vawef';
    el.querySelectorAll('input')[1].value = 'answer 1';
    el.querySelectorAll('input')[2].value = 'answer 2';
    var event = jsdomDocument.createEvent('HTMLEvents');
    event.initEvent('submit', true, true);
    el.querySelector('form').dispatchEvent(event);
  });

  it('should disable inputs on "submit"', function(){
    var corsRequestFn = function() {
      return {
        post: function() {
        }
      };
    };

    var el = jsdomDocument.createElement('div');
    el.setAttribute('data-poll-id', '573a3d2ed1bd031a0f000000');
    create({
      element: el,
      corsRequestFn: corsRequestFn,
      apiUrl: 'http://localhost:3000/',
      locale: 'en'
    });

    el.querySelectorAll('input')[1].value = 'answer 1';
    el.querySelectorAll('input')[2].value = 'answer 2';
    var event = jsdomDocument.createEvent('HTMLEvents');
    event.initEvent('submit', true, true);
    el.querySelector('form').dispatchEvent(event);
    expect(el.querySelector('.polldozer-js-submit').disabled).to.equal(true);
    expect(el.querySelector('.polldozer-js-title-input').disabled).to.equal(true);
    expect(el.querySelectorAll('.polldozer-js-answer-input')[2].disabled).to.equal(true);
  });

  it('should reenable inputs on "submit" fail', function(){
    var corsRequestFn = function(options) {
      return {
        post: function() {
          options.onFailure({
            responseJSON: {
              errors: ['not created', 'foo bar']
            }
          });
        }
      };
    };
    var el = jsdomDocument.createElement('div');
    el.setAttribute('data-poll-id', '573a3d2ed1bd031a0f000000');
    create({
      element: el,
      corsRequestFn: corsRequestFn,
      apiUrl: 'http://localhost:3000/',
      locale: 'en'
    });

    el.querySelectorAll('input')[1].value = 'answer 1';
    el.querySelectorAll('input')[2].value = 'answer 2';
    var event = jsdomDocument.createEvent('HTMLEvents');
    event.initEvent('submit', true, true);
    el.querySelector('form').dispatchEvent(event);
    expect(el.querySelector('.polldozer-js-submit').getAttribute('disabled')).to.equal(null);
    expect(el.querySelector('.polldozer-js-title-input').getAttribute('disabled')).to.equal(null);
    expect(el.querySelectorAll('.polldozer-js-answer-input')[2].getAttribute('disabled')).to.equal(null);
  });

  it('should show additional choice filed', function(){
    var el = createDefaultEl();

    el.querySelector('.polldozer-js-add-choice').click();
    expect(el.querySelectorAll('.polldozer-js-choice.polldozer-is-hide').length).to.equal(5);
    el.querySelector('.polldozer-js-add-choice').click();
    expect(el.querySelectorAll('.polldozer-js-choice.polldozer-is-hide').length).to.equal(4);
  });

  it('should remove "add-choice" button on max choices', function(){
    var el = createDefaultEl();

    var button = el.querySelector('.polldozer-js-add-choice');
    button.click();
    button.click();
    expect(button.classList.contains('polldozer-is-hide')).to.equal(false);
    button.click();
    button.click();
    button.click();
    button.click();
    button.click();
    expect(button.classList.contains('polldozer-is-hide')).to.equal(true);
  });

  it('should reenable "add-choice" button on remove of a choice', function(){
    var el = createDefaultEl();

    var button = el.querySelector('.polldozer-js-add-choice');
    button.click();
    button.click();
    button.click();
    button.click();
    button.click();
    button.click();
    button.click();
    expect(el.querySelectorAll('.polldozer-js-choice.polldozer-is-hide').length).to.equal(0);
    el.querySelector('.polldozer-js-remove-choice').click();
    expect(el.querySelectorAll('.polldozer-js-choice.polldozer-is-hide').length).to.equal(1);
    expect(button.classList.contains('polldozer-is-hide')).to.equal(false);
  });

  it('should open time length inputs', function(){
    var el = createDefaultEl();

    expect(el.querySelector('.polldozer-js-lenght-inputs').classList.contains('polldozer-is-hide')).to.equal(true);
    el.querySelector('.polldozer-js-change-length').click();
    expect(el.querySelector('.polldozer-js-lenght-inputs').classList.contains('polldozer-is-hide')).to.equal(false);
  });

  it('should not change hours on day change to zeor', function(){
    var el = createDefaultEl();
    var selectDaysElem = el.querySelector('.polldozer-js-select-days');
    var selectHoursElem = el.querySelector('.polldozer-js-select-hours');

    selectDaysElem.selectedIndex = 2;
    var event = jsdomDocument.createEvent('HTMLEvents');
    event.initEvent('change', true, true);
    selectDaysElem.dispatchEvent(event);

    expect(selectHoursElem.value).to.equal('0');
  });

  it('should change hours on day change to zeor', function(){
    var el = createDefaultEl();
    var selectDaysElem = el.querySelector('.polldozer-js-select-days');
    var selectHoursElem = el.querySelector('.polldozer-js-select-hours');

    selectDaysElem.selectedIndex = 0;
    var event = jsdomDocument.createEvent('HTMLEvents');
    event.initEvent('change', true, true);
    selectDaysElem.dispatchEvent(event);

    expect(selectHoursElem.value).to.equal('1');
  });

  it('should not change minutes on hours change to zeor', function(){
    var el = createDefaultEl();
    var selectDaysElem = el.querySelector('.polldozer-js-select-days');
    var selectHoursElem = el.querySelector('.polldozer-js-select-hours');
    var selectMinutesElem = el.querySelector('.polldozer-js-select-minutes');

    selectMinutesElem.selectedIndex = 10;
    selectDaysElem.selectedIndex = 0;
    selectHoursElem.selectedIndex = 0;
    var event = jsdomDocument.createEvent('HTMLEvents');
    event.initEvent('change', true, true);
    selectHoursElem.dispatchEvent(event);

    expect(selectMinutesElem.value).to.equal('10');
  });

  it('should change minutes on hours change to zeor', function(){
    var el = createDefaultEl();
    var selectDaysElem = el.querySelector('.polldozer-js-select-days');
    var selectHoursElem = el.querySelector('.polldozer-js-select-hours');
    var selectMinutesElem = el.querySelector('.polldozer-js-select-minutes');

    selectDaysElem.selectedIndex = 0;
    selectHoursElem.selectedIndex = 0;
    var event = jsdomDocument.createEvent('HTMLEvents');
    event.initEvent('change', true, true);
    selectHoursElem.dispatchEvent(event);

    expect(selectMinutesElem.value).to.equal('5');
  });

  it('should use "de" locale', function(){
    var el = createDefaultEl({locale: 'de'});
    expect(el.querySelector('input').placeholder).to.equal('Stelle eine Frage…');
  });

  it('should fallback with locale to "en"', function(){
    var el = createDefaultEl({locale: null});
    expect(el.querySelector('input').placeholder).to.equal('Ask a question…');
  });

});

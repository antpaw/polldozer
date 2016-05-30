var expect = require('chai').expect;
var vote = require('../vote.js');
var jsdomDocument = require('jsdom').jsdom();

var poll = {
  "_id":"573a3d2ed1bd031a0f000000",
  "title":"yoo",
  "valid_until":1464635407,
  "finished":false,
  "total_votes_count":1,
  "ip_has_voted":false,
  "answers":[
    {"_id":"573a3d2ed1bd031a0f000001","title":"sure","vote_count":1,"percent_total":100,"winner":true},
    {"_id":"573a3d2ed1bd031a0f000002","title":"nope","vote_count":0,"percent_total":0,"winner":false}
  ]
};
var poll2 = {
  "_id":"573a3d2ed1bd031a0f000000",
  "title":"yoo",
  "valid_until":1463262225,
  "finished":true,
  "total_votes_count":1,
  "ip_has_voted":true,
  "answers":[
    {"_id":"573a3d2ed1bd031a0f000001","title":"sure","vote_count":1,"percent_total":100,"winner":true},
    {"_id":"573a3d2ed1bd031a0f000002","title":"nope","vote_count":0,"percent_total":0,"winner":false}
  ]
};

describe('vote poll', function () {
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
    vote({
      element: el,
      corsRequestFn: corsRequestFn,
      apiUrl: 'http://localhost:3000/',
      locale: 'en'
    });

    expect(el.querySelectorAll('li').length).to.equal(2);
  });

  it('should vote', function(done){
    var corsRequestFn = function(options) {
      return {
        get: function() {
          options.onSuccess(poll);
        },
        post: function(url) {
          try {
            expect(url).to.equal('http://localhost:3000/api/v1/polls/573a3d2ed1bd031a0f000000/vote.json');
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

    var el = jsdomDocument.createElement('div');
    el.setAttribute('data-poll-id', '573a3d2ed1bd031a0f000000');
    vote({
      element: el,
      corsRequestFn: corsRequestFn,
      apiUrl: 'http://localhost:3000/',
      locale: 'en'
    });

    el.querySelectorAll('input')[1].checked = true;
    var event = jsdomDocument.createEvent('HTMLEvents');
    event.initEvent('submit', true, true);
    el.querySelector('form').dispatchEvent(event);

  });

  it('should render stats because ip_has_voted', function(){
    var corsRequestFn = function(options) {
      return {
        get: function() {
          options.onSuccess(poll2);
        },
        post: function() {
        }
      };
    };

    var el = jsdomDocument.createElement('div');
    el.setAttribute('data-poll-id', '573a3d2ed1bd031a0f000000');
    vote({
      element: el,
      corsRequestFn: corsRequestFn,
      apiUrl: 'http://localhost:3000/',
      locale: 'en'
    });

    expect(el.querySelectorAll('input').length).to.equal(0);
    expect(el.querySelectorAll('li')[0].innerHTML).to.contain('100%');
  });

  it('should render without xhr', function(){
    var corsRequestFn = function() {
      return {
        get: function() {
          throw new Error('should not use xhr');
        },
        post: function() {
          throw new Error('should not use xhr');
        }
      };
    };

    var el = jsdomDocument.createElement('div');
    el.setAttribute('data-poll-id', '573a3d2ed1bd031a0f000000');
    vote({
      element: el,
      corsRequestFn: corsRequestFn,
      apiUrl: 'http://localhost:3000/',
      locale: 'en',
      pollData: poll
    });

    expect(el.querySelectorAll('input')[1].checked).to.equal(false);
  });

  it('should render errors on vote', function(done){
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
            expect(el.querySelector('.poll-errors').innerHTML).to.equal('not created, foo bar');
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

    var el = jsdomDocument.createElement('div');
    el.setAttribute('data-poll-id', '573a3d2ed1bd031a0f000000');
    vote({
      element: el,
      corsRequestFn: corsRequestFn,
      apiUrl: 'http://localhost:3000/',
      locale: 'en'
    });

    el.querySelectorAll('input')[1].checked = true;
    var event = jsdomDocument.createEvent('HTMLEvents');
    event.initEvent('submit', true, true);
    el.querySelector('form').dispatchEvent(event);
  });

  it('should not vote with empty answerId', function(){
    var corsRequestFn = function(options) {
      return {
        get: function() {
          options.onSuccess(poll);
        },
        post: function() {
          throw new Error('should not use xhr');
        }
      };
    };

    var el = jsdomDocument.createElement('div');
    el.setAttribute('data-poll-id', '573a3d2ed1bd031a0f000000');
    vote({
      element: el,
      corsRequestFn: corsRequestFn,
      apiUrl: 'http://localhost:3000/',
      locale: 'en'
    });

    var event = jsdomDocument.createEvent('HTMLEvents');
    event.initEvent('submit', true, true);
    el.querySelector('form').dispatchEvent(event);
  });

  it('should use "de" locale', function(){
    var corsRequestFn = function(options) {
      return {
        get: function() {
          options.onSuccess(poll);
        },
        post: function() {
          throw new Error('should not use xhr');
        }
      };
    };

    var el = jsdomDocument.createElement('div');
    el.setAttribute('data-poll-id', '573a3d2ed1bd031a0f000000');
    vote({
      element: el,
      corsRequestFn: corsRequestFn,
      locale: 'de',
      apiUrl: 'http://localhost:3000/'
    });

    expect(el.querySelector('input[type="submit"]').value).to.equal('Abstimmen');
  });

  it('should fallback with locale to "en"', function(){
    var corsRequestFn = function(options) {
      return {
        get: function() {
          options.onSuccess(poll);
        },
        post: function() {
          throw new Error('should not use xhr');
        }
      };
    };

    var el = jsdomDocument.createElement('div');
    el.setAttribute('data-poll-id', '573a3d2ed1bd031a0f000000');
    vote({
      element: el,
      corsRequestFn: corsRequestFn,
      apiUrl: 'http://localhost:3000/'
    });

    expect(el.querySelector('input[type="submit"]').value).to.equal('Vote');
  });

});
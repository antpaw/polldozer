# polldozer
[![npm version](https://badge.fury.io/js/polldozer.svg)](https://www.npmjs.com/package/polldozer) [![Build Status](https://travis-ci.org/antpaw/polldozer.svg?branch=master)](https://travis-ci.org/antpaw/polldozer) [![codecov.io](https://codecov.io/github/antpaw/polldozer/coverage.svg?branch=master)](https://codecov.io/github/antpaw/polldozer?branch=master)

Lightweight Polldozer client to create and vote on polls with [Polldozer API](https://github.com/antpaw/polldozer-api)

## Install

```bash
$ npm install --save polldozer
```

## Usage `polldozer/vote`

Renders a poll with "vote" or "analysis" layout based on the current state of the user (voted: yes / no) and the poll (expired: yes / no).

Below is a example of usage:

```html
<div id="vote" data-poll-id="POLL_ID"></div>
```

```javascript
var PolldozerVote = require('polldozer/vote');
var corsRequestFn = function(options) {
  var ajax = function(url, type, data) {
    return $.ajax({
      url: url,
      type: type,
      crossDomain: true,
      contentType: data ? 'application/json; charset=utf-8' : undefined,
      dataType: 'json',
      data: data ? JSON.stringify(data) : void 0,
      success: options.onSuccess,
      error: options.onFailure,
      complete: options.onComplete
    });
  };
  return {
    get: function(url) {
      return ajax(url, 'GET');
    },
    post: function(url, data) {
      return ajax(url, 'POST', data);
    }
  };
};


new PolldozerVote({
  element: document.getElementById('vote'),
  apiUrl: 'https://polldozer.herokuapp.com/', // please host your own, this is a slow free tier heroku app
  corsRequestFn: corsRequestFn
});
```

## Options


### new Instance(options)

#### `element`
type: `Element`  
default: `undefined`  
Element that will be used to render the poll

#### `corsRequestFn`
type: `Function`  
default: `undefined`  
A function that returns a object with `get` and `post` methods to handle ajax calls. See jQuery example from above.

#### `apiUrl`
type: `String`  
default: `undefined`  
URL to [Polldozer API](https://github.com/antpaw/polldozer-api)

#### `locale` (optional)
type: `String`  
default: `'en'`  
`de` also supported


#### `onVote(poll)` (optional)
type: `Function`  
default: `undefined`  
Callback function that is called after a successful vote





## Usage `polldozer/create`

Renders, validates and submits a poll create form.

Below is a example of usage:

```html
<div id="poll_form"></div>
```

```javascript
var PolldozerVote = require('polldozer/create');
var corsRequestFn = function(options) {
  var ajax = function(url, type, data) {
    return $.ajax({
      url: url,
      type: type,
      crossDomain: true,
      contentType: data ? 'application/json; charset=utf-8' : undefined,
      dataType: 'json',
      data: data ? JSON.stringify(data) : void 0,
      success: options.onSuccess,
      error: options.onFailure,
      complete: options.onComplete
    });
  };
  return {
    get: function(url) {
      return ajax(url, 'GET');
    },
    post: function(url, data) {
      return ajax(url, 'POST', data);
    }
  };
};


new PolldozerCreate({
  element: document.getElementById('poll_form'),
  apiUrl: 'https://polldozer.herokuapp.com/', // please host your own, this is a slow free tier heroku app
  corsRequestFn: corsRequestFn,
  onCreate: function(poll) {
    alert(poll._id);
  }
});
```

## Options


### new Instance(options)

#### `element`
type: `Element`  
default: `undefined`  
Element that will be used to render the poll

#### `corsRequestFn`
type: `Function`  
default: `undefined`  
A function that returns a object with `get` and `post` methods to handle ajax calls. See jQuery example from above.

#### `apiUrl`
type: `String`  
default: `undefined`  
URL to [Polldozer API](https://github.com/antpaw/polldozer-api)

#### `locale` (optional)
type: `String`  
default: `'en'`  
`de` also supported

#### `onCreate(poll)` (optional)
type: `Function`  
default: `undefined`  
Callback function that is called after a poll was created successfully

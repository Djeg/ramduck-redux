Ramduck Redux
=============

Tired of creating reducers that arn't curried. Interested in partial application with
ramda ?

This little project brings the power of currie and composition (thanks to Ramda) into
your redux project.

#### Previously

```js
// reducer/user.js
export const INITIAL_STATE = {
  name: '',
  email: '',
};

// Actions types
export const CHANGE_NAME = 'change user name';
export const CHANGE_EMAIL = 'change user email';
export const CHANGE_USER = 'change user';

// Actions creator
export const changeName = name => ({ type: CHANGE_NAME, name });
export const changeEmail = email => ({ type: CHANGE_EMAIL, email });
export const changeUser = (name, email) => ({ type: CHANGE_USER, name, email });

// Reducer:
export default function (state = INITIAL_STATE, action) {
  switch(action.type) {
    case CHANGE_NAME:
      return {
        ...state,
        name: action.name,
      };
    case CHANGE_EMAIL:
      return  {
        ...state,
        email: action.email,
      };
    case CHANGE_USER:
      return {
        ...state,
        name: action.name,
        email: action.email,
      };
    default:
      return state;
  }
}
```

#### With Ramduck Redux

```js
// reducer/user.js
import { action1, action2, combine, init, when, mergeAction } from 'ramduck-redux'
import { objOf, always, evolve, o, merge } from 'ramda'

export const INITIAL_STATE = {
  name: '',
  email: '',
};

// Actions types
export const CHANGE_NAME = 'change user name';
export const CHANGE_EMAIL = 'change user email';
export const CHANGE_USER = 'change user';

// Actions creator
export const changeName = action1(CHANGE_NAME, name => { name });
// with obj of
export const changeEmail = action1(CHANGE_EMAIL, objOf('email'));
// with 2 arguments
export const changeUser = action2(CHANGE_USER, name => email => ({ name, email }))

// Reducer:
export default combine(
  init(INITIAL_STATE),

  when(CHANGE_NAME, ({ name }) => state => ({
    ...state,
    name,
  })),

  // with evolve:
  when(CHANGE_EMAIL, ({ email }) => evolve({
    email: always(email),
  })),

  // with omit, merge and composition:
  when(CHANGE_USER, ({ name, email }) => state => ({
      ..state,
      name,
      email,
  })),

  // or with mergeAction (same behavior, it merge the action payload by removing
  // the type properties):
  // when(CHANGE_USER, mergeAction),
)
```

## Installation

With npm:

```
npm i --save ramduck-redux
```

Or with yarn:

```
yarn add ramduck-redux
```

## Usage

### Actions

You can easily create curried action creator with
the function `action, action1, action2, action3, action4, actionN`:

```js
import { action, action1, action2, action3, action4 } from 'ramduck-redux'
import { objOf } from 'ramda'

// action with no parameter, only a type
const initialize = action('INITIALIZE');
// action with 1 parameter
const changeName = action1('CHANGE_NAME', objOf('name'))
// action with 2 parameter
const changeUser = action2('CHANGE_USER', name => email => ({ name, email }))
// same thing for action2, action3, action4 :)

// you can also create actions of N arguments with actionN
// const veryHugeAction = actionN(8, 'some type', a => b => c => e => f => g => h => i => ...)

// and then:
myAction() // { type: 'MY_TYPE' }
changeName('John') // { type: 'CHANGE_NAME', name: 'John' }
changeUser('John', 'john@mail.com') // { type: 'CHANGE_USER', name: 'John', email: 'john@mail.com' }

// action creators are curried:
const changeJohnEmail = changeUser('John'); // [Function]
const action = changeJohnEmail('john@doe.com'); // { type: 'CHANGE_USER', name: 'John', email: 'john@mail.com' }
```

### Reducer

You can create reducers much more easily with `combine, init, when`:

```js
import { combine, init, when } from 'ramduck-redux'

const simpleReducer = init({ name: 'John' });

simpleReducer(null, { type: 'some action' }); // { name: 'John' }
simpleReducer({ name: 'Jane' }, { type: 'some action' }); // { name: 'Jane' }

const changeNameReducer = when(
  'changeName',
  action => state => ({
    ...state,
    name: action.name,
  })
)

changeNameReducer({}, { type: 'changeName', name: 'john' }); // { name: 'john' }

// you can easily combine those methods to create much more complex
// reducers:
const reducer = combine(
  init(myInitialState),

  when('SOME_TYPE', someTypeReducer),
  when('SOME_OTHER_TYPE', someOtherTypeReducer),
  when(['A', 'B'], somePluralActionReducer),
)
```

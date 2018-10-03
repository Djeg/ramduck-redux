import { evolve, always, pipe, uncurryN } from 'ramda'
import { init, when, combine } from './reducer'

it('can create reducer with an initial state', () => {
  const app = init({ name: 'John Doe' });

  expect(app(null, { type: 'some action' })).toEqual({
    name: 'John Doe',
  });
});

it('can reduce an action', () => {
  const app = when('changeName', action => evolve({
    name: always(action.name),
  }));

  const state = app(
    { name: 'Jane' },
    { type: 'changeName', name: 'John' }
  );

  expect(state).toEqual({
    name: 'John',
  })
});

it('can create reducers on top of action reduce', () => {
  const reduceChangeName = when('changeName', action => evolve({
    name: always(action.name),
  }));

  const initialState = { name: 'Jane' }

  const app = combine(
    init(initialState),
    reduceChangeName,
  );

  const state1 = app(initialState, { type: 'changeName', name: 'John' });
  const state2 = app(state1, { type: 'changeName', name: 'Eric' });
  const state3 = app(state2, { type: 'unkown' });

  expect(state1).toEqual({ name: 'John' });
  expect(state2).toEqual({ name: 'Eric' });
  expect(state3).toEqual(state2);
});

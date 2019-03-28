import { createReducer, createRootReducer, init, when } from './reducer'
import { evolve, always, pipe, uncurryN } from 'ramda'

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
  const reduceChangeName = when(['changeName', 'change_name'], action => evolve({
    name: always(action.name),
  }));

  const initialState = { name: 'Jane' }

  const app = createReducer('user', [
    init(initialState),
    reduceChangeName,
  ]);

  const root = createRootReducer([ app ])

  const state1 = app(initialState, { type: 'changeName', name: 'John' });
  const state2 = app(state1, { type: 'changeName', name: 'Eric' });
  const state3 = app(state2, { type: 'unkown' });
  const state4 = app(state3, { type: 'change_name', name: 'Michelle' });

  expect(state1).toEqual({ name: 'John' });
  expect(state2).toEqual({ name: 'Eric' });
  expect(state3).toEqual(state2);
  expect(state4).toEqual({ name: 'Michelle' });

  expect(`${app}`).toEqual('user');

  const rootState = root({}, { type: 'changeName', name: 'John' })

  expect(rootState).toEqual({ user: { name: 'John' } })
});

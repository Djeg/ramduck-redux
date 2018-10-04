import { action, actionN, action1, action2, action3, action4, mergeAction } from './action'
import { objOf, pipe, merge } from 'ramda'

it('can create action of no argument', () => {
  const a = action('test');

  expect(a()).toEqual({ type: 'test' });
});

it('can create actions of n arguments', () => {
  const a = actionN(1, 'test', objOf('name'));

  expect(a('john')).toEqual({ type: 'test', name: 'john' });

  const b = actionN(2, 'test2', a => b => ({
    name: a,
    age: b,
  }))

  expect(b('John', 30)).toEqual({ 
    type: 'test2',
    name: 'John',
    age: 30,
  })
});

it('can create curried actions creator', () => {
  const changeUser = actionN(2, 'changeUser', name => email => ({ name, email }));
  const changeJohnMail = changeUser('John');
  const action = changeJohnMail('john@doe.com');

  expect(action).toEqual({
    type: 'changeUser',
    name: 'John',
    email: 'john@doe.com'
  });
});

it('can create an action of one argument', () => {
  const test = action1('test', objOf('name'));

  expect(test('John Doe')).toEqual({ type: 'test', name: 'John Doe' });
});

it('can create an action of two arguments', () => {
  const changePerson = action2('test', name => pipe(
    objOf('age'),
    merge(objOf('name', name)),
  ));

  expect(changePerson('Jane Doe', 24)).toEqual({
    type: 'test',
    name: 'Jane Doe',
    age: 24,
  })
});

it('can create an action of three arguments', () => {
  const changePerson = action3('test', name => age => pipe(
    objOf('email'),
    merge(objOf('name', name)),
    merge(objOf('age', age)),
  ))

  expect(changePerson('Jane Doe', 24, 'jane@doe.com')).toEqual({
    type: 'test',
    name: 'Jane Doe',
    age: 24,
    email: 'jane@doe.com',
  });
});

it('can create action of four arguments', () => {
  const changePerson = action4('test', name => age => email => pipe(
    objOf('password'),
    merge(objOf('name', name)),
    merge(objOf('age', age)),
    merge(objOf('email', email)),
  ));

  expect(changePerson('Jane', 20, 'jane@mail.com', '1234')).toEqual({
    type: 'test',
    name: 'Jane',
    age: 20,
    email: 'jane@mail.com',
    password: '1234',
  });
});

it('can merge an action payload (without it\'s type) with any object', () => {
  const changeName = action1('changeName', objOf('name'))
  const state = { name: 'John' };
  const action = changeName('Jane')
  const newState = mergeAction(action, state);

  expect(newState).toEqual({
    name: 'Jane',
  })
});

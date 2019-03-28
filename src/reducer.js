import {
  T,
  __,
  always,
  compose,
  cond,
  contains,
  defaultTo,
  flip,
  reduce as freduce,
  identity,
  ifElse,
  is,
  map,
  pipe,
  prop,
  propEq,
  reduce,
  uncurryN,
} from 'ramda'

/**
 * init :: a -> (a, Action(*, *)) -> a
 *
 * Create an reducer with an initial stae
 */
export const init = uncurryN(2, initialState =>
  flip(uncurryN(2, action => pipe(
    defaultTo(initialState),
    identity,
  )))
)

/**
 * whenAction :: String -> (Action(*, *) -> a -> b) -> (a, Action(*, *)) -> b
 *
 * Reduce a given action type
 */
export const whenAction = uncurryN(2, type => pipe(
  uncurryN(2),
  fn => uncurryN(2, state => ifElse(
    propEq('type', type),
    action => fn(action, state),
    always(state),
  )),
))

/**
 * whenActions :: [String] -> (Action(*, *) -> a -> b) -> (a, Action(*, *)) -> b
 *
 * Reduce a given action type
 */
export const whenActions = uncurryN(2, types => pipe(
  uncurryN(2),
  fn => uncurryN(2, state => ifElse(
    compose(contains(__, types), prop('type')),
    action => fn(action, state),
    always(state),
  )),
))

/**
 * when :: String|[String] -> (Action(*, *) -> a -> b) -> (a, Action(*, *)) -> b
 *
 * Reduce a given action type
 */
export const when = uncurryN(2, cond([
  [is(Array), whenActions],
  [T, whenAction],
]))

/**
 * combine :: [(a -> Action(*, *) -> b)] -> a -> Action(*, *) -> c
 *
 * Create a reducer by composing reducer functions
 */
export const combineReducers = reducers =>
  uncurryN(2, state => action => freduce(
    (s, r) => r(s, action),
    state,
    reducers
  ))


/**
 * namedReducer :: String -> [(a -> Action * -> b)] -> Action * * -> a -> a
 *
 * create a named reducer
 */
export const createReducer = uncurryN(2, name => reducers => {
  const fn = combineReducers(reducers)
  fn.toString = () => name

  return fn;
})


/**
 * createRootReducer :: [(a -> Action * -> b)] -> Action * * -> a -> a
 */
export const createRootReducer = uncurryN(3, reducers => state => action => reduce(
    (state, reducer) => ({
        ...state,
        [`${reducer}`]: reducer(state[`${reducer}`], action)
    }),
    state || {},
    reducers,
  )
)

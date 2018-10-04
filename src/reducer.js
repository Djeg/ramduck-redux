import {
  T,
  __,
  always,
  compose,
  cond,
  contains,
  defaultTo,
  flip,
  identity,
  ifElse,
  is,
  map,
  pipe,
  prop,
  propEq,
  reduce as freduce,
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
 * combine :: ...(a -> Action(*, *) -> b) -> a -> Action(*, *) -> c
 *
 * Create a reducer by composing reducer functions
 */
export const combine = (...reducers) =>
  uncurryN(2, state => action => freduce(
    (s, r) => r(s, action),
    state,
    reducers
  ))

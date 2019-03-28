import {
  always,
  compose,
  curryN,
  flip,
  merge,
  objOf,
  omit,
  pipe,
  uncurryN,
} from 'ramda'

/**
 * @type EmptyAction :: String -> { type :: String }
 * @type Action a :: String -> a -> { type :: String | a }
 */

/**
 * Allow a function to be converted to string. Usefull in order ti write
 * reducer, no need of action type
 *
 * rewriteToStringEff :: Object a => Number -> (String -> (* -> a) -> * -> Action a) -> String -> (* -> a) -> * -> Action a
 */
const rewriteToStringEff = type => fn => {
  fn.toString = () => type

  return fn;
}


/**
 * action :: String -> () -> EmptyAction
 *
 * Create an action object by giving a string type
 */
export const action = type => rewriteToStringEff(type)(always(objOf('type', type)))

/**
 * actionN :: Object a => Number -> String -> (* -> a) -> * -> Action a
 *
 * Create an action of N arguments that and merge it inside a action object
 *
 * @example
 *  const changeName = actionN(1, 'CHANGE_NAME', objOf('name'))
 *  const action = changeName('John') // { type: 'CHANGE_NAME', name: 'John' }
 */
export const actionN = uncurryN(3, n => type => fn => rewriteToStringEff(type)(
  curryN(
    n,
    (...args) => merge({ type }, uncurryN(n, fn)(...args))
  )
))

/**
 * action1 :: Object a => String -> (* -> a) -> * -> Action a
 * 
 * Create an action of one argument
 */
export const action1 = actionN(1)

/**
 * action2 :: Object a => String -> (* -> * -> a) -> * -> * -> Action a
 * 
 * Create an action of two arguments
 */
export const action2 = actionN(2)

/**
 * action3 :: Object a => String -> (* -> * -> * -> a) -> * -> * -> * -> a
 * 
 * Create an action of three arguments
 */
export const action3 = actionN(3)

/**
 * action4 :: Object a => String -> (* -> * -> * -> * -> a) -> * -> * -> * -> * -> Action a
 * 
 * Create an action of four arguments
 */
export const action4 = actionN(4)

/**
 * mergeAction :: Object a, Object b => Action(*, a) -> b -> { | a b }
 *
 * merge an action with a given object by omitting it's `type` property !
 */
export const mergeAction = uncurryN(2, compose(flip(merge), omit(['type'])))

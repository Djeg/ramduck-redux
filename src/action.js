import { always, objOf, curryN, merge, uncurryN } from 'ramda'

/**
 * @type EmptyAction :: String a -> { type :: a }
 * @type Action :: String a -> Object b -> { type :: a, b }
 */

/**
 * action :: String a => a -> () -> EmptyAction a
 *
 * Create an action object by giving a string type
 */
export const action = type => always(objOf('type', type))

/**
 * actionN :: Number a, String b, Object c => a -> b -> (...n -> c) -> ...n -> Action(b, c)
 *
 * Create an action of N arguments that and merge it inside a action object
 *
 * @example
 *  const changeName = actionN(1, 'CHANGE_NAME', objOf('name'))
 *  const action = changeName('John') // { type: 'CHANGE_NAME', name: 'John' }
 */
export const actionN = uncurryN(3, n => type => fn => curryN(
  n,
  (...args) => merge({ type }, uncurryN(n, fn)(...args))
))

/**
 * action1 :: String a, Object b => a -> b -> (* -> c) -> * -> Action(a, c)
 * 
 * Create an action of one argument
 */
export const action1 = actionN(1)

/**
 * action2 :: String a, Object b => a -> b -> (* -> * -> c) -> * -> * -> Action(a, c)
 * 
 * Create an action of two arguments
 */
export const action2 = actionN(2)

/**
 * action3 :: String a, Object b => a -> b -> (* -> * -> * -> c) -> * -> * -> * -> Action(a, c)
 * 
 * Create an action of three arguments
 */
export const action3 = actionN(3)

/**
 * action4 :: String a, Object b => a -> b -> (* -> * -> * -> * -> c) -> * -> * -> * -> * -> Action(a, c)
 * 
 * Create an action of four arguments
 */
export const action4 = actionN(4)

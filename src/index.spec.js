import * as ramduck from './index'

it('contains actions functions', () => {
  expect(ramduck.action).toBeDefined();
  expect(ramduck.action1).toBeDefined();
  expect(ramduck.action2).toBeDefined();
  expect(ramduck.action3).toBeDefined();
  expect(ramduck.action4).toBeDefined();
  expect(ramduck.actionN).toBeDefined();
  expect(ramduck.mergeAction).toBeDefined();
});

it('contains reducers functions', () => {
  expect(ramduck.init).toBeDefined();
  expect(ramduck.when).toBeDefined();
  expect(ramduck.whenActions).toBeDefined();
  expect(ramduck.whenAction).toBeDefined();
  expect(ramduck.combine).toBeDefined();
});

import { jest } from '@jest/globals';
import jLogger from '../lib/index.js';

beforeAll(() => {
    if (typeof global.window === 'undefined') {
        global.window = { console };
    }
});

describe('constructor', () => {
    test('defaults — inactive, level 0, available', () => {
        const l = new jLogger();
        expect(l.available).toBe(true);
        expect(l.active).toBe(false);
        expect(l.level).toBe(0);
        expect(l.status()).toBe(false);
    });

    test('debug=true makes status true', () => {
        const l = new jLogger(true);
        expect(l.active).toBe(true);
        expect(l.status()).toBe(true);
    });

    test('level passed through', () => {
        const l = new jLogger(false, 3);
        expect(l.level).toBe(3);
    });

    test('status is false when not available even if active', () => {
        const l = new jLogger(true);
        l.available = false;
        expect(l.status()).toBe(false);
    });
});

describe('setActive / setLevel', () => {
    test('setActive is chainable and updates state', () => {
        const l = new jLogger();
        expect(l.setActive(true)).toBe(l);
        expect(l.active).toBe(true);
    });

    test('setActive() with no arg defaults to false', () => {
        const l = new jLogger(true);
        l.setActive();
        expect(l.active).toBe(false);
    });

    test('setLevel is chainable and updates state', () => {
        const l = new jLogger();
        expect(l.setLevel(2)).toBe(l);
        expect(l.level).toBe(2);
    });

    test('setLevel() with no arg defaults to 0', () => {
        const l = new jLogger(false, 5);
        l.setLevel();
        expect(l.level).toBe(0);
    });
});

describe('logging output', () => {
    let l;
    let spies;

    beforeEach(() => {
        l = new jLogger(true);
        spies = {
            log:   jest.spyOn(console, 'log').mockImplementation(() => { }),
            info:  jest.spyOn(console, 'info').mockImplementation(() => { }),
            warn:  jest.spyOn(console, 'warn').mockImplementation(() => { }),
            error: jest.spyOn(console, 'error').mockImplementation(() => { }),
            debug: jest.spyOn(console, 'debug').mockImplementation(() => { }),
            dir:   jest.spyOn(console, 'dir').mockImplementation(() => { }),
            clear: jest.spyOn(console, 'clear').mockImplementation(() => { }),
        };
    });

    afterEach(() => {
        Object.values(spies).forEach(s => s.mockRestore());
    });

    test('log() with single value emits just the value', () => {
        l.log('hello');
        expect(spies.log).toHaveBeenCalledWith('hello');
        expect(spies.log).toHaveBeenCalledTimes(1);
    });

    test('log() with label + value emits "label : ", value', () => {
        l.log('label', { x: 1 });
        expect(spies.log).toHaveBeenCalledWith('label : ', { x: 1 });
    });

    test('info / warn / error / debug route to matching console method', () => {
        l.info('a');
        l.warn('b');
        l.error('c');
        l.debug('d');
        expect(spies.info).toHaveBeenCalledWith('a');
        expect(spies.warn).toHaveBeenCalledWith('b');
        expect(spies.error).toHaveBeenCalledWith('c');
        expect(spies.debug).toHaveBeenCalledWith('d');
    });

    test('dir() preserves the original reference (no JSON clone)', () => {
        const obj = { x: 1, fn: () => 42 };
        l.dir(obj);
        expect(spies.dir).toHaveBeenCalledTimes(1);
        expect(spies.dir.mock.calls[0][0]).toBe(obj);
    });

    test('non-dir methods deep-clone the value via JSON', () => {
        const obj = { x: 1, nested: { y: 2 } };
        l.log(obj);
        const passed = spies.log.mock.calls[0][0];
        expect(passed).not.toBe(obj);
        expect(passed).toEqual(obj);
    });

    test('circular value falls back to dir', () => {
        const a = { name: 'circ' };
        a.self = a;
        l.log(a);
        expect(spies.log).not.toHaveBeenCalled();
        expect(spies.dir).toHaveBeenCalledWith(a);
    });

    test('circular with label still falls back to dir', () => {
        const a = {};
        a.self = a;
        l.warn('label', a);
        expect(spies.warn).not.toHaveBeenCalled();
        expect(spies.dir).toHaveBeenCalledWith('label : ', a);
    });
});

describe('compatibility aliases', () => {
    let l, spies;
    beforeEach(() => {
        l = new jLogger(true);
        spies = {
            log:  jest.spyOn(console, 'log').mockImplementation(() => { }),
            warn: jest.spyOn(console, 'warn').mockImplementation(() => { }),
        };
    });
    afterEach(() => Object.values(spies).forEach(s => s.mockRestore()));

    test('warning() aliases warn', () => {
        l.warning('msg');
        expect(spies.warn).toHaveBeenCalledWith('msg');
    });

    test('add() aliases log', () => {
        l.add('msg');
        expect(spies.log).toHaveBeenCalledWith('msg');
    });
});

describe('inactive logger', () => {
    let spies;
    beforeEach(() => {
        spies = {
            log:   jest.spyOn(console, 'log').mockImplementation(() => { }),
            info:  jest.spyOn(console, 'info').mockImplementation(() => { }),
            warn:  jest.spyOn(console, 'warn').mockImplementation(() => { }),
            error: jest.spyOn(console, 'error').mockImplementation(() => { }),
            debug: jest.spyOn(console, 'debug').mockImplementation(() => { }),
            dir:   jest.spyOn(console, 'dir').mockImplementation(() => { }),
            clear: jest.spyOn(console, 'clear').mockImplementation(() => { }),
        };
    });
    afterEach(() => Object.values(spies).forEach(s => s.mockRestore()));

    test('emits nothing when active is false', () => {
        const l = new jLogger(false);
        l.log('x');
        l.info('x');
        l.warn('x');
        l.error('x');
        l.debug('x');
        l.dir({ a: 1 });
        l.warning('x');
        l.add('x');
        expect(spies.log).not.toHaveBeenCalled();
        expect(spies.info).not.toHaveBeenCalled();
        expect(spies.warn).not.toHaveBeenCalled();
        expect(spies.error).not.toHaveBeenCalled();
        expect(spies.debug).not.toHaveBeenCalled();
        expect(spies.dir).not.toHaveBeenCalled();
    });

    test('clear() runs even when inactive (gated only on availability)', () => {
        const l = new jLogger(false);
        l.clear();
        expect(spies.clear).toHaveBeenCalledTimes(1);
    });
});

describe('invalid arguments', () => {
    test('no-arg call reports invalid and emits no method output', () => {
        const l = new jLogger(true);
        const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
        l.log();
        // parseArguments emits "Invalid arguments" via console.log directly,
        // and print() short-circuits because valid=false.
        expect(logSpy).toHaveBeenCalledTimes(1);
        expect(logSpy).toHaveBeenCalledWith('Invalid arguments', expect.anything());
        logSpy.mockRestore();
    });
});

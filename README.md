# jizy-logger

A thin wrapper around `window.console` that gives you an on/off switch, level gating, safe JSON cloning, and a small fallback to `console.dir` for non-serializable values.

## Features

- One togglable instance — flip `setActive(true)` to enable, leave it off in production.
- Routes to the matching `console` method (`log`, `info`, `warn`, `error`, `debug`, `dir`).
- Optional label: `log('label', value)` prints `label : `, `value`.
- Deep-clones values through `JSON.parse(JSON.stringify(...))` so what you log is what you had at call time.
- Falls back to `console.dir` when a value can't be serialized (circular refs, etc.).
- Compatibility aliases: `warning()` → `warn`, `add()` → `log`.

## Install

```bash
npm install jizy-logger
```

## Usage

```js
import jLogger from 'jizy-logger';

const log = new jLogger(true); // active
log.log('hello');                  // console.log('hello')
log.info('user', { id: 42 });      // console.info('user : ', { id: 42 })
log.warn('careful');               // console.warn('careful')
log.error('boom');                 // console.error('boom')
log.dir(domNode);                  // console.dir(domNode) — no JSON clone

const a = {}; a.self = a;
log.log(a);                        // falls back to console.dir(a)

log.setActive(false);              // silences everything except clear()
log.clear();                       // console.clear()
```

## API

### Constructor

`new jLogger(active = false, level = 0)`

- `active`: `true` to emit logs, `false` to silence.
- `level`: integer, stored on the instance for caller-side gating.

### Methods

- `setActive(active = false)` — chainable.
- `setLevel(level = 0)` — chainable.
- `status()` — `true` if `console` is available **and** the logger is active.
- `clear()` — calls `console.clear()` (only gated on availability, not on `active`).
- `log(...)`, `info(...)`, `warn(...)`, `error(...)`, `debug(...)`, `dir(...)`
- `warning(...)` — alias for `warn`.
- `add(...)` — alias for `log`.

### Argument shapes

Each logging method accepts:

- `(value)` — prints just the value.
- `(label, value)` — prints `label + ' : '` then the value.
- `(label, value, level)` — same, with a level hint stored on the parsed args (not currently used for filtering).

Calling with no arguments emits `console.log('Invalid arguments', args)` and produces no further output.

## Tests

```bash
npm test
```

Jest (ESM mode via `--experimental-vm-modules`) covers constructor defaults, chainable setters, output routing, JSON cloning, circular-ref fallback, compatibility aliases, and the inactive-logger contract.

## License

MIT — see [LICENSE](./LICENSE).

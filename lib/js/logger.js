function parseArguments(args, method) {
    const o = {
        valid: false,
        label: '',
        value: '',
        level: 1,
        method: method,
    };

    // Check if arguments match expected formats
    if (args.length >= 1) {
        o.value = args[0];
        o.valid = true;

        if (args.length >= 2) {
            o.label = args[0];
            o.value = args[1];
        }
        if (args.length >= 3) {
            o.level = args[2];
        }
    } else {
        console.log('Invalid arguments', args);
    }

    // Ensure the value can be serialized, fallback to 'dir' if not
    if (o.value && o.method !== 'dir') {
        try {
            o.value = JSON.parse(JSON.stringify(o.value));
        } catch (e) {
            o.method = 'dir';
        }
    }

    return o;
}

export default class jLogger {
    constructor(debug = false, level = 0) {
        this.available = typeof window.console !== 'undefined';
        this.setActive(debug);
        this.setLevel(level);
    }

    status() {
        return this.available && this.active;
    }

    setActive(active = false) {
        this.active = active;
        return this;
    }

    setLevel(level = 0) {
        this.level = level;
        return this;
    }

    clear() {
        if (this.available) {
            console.clear();
        }
    }

    print(data) {
        if (!data.valid || !this.available || !this.active) {
            return;
        }

        const method = data.method === 'dir' ? 'dir' : data.method;

        if (data.label) {
            console[method](data.label + ' : ', data.value);
        } else {
            console[method](data.value);
        }
    }

    log() {
        this.print(parseArguments(arguments, 'log'));
    }

    debug() {
        this.print(parseArguments(arguments, 'debug'));
    }

    info() {
        this.print(parseArguments(arguments, 'info'));
    }

    error() {
        this.print(parseArguments(arguments, 'error'));
    }

    dir() {
        this.print(parseArguments(arguments, 'dir'));
    }

    warn() {
        this.print(parseArguments(arguments, 'warn'));
    }

    warning() {
        this.print(parseArguments(arguments, 'warn'));
    }

    add() {
        this.print(parseArguments(arguments, 'log'));
    }
}

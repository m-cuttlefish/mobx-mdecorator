/**
 * @file   index
 * @author yucong02
 */

export function invokedWithArgs(args) {
    return (
        args.length !== 3
        || typeof args[0] !== 'object'
        || typeof args[1] !== 'string'
        || typeof args[2] !== 'object'
    )
}

export function invokedWithArgsForClass(args) {
    return (
        args.length !== 1
        || typeof args[0] !== 'function'
    )
}


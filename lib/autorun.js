/**
 * @file   autorun
 * @author yucong02
 */
import {
    observable,
    action,
    computed,
    reaction,
    autorun
} from 'mobx'
import {
    invokedWithArgs
} from './utils'


const myAutorun = (target, property, description) => {
    if (typeof target[property] === 'function') {
        const dispose = autorun(() => {
            target[property](dispose)
        })

        let origin = target.exit;
        Object.defineProperty(target, 'exit', {
            value: (...args) => {
                console.log('dispose autorun `' + property + '`')
                dispose()
                return origin && origin(...args)
            }
        })

    } else {
        throw new Error('`autorun` 请使用在成员方法中')
    }

    return description && {...description, configurable: true};
}

export default (...args) => {
    if (invokedWithArgs(args)) {
        console.warn('`autorun` 不需要传参')
        return myAutorun.bind(null, ...args)
    } else {
        return myAutorun(...args)
    }
}
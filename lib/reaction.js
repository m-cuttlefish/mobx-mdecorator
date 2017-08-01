/**
 * @file   reaction
 * @author yucong02
 */
import {
    observable,
    action,
    computed,
    reaction
} from 'mobx'
import {
    invokedWithArgs
} from './utils'

export default (...keyNames) => {
    if (!invokedWithArgs(keyNames)) {
        throw new Error('`reaction` 请绑定被监听的属性值')
    }
    const exited = {}
    keyNames = keyNames.filter(x => {
        if (exited[x]) {
            return false
        } else {
            exited[x] = true
            return true
        }
    })

    return (target, property, description) => {
        if (typeof target[property] !== 'function') {
            throw new Error('`reaction` 只能用于成员方法')
        }

        const dispose = reaction(
            () => {
                return keyNames.reduce((obj, name)=> {
                    const arr = name.split('.')
                    const val = arr.reduce((obj, b) => {
                        return obj[b]
                    }, target)

                    obj[arr.join('_')] = val
                    return obj
                }, {})
            },
            data => target[property].call(target, data, dispose)
        )

        let origin = target.exit
        Object.defineProperty(target, 'exit', {
            value: (...args) => {
                console.log('dispose reaction `' + property + '`')
                dispose()
                return origin && origin(...args)
            }
        })

        return description && {...description, configurable: true};
    }
}



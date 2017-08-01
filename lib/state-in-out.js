/**
 * @file   style-in-out
 * @author yucong02
 */
import {toJS} from 'mobx'

export default function (StateClass, keyName = 'localState') {
    if (typeof StateClass !== 'function') {
        throw new Error(StateClass, 'is not a function');
    }
    return componentClass =>
        class extends componentClass {
            // [refAPI]
            getState() {
                return this[keyName]
            }
            // [refAPI]
            getStateJSON() {
                return toJS(this[keyName])
            }

            [keyName] = new StateClass

            componentWillMount(...args) {
                this[keyName].init && this[keyName].init(this.props);
                if (super.componentWillMount) {
                    super.componentWillMount.apply(this, args)
                }
            }

            componentWillReceiveProps(...args) {
                if (this[keyName].update) {
                    this[keyName].update(args[0])
                } else if (this[keyName].init) {
                    this[keyName].init(args[0])
                }
                if (super.componentWillReceiveProps) {
                    super.componentWillReceiveProps.apply(this, args)
                }
            }

            componentWillUnmount(...args) {
                this[keyName].exit && this[keyName].exit(this.props)
                if (super.componentWillUnmount) {
                    super.componentWillUnmount.apply(this, args)
                }
            }
        }
}
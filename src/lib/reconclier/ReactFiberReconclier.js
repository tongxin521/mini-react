import {updateNode} from './../shared/util'
import {reconcileChildren} from './ReactChildFiber';

export function updateHostTextComponent(workInProgress) {
    workInProgress.stateNode = document.createTextNode(workInProgress.props.children)

}


export function updateHostComponent(workInProgress) {
    //  创建真实的 DOM 节点对象
    if (!workInProgress.stateNode) {
        // 进入此 if，说明当前的 fiber 节点没有创建过真实的 DOM 节点
        workInProgress.stateNode = document.createElement(workInProgress.type)
        // 更新节点上的属性
        updateNode(workInProgress.stateNode, {}, workInProgress.props)

        // 应该处理子节点
        reconcileChildren(workInProgress, workInProgress.props.children)

    }

}

/**
 * 函数组件
 * @param {*} workInProgress 
 */
export function updateFunctionComponent(workInProgress) {
    // 从当前的 workInProgress 上面获取到的 type 是一个函数
    // 函数执行获取 VNode
    const {type, props} = workInProgress;
    const children = type(props)
    // 调用 reconcileChildren 方法，来处理子节点
    reconcileChildren(workInProgress, children);
}

/**
 * 类组件
 * @param {*} workInProgress 
 */
export function updateClassComponent(workInProgress) {
    // 当前的 workInProgress 上面获取到的 type 是一个类
    // 创建组件实例
    const {type, props} = workInProgress;
    const instance = new type(props);
    // 调用组件的 render 方法，获取 VNode
    const children = instance.render();
    reconcileChildren(workInProgress, children);

}

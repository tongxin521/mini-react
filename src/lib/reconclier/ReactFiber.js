import { Placement, isStr, isFn, isUndefined } from "../shared/util";
import {
    FunctionComponent,
    ClassComponent,
    HostComponent,
    HostText,
    Fragment,
  } from "./ReactWorkTag";
export default function createFiber(vnode, returnFiber) {
    const fiber = {
        // fiber 类型
        type: vnode.type,
        // key
        key: vnode.key,
        // props
        props: vnode.props,
        // 存储当前 fiber 所对应的 dom
        stateNode: null,
        // 子fiber
        child: null,
        // 兄弟fiber
        sibling: null,
        // 父 fiber
        return: returnFiber,
        // 记录 fiber 对象要做的具体操作
        flags: Placement,
        // 记录当前节点在当前层级下的位置
        index: null,
        // 存储旧的 fiber 对象
        alternate: null,
    }

    const type = vnode.type;

    // 实际上 fiber 对象上面还有一个 tag 值
    // 这个 tag 值是什么取决于 fiber 的 type 值
    // 不同的 vnode 类型，type 是有所不同的

    if (isStr(type)) {
        fiber.tag = HostComponent;
    } else if (isFn(type)) {
        // 注意这里会有两种情况：函数组件和类组件的 type 都是 function
        // 例如函数组件的 type 值为 f xxx()
        // 类组件 class XXX，背后仍然是一个函数
        // 所以我们通过判断 type 是否有 isReactComponent 属性来判断是否为类组件
        if (type.prototype.isReactComponent) {
            // 类组件
            fiber.tag = ClassComponent;
        } else {
            // 函数组件
            fiber.tag = FunctionComponent;
        }
    } else if (isUndefined(type)) {
        // 说明这是一个文本节点
        fiber.tag = HostText;
        // 除此之外还需要多做一件事情
        // 文本节点是没有 props 属性的，我们将手动的给该 fiber 设置一个 props 属性
        fiber.props = {
            children: vnode
        }
    } else {
        fiber.tag = Fragment
    }
    // 说明这是一个 Fragment
    return fiber;
}
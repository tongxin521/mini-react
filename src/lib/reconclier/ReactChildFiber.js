import { isStr, isArray } from "../shared/util";
import createFiber from "./ReactFiber";

export function reconcileChildren(returnFiber, children) {
    // 如果 children 是一个字符串，那么说明这是一个文本节点
    // 文本节点我们已经在 updateNode 方法中处理过了，所以这里就不需要再处理了
    if (isStr(children)){
        return
    }

    // 如果只有一个子节点，那么 children 就是一个 vnode 对象
    // 如果有多个子节点，那么 children 就是一个 vnode 数组
    // 所以我们这一步，就是为了将 children 统一都转为数组，方便我们后续的处理
    const newChildren = isArray(children) ? children : [children];

    let previousFiber = null; // 上一个 fiber 对象
    let oldFiber = returnFiber.alternate?.child; // 上一个 fiber 对象对应的旧 fiber 对象
    let i = 0; // 记录 children 数组的索引（下标）
    let lastplacedIndex = 0; // 上一次 DOM 节点插入的最远位置
    // 是否需要追踪副作用
    // true 代表组件更新
    // false 代表组件初次渲染
    let shouldTrackSideEffects = !!returnFiber.alternate;
    // // 第一轮遍历，会尝试复用节点
    for (; oldFiber && i < newChildren.length; i++) {

    }

    // for 循环结束，说明有两种情况
    // 1. oldFiber 为 null，说明是初次渲染
    // 2. i === newChildren.length 说明是更新

    if (i === newChildren.length) {
        // 说明是更新，需要删除多余的节点
    }

    // 说明是初次渲染，需要创建新的节点
    if (!oldFiber){
        for (; i < newChildren.length; i++) {
            const newChildVnode = newChildren[i];

            if (newChildVnode == null) {
                return;
            }

            const newFiber = createFiber(newChildVnode, returnFiber);

            lastplacedIndex = placeChild(newFiber, lastplacedIndex, i, shouldTrackSideEffects);

            // 将新生成的 fiber 加入到 fiber 链表里面去
            if (previousFiber === null) {
                // 说明是第一个子节点
                returnFiber.child = newFiber;
            } else {
                // 当前生成的 fiber 节点并非父 fiber 的第一个节点
                previousFiber.sibling = newFiber;
            }

            // 将 previousNewFiber 设置为 newFiber
            // 从而将当前 fiber 更新为上一个 fiber

            previousFiber = newFiber;
        }

        
    }

}

/**
 * 该方法专门用于更新 lastPlacedIndex
 * @param {*} newFiber 上面刚刚创建的新的 fiber 对象
 * @param {*} lastPlacedIndex 上一次的 lastPlacedIndex，也就是上一次插入的最远位置，初始值是 0
 * @param {*} newIndex 当前的下标，初始值也是 0
 * @param {*} shouldTrackSideEffects 用于判断 returnFiber 是初次渲染还是更新
 * @returns 
 */
function placeChild(newFiber, lastPlacedIndex, newIndex, shouldTrackSideEffects) {
    newFiber.index = newIndex;
    if (!shouldTrackSideEffects) {
        return lastPlacedIndex;
    }

}
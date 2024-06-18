import { Placement } from "../shared/util";
import schedulerCallback from './../scheduler/scheduler';

/**
 * 判断节点是否为相同
 * 判断标准
 *  1. 同一层级下面
 *  2. 类型相同
 *  3. key 相同
 * @param {*} a 新的 vnode 节点
 * @param {*} b 旧的 fiber 节点
 */
export function sameNode(a, b) {
    return a && b && a.type === b.type && a.key === b.key;
}


/**
 * 该方法专门用于更新 lastPlacedIndex
 * @param {*} newFiber 上面刚刚创建的新的 fiber 对象
 * @param {*} lastPlacedIndex 上一次的 lastPlacedIndex，也就是上一次插入的最远位置，初始值是 0
 * @param {*} newIndex 当前的下标，初始值也是 0
 * @param {*} shouldTrackSideEffects 用于判断 returnFiber 是初次渲染还是更新
 * @returns 
 */
export function placeChild(newFiber, lastPlacedIndex, newIndex, shouldTrackSideEffects) {
    // 更新 fiber 对象上面的 index
    // fiber 对象上面的 index 记录当前 fiber 节点在当前层级下的位置
    newFiber.index = newIndex;
    if (!shouldTrackSideEffects) {
        // 首次渲染，不需要记录节点位置
        return lastPlacedIndex;
    }

    // 旧的 fiber
    const current = newFiber.alternate;

    if (current) {
        // 旧的 fiber index
        const oldIndex = current.index;
        if (oldIndex < lastPlacedIndex) {
            newFiber.flags |= Placement;

            return lastPlacedIndex;
        } else {
            // // 进入此分支，说明 oldIndex 应该作为最新的 lastPlacedIndex
            return oldIndex;
        }
    }
    else {
        // 进入此分支，说明当前的 fiber 是初次渲染
        newFiber.flags |= Placement;
        return lastPlacedIndex;
    }

}

/**
 * 
 * @param {*} returnFiber 父节点 fiber 对象
 * @param {*} childToDelete 待删除的节点 fiber 对象
 */
function deleteChild(returnFiber, childToDelete) {
    // 这里的删除其实仅仅只是标记一下，真正的删除是在 commit 阶段
    // 将要删除的 fiber 对象放入到到一个数组里面
    const deletions = returnFiber.deletions;
    if (deletions) {
        returnFiber.deletions.push(childToDelete)
    } else {
        returnFiber.deletions = [childToDelete];
    }
}

/**
 * 删除多余节点
 * @param {*} returnFiber 父节点 fiber 对象
 * @param {*} currentFirstChild 待删除的第一个节点
 */

export function deleteRemainingChildren(returnFiber, currentFirstChild) {
    let childToDelete = currentFirstChild;
    while (childToDelete) {
        // 删除节点
        deleteChild(returnFiber, childToDelete);
        childToDelete = childToDelete.sibling;
    }
}

/**
 * 将旧的子节点构建到一个 map 结构里面
 * @param {*} currentFirstChild 
 */
export function mapRemainingChildren(currentFirstChild) {
    const existingChildren = new Map();
    let existingChild = currentFirstChild;
    while (existingChild) {
        existingChildren.set(existingChild.key || existingChild.index, existingChild);
        existingChild = existingChild.sibling;
    }

    return existingChildren;
}

/**
 * 一次执行 updateQueue 副作用函数
 * @param {*} workInProgress 
 */
export function invokeHooks(workInProgress) {
    const {updateQueue} = workInProgress;

    for (let i = 0; i < updateQueue.length; ++i) {
        const effect = updateQueue[i];
        if (effect.destroy) {
            effect.destroy();
        }
        schedulerCallback(function (){
            effect.destroy = effect.create();
        })
    }
}

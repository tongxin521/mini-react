import { isStrOrNumber, isArray, Update } from "../shared/util";
import createFiber from "./ReactFiber";
import {
    sameNode, placeChild,
    deleteRemainingChildren,
    mapRemainingChildren,
} from './ReactChildFiberAssistant';

export function reconcileChildren(returnFiber, children) {
    // 如果 children 是一个字符串，那么说明这是一个文本节点
    // 文本节点我们已经在 updateNode 方法中处理过了，所以这里就不需要再处理了
    if (isStrOrNumber(children)){
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
    // 该变量有两个作用：
    // 1. 存储下一个旧的 fiber 对象
    // 2. 临时存储当前的旧的 fiber 对象
    let nextOldFiber = null;


    // 接下来就是我们整个 diff 核心的算法思想：整体分为 5 个步骤
    // 1. 第一轮遍历，从左往右遍历新节点（vnode），在遍历的同时比较新旧节点（旧节点是 fiber 对象）
    //  如果节点可以复用，那么复用，循环继续往右边走
    //  如果节点不能够复用，那么就跳出循环，结束第一轮遍历
    // 2. 检查 newChildren 是否完成了遍历，因为从上面第一步出来，就两种：
    //  要么是提前跳出来的
    //  要么是遍历完了跳出来，如果新节点完成了整个遍历，但是旧节点（fiber对象）还存在，那么就将旧节点删除
    // 3. 初次渲染（这一步我们其实之前已经完成了）
    //  还有一种情况也是属于初次渲染：旧节点遍历完了，新节点还有剩余，那么这些新节点就是属于初次渲染
    // 4. 处理新旧节点都还有剩余的情况
    // （1）将剩下旧节点放入到一个 map 结构里面，方便之后使用
    // （2）遍历剩余的新节点，通过新节点的 key 去 map 里面进行查找，看有没有能够复用的旧节点，如果有，拿来复用，并且会从 map 中删除对应的旧节点
    // 5. 整个新节点遍历完成后，如果 map 中还有剩余的旧节点，这些旧节点也就没有用了，直接删除即可

    // // 第一轮遍历，会尝试复用节点
    for (; oldFiber && i < newChildren.length; i++) {
        // 当前的 VNode 对象
        const newChild = newChildren[i];

        if (newChild === null) {
            continue;
        }

        // 在判断是否能够复用之前，我们先给 nextOldFiber 赋值
        // 这里有一种情况
        // old 一开始是 1 2 3 4 5，进行了一些修改，现在只剩下 5 和 4
        // old >> 5(4) 4(3)
        // new >> 4(3) 1 2 3 5(4)
        // 此时旧的节点的 index 是大于 i，因此我们需要将 nextOldFiber 暂存为 oldFiber
        if (oldFiber.index > i) {
            nextOldFiber = oldFiber;
            oldFiber = null
        } else {
            nextOldFiber = oldFiber.sibling;
        }

        // 判断是否能够复用
        const same = sameNode(newChild, oldFiber);

        if (!same) {
            // 说明不能复用，跳出循环
            // 在退出第一轮遍历之前，我们会做一些额外的工作
            // 我们需要将 oldFiber 原本的值还原，方便后面使用
            if (oldFiber === null) {
              oldFiber = nextOldFiber;
            }
            break;
        }

        // 说明可以复用
        const newFiber = createFiber(newChild, returnFiber);
         // 复用旧 fiber 上面的部分信息，特别是 DOM 节点
        Object.assign(newFiber, {
            stateNode: oldFiber.stateNode,
            alternate: oldFiber,
            flags: Update,
        });

        // 更新 lastPlacedIndex 的值
        lastplacedIndex = placeChild(
            newFiber,
            lastplacedIndex,
            i,
            shouldTrackSideEffects
        );

        // 将新生成的 fiber 加入到 fiber 链表里面去
        if (previousFiber === null) {
            // 说明是第一个子节点
            returnFiber.child = newFiber;
        } else {
            // 当前生成的 fiber 节点并非父 fiber 的第一个节点
            previousFiber.sibling = newFiber;
        }

        // 将 previousFiber 设置为 newFiber
        previousFiber = newFiber;
        // oldFiber 存储下一个旧节点信息
        oldFiber = nextOldFiber;

    }

    // for 循环结束，说明有两种情况
    // 1. oldFiber 为 null，说明是初次渲染
    // 2. i === newChildren.length 说明是更新

    if (i === newChildren.length) {
        // 如果还有剩余节点，需要删除多余的节点
        deleteRemainingChildren(returnFiber, oldFiber);
        return;
    }

    // 说明是初次渲染，需要创建新的节点
    if (!oldFiber){
        // 需要将 newChildren 数组中的每一个元素都生成一个 fiber 对象
        // 然后将这些 fiber 对象串联起来
        for (; i < newChildren.length; i++) {
            const newChildVnode = newChildren[i];

            if (newChildVnode == null) {
                continue;
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

    // 处理新旧节点都还有剩余的情况
    // 首先创建一个 map 结构，用于存储剩余的旧节点
    const existingChildren = mapRemainingChildren(oldFiber);
    for (; i < newChildren.length; i++) {
        const newChild = newChildren[i];
        if (newChild === null) {
            continue;
        }
        // 根据新节点的 vnode 去生成新的 fiber
        const newFiber = createFiber(newChild, returnFiber);
        // 接下来就需要去哈希表里面寻找是否有可以复用的节点
        const matchedFiber = existingChildren.get(newFiber.key || newFiber.index);
        if (matchedFiber) {
            // 说明可以复用
            Object.assign(newFiber, {
                stateNode: matchedFiber.stateNode,
                alternate: matchedFiber,
                flags: Update,
            });

            // 删除哈希表中的旧 fiber
            existingChildren.delete(newFiber.key || newFiber.index);
        }
        // 更新 lastPlacedIndex 的值
        lastplacedIndex = placeChild(
            newFiber,
            lastplacedIndex,
            i,
            shouldTrackSideEffects
        );
        // 将新生成的 fiber 加入到 fiber 链表里面去
        if (previousFiber === null) {
            // 说明是第一个子节点
            returnFiber.child = newFiber;
        } else {
            // 当前生成的 fiber 节点并非父 fiber 的第一个节点
            previousFiber.sibling = newFiber;
        }
        // 将 previousFiber 设置为 newFiber
        previousFiber = newFiber;
        // 整个新节点遍历完成后，如果 map 中还有剩余的旧节点，这些旧节点也就没有用了，直接删除即可
        if (shouldTrackSideEffects) {
            existingChildren.forEach((child) => {
                deleteRemainingChildren(returnFiber, child);
            });
        }
    }

}
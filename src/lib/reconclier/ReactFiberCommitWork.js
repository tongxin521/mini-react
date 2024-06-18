import {Placement, Update, updateNode} from './../shared/util';
import {FunctionComponent} from './ReactWorkTag';
import {invokeHooks} from './ReactChildFiberAssistant';
function getParent(workInProgress) {
    // 获取父节点
    while(workInProgress) {
        if (workInProgress.stateNode) {
            return workInProgress.stateNode;
        }

        workInProgress = workInProgress.return;
    }
}

function commitNode(workInProgress) {
    // 提交节点
    const parentNodeDom = getParent(workInProgress.return);
    const {flags, stateNode, tag, deletions} = workInProgress;
    if (stateNode && flags & Placement) {
        parentNodeDom.appendChild(workInProgress.stateNode);
    }

    if (stateNode && flags & Update) {
        // 这里就应该是更新属性的操作了
        updateNode(stateNode, workInProgress.alternate.props, workInProgress.props);
    }

    if (deletions) {
        // 有需要删除的节点
        commitDeletion(deletions, stateNode || parentNodeDom);
    }

    if (tag === FunctionComponent) {
        // 处理hook
        invokeHooks(workInProgress);
    }
}
export default function commitWorker(workInProgress) {
    if (!workInProgress) {
        return;
    }

    /**
     * commitWorker 共分为三步
     * 1. 提交自己
     * 2. 提交子节点
     * 3. 提交兄弟节点
     */

    commitNode(workInProgress);
    commitWorker(workInProgress.child);
    commitWorker(workInProgress.sibling);
}

/**
 *
 * @param {*} fiber 要删除的 fiber
 * @returns fiber 所对应的真实 DOM 对象
 */
function getStateNode(fiber) {
    let temp = fiber;
    while (!temp.stateNode) {
      temp = temp.child;
    }
    return temp.stateNode;
}


/**
 *
 * @param {*} deletions 当前 fiber 对象上面要删除的子 fiber 数组
 * @param {*} parentNode 当前 fiber 对象所对应的真实 DOM 对象，如果当前的 fiber 没有 dom 对象，那么传递过来的就是父级的 dom
 */
function commitDeletion(deletions, parentNode) {
    for (let i = 0; i < deletions.length; i++) {
      // 取出每一个要删除的 fiber 对象
      const child = deletions[i];
      // 这里在进行删除的时候，需要删除 fiber 所对应的 stateNode（DOM）
      // 但是存在一种情况，没有对应的 stateNode（函数组件或者类组件）
      // 我们就需要往下一直找，直到找到有对应的真实 dom 为止
      parentNode.removeChild(getStateNode(child));
    }
  }
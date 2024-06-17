import {Placement, Update, updateNode} from './../shared/util';
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
    const {flags, stateNode} = workInProgress;
    if (stateNode && flags & Placement) {
        parentNodeDom.appendChild(workInProgress.stateNode);
    }

    if (stateNode && flags & Update) {
        // 这里就应该是更新属性的操作了
        updateNode(stateNode, workInProgress.alternate.props, workInProgress.props);
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
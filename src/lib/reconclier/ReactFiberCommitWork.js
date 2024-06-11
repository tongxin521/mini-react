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

    if (workInProgress.stateNode) {
        parentNodeDom.appendChild(workInProgress.stateNode);
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
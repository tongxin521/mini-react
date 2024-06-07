
// 保存当前使用的根节点
let workInProgress = null;
// 保存根fiber
let workInProgressRoot = null;

export default function scheduleUpdateOnFiber(fiber) {

    workInProgress = fiber;
    workInProgressRoot = fiber;
    // 暂时使用 requestIdleCallback 调度，后期使用 scheduler 包来进行调度
    // 当浏览器的每一帧有空闲时间的时候，执行 workloop 函数
    requestIdleCallback(workLoop);

}

function workLoop(deadline) {
    while (workInProgress && deadline.timeRemaining() > 0) {
        // 进入此循环，说明当前帧还有时间，并且有需要处理的 任务
        performUnitOfWork();
    }

    /**
     * 代码执行到这里，说明有两种情况
     * 1. 当前帧没有时间了，不需要处理
     * 2. fiber 树都处理完了，我们需要将 workInProgressRoot 挂载到 Dom 上
     */
    if (!workInProgress) {
        commitRoot();
    }
}

/**
 * 该函数主要负责处理一个 fiber 节点
 * 有下面的事情要做：
 * 1. 处理当前的 fiber 对象
 * 2. 通过深度优先遍历子节点，生成子节点的 fiber 对象，然后继续处理
 * 3. 提交副作用
 * 4. 进行渲染
 */
function performUnitOfWork() {
    // 生成子 fiber
    beginWork(workInProgress);

    if (workInProgress.child !== null) {
        workInProgress = workInProgress.child;
        return;
    }
    // 没有子节点，则进行提交副作用
    completeWork(workInProgress);

    // 如果没有子节点，找兄弟节点
    const next = workInProgress;
    
    while (next != null) {
        if (next.sibling !== null) {
            workInProgress = next.sibling;
            return;
        }

        // 如果没有进入上面 if 语句，说明当前节点没有兄弟节点了
        // 说明当前节点已经处理完了，需要返回到父节点

        workInProgress = next.return;

        // 在寻找父亲那一辈的兄弟节点之前，先执行一下 completeWork 方法
        completeWork(next);
    }

    // 如果执行到这里，说明已经没有要处理的节点了

    workInProgress = null;
}

function commitRoot() {
    
}

# mini-react总结

- 调度器的实现

  - Scheduler
  - 最小堆的实现

- Fiber 结构的创建

- 如何生成一颗 Fiber 树

  - Fiber 子节点的协调
  - diff 算法，核心 5 个步骤：

  1. 从左边往右边进行新节点（vnode）进行遍历，和旧节点（fiber）进行比较。如果可以复用则拿到复用，继续往右，不能复用就停止第一轮遍历
  2. 检查 newChildren（新节点 vnode 的数组）是否遍历完毕，如果遍历完了但是老节点还存在，那么需要将老节点删除掉
  3. 完全没有老节点，那么就是初次渲染，做和初次渲染相关的操作；还需要注意一种情况，老节点没有了，但是新节点还有剩余，那么对于这些剩余的新节点来讲，也是初次渲染
  4. 新老节点都还有剩余
     - 把剩下的老节点构建到一张哈希表里面（ map 结构）
     - 遍历剩余的新节点，通过新节点的 key 去哈希表里面查找节点，找到能够复用的，就拿来复用，并且删除哈希表中对应的已经复用了的节点
  5. 如果经历了上面的步骤之后，哈希表还有剩余，那么所剩余的节点也就没有用了，说明是无论如何都无法复用，那么直接删除即可

- 实现了一些很重要的方法

  - scheduleCallback：负责将一个任务放到任务队列里面
  - workloop：在浏览器渲染每一帧的时候，如果还有剩余时间，那么会执行
  - performUnitOfWork：处理每一颗 fiber 对象
    - beginWork
    - completeWork(待补充)

- 节点的提交

  - 其核心就是根据 fiber 身上不同的 flags 来做不同的事情

- 基本的 Hooks 的实现

  - useState
  - useReducer
  - useEffect



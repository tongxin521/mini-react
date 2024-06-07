import createFiber from './../reconclier/ReactFiber';
import scheduleUpdateOnFiber from './../reconclier/ReactFiberWokrLoop';

/**
 * 更新容器的方法
 * @param {*} element 要挂载的 vnode 树
 * @param {*} container 容器的 DOM 节点
 */
function updateCaontainer(element, container) {
    const fiber = createFiber(element, {
        // 该对象就是父 fiber 对象，里面会放置一些核心的属性
        type: container.nodeName.toLowerCase(),
        stateNode: container,
    });

    // 目前仅仅创建了最外层的父 filber, 接下来需要创建子 fiber
    scheduleUpdateOnFiber(fiber);
}

class ReactDomRoot {
    // 将拿到的根 DOM 节点在内部保存一份
    #_internalRoot
    constructor(container) {
        this.#_internalRoot = container
    }

   /**
    * 
    * @param {*} children 要挂载到根节点的 vnode 树
    * 这里做一个约定：
    * 1. 以前的虚拟DOM，我们称之为 vnode
    * 2. 新的虚拟DOM，我们称之为 Fiber
   */
    render(element) {
        updateCaontainer(element, this.#_internalRoot);
    }
}

const ReactDom = {
  /**
   *
   * @param {*} container 要挂载的根 DOM 节点
   * @return 返回值是一个对象，该对象会有一个 render 方法
   */
    createRoot(container) {
        return new ReactDomRoot(container);
    }
} 


export default ReactDom;
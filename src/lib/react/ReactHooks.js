
/**
 * 改文件用于创建各种 hooks
 */
import scheduleUpdateOnFiber from './../reconclier/ReactFiberWokrLoop'
import {areHookInputEqual} from './../shared/util'

let currentlyRenderingFiber = null; // 当前渲染的 fiber 对象
let workInProgressHook = null; // 当前正在处理的 hook
let currentHook = null; // 当前处理完的 hook

/**
 * 对当前 fiber 对象进行 hook 的初始化
 * @param {*} workInProgress 
 */
export function renderWithHooks(workInProgress) {
    // 将当前渲染的 fiber 对象赋值给 currentlyRenderingFiber
    currentlyRenderingFiber = workInProgress;
    // 将当前渲染的 fiber 对象的 memorizedState 置为 null
    currentlyRenderingFiber.memorizedState = null;
    // 将当前正在处理的 hook 置为 null
    workInProgressHook = null;
    //存储 effect 对应的副作用函数和依赖项
    currentlyRenderingFiber.updateQueue = [];
}

/**
 * 该方法的作用主要就是返回一个 hook 对象
 * 并且让 workInProgressHook始终指向 hook 链表的最后一个 hook
 */
function updateWorkInProgressHook() {

    let hook = null;
    const current = currentlyRenderingFiber.alternate;

    if (current) {
        // 不是第一次渲染，存在旧的 fiber 对象
        currentlyRenderingFiber.memorizedState = current.memorizedState;

        if (workInProgressHook) {
            // 链表已经存在
            workInProgressHook = hook = workInProgressHook.next;
            currentHook = currentHook.next;
        }
        else {
            // 链表不存在
            workInProgressHook = hook = currentlyRenderingFiber.memorizedState;
            currentHook = current.memorizedState;
        }

    }
    else {
        // 首次渲染
        hook = {
            memorizedState: null,
            next: null
        };

        if (workInProgressHook) {
            // 说明这个链表上面已经有 hook 了
            workInProgressHook = workInProgressHook.next = hook;
        }
        else {
            // 说明 hook 链表上面还没有 hook
            workInProgressHook = currentlyRenderingFiber.memorizedState = hook;
        }
    }

    return hook;

}

export function useState(initialState) {
    return useReducer(null, initialState)
}

export function useReducer(reducer, initialState) {
    // 首先我们要拿到最新的 hook
    // 这里的 hook 其实是一个对象，里面存储了一些数据
    // hook ---> {memorizedState: xxx, next: xxx}
    // hook 对象里面有两个属性，一个 memorizedState 用于存储数据，一个 next 用于指向下一个 hook
    const hook = updateWorkInProgressHook();

    if (!currentlyRenderingFiber.alternate) {
        // 首次渲染
        hook.memorizedState = initialState;
    }

    const dispatch = dispatchReducerAction.bind(
        null,
        currentlyRenderingFiber,
        hook,
        reducer
    ); 


    return [hook.memorizedState, dispatch];
}

function dispatchReducerAction(fiber, hook, reducer, action) {
    console.log('dispatchReducerAction', fiber, hook, reducer, action)
    // 更新 hook 对象的 memorizedState
    hook.memorizedState = reducer ? reducer(hook.memorizedState) : action;
    fiber.alternate = { ...fiber };
    fiber.sibling = null;
    scheduleUpdateOnFiber(fiber);
}

/**
 * 
 * @param {*} create 副作用函数
 * @param {*} deps 依赖项
 */
export function useEffect(create, deps) {
    // 获取最后一个 hook
    const hook = updateWorkInProgressHook();
    // 用于存储销毁函数
    let destroy = null;

    if (currentHook) {
        // 从 hook 中获取副作用函数和依赖项
        const preEffect = currentHook.memorizedState;
        // 上一次的销毁函数
        destroy = preEffect.destroy;
         // 判断是否有依赖项
        if (deps) {
            // 上一次的依赖项
            const preDeps = preEffect.deps;
            // 判断依赖项是否发生变化
            if (areHookInputEqual(deps, preDeps)) {
                // 说明依赖项没有变化，不需要执行副作用函数，直接返回
                return;
            }
        }

    }

    // 组装要存储到 memorizedState 中的数据
    const effect = {create, destroy, deps}

    hook.memorizedState = effect;
    // 接下来我们需要执行副作用函数
    // 注意这里并非直接执行，推入到 updateQueue 数组中
    currentlyRenderingFiber.updateQueue.push(effect);

}
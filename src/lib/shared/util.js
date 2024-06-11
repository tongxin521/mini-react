// 存放工具方法的文件

/**
 * 对 fiber 对象要做的操作进行的标记
 */

// 没有任何操作
export const NoFlags = 0b00000000000000000000;
// 节点新增、插入、移动
export const Placement = 0b0000000000000000000010; // 2
// 节点更新属性
export const Update = 0b0000000000000000000100; // 4
// 删除节点
export const Deletion = 0b0000000000000000001000; // 8

/**
 * 判断参数 s 是否为字符串
 * @param {*} s
 * @returns
 */
export function isStr(s) {
  return typeof s === "string";
}

/**
 * 判断参数 fn 是否为函数
 * @param {*} fn
 * @returns
 */
export function isFn(fn) {
  return typeof fn === "function";
}

/**
 * 判断参数 s 是否为 undefined
 * @param {*} s
 * @returns
 */
export function isUndefined(s) {
  return s === undefined;
}

export function isArray(arr) {
  return Array.isArray(arr);
}

/**
 * 该方法主要负责更新 DOM 节点上的属性
 * @param {*} node 真实的 DOM 节点
 * @param {*} prevVal 旧值
 * @param {*} nextVal 新值
 */
export function updateNode(node, preValue, nextValue) {
  // 这里其实要做的事情就分为两个部分：
  // 1. 对旧值的处理
  // 2. 对新值的处理
  Object.keys(preValue).forEach((key) => {
    if (key === 'children') {
      if (isStr(preValue[key])) {
        // 这里我们需要判断一下 children 是否是字符串
        // 如果是字符串，说明是文本节点，我们需要将其设置为空字符串
        node.textContent = '';
      } else if (key.startsWith('on')) {
        let eventName = key.slice(2).toLowerCase();
        // 需要注意，如果是 change 事件，那么背后绑定的是 input 事件
        // 这里我们需要做一下处理
        if (eventName === 'change') {
          eventName === 'input';
        }
        // 移除事件
        node.removeEventListener(eventName, preValue[key]);
      } else {
        // 普通的属性
        // 例如 id、className 之类的
        // 这里不能无脑的直接去除，应该检查一下新值中是否还有这个属性
        // 如果没有，我们需要将其移除掉
        if (!(key in nextValue)) {
          node[key] = '';
        }
      }
    }
  })

  console.log(node, preValue, nextValue);
  Object.keys(nextValue).forEach((key) => {
    if (key === 'children') {
      // 文本节点
      if (isStr(nextValue[key])) {
        node.textContent = nextValue[key];
      } 
    }else if (key.startsWith('on')) {
      // 绑定事件
      let eventName = key.slice(2).toLowerCase();
      if (eventName === 'change') {
        eventName === 'input';
      }
      node.addEventListener(eventName, nextValue[key]);
    } else {
      // 普通属性
        node[key] = nextValue[key];
    }
  })
}

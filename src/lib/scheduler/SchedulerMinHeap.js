
/**
 * 返回队列第一个
 * @param {*} heap 
 */
export function peek(heap) {
    return heap.length === 0 ? null : heap[0];
}

/**
 * 
 * @param {*} heap 
 * @returns 
 */

export function pop(heap) {
    if (heap.length === 0) {
        return null;
    }

    const first = heap[0];
    const last = heap.pop();

    if (first !== last) {
        // 队列任务大于1个，将最后一个任务放到第一个位置
        heap[0] = last;
        // 将最后一个任务进行下沉操作，使其在合适的位置
        siftDown(heap, last, 0);
    }

    return first;
}

/**
 * 向任务队列中添加一个任务
 * @param {*} heap 
 * @param {*} task 
 */
export function push(heap, task) {
    // 获取任务队列的长度
    const len = heap.length;
    // 将当前任务直接推入到任务队列的末尾，目前不一定在合适的位置
    heap.push(task);
    // 将当前任务进行上浮操作，使其在合适的位置
    siftUp(heap, task, len);
}

/**
 * 上浮操作
 * @param {*} heap 
 * @param {*} node 
 * @param {*} i 
 */
function siftUp(heap, node, i) {
    let index = i;

    while (index > 0) {
        // 这里涉及到了二进制里面的移位操作的知识，每右移一位，相当于除以 2，每左移一位，相当于乘以 2
        // 这里之所以要除以 2，是因为我们要获取到父节点的索引，要找上一层的节点
        const parentIndex = (index - 1) >> 1;
        // 通过父节点的索引，就可以获取到父节点的任务
        const parent = heap[parentIndex];
        // 如果父节点的过期时间大于子节点的过期时间，说明子节点的过期时间更小
        // 子节点的过期时间更紧急，那么就需要将子节点上浮
        // 那么就需要交换父节点和子节点的位置
        if (compare(parent, node) > 0) {
            heap[parentIndex] = node;
            heap[index] = parent;
            // 接下来需要将 index 更新为父节点的索引
            index = parentIndex;
        } else {
            return
        }
    }
}

/**
 * 下浮操作
 * @param {*} heap 
 * @param {*} node 
 * @param {*} i 
 */
function siftDown(heap, node, i) {
    let index = i;
    let len = heap.length;
    const halfLen = len >> 1;
    // 因为我们是使用的数组来实现的二叉树，那么首先第一个条件就是数组不能越界

    while(index < halfLen) {
        // 左右的索引有了之后，我们就可以得到左右节点对应的任务
        const leftIndex = index * 2 + 1;
        const rightIndex = index * 2 + 2;

        const left = heap[leftIndex];
        const right = heap[rightIndex]

        if (compare(left, node) < 0) {
            // 如果进入此分支，说明左节点的过期时间更紧急
            // 接下来还需要进行左右节点的比较，谁小谁才能上去
            // 为什么要做 rightIndex < len 的判断呢？
            // 因为右边的树可能存在节点缺失的情况，所以需要判断一下索引值是否超出了数组的长度，防止数组越界
            if (rightIndex < len && compare(right, left) < 0) {
                // 如果进入此分支，说明右边节点的过期时间更紧急
                heap[rightIndex] = node;
                heap[index] = right;
                index = rightIndex;
            } else {
                // 如果进入此分支，说明左边节点的过期时间更紧急
                heap[leftIndex] = node;
                heap[index] = left;
                index = leftIndex;
            }
        } else if (rightIndex < len && compare(right, node) < 0) {
            // 如果进入此分支，说明右节点的过期时间更紧急
            // 但是这里还需要判断一下，右节点的索引不能越界
            heap[rightIndex] = node;
            heap[index] = right;
            index = rightIndex;
        } else {
            // 当前的任务就是最小的
            return;
        }
    }
}


/**
 * 比较函数，接收两个任务
 * @param {*} a
 * @param {*} b
 */
function compare(a, b) {
    // 每个任务都有一个 sortIndex 属性，表示该任务的过期时间
    // 假设父节点的过期时间为 10，子节点的过期时间为 1
    const diff = a.sortIndex - b.sortIndex;
    // 如果通过过期时间比较不出来先后，那么就根据 id 来比较
    return diff !== 0 ? diff : a.id - b.id;
  }
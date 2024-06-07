import {updateNode} from './../shared/util'

export function updateHostTextComponent(workInProgress) {
    workInProgress.stateNode = document.createTextNode(workInProgress.props.children)

}


export function updateHostComponent(workInProgress) {

    if (!workInProgress.stateNode) {
        workInProgress.stateNode = document.createElement(workInProgress.type)
        console.log(workInProgress.stateNode, "更新属性前");
        updateNode(workInProgress.stateNode, {}, workInProgress.props)
        console.log(workInProgress.stateNode, "更新属性后");
    }

}

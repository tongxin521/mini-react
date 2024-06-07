
import {
    FunctionComponent,
    ClassComponent,
    HostText,
    HostComponent,
    Fragment,
  } from "./ReactWorkTag";

import {updateHostTextComponent, updateHostComponent} from './ReactFiberReconclier';

/**
 * 根据 fiber 不同的 tag 值，调用不同的方法来处理
 * @param {*} workInProgress
 */
export default function berginWork(workInProgress) {
    const tag = workInProgress.tag;

    switch (tag) {
        case ClassComponent:
            break;
        case FunctionComponent:
            break;
        case HostText:
            updateHostTextComponent(workInProgress)
            break;
        case HostComponent:
            updateHostComponent(workInProgress)
            break;
        case Fragment:
            break;
            
    }
}
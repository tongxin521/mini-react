
import {
    FunctionComponent,
    ClassComponent,
    HostText,
    HostComponent,
    Fragment,
  } from "./ReactWorkTag";

import {
    updateHostTextComponent,
    updateHostComponent,
    updateFunctionComponent,
    updateClassComponent,
} from './ReactFiberReconclier';

/**
 * 根据 fiber 不同的 tag 值，调用不同的方法来处理
 * @param {*} workInProgress
 */
export default function berginWork(workInProgress) {
    const tag = workInProgress.tag;

    switch (tag) {
        case ClassComponent:
            updateClassComponent(workInProgress)
            break;
        case FunctionComponent:
            updateFunctionComponent(workInProgress);
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
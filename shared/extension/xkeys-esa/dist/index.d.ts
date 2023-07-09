/// <reference types="node" />
import NodeCGTypes from '@nodecg/types';
import { EventEmitter } from 'events';
import { XKeys } from 'xkeys';
import { XKeys as XKeysTypes } from '../../../types';
interface XKeysClass {
    on(event: 'down', listener: (keyIndex: number) => void): this;
    on(event: 'up', listener: (keyIndex: number) => void): this;
    on(event: 'jog', listener: (index: number, position: number) => void): this;
    on(event: 'shuttle', listener: (index: number, position: number) => void): this;
}
declare class XKeysClass extends EventEmitter {
    private nodecg;
    private config;
    panel: XKeys | undefined;
    initPanel(): void;
    constructor(nodecg: NodeCGTypes.ServerAPI, config: XKeysTypes.Config);
    setBacklight(keyIndex: number | string, on?: boolean, redLight?: boolean, flashing?: boolean): void;
}
export default XKeysClass;
//# sourceMappingURL=index.d.ts.map
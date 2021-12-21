/// <reference types="node" />
import { EventEmitter } from 'events';
import type { NodeCG } from 'nodecg/types/server';
import { XKeys } from 'xkeys';
import { XKeys as XKeysTypes } from '../../../types';
interface XKeysClass {
    on(event: 'down', listener: (keyIndex: string) => void): this;
    on(event: 'up', listener: (keyIndex: string) => void): this;
    on(event: 'jog', listener: (position: number) => void): this;
    on(event: 'shuttle', listener: (position: number) => void): this;
}
declare class XKeysClass extends EventEmitter {
    private nodecg;
    private config;
    panel: XKeys | undefined;
    constructor(nodecg: NodeCG, config: XKeysTypes.Config);
    connect(): void;
    setBacklight(keyIndex: number | string, on?: boolean, redLight?: boolean, flashing?: boolean): void;
}
export default XKeysClass;
//# sourceMappingURL=index.d.ts.map
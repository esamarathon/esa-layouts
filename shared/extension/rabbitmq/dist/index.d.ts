import type NodeCGTypes from '@nodecg/types';
import { RabbitMQ as RabbitMQTypes } from '../../../types';
declare class RabbitMQ {
    private nodecg;
    private config;
    private chan;
    private exchange;
    private event;
    private listenTopics;
    private useTestData;
    evt: RabbitMQTypes.Events;
    constructor(nodecg: NodeCGTypes.ServerAPI, useTestData: boolean, opts: {
        config: RabbitMQTypes.Config;
        exchange: string;
        event: string;
        listenTopics: RabbitMQTypes.ListenTopics;
    });
    private url;
    private opts;
    private validateMsg;
    private setupChan;
    /**
     * Used to send messages over the RabbitMQ connection.
     * Automatically prepends the event name to the key.
     * @param key The routing key this message will be published with.
     * @param data The data that should be sent in this message.
     */
    send(key: string, data: {
        [k: string]: any;
    }): Promise<void>;
}
export = RabbitMQ;
//# sourceMappingURL=index.d.ts.map
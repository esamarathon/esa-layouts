import { Configschema } from '@esa-layouts/types/schemas';
import type NodeCGTypes from '@nodecg/types';

let nodecg: NodeCGTypes.ServerAPI<Configschema>;

export function set(ctx: NodeCGTypes.ServerAPI<Configschema>): void {
  nodecg = ctx;
}

export function get(): NodeCGTypes.ServerAPI<Configschema> {
  return nodecg;
}

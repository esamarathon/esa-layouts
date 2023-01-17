import type NodeCGTypes from '@alvancamp/test-nodecg-types';
import { Configschema } from '@esa-layouts/types/schemas';

let nodecg: NodeCGTypes.ServerAPI<Configschema>;

export function set(ctx: NodeCGTypes.ServerAPI<Configschema>): void {
  nodecg = ctx;
}

export function get(): NodeCGTypes.ServerAPI<Configschema> {
  return nodecg;
}

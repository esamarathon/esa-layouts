import { NodeCG } from 'nodecg/types/server';
import { Configschema } from '../../../configschema';

let context: NodeCG;
export let bundleConfig: Configschema;

export function getCtx(): NodeCG {
  return context;
}

export function setCtx(ctx: NodeCG): void {
  context = ctx;
  bundleConfig = ctx.bundleConfig;
}

/* eslint-disable */
/**
 * This is currently a copy of the main index.d.ts of the official typings
 * because the default behaviour is to find the NodeCG installed typings, which are
 * for an older version, and I couldn't find a way to make them be ignored.
 */

declare module 'socket.io-client' {
  import { Manager, ManagerOptions } from "../../node_modules/socket.io-client/build/manager";
  import { Socket, SocketOptions } from "../../node_modules/socket.io-client/build/socket";
  /**
   * Looks up an existing `Manager` for multiplexing.
   * If the user summons:
   *
   *   `io('http://localhost/a');`
   *   `io('http://localhost/b');`
   *
   * We reuse the existing instance based on same scheme/port/host,
   * and we initialize sockets for each namespace.
   *
   * @public
   */
  declare function lookup(opts?: Partial<ManagerOptions & SocketOptions>): Socket;
  declare function lookup(uri: string, opts?: Partial<ManagerOptions & SocketOptions>): Socket;
  declare function lookup(uri: string | Partial<ManagerOptions & SocketOptions>, opts?: Partial<ManagerOptions & SocketOptions>): Socket;
  /**
    * Protocol version.
    *
    * @public
    */
  export { protocol } from "socket.io-parser";
  /**
    * Expose constructors for standalone build.
    *
    * @public
    */
  export { Manager, ManagerOptions, Socket, SocketOptions, lookup as io, lookup as connect, lookup as default, };
}

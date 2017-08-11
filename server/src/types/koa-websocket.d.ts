declare module 'koa-websocket' {
    import * as Koa from 'koa'
    import * as ws from 'ws'
    import * as http from 'http'
    import * as https from 'https'

    module 'koa' {
        interface Context {
            websocket: ws
        }
    }

    type KoaWebsocketConnectionHandler = (socket: ws) => void;
    type KoaWebsocketMiddleware = (context: Koa.Context, next: () => Promise<any>) => any;
    class KoaWebsocketServer {
        app: Koa;
        middleware: Koa.Middleware[];

        constructor(app: Koa);
        listen(server: http.Server | https.Server): ws.Server;
        onConnection(handler: KoaWebsocketConnectionHandler): void;
        use(middleware: KoaWebsocketMiddleware): this;
    }

    interface KoaWebsocketApp extends Koa {
        ws: KoaWebsocketServer;
    }
    type KoaWebsockets = (app: Koa) => KoaWebsocketApp

    const websockets: KoaWebsockets
    export = websockets
}


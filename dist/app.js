"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const Route = require("koa-router");
const websockify = require("koa-websocket");
const route = new Route();
const app = websockify(new Koa());
app.ws.use(function (ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(1);
        ctx.websocket.send('Hello World');
        ctx.websocket.on('message', (message) => {
            console.log(2);
            console.log(message);
        });
    });
});
app.listen(3000);
//# sourceMappingURL=app.js.map
declare module 'koa-conditional-get' {
  import * as Koa from 'koa'
  const conditional: () => (context: Koa.Context, next: () => Promise<any>) => any
  export = conditional
}

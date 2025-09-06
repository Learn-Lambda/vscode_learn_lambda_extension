export abstract class Env {}

export class DevEnv implements Env {}

export class ProdEnv implements Env {}

const getConfig = () => {};

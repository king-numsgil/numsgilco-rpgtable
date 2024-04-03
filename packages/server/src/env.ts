declare module "bun" {
    interface Env {
        TOKEN_PRIVATE_KEY: string;
        TOKEN_PUBLIC_KEY: string;
    }
}

export class Env {
    public static get privateKey() {
        return Buffer.from(Bun.env.TOKEN_PRIVATE_KEY, 'base64').toString('ascii');
    }

    public static get publicKey() {
        return Buffer.from(Bun.env.TOKEN_PUBLIC_KEY, 'base64').toString('ascii');
    }
}
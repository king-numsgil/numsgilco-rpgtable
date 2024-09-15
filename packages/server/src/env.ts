declare module "bun" {
    interface Env {
        TOKEN_PRIVATE_KEY: string;
        TOKEN_PUBLIC_KEY: string;
        POSTGRES_PASSWORD: string;
        POSTGRES_USER: string;
        POSTGRES_DB: string;
    }
}

export class Env {
    public static get privateKey() {
        return Buffer.from(Bun.env.TOKEN_PRIVATE_KEY, 'base64').toString('ascii');
    }

    public static get publicKey() {
        return Buffer.from(Bun.env.TOKEN_PUBLIC_KEY, 'base64').toString('ascii');
    }

    public static get pgUser() {
        return Bun.env.POSTGRES_USER;
    }

    public static get pgPassword() {
        return Bun.env.POSTGRES_PASSWORD;
    }

    public static get pgDb() {
        return Bun.env.POSTGRES_DB;
    }
}

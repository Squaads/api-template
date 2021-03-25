declare namespace NodeJS {
  export interface ProcessEnv {
    BASE_URL: string;
    MONGO_URI: string;
    MONGO_DB_NAME: string;
    MONGO_OPTIONS: string;
    PORT: string;
    MAIL: string;
    MAIL_PASSWORD: string;
  }
}

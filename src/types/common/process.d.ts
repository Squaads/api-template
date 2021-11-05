declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_BASE_URL: string;
    MONGO_URL: string;
    MONGO_DB_NAME: string;
    MONGO_OPTIONS: string;
    DB_USER: string;
    DB_PASSWORD: string;
    PORT: string;
    FIREBASE_URL: string;
    MAIL: string;
    MAIL_PASSWORD: string;
    MODE: string;
    AIRTABLE_KEY: string;
    AIRTABLE_BASE: string;
    DOMAIN_URL: string;
    DOMAIN_API : string;
    LOG_LEVEL: string;
    REQUEST_LIMIT: string;
    SESSION_SECRET: string;
    OPENAPI_SPEC: string;
    REDSYS_SECRET: string;
    ACCESS_TOKEN_SECRET_PAY: string;
  }
}

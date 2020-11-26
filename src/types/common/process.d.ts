declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_BASE_URL: string;
    MONGO_URL: string;
    MONGO_DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    PORT: string;
    FIREBASE_URL: string;
  }
}

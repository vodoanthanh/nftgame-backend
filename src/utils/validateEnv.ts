import { cleanEnv, str } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'uat', 'staging', 'production', 'testing'],
    }),
    SECRET_KEY: str(),
    DB_USER: str(),
    DB_PASS: str(),
    DB_NAME: str(),
    DB_HOST: str(),
    PROVIDER_URL: str()
  });
};

export default validateEnv;

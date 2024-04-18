import { Environment } from 'vitest';

const environment: Environment = {
  name: 'prisma',
  async setup() {
    console.log('Setup');

    return {
      teardown() {
        console.log('Teardown');
      }
    };
  },
  transformMode: 'web' // verificar se está certo isso
};

export default environment;

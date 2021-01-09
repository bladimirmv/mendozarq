import { SocketIoConfig } from 'ngx-socket-io';

const socketConfig: SocketIoConfig = { url: 'http://localhost:3000', options: {} };

export const environment = {
  production: true,
  API_URL: 'http://localhost:3000',
  socketConfig
};

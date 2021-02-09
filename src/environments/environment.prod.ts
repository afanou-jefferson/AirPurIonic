// export const environment = {
//   production: true
// };

import { config } from "./common";

export const environment = Object.assign({
  production: true,
  baseUrl: 'http://localhost:8080/'
}, 
  config
);
import * as Logger from 'loglevel';

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  Logger.setLevel('debug');
} else {
  Logger.setLevel('error');
}
window.Logger = Logger;
export default Logger;

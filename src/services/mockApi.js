// PrintM API Adapter
// Defaults to the real backend, with graceful offline fallback
import { Api } from './api';

export const MockApi = Api;
export { Api };
export default Api;

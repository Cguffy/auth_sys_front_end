import { request } from 'umi';
import { sysInfo } from './commonParams';

export async function query(
  url: string,
  params?: Record<string, any>,
  options?: Record<string, any>,
) {
  return request(`/api${url}`, {
    method: 'POST',
    data: {
      ...(params || {}),
      ...sysInfo,
    },
    ...(options || {}),
  });
}

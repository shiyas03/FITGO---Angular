import { JwtHelperService } from '@auth0/angular-jwt';

export function decodeToken(token: string) {
  const helper = new JwtHelperService();
  const decode = helper.decodeToken(token);
  return decode
}

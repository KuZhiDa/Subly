import { LoginDto, RegisterDto } from '../presentation/dto/auth.dto';

export interface IAuthService {
  registerUser(dto: RegisterDto);
  loginUser(dto: LoginDto);
  logoutUser(token: string);
  validateUser(email: string);
  checkUser(email: string);
  genTokens(data: any);
  refreshSave(id: string, token: string);
  deleteTokenRefresh(token: string);
  accessRefresh(token: string);
  verifyToken(token: string);
  checkRefreshToken(token: string);
}

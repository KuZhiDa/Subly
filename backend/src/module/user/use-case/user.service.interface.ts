import { UpdateDto } from '../presentation/dto/user.dto';

export interface IUserService {
  getOne(id: string);
  update(id: string, dto: UpdateDto);
}

import { UpdateDto } from '../presentation/dto/update.dto';

export interface IUserService {
  getOne(id: string);
  update(id: string, dto: UpdateDto);
}

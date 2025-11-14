// infrastructure/mappers/user.mapper.ts
import { User } from '../../domain/user.entity';

export class UserMapper {
  static toDomain(raw: any): User {
    return new User(raw.user_id, raw.user_name, raw.user_email);
  }

  static toPersistence(user: User): any {
    return {
      user_id: user.id,
      user_name: user.name,
      user_email: user.email,
    };
  }
}


/* domain/user.entity.ts
export class User {
  constructor(
    public readonly id: string,
    public name: string,
    public email: string,
  ) {}
}
 convertimos esa estructura la logica de negocio a una base como postresSQL

 {
  "user_id": "123",
  "user_name": "Carlos",
  "user_email": "carlos@test.com"
}
*/

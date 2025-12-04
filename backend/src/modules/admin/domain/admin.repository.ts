import { Admin } from './admin.entity';


export abstract class AdminRepository {
  abstract findByUid(uid: string): Promise<Admin | null>;
}

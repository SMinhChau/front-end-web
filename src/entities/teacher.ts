import { EnumRole, EnumGender } from '../enum';
interface Teacher {
  id: any;
  username: string;
  avatar: string;
  name: string;
  email: string;
  phoneNumber: string;
  gender: EnumGender;
  role: EnumRole;
  majors: {
    id: number;
  };
  degree: string;
  isAdmin: string;
}

export default Teacher;

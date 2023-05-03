import { axiosAuth } from '../utils/axiosConfig';

class GroupService {
  getGroupById(groupId: number) {
    return axiosAuth({
      url: `/lecturer/groups/${groupId}`,
      method: 'get',
    });
  }
}
const studentService = new GroupService();

export default studentService;

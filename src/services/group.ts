import { axiosAuth } from '../utils/axiosConfig';

class GroupService {
  getGroupById(groupId: number) {
    return axiosAuth({
      url: `/lecturer/groups/${groupId}`,
      method: 'get',
    });
  }
  updateTypeReport(groupId: number, typeReport: string) {
    return axiosAuth({
      url: `/lecturer/groups/${groupId}/type-report`,
      method: 'patch',
      data: { typeReport },
    });
  }
}
const studentService = new GroupService();

export default studentService;

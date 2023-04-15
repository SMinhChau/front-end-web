import { axiosAuth, axiosFormData } from '~/utils/axiosConfig';

class StudentService {
  getStudent(filter: { majorsId?: number }) {
    return axiosAuth({
      url: '/lecturer/students',
      params: filter,
      method: 'get',
    });
  }

  importSudent(data: FormData) {
    return axiosFormData({
      url: '/lecturer/students/import-student',
      method: 'post',
      data,
    });
  }

  getGroupStudents(termId: number) {
    return axiosAuth({
      url: `/lecturer/groups?termId=${termId}`,
      method: 'get',
    });
  }
  getGroupStudentByID(id: number) {
    return axiosAuth({
      url: `lecturer/groups/${id}`,
      method: 'get',
    });
  }

  async getGroupLecturerOfStudentByType(groupId?: number, termId?: number, type?: string) {
    return await axiosAuth({
      url: `lecturer/assigns?groupId=${groupId}&termId=${termId}&type=${type}`,
      method: 'get',
    });
  }
}

const studentService = new StudentService();

export default studentService;

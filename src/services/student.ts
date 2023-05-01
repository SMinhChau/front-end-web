import { axiosAuth, axiosFormData } from '~/utils/axiosConfig';
import qs from 'qs';
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

  async addStudent(data: {
    majorsId: number;
    termId: number;
    username: string;
    name: string;
    gender: string;
    email: string;
    phoneNumber: string;
    typeTraining: string;
  }) {
    return await axiosAuth({
      url: '/lecturer/students',
      data: qs.stringify(data),
      method: 'post',
    });
  }

  async getTranscriptsSummary(studentId: number, termId: number) {
    return await axiosAuth({
      url: `/lecturer/transcripts/summary?studentId=${studentId}&termId=${termId}`,

      method: 'get',
    });
  }
}

const studentService = new StudentService();

export default studentService;

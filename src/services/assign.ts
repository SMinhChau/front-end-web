import { axiosAuth, axiosFormData } from '../utils/axiosConfig';

class AssignService {
  getAssignByLecturer(termId: number, lecturerId: number, typeEvaluation?: string) {
    const params: Record<string, any> = {};
    params['termId'] = termId;
    if (typeEvaluation) params['typeEvaluation'] = typeEvaluation;
    return axiosAuth({
      url: `/lecturer/assigns/lecturers/${lecturerId}`,
      params,
      method: 'get',
    });
  }
  getAssignByTypeAdvisor(lecturerId: number, data: { typeEvaluation?: string }) {
    return axiosAuth({
      url: `/assigns/lecturers/${lecturerId}`,
      params: data,
      method: 'get',
    });
  }
}

const studentService = new AssignService();

export default studentService;

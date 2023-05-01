import { TypeEvaluation } from '~/constant';
import { axiosAuth, axiosFormData } from '~/utils/axiosConfig';

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
}

const studentService = new AssignService();

export default studentService;

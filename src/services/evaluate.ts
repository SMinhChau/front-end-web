import { axiosAuth } from '../utils/axiosConfig';
import qs from 'qs';

class EvaluateService {
  async getEvaluate(data: { termId: number; type: string }) {
    return await axiosAuth({
      url: '/lecturer/evaluations',
      method: 'get',
      params: data,
    });
  }
  async insert(data: any) {
    return await axiosAuth({
      url: '/lecturer/evaluations',
      method: 'post',
      data,
    });
  }
  async deleteTerm(id: number) {
    return await axiosAuth({
      url: `/lecturer/evaluations/${id}`,
      method: 'delete',
    });
  }
  async update(id: any, data: any) {
    return await axiosAuth({
      url: '/lecturer/evaluations/' + id,
      method: 'put',
      data: qs.stringify(data),
    });
  }
  async exportFile(termId: number, type: string) {
    return await axiosAuth({
      url: `/lecturer/evaluations/pdf/download?termId=${termId}&type=${type}`,
      method: 'get',
      responseType: 'blob', // Important
    });
  }
  async exportFileByAssignId(id: number) {
    return await axiosAuth({
      url: `/lecturer/evaluations/pdf/assigns/${id}/download`,
      method: 'get',
      responseType: 'blob', // Important
    });
  }
}

const evaluateService = new EvaluateService();
export default evaluateService;

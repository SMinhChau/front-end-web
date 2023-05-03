import { axiosAuth } from '../utils/axiosConfig';
import qs from 'qs';
class TermService {
  async getTerm(data: any) {
    return await axiosAuth({
      url: '/lecturer/terms',
      method: 'get',
      params: data,
    });
  }
  async createTerm(values: any) {
    return await axiosAuth({
      url: '/lecturer/terms',
      method: 'post',
      data: qs.stringify(values),
    });
  }

  async deleteTerm(id: number) {
    return await axiosAuth({
      url: '/lecturer/terms/' + id,
      method: 'delete',
    });
  }
  async update(id: any, data: any) {
    return await axiosAuth({
      url: '/lecturer/terms/' + id,
      method: 'put',
      data,
    });
  }
  async getTermById(id: number) {
    return await axiosAuth({
      url: `/lecturer/terms/${id}`,
      method: 'get',
    });
  }
}

const termService = new TermService();
export default termService;

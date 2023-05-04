import { axiosAuth } from '../utils/axiosConfig';

class MajorService {
  async getMajor() {
    return await axiosAuth({
      url: '/lecturer/majors',
      method: 'get',
    });
  }
  async createMajor(data: { name: string }) {
    return await axiosAuth({
      url: '/lecturer/majors',
      method: 'post',
      data,
    });
  }
  async deleteMajor(id: number) {
    return await axiosAuth({
      url: '/lecturer/majors/' + id,
      method: 'delete',
    });
  }

  async updateMajor(majorId: number, data: { name: string }) {
    return await axiosAuth({
      url: '/lecturer/majors/' + majorId,
      method: 'put',
      data,
    });
  }
  async getMajorById(majorId: number) {
    return await axiosAuth({
      url: '/lecturer/majors/' + majorId,
      method: 'get',
    });
  }

  async updateRoleOfMajor(id: number, data: { role: string }) {
    return await axiosAuth({
      url: `/lecturer/lecturers/${id}/role`,
      method: 'put',
      data,
    });
  }
}

const majorService = new MajorService();

export default majorService;

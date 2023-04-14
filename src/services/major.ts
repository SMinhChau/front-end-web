import { axiosAuth } from '~/utils/axiosConfig';

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

  async updateMajor(majorId: number, data: { name: string; headLecturerId: number }) {
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
}

const majorService = new MajorService();

export default majorService;

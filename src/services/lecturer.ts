import { axiosAuth, axiosFormData } from '~/utils/axiosConfig';
import qs from 'qs';

class LecturerService {
  async getAll() {
    return await axiosAuth({
      url: '/lecturer/lecturers?isHeadLecturer=true',
      method: 'get',
    });
  }
  async getWithTerm(termId: number) {
    return await axiosAuth({
      url: '/lecturer/lecturers',
      params: {
        termId,
      },
    });
  }
  async import(data: FormData) {
    return await axiosFormData({
      url: '/lecturer/lecturers/import-lecturer',
      data,
    });
  }
  async getGroupLecturers(termId: number) {
    return await axiosAuth({
      url: `/lecturer/group-lecturer?termId=${termId}`,
      method: 'get',
    });
  }

  async createGroupLecturer(data: { termId: number; name: string; lecturerIds: string }) {
    console.log('createGroupLecturer============', data);
    // return axiosAuth.postForm("/lecturer/group-lecturer", data, {headers: {'content-type': 'application/x-www-form-urlencoded'}})

    return await axiosAuth({
      url: '/lecturer/group-lecturer',
      method: 'post',
      data: qs.stringify(data),
    });
  }

  async updateGroupLecturer(
    id: number,
    data: {
      termId: number;
      name: string;
      lecturerIds: string;
    },
  ) {
    return await axiosAuth({
      url: `/lecturer/group-lecturer/${id}`,
      method: 'put',
      data,
    });
  }

  async deleteGroupLecturer(id: number) {
    return await axiosAuth({
      url: `lecturer/group-lecturer/${id}`,
      method: 'delete',
    });
  }
  async deleteMemberOfGroupLecturer(id: number, lecturerId: number) {
    return await axiosAuth({
      url: `lecturer/group-lecturer/${id}/members/${lecturerId}`,
      method: 'delete',
    });
  }

  async getGroupStudentOfLecturer(termId: number, lecturerId: number) {
    return await axiosAuth({
      url: `/lecturer/assigns/lecturers/${lecturerId}?termId=${termId}`,
      method: 'get',
    });
  }
  async getListGroupStudentByGroupLecturer(groupLecturerId: number, termId: number) {
    return await axiosAuth({
      url: `lecturer/assigns/lecturers/:${groupLecturerId}?termId=${termId}`,
      method: 'get',
    });
  }
}

const lecturerService = new LecturerService();

export default lecturerService;

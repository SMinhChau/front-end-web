import { axiosAuth, axiosFormData } from '../utils/axiosConfig';
import qs from 'qs';

class LecturerService {
  async getAll() {
    return await axiosAuth({
      url: '/lecturer/lecturers?isHeadLecturer=true',
      method: 'get',
    });
  }
  async getWithTerm(termId: number, majorsId?: number) {
    return await axiosAuth({
      url: '/lecturer/lecturers',
      params: {
        termId,
        majorsId,
      },
    });
  }
  async import(data: FormData) {
    return await axiosFormData({
      url: '/lecturer/lecturers/import-lecturer',
      data,
      method: 'post',
    });
  }
  async getGroupLecturers(params: { termId: number; typeEvaluation: string }) {
    return await axiosAuth({
      url: `/lecturer/group-lecturer`,
      method: 'get',
      params: params,
    });
  }
  async getAllGroupLecturers(params: { termId: number }) {
    return await axiosAuth({
      url: `/lecturer/group-lecturer`,
      method: 'get',
      params: params,
    });
  }

  async createGroupLecturer(data: { termId: number; name: string; lecturerIds: string; type?: string }) {
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
      type?: string;
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

  async createAssignGroupLecturer(data: { typeEvaluation: string; groupLecturerId: number; groupId: number }) {
    return await axiosAuth({
      url: '/lecturer/assigns',
      method: 'post',
      data: qs.stringify(data),
    });
  }
  async updateAssignGroupLecturer(id: number, data: { typeEvaluation: string; groupLecturerId: number; groupId: number }) {
    return await axiosAuth({
      url: `lecturer/assigns/${id}`,
      method: 'put',
      data: qs.stringify(data),
    });
  }

  async addLecturer(data: {
    majorsId: number;
    termId: number;
    username: string;
    name: string;
    gender: string;
    email: string;
    phoneNumber: string;
    degree: string;
  }) {
    return await axiosAuth({
      url: '/lecturer/lecturers',
      method: 'post',
      data: qs.stringify(data),
    });
  }

  async getLecturerByMajor(majorsId: number, termId: number) {
    return await axiosAuth({
      url: `/lecturer/lecturers?majorsId=${majorsId}&termId=${termId}`,
      method: 'get',
    });
  }
  async reSetPass(id: number, data: { password: string }) {
    return await axiosAuth({
      url: `/lecturer/lecturers/${id}/reset-password`,
      method: 'patch',
      data,
    });
  }
  async getGroupssignById(id: number) {
    return await axiosAuth({
      url: `/lecturer/groups/group-lecturer/${id}`,
      method: 'get',
    });
  }
  async getGroupLecturersDetail(params: { termId: number; type: string }) {
    return await axiosAuth({
      url: `/lecturer/group-lecturer`,
      method: 'get',
      params: params,
    });
  }
  async getGroupLecturerDontHaveByType(params: { termId: number; type: string }) {
    return await axiosAuth({
      url: `/lecturer/lecturers/available-group`,
      method: 'get',
      params: params,
    });
  }
  async asignTopicForStudent(data: { topicId: number; studentId: number }) {
    return await axiosAuth({
      url: `/lecturer/groups/grant-topic`,
      method: 'post',
      data,
    });
  }
}

const lecturerService = new LecturerService();

export default lecturerService;

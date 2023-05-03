import { axiosAuth } from '../utils/axiosConfig';
interface IPostTranscripts {
  assignId: number;
  studentId: number;
  transcripts: {
    idEvaluation: number;
    grade: number;
  }[];
}
class TranscriptService {
  getTranscripts(groupId: number, lecturerId: number, studentId: number, typeEvaluation: string) {
    const params: Record<string, any> = {};
    params['groupId'] = groupId;
    params['typeEvaluation'] = typeEvaluation;
    params['lecturerId'] = lecturerId;
    return axiosAuth({
      url: `/lecturer/transcripts/students/${studentId}`,
      params,
      method: 'get',
    });
  }
  postTranscripts(data: IPostTranscripts) {
    console.log(data);
    return axiosAuth({
      url: `/lecturer/transcripts`,
      data,
      method: 'post',
    });
  }
}

const studentService = new TranscriptService();

export default studentService;

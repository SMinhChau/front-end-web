import classNames from 'classnames/bind';
import style from './ItemAdvisor.module.scss';
import { ToastContainer } from 'react-toastify';
import { useEffect, useState, useMemo } from 'react';
import { Button, Col, Descriptions, Divider, InputNumber, Radio, Row, Skeleton, Spin, Table, Typography } from 'antd';
import groupService from '../../services/group';
import { useAppSelector } from '../../redux/hooks';
import { EditOutlined, LoadingOutlined } from '@ant-design/icons';
import transcriptService from '../../services/transcript';
import Teacher from '../../entities/teacher';
import { useParams, useSearchParams } from 'react-router-dom';
import Student from '../../pages/student/Student';
import { ErrorCodeDefine, showMessage, showMessageEror } from '../../constant';
import studentService from '../../services/student';
import TranscriptSumMary from '../../entities/transcript';
import { TypeEvalution } from 'src/entities/assign';
import { ColumnsType } from 'antd/es/table';

const cls = classNames.bind(style);
const { Text } = Typography;
interface GroupLecturer {
  id: number;
  name: string;
  members: {
    id: number;
    lecturer: Teacher;
    groupLecturer: number;
  }[];
}
interface Transcript {
  id: number;
  name: string;
  gradeMax: number;
  description: string;
  type: string;
  term: {
    id: number;
  };
  grade: number;
}
interface Student {
  id: 4;
  majors: {
    id: 1;
  };
  username: string;
  avatar: string;
  phoneNumber: string;
  email: string;
  name: string;
}
interface GroupStudent {
  id: number;
  name: string;
  term: {
    id: number;
  };
  topic: {
    id: number;
  };
  members: {
    id: number;
    student: Student;
    group: {
      id: number;
    };
  }[];
}
interface Grade {
  idEvaluation: number;
  grade: number;
  gradeMax: number;
}
interface GroupLecturerTable extends GroupLecturer {
  key: number;
}

interface ListAvg {
  grade: number;
}
const ItemAdvisor = () => {
  const [grades, setGrades] = useState<Array<Grade>>([]);
  const [group, setGroup] = useState<GroupStudent>();
  const [transcripts, setTranscripts] = useState<Transcript[]>();
  const [searchParams, setSearchParams] = useSearchParams();

  const userState = useAppSelector((state) => state.user).user;
  const [loadingInfoGroup, setLoadingInfoGroup] = useState(false);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [studentTranscript, setStudentTranscript] = useState<Student | null>();

  const [studentIdSelect, setStudentIdSelect] = useState(0);
  const param: any = useParams();
  const termState = useAppSelector((state) => state.term);

  const [listAvgGrader, setListAvgGrader] = useState<Array<ListAvg>>([]);
  const [avgGrader, setAvgGrader] = useState(0);
  const [transcriptsSummary, setTranscriptsSummary] = useState<TranscriptSumMary>();
  const [avgSummary, setAvgSummary] = useState<number | null>(null);
  const [isloadSum, setIsLoadSum] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [typeEvalution, setTypeEvalution] = useState<TypeEvalution>(TypeEvalution.ADVISOR);

  useEffect(() => {
    groupService
      .getGroupById(param.id)
      .then((response) => {
        setGroup(response.data);
        setLoadingInfoGroup(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getTranscriptsSummaryBhyStudentId = (_id: number) => {
    studentService
      .getTranscriptsSummary(_id, termState.termIndex.id)
      .then((result) => {
        setLoadingDetail(false);
        setTranscriptsSummary(result.data);
      })
      .catch((er) => console.log('er', er));
  };

  useEffect(() => {
    switch (typeEvalution) {
      case 'ADVISOR':
        return setAvgSummary(Number(transcriptsSummary?.ADVISOR.avgGrader));
      case 'REVIEWER':
        return setAvgSummary(Number(transcriptsSummary?.REVIEWER.avgGrader));
      case 'SESSION_HOST':
        return setAvgSummary(Number(transcriptsSummary?.SESSION_HOST.avgGrader));
    }
  }, [transcriptsSummary, listAvgGrader]);

  const loadTranscriptStudent = (id: any) => {
    setStudentIdSelect(id);
    getTranscriptByType(id, typeEvalution);
  };

  const getTranscriptByType = (studentId: number, typeEvalution: string) => {
    setLoadingDetail(true);
    setTranscripts([]);
    setStudentTranscript(null);
    setLoadingTranscript(true);
    setGrades([]);
    setIsLoadSum(true);
    getTranscriptsSummaryBhyStudentId(studentId);
    transcriptService
      .getTranscripts(param.id, userState?.id, studentId, typeEvalution)
      .then((result) => {
        setTranscripts(result?.data);

        setListAvgGrader(
          result?.data.map((i: any) => {
            return { grade: i.grade };
          }),
        );

        let sum = 0;
        if (result?.data.length > 0) {
          result?.data.forEach((i: { grade: number }) => {
            sum += i.grade;
            setAvgGrader(sum);
          });
        } else {
          setAvgGrader(0);
        }

        setIsLoadSum(false);
        const member = group?.members.find((e) => e.student.id == studentId);
        setStudentTranscript(member?.student);

        setLoadingTranscript(false);
      })

      .catch((error) => {
        showMessageEror(ErrorCodeDefine[error.response.data.code].message, 5000);
        setLoadingTranscript(false);
      });
  };

  const getEvalutionName = () => {
    switch (typeEvalution) {
      case 'ADVISOR':
        return 'Giáo viên hướng dẫn';
      case 'REVIEWER':
        return 'Phản biện';
      case 'SESSION_HOST':
        return 'Hội đồng';
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Tên tiêu chí',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <div className={cls('text_colum')} style={{ maxHeight: '100px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Điểm tối đa',
      dataIndex: 'gradeMax',
      key: 'gradeMax',
      width: 150,
      render: (text: string) => (
        <div className={cls('text_colum')} style={{ maxHeight: '100px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Điểm',
      dataIndex: 'grade',
      width: 150,
      render: (text: string) => {
        let n = Number(text);
        const col = n <= 5 ? 'red' : 'green';
        return (
          <div className={cls('text_colum')} style={{ maxHeight: '100px', overflow: 'auto', color: col, fontWeight: '600' }}>
            {text}
          </div>
        );
      },
    },
  ];

  const columnsLecturer = [
    {
      title: 'Mã SV',
      dataIndex: 'username',
      key: 'username',
      render: (text: string) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Tên SV',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },

    {
      title: 'Chấm điểm',
      dataIndex: 'id',
      render: (id: any) => (
        <Button onClick={() => loadTranscriptStudent(id)}>
          <EditOutlined style={{ color: 'red' }} />
        </Button>
      ),
    },
  ];

  const getPointAvg = useMemo(() => {
    return (
      <Text mark strong type="danger" className={cls('title_point_avg')}>
        {avgGrader}
      </Text>
    );
  }, [listAvgGrader]);

  const handlerChangeType = (props: any) => {
    setTypeEvalution(props.target.value);

    getTranscriptByType(studentIdSelect, props.target.value);
  };

  const renderAvgSumTranscript = useMemo(() => {
    return (
      <>
        {avgGrader !== null ? (
          <>
            <Row justify={'start'} align={'middle'}>
              <Col>
                <Text type="danger" className={cls('title_point')} style={{ marginRight: '10px' }}>
                  Điểm trung bình:
                </Text>
              </Col>
              <Col>
                <Text type="danger" className={cls('title_point')}>
                  {avgSummary}
                </Text>
              </Col>
            </Row>
          </>
        ) : null}
      </>
    );
  }, [avgSummary, transcriptsSummary, listAvgGrader]);

  return (
    <div className={cls('group_evaluation')}>
      <ToastContainer />
      <Row justify={'start'} align={'top'}>
        <Col span={9} className={cls('group-col')}>
          <Row justify={'space-between'} style={{ height: '100%' }}>
            <Col span={24}>
              <div className={cls('title_group')}>Thông tin nhóm</div>
              <div className={cls('info_item_des')}>
                <Skeleton loading={!loadingInfoGroup} active paragraph={{ rows: 5 }}>
                  <div className={cls('top_des')}>
                    <Row justify={'start'} align={'middle'}>
                      <Col span={6}>
                        <p className={cls('title_info_group')}>Tên nhóm :</p>
                      </Col>
                      <Col span={6}>
                        <h4 className={cls('name_group')}>{group?.name}</h4>
                      </Col>
                    </Row>

                    <Divider className={cls('title_point')} plain>
                      Danh sách sinh viên
                    </Divider>
                    <Table
                      dataSource={group?.members.map((value) => {
                        return {
                          id: value?.student?.id,
                          username: value?.student?.username,
                          name: value?.student?.name,
                        };
                      })}
                      columns={columnsLecturer}
                      pagination={{ pageSize: 2 }}
                    />
                  </div>
                </Skeleton>
              </div>
            </Col>
          </Row>
        </Col>

        <Col span={15} style={{ backgroundColor: '#ffff' }}>
          <div className={cls('type_evalution')}>
            <Radio.Group defaultValue={typeEvalution} buttonStyle="solid" onChange={handlerChangeType}>
              <Radio.Button className={cls('btn_radio')} value={TypeEvalution.ADVISOR}>
                hướng dẫn
              </Radio.Button>
              <Radio.Button className={cls('btn_radio')} value={TypeEvalution.REVIEWER}>
                Phản biện
              </Radio.Button>
              <Radio.Button className={cls('btn_radio')} value={TypeEvalution.SESSION_HOST}>
                Hội đồng
              </Radio.Button>
            </Radio.Group>
          </div>
          <div className={cls('transcript-col')}>
            <div className={cls('title_group')}>Bảng điểm - {getEvalutionName()}</div>

            <Spin spinning={loadingTranscript}>
              <Descriptions title={<></>}>
                <Descriptions.Item label={<p className={cls('title_info_student')}>MSSV</p>} span={1}>
                  <h4 className={cls('name_group')}>{studentTranscript?.username}</h4>
                </Descriptions.Item>
                <Descriptions.Item label={<p className={cls('title_info_student')}>Tên SV</p>} span={1}>
                  <h4 className={cls('name_group')}>{studentTranscript?.name}</h4>
                </Descriptions.Item>
                <Descriptions.Item label={<p className={cls('title_info_student')}>Email</p>} span={1}>
                  <h4 className={cls('name_group')}>{studentTranscript?.email}</h4>
                </Descriptions.Item>
              </Descriptions>
              <Divider className={cls('title_point')} plain>
                Danh sách Tiêu chí : {transcripts?.length}
              </Divider>
              <Skeleton loading={loadingDetail} active paragraph={{ rows: 5 }}>
                <div className={cls('group_content')}>
                  <Table dataSource={transcripts} columns={columns} scroll={{ x: 400, y: 290 }} />
                </div>
              </Skeleton>
              {studentIdSelect && (
                <>
                  <Row
                    justify={'space-between'}
                    align={'middle'}
                    style={{
                      marginTop: '10px',
                      width: '100%',
                    }}
                  >
                    <Col span={6}>
                      <div className={cls('avg_content')}>{renderAvgSumTranscript}</div>
                    </Col>
                    <Col span={6}>
                      <Row justify={'start'} align={'middle'}>
                        <Col>
                          <Text mark strong type="danger" className={cls('title_point')}>
                            <div className={cls('avg_content')}>Tổng điểm: </div>
                          </Text>
                        </Col>
                        <Col span={2}>
                          <Text mark strong type="danger" className={cls('title_point')}>
                            <div className={cls('avg_content')}> {avgGrader}</div>
                          </Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              )}
            </Spin>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ItemAdvisor;

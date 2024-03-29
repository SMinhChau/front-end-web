import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styled from './GradingAssigment.module.scss';
import {
  Avatar,
  Button,
  Col,
  Descriptions,
  Divider,
  Radio,
  Result,
  Row,
  Skeleton,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from 'antd';

import { useAppSelector } from '../../redux/hooks';
import assignService from '../../services/assign';
import { BookOutlined, EditOutlined, ExportOutlined, MoreOutlined, SnippetsOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { Link } from 'react-router-dom';

import { TypeEvalution } from '../../entities/assign';

import { AiOutlineEdit } from 'react-icons/ai';

import AssignAdvisor from 'src/entities/assign_advisor';
import AssignAdvisorOfLecturer from 'src/entities/assign_advisor';
import { checkDegree, checkGender, getStatusGroup, getStatusGroupColor } from 'src/constant';
import GroupLecturer from '../group_lecturer/GroupLecturer';
import { ColumnsType } from 'antd/es/table';
import transcriptService from '../../services/transcript';
import studentService from 'src/services/student';
import TranscriptSumMary from 'src/entities/transcript';
import Student from 'src/entities/student';
import Teacher from 'src/entities/teacher';
import Topic from 'src/entities/topic';
import Select from 'react-select';

const cls = classNames.bind(styled);
const { Text } = Typography;

interface InfoAll {
  id: number;
  name: string;
  term: {
    id: number;
  };
  status: string;
  topic: Topic;
  members: [
    {
      id: number;
      student: {
        id: number;
        username: string;
        avatar: string;
        phoneNumber: string;
        email: string;
        name: string;
        gender: string;
        createdAt: string;
        updatedAt: string;
        majors: {
          id: number;
        };
        typeTraining: string;
        schoolYear: string;
      };
      group: {
        id: number;
      };
    },
  ];
  groupReview: string;
  groupHost: string;
}

const GradingAssigment = () => {
  const [listAssign, setListAssign] = useState<Array<InfoAll>>([]);
  const [data, setData] = useState<Array<InfoAll>>([]);
  // const [loading, setLoading] = useState(true);
  const [typeEvalution, setTypeEvalution] = useState<TypeEvalution>(TypeEvalution.ADVISOR);
  const termState = useAppSelector((state) => state.term);
  const user = useAppSelector((state) => state.user.user);
  const [isShow, setIssShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [transcriptsSummary, setTranscriptsSummary] = useState<TranscriptSumMary>();
  const [lectureAdvisor, setLectureAdvisor] = useState<Array<Teacher>>([]);
  const [groupStudent, setGroupStudent] = useState<InfoAll>();
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (termState.term.length > 0) {
      studentService
        .getGroupStudents(termState.termIndex.id)

        .then((result) => {
          const _data = result.data.map((value: InfoAll, index: number) => {
            return {
              ...value,
              index,
            };
          });

          setListAssign(_data);
          setData(_data);
        })
        .catch((error) => {
          console.log('getlist -> error', error);
        });
    }
  }, [termState]);

  const baseColumns: ColumnsType<InfoAll> = [
    {
      title: 'Mã nhóm',
      dataIndex: 'id',
      key: 'id',

      render: (text) => {
        return <div className={cls('text_colum')}>{text}</div>;
      },
    },

    {
      title: 'Tình tạng',
      dataIndex: 'status',
      key: 'status',

      render: (text) => {
        const name = getStatusGroup(text);
        const color = getStatusGroupColor(text);
        return (
          <Tag color={color}>
            <div style={{ color: color, fontSize: '16px' }}>{name}</div>
          </Tag>
        );
      },
    },
    {
      title: <div className={cls('text_colum')}>Thành viên nhóm hội đồng</div>,
      dataIndex: 'id',
      key: 'id',
      render: (text) => {
        return (
          <>
            <Tag color={'blue'}>
              <div className={cls('group_more_more')}>
                <Link to={'/group/' + text}>
                  <div style={{ fontSize: '1rem' }}>Xem chi tiết...</div>
                </Link>
              </div>
            </Tag>
          </>
        );
      },
    },

    {
      title: '',
      dataIndex: 'id',
      width: 50,
      render: (id: any) => (
        <Space wrap>
          <Tooltip title="Xem chi tiết" color={'geekblue'}>
            <Button
              onClick={() => {
                handleGetInfoStudent(id);
              }}
            >
              <MoreOutlined style={{ color: '#30a3f1' }} />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleGetInfoStudent = (id: number) => {
    setLoadingDetail(true);
    setLoading(true);
    studentService
      .getGroupStudentByID(id)

      .then((result) => {
        setLoadingDetail(false);
        setLoading(false);
        setGroupStudent(result.data);
      })
      .catch((error) => {
        console.log('getlist -> error', error);
      });
  };

  const renderTable = useMemo(() => {
    return <Table columns={baseColumns} dataSource={data} />;
  }, [data, listAssign]);

  const columnsLecturer: ColumnsType<any> = [
    {
      title: 'Mã SV',
      dataIndex: 'username',
      key: 'username',
      width: 100,
      render: (text: string) => (
        <div className={cls('text_colum')} style={{ maxHeight: '50px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Tên sinh viên',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      render: (text: string) => (
        <div className={cls('text_colum')} style={{ maxHeight: '60px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Giới tính',
      dataIndex: 'gender',
      width: 100,
      render: (text: string) => {
        const _name = checkGender(text)?.toLocaleUpperCase();
        return (
          <Tag color={_name === 'THẠC SĨ' ? 'green' : 'red'} key={checkGender(text)}>
            <div className={cls('text_colum')} style={{ maxHeight: '160px' }}>
              {_name}
            </div>
          </Tag>
        );
      },
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: 120,
      render: (text: string) => (
        <div className={cls('text_colum')} style={{ maxHeight: '60px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 150,
      render: (text: string) => (
        <div className={cls('text_colum')} style={{ maxHeight: '60px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
  ];

  const renderInfoForStudent = useMemo(() => {
    return (
      <>
        <Spin spinning={loading}>
          <Skeleton active paragraph={{ rows: 5 }} loading={loadingDetail}>
            <Row justify={'start'} align={'middle'} style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <p className={cls('title_info_lecturer')}>Mã nhóm:</p>
              </Col>
              <Col span={12}>
                <h4 className={cls('name_group')}>{groupStudent?.id}</h4>
              </Col>
            </Row>
            <Row justify={'start'} align={'middle'} style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <p className={cls('title_info_lecturer')}>Tên nhóm :</p>
              </Col>
              <Col span={12}>
                <h4 className={cls('name_group')}>{groupStudent?.name}</h4>
              </Col>
            </Row>

            <Table
              dataSource={groupStudent?.members.map((value) => {
                return {
                  id: value?.student.id,
                  username: value?.student.username,
                  name: value?.student.name,
                  gender: value?.student.gender,

                  email: value?.student.email,
                  phoneNumber: value?.student.phoneNumber,
                };
              })}
              columns={columnsLecturer}
              pagination={{ pageSize: 7 }}
            />
          </Skeleton>
        </Spin>
      </>
    );
  }, [groupStudent, loading, loadingDetail]);

  const handleChangeSelectedOption = (value: any) => {
    const _data = listAssign.filter((i) => i.status === value.value);
    setData(_data);
  };

  return (
    <>
      <div className={cls('list_evaluation')}>
        <div className={cls('info')}>
          <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
            <Col span={10}>
              <Row justify={'space-between'} align={'middle'} style={{ width: '100%' }}>
                <Col className={cls('select')}>
                  <div>Chọn tình trạng nhóm: </div>
                </Col>
                <Col>
                  <div style={{ width: '150px' }}>
                    <Select
                      placeholder={'Tất cả'}
                      onChange={handleChangeSelectedOption}
                      options={[
                        { value: 'OPEN', label: 'Nhóm mới tạo' },
                        { value: 'FAIL_ADVISOR', label: 'Rớt hướng dẫn' },
                        { value: 'FAIL_REVIEWER', label: 'Rớt phản biện' },
                        { value: 'FAIL_SESSION_HOST', label: 'Rớt hội đồng' },
                        { value: 'PASS_ADVISOR', label: 'Đậu hướng dẫn' },
                        { value: 'PASS_REVIEWER', label: 'Đậu phản biện' },
                        { value: 'PASS_SESSION_HOST', label: 'Đậu hội dồng' },
                      ]}
                    />
                  </div>
                </Col>
                <Col>
                  <Button
                    type="dashed"
                    size="large"
                    style={{
                      margin: '0 10px',
                      animation: 'none',
                      color: 'rgb(80, 72, 229)',
                    }}
                    onClick={() => setData(listAssign)}
                  >
                    Tất cả
                  </Button>
                </Col>
                {/* <Col span={20}><h3 className={cls('title_group_left')}>Danh sách nhóm đang quản lý</h3></Col> */}
              </Row>

              <div className={cls('left')}>{renderTable}</div>
            </Col>
            <Col span={14}>
              <div className={cls('right')}>
                <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
                  <Col span={24}>
                    <div className={cls('title_group')}>Thành viên nhóm</div>
                    {renderInfoForStudent}
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
export default GradingAssigment;

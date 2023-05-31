import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styled from './GroupAdvisor.module.scss';
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
import { BookOutlined, EditOutlined, ExportOutlined, SnippetsOutlined } from '@ant-design/icons';
import Select from 'react-select';
import { TypeEvalution } from '../../entities/assign';

import AssignAdvisor from 'src/entities/assign_advisor';
import AssignAdvisorOfLecturer from 'src/entities/assign_advisor';
import { checkDegree, checkGender, getStatusGroup, getStatusGroupColor } from 'src/constant';

import { ColumnsType } from 'antd/es/table';

import studentService from 'src/services/student';
import TranscriptSumMary from 'src/entities/transcript';

import TruncatedText from '../topic_management/TruncatedText';
import Topic from 'src/entities/topic';
import topicService from 'src/services/topic';

const cls = classNames.bind(styled);
const { Text } = Typography;

interface Filter {
  value: number;
  label: string;
}

const GroupAdvisor = () => {
  const [listAssign, setListAssign] = useState<Array<AssignAdvisor>>([]);
  const [data, setData] = useState<Array<AssignAdvisor>>([]);
  // const [loading, setLoading] = useState(true);
  const [typeEvalution, setTypeEvalution] = useState<TypeEvalution>(TypeEvalution.ADVISOR);
  const termState = useAppSelector((state) => state.term);
  const user = useAppSelector((state) => state.user.user);
  const [isShow, setIssShow] = useState(false);
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(true);
  const [transcriptsSummary, setTranscriptsSummary] = useState<TranscriptSumMary>();
  const [topic, setTopic] = useState<Array<Topic>>([]);
  const [listTopic, setListTopic] = useState<Array<Filter>>([]);

  useEffect(() => {
    if (termState.term.length > 0) {
      assignService
        .getAssignByTypeAdvisor(user.id, { typeEvaluation: TypeEvalution.ADVISOR })

        .then((result) => {
          const _data = result.data.map((value: AssignAdvisor, index: number) => {
            return {
              group: value.group,

              key: index,
              id: value.id,
              name: value.group.name,
              status: value.group.status,
              member: value.group.members,
              topic: value.group.topic,
              groupOfLecturer: value.groupLecturer.members,
            };
          });

          setListAssign(_data);

          setData(_data);

          const listTopicOfGroups = result.data.map((value: AssignAdvisor) => {
            return value.group.topic;
          });

          const _dataListTopic: Filter[] = listTopicOfGroups.reduce(
            (accumulator: { value: number; label: string }[], current: { id: number; name: string }) => {
              const existingItem = accumulator.find((item) => item.value === current.id);
              if (!existingItem) {
                accumulator.push({ value: current.id, label: current.name });
              }
              return accumulator;
            },
            [],
          );
          setListTopic(_dataListTopic);
        })
        .catch((error) => {
          console.log('getlist -> error', error);
        });
    }
  }, [termState]);

  // useEffect(() => {
  //   getListOfTopic();
  // }, [topic]);

  const baseColumns: ColumnsType<AssignAdvisorOfLecturer> = [
    {
      title: 'Mã nhóm',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => {
        const _id = listAssign.filter((i) => i.id === id)[0];

        return <div className={cls('text_colum')}>{_id.group.id}</div>;
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
      title: 'Tên đề tài',
      dataIndex: 'topic',
      key: 'topic',
      fixed: 'left',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto', fontWeight: '500' }}>
          {text.name}
        </div>
      ),
    },
    {
      title: '',
      dataIndex: 'topic',
      key: 'topic',
      width: 100,
      render: (topic) => {
        return (
          <Space wrap>
            <Tooltip title="Xem chi tiết đề tài" color={'geekblue'}>
              <TruncatedText id={topic.id} topicInfo={topic} topicfromDetail={true} />
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  const handleClseShow = () => {
    setIssShow(false);
    setData(listAssign);
  };

  const handleGetInfoStudent = (id: number) => {
    getTranscriptByStudent(id);
  };

  const viewMember = (id: number) => {
    setIssShow(true);
    const data = listAssign.filter((value) => id === value.id)[0];

    const studentTable = data.member.map((i) => {
      return { username: i.student.username, name: i.student.name, id: i.student.id };
    });

    const studenColum = [
      {
        title: 'Mã sinh viên',
        dataIndex: 'username',
        key: 'username',
        width: 100,
        render: (text: string) => {
          return <div className={cls('text_colum')}>{text}</div>;
        },
      },
      {
        title: 'Tên ',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => {
          return <div className={cls('text_colum')}>{text}</div>;
        },
      },
      {
        title: '',
        dataIndex: 'id',
        width: 100,
        render: (id: any) => (
          <Button onClick={() => handleGetInfoStudent(id)}>
            <EditOutlined style={{ color: 'blue' }} />
          </Button>
        ),
      },
    ];
    return (
      <>
        <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
          <Col span={6}>
            <div className={cls('member')}>Thành viên: </div>
          </Col>

          <Col span={18}>
            <Table pagination={false} columns={studenColum} dataSource={studentTable} />
          </Col>
        </Row>
      </>
    );
  };

  const renderTable = useMemo(() => {
    return (
      <Table
        columns={baseColumns}
        expandable={{
          expandedRowRender: (i) => <p style={{ margin: 0 }}>{viewMember(i.id)}</p>,
          rowExpandable: (record) => record.name !== 'Not Expandable',
          expandRowByClick: false,
        }}
        pagination={{ pageSize: 7 }}
        dataSource={data}
      />
    );
  }, [data, listAssign, listTopic]);

  const handlerChangeType = (props: any) => {
    setTypeEvalution(props.target.value);
  };

  const getTranscriptByStudent = (_id: number) => {
    setLoadingTranscript(true);
    studentService
      .getTranscriptsSummary(_id, termState.termIndex.id)
      .then((result) => {
        setLoadingTranscript(false);
        setLoadingDetail(false);
        setTranscriptsSummary(result.data);
      })
      .catch((er) => console.log('er', er));
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
  const getAvgByType = () => {
    switch (typeEvalution) {
      case 'ADVISOR':
        return transcriptsSummary?.ADVISOR?.avgGrader ? transcriptsSummary?.ADVISOR?.avgGrader : 'Chưa có điểm';
      case 'REVIEWER':
        return transcriptsSummary?.REVIEWER?.avgGrader ? transcriptsSummary?.REVIEWER?.avgGrader : 'Chưa có điểm';
      case 'SESSION_HOST':
        return transcriptsSummary?.SESSION_HOST?.avgGrader ? transcriptsSummary?.SESSION_HOST?.avgGrader : 'Chưa có điểm';
    }
  };
  const getDatabyType = () => {
    switch (typeEvalution) {
      case 'ADVISOR':
        return transcriptsSummary?.ADVISOR?.details;
      case 'REVIEWER':
        return transcriptsSummary?.REVIEWER?.details;
      case 'SESSION_HOST':
        return transcriptsSummary?.SESSION_HOST?.details;
    }
  };

  const renderInfoForStudent = useMemo(() => {
    const student = transcriptsSummary?.student;

    const STUDENT = [
      {
        lable: 'MSSV',
        value: student?.username,
      },
      {
        lable: 'Tên',
        value: student?.name,
      },
      {
        lable: 'Email',
        value: student?.email,
      },
      {
        lable: 'Số điện thoại',
        value: student?.phoneNumber,
      },
      {
        lable: 'Giới tính',
        value: checkGender(String(student?.gender)),
      },
    ];

    const columnsLecturer: ColumnsType<any> = [
      {
        title: 'Mã GV',
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
        title: 'Tên GV',
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
        title: 'Trình độ',
        dataIndex: 'degree',
        width: 100,
        render: (text: string) => {
          const _name = checkDegree(text)?.toLocaleUpperCase();
          return (
            <Tag color={_name === 'THẠC SĨ' ? 'green' : 'red'} key={checkDegree(text)}>
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

    const tableOfLecturer = () => {
      return (
        <>
          <Table
            dataSource={getDatabyType()?.map((value) => {
              return {
                id: value?.lecturer?.id,
                username: value?.lecturer?.username,
                name: value?.lecturer?.name,
                degree: value?.lecturer?.degree,
                gender: value?.lecturer?.gender,
                email: value?.lecturer?.email,
                phoneNumber: value?.lecturer?.phoneNumber,
                role: value?.lecturer?.role,
              };
            })}
            columns={columnsLecturer}
            scroll={{ x: 400, y: 290 }}
          />
        </>
      );
    };
    return (
      <>
        <Spin spinning={loadingTranscript}>
          <Skeleton active paragraph={{ rows: 5 }} loading={loadingDetail}>
            <Row gutter={[16, 16]} align={'middle'} justify={'center'} style={{ marginTop: '5px' }}>
              {STUDENT.map((item) => {
                return (
                  <>
                    <Col span={12}>
                      <Text style={{ fontSize: '16px', fontWeight: '600', color: '#264653', paddingRight: '10px' }}>{item.lable}: </Text>
                      <Text style={{ fontSize: '16px', fontWeight: '600', color: '#1976d2' }}>{item.value}</Text>
                    </Col>
                  </>
                );
              })}
            </Row>

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
            <Divider className={cls('title_point')} plain>
              Bảng điểm
            </Divider>
            <Row gutter={[16, 16]} align={'middle'} justify={'center'} style={{ marginTop: '5px', marginBottom: '10px' }}>
              <Col span={8}>
                <div className={cls('title_point')} style={{ marginBottom: '5px' }}>
                  Điểm trung bình
                </div>
              </Col>
              <Col span={8}>
                <div
                  className={cls('title_point')}
                  style={{ color: getAvgByType()?.toString().toLocaleLowerCase() === 'Chưa có điểm'.toLocaleLowerCase() ? 'red' : 'blue' }}
                >
                  {getAvgByType()}
                </div>
              </Col>
            </Row>

            <div className={cls('group_content')}>{tableOfLecturer()}</div>
          </Skeleton>
        </Spin>
      </>
    );
  }, [loadingDetail, loadingTranscript, transcriptsSummary, getAvgByType(), typeEvalution]);

  const handleSelectChange = (selectedOptionReview: any) => {
    const id = selectedOptionReview.value;

    const m = listAssign.filter((value) => value.topic?.id === id);
    setData(m);
  };

  return (
    <>
      <div className={cls('list_evaluation')}>
        <div className={cls('info')}>
          <h3 className={cls('title_group_left')}>Danh sách nhóm đang quản lý</h3>
          <Row justify={'space-between'} align={'middle'} style={{ width: '100%', padding: '10px' }}>
            <Col>
              <div className={cls('name')}>Chọn đề tài:</div>
            </Col>
            <Col>
              <Row justify={'start'} align={'middle'} style={{ width: '100%' }}>
                <Col span={24}>
                  <div className={cls('selectItem')} style={{ width: '300px', zIndex: 999, position: 'relative' }}>
                    <Select
                      placeholder={'Tất cả'}
                      onChange={handleSelectChange}
                      options={listTopic.map((val) => {
                        return {
                          value: val.value,
                          label: val.label,
                        };
                      })}
                    />
                  </div>
                </Col>
              </Row>
            </Col>
            <Col>
              {' '}
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
          </Row>
          <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
            <Col span={12}>
              <div className={cls('left')}>{renderTable}</div>
            </Col>
            <Col span={12}>
              <div className={cls('right')}>
                <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
                  <Col span={24}>
                    <div className={cls('title_group_member')}>Thông tin chi tiết từng thành viên</div>
                    {renderInfoForStudent}
                  </Col>
                </Row>
                {/* <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
                  <h3 className={cls('title_group_right')}>Nhóm Hội đồng - Hội đồng</h3>
                  <Col span={24}> {renderGroupLecturer}</Col>
                </Row> */}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
export default GroupAdvisor;

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import style from './GroupDetail.module.scss';
import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Dropdown,
  Form,
  MenuProps,
  Row,
  Skeleton,
  Space,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { useParams } from 'react-router-dom';
import studentService from '../../services/student';
import GroupStudent from '../../entities/group_student';
import topicService from '../../services/topic';
import Topic from '../../entities/topic';
import Teacher from '../../entities/teacher';
import GroupLecturer from '../group_lecturer/GroupLecturer';
import lecturerService from '../../services/lecturer';
import groupService from '../../services/group';
import { useAppSelector } from '../../redux/hooks';
import { ToastContainer } from 'react-toastify';
import {
  ErrorCodeDefine,
  checkDegree,
  checkGender,
  getStatusGroup,
  getStatusGroupColor,
  showMessage,
  showMessageEror,
} from '../../constant';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { AiOutlineBars, AiOutlineUser } from 'react-icons/ai';
import { BiGroup } from 'react-icons/bi';
import { MdOutlineTopic } from 'react-icons/md';
import Select, { StylesConfig } from 'react-select';
import { type, userInfo } from 'os';
import { TypeEvalution } from 'src/entities/assign';
import TruncatedText from '../topic_management/TruncatedText';
import { checkDisableButton } from '../../constant';
import { group } from 'console';

const cls = classNames.bind(style);

interface SelectOption {
  value: number;
  lable: string;
}
interface SelectOptionTypeReport {
  value: string;
  label: string;
}
const optionsTypeReport: SelectOptionTypeReport[] = [
  { value: 'OPEN', label: 'Chưa xác định' },
  { value: 'POSTER', label: 'Poster' },
  { value: 'SESSION_HOST', label: 'Báo cáo hội động' },
];

const { Text } = Typography;

const GroupDetail = () => {
  const { id } = useParams();
  const [inforGroup, setInfoGroup] = useState<GroupStudent>();
  const [topic, setTopic] = useState<Topic>();
  const [lecturer, setLecturer] = useState<Teacher>();
  const [loading, setLoading] = useState(true);
  const [groupLecturerReview, setGroupLecturerReview] = useState<Array<GroupLecturer>>([]);
  const [groupLecturerHost, setGroupLecturerHost] = useState<Array<GroupLecturer>>([]);

  const [status, setStatus] = useState('insert');
  const [statusHost, setStatusHost] = useState('insert');
  const [idGroupReview, setIdGroupReview] = useState<number | null>(null);
  const [idGroupHost, setIdGroupHost] = useState<number | null>(null);
  const { user } = useAppSelector((state) => state.user);

  const [initData, setInitData] = useState<{
    typeEvaluation: string;
    groupLecturerId: number;
    groupId: number;
  }>({ typeEvaluation: '', groupLecturerId: NaN, groupId: NaN });

  const [initDataHost, setInitDataHost] = useState<{
    typeEvaluation: string;
    groupLecturerId: number;
    groupId: number;
  }>({ typeEvaluation: '', groupLecturerId: NaN, groupId: NaN });

  const [infoReview, setInfoReview] = useState<GroupLecturer>();
  const [infoHost, setInfoHost] = useState<GroupLecturer>();

  const termState = useAppSelector((state) => state.term);

  const [warmingLecturerReview, setWarmingLecturerReview] = useState(false);
  const [warmingLecturerHost, setWarmingLecturerHost] = useState(false);

  const [idReview, setIdReview] = useState<SelectOption>();
  const [idHost, setIdHost] = useState<SelectOption>();
  const [typeReport, setTypeReport] = useState<SelectOptionTypeReport>(optionsTypeReport[0]);

  const handleSelectChangeReview = (selectedOptionReview: any) => {
    const id = selectedOptionReview.value;
    const t = groupLecturerReview.filter((item) => item.id === Number(id))[0];
    t.members.map((i) => {
      if (i.lecturer.id === lecturer?.id) {
        setWarmingLecturerReview(true);
      } else {
        setWarmingLecturerReview(false);
      }
    });
    setInfoReview(t);
    setIdReview(id);
  };
  const handleSelectTypeReport = (option: any) => {
    setTypeReport(option);
  };

  const handleSelectChangeHost = (selectedOptionHost: any) => {
    const id = selectedOptionHost.value;
    setIdHost(id);
    const t = groupLecturerHost.filter((item) => item.id === Number(id))[0];
    t.members.map((i) => {
      if (i.lecturer.id === lecturer?.id) {
        setWarmingLecturerHost(true);
      } else {
        setWarmingLecturerHost(false);
      }
    });
    setInfoHost(t);
  };

  useEffect(() => {
    const idGroup = Number(id);

    if (termState.term.length > 0) {
      studentService
        .getGroupStudentByID(Number(idGroup))
        .then((result) => {
          setLoading(false);
          setInfoGroup(result.data);

          getTopic(result.data?.topic?.id);
          const option = optionsTypeReport.find((option) => option.value == result.data.typeReport);
          setTypeReport(option ? option : optionsTypeReport[0]);
        })
        .catch((errr) => console.log('erre', errr));

      getGroupReviewApi(idGroup);
      getGroupHostApi(idGroup);
    }
  }, [termState]);

  const getGroupReviewApi = (idGroup: number) => {
    studentService
      .getGroupLecturerOfStudentByType(Number(idGroup), termState.termIndex.id, 'REVIEWER')
      .then((resutl) => {
        setInfoReview(resutl?.data?.[0]?.groupLecturer);

        if (resutl?.data?.[0]?.groupLecturer?.id !== undefined) {
          setStatus('update');
        }
      })
      .catch((error) => console.log('error REVIEWER', error));
  };

  const getGroupHostApi = (idGroup: number) => {
    studentService
      .getGroupLecturerOfStudentByType(Number(idGroup), termState.termIndex.id, 'SESSION_HOST')
      .then((resutl) => {
        setInfoHost(resutl?.data?.[0]?.groupLecturer);
        if (resutl?.data?.[0]?.groupLecturer?.id !== undefined) {
          setStatusHost('update');
        }
      })
      .catch((error) => console.log('error SESSION_HOST', error));
  };

  const getTopic = (id: number) => {
    if (id) {
      topicService
        .getTopicById(id)
        .then((result) => {
          setTopic(result.data);
          setLecturer(result.data?.lecturer);
        })
        .catch((errr) => console.log('erre', errr));
    }
  };

  useEffect(() => {
    if (termState.term.length > 0) {
      lecturerService
        .getGroupLecturersDetail({ termId: termState.termIndex.id, type: TypeEvalution.REVIEWER })
        .then((resutl) => {
          setGroupLecturerReview(resutl?.data);
        })
        .catch((er) => console.log('getGroupLecturersDetail REVIEW', er));
      lecturerService
        .getGroupLecturersDetail({ termId: termState.termIndex.id, type: TypeEvalution.SESSION_HOST })
        .then((resutl) => {
          setGroupLecturerHost(resutl?.data);
        })
        .catch((er) => console.log('getGroupLecturersDetail Host', er));
    }
  }, [termState]);

  const onFinishChosseTypeReport = () => {
    const idGroup = id;
    groupService
      .updateTypeReport(Number(idGroup), typeReport.value)
      .then((resutl) => {
        showMessage('Cập nhật thành công', 3000);
      })
      .catch((er) => console.log('getGroupLecturersDetail Host', er));
  };

  const onFinishChosseGroupReview = (value: { typeEvaluation: string; groupId: number }) => {
    const idGroup = id;

    if (status === 'insert') {
      lecturerService
        .createAssignGroupLecturer({
          ...value,
          typeEvaluation: 'REVIEWER',
          groupLecturerId: Number(idReview),
          groupId: Number(idGroup),
        })
        .then((result) => {
          setStatus('update');
          setIdGroupReview(result?.data?.id);
          showMessage('Đã gắn nhóm thành công', 3000);
          getGroupReviewApi(Number(idGroup));
        })
        .catch((error) => {
          console.log(error);
          showMessageEror(ErrorCodeDefine[error.response.data.code].message, 3000);
        });
    } else {
      console.log(idGroupReview);

      lecturerService
        .createAssignGroupLecturer({
          ...value,
          typeEvaluation: 'REVIEWER',
          groupLecturerId: Number(idReview),
          groupId: Number(idGroup),
        })
        .then((result) => {
          showMessage('Cập nhật thành công', 3000);
          getGroupReviewApi(Number(idGroup));
        })
        .catch((error) => {
          showMessageEror(ErrorCodeDefine[error.response.data.code].message, 3000);
        });
    }
  };

  const onFinishChosseGroupSessionHost = (value: { typeEvaluation: string; groupId: number }) => {
    const idGroup = id;

    if (statusHost === 'insert') {
      lecturerService
        .createAssignGroupLecturer({
          ...value,
          typeEvaluation: 'SESSION_HOST',
          groupLecturerId: Number(idHost),
          groupId: Number(idGroup),
        })
        .then((result) => {
          showMessage('Đã gắn nhóm thành công', 3000);
          setStatusHost('update');
          setIdGroupHost(result?.data?.id);
        })
        .catch((error) => {
          console.log(error);
          showMessageEror(ErrorCodeDefine[error.response.data.code].message, 3000);
        });
    } else {
      lecturerService
        .createAssignGroupLecturer({
          ...value,
          typeEvaluation: 'SESSION_HOST',
          groupLecturerId: Number(idHost),
          groupId: Number(idGroup),
        })
        .then((result) => {
          showMessage('Cập nhật thành công', 3000);
        })
        .catch((error) => {
          console.log('error', error);

          showMessageEror(ErrorCodeDefine[error.response.data.code].message, 3000);
        });
    }
  };

  const genderMemberForGroup = useMemo(() => {
    if (inforGroup) {
      const member = inforGroup?.members?.length;
      if (member > 0)
        return (
          <>
            {inforGroup?.members?.map((i, index) => {
              const items: MenuProps['items'] = [
                {
                  label: 'Mã SV: ' + i?.student?.username,
                  key: 1,
                },
                {
                  label: 'Giới tính: ' + `${checkGender(i?.student?.gender)}`,
                  key: 2,
                },
              ];
              return (
                <div key={index} title="" className={cls('item_name')}>
                  <Dropdown menu={{ items }}>
                    <p onClick={(e) => e.preventDefault()}>
                      <Space>
                        <div className={cls('member')}>
                          <AiOutlineUser />
                        </div>
                        <div className={cls('member')}>{i?.student?.name}</div>
                        <DownOutlined />
                      </Space>
                    </p>
                  </Dropdown>
                </div>
              );
            })}
          </>
        );
      else
        return (
          <div style={{ width: '90%' }}>
            <Badge.Ribbon text="Không có sinh viên" color="red"></Badge.Ribbon>
          </div>
        );
    }
  }, [inforGroup?.members?.length]);

  const renderTopic = useMemo(() => {
    if (topic)
      return (
        <>
          <div className={cls('_lable')} style={{ paddingBottom: '10px' }}>
            <AiOutlineBars style={{ fontSize: '24px', alignItems: 'center', marginRight: '20px' }} /> {topic?.name}
          </div>
          <Space>
            <div className={cls('member')}>
              <TruncatedText id={topic.id} topicInfo={topic} topicfromDetail={true} />
            </div>
          </Space>
        </>
      );
    else
      return (
        <div style={{ width: '100%' }}>
          <Badge.Ribbon text=" Nhóm chưa có đề tài" color="red"></Badge.Ribbon>
        </div>
      );
  }, [topic]);

  const renderLecturerForGroup = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        label: 'Mã GV: ' + lecturer?.username,
        key: 1,
      },

      {
        label: 'Trình độ:  ' + `${checkDegree(String(lecturer?.degree))}`,
        key: 2,
      },
    ];

    if (lecturer)
      return (
        <Dropdown menu={{ items }} className={cls('item_name')}>
          <Col span={10}>
            <p onClick={(e) => e.preventDefault()}>
              <Space>
                <div className={cls('member')}>
                  <AiOutlineUser />
                </div>
                <div className={cls('member')}>{lecturer?.name}</div>
                <DownOutlined />
              </Space>
            </p>
          </Col>
        </Dropdown>
      );
    else
      return (
        <div style={{ width: '100%' }}>
          <Badge.Ribbon text="Nhóm chưa có Giảng viên hướng dẫn" color="red"></Badge.Ribbon>
        </div>
      );
  }, [lecturer]);

  const renderFormAssignReview = useMemo(() => {
    return (
      <>
        <Form
          layout="vertical"
          onFinish={onFinishChosseGroupReview}
          initialValues={status === 'insert' ? {} : initData}
          style={{ maxWidth: 600 }}
        >
          <Row>
            <Col span={18}>
              <Form.Item label="" rules={[{ required: true }]}>
                <Select
                  onChange={handleSelectChangeReview}
                  placeholder={infoReview?.name ? infoReview?.name : 'Chọn nhóm Hội đồng'}
                  options={groupLecturerReview.map((val) => {
                    let me = '';
                    if (val.id === user.id) {
                      me = '(Bạn)';
                    }
                    return {
                      value: val.id,
                      label: `${val.name} ${me}`,
                    };
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item wrapperCol={{ span: 24 }}>
                <Row justify={'end'} style={{ bottom: '0px' }}>
                  <Col>
                    <Tooltip title={getStatusGroup(String(inforGroup?.status))} color={getStatusGroupColor(String(inforGroup?.status))}>
                      <Button disabled={checkDisableButton(String(inforGroup?.status))} type="primary" htmlType="submit">
                        Cập nhật
                      </Button>
                    </Tooltip>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {infoReview?.name ? (
          <>
            <Row gutter={[16, 24]} style={{ width: '100%' }}>
              <Col span={8}>
                <Text strong className={cls('title')}>
                  Tên nhóm:
                </Text>
              </Col>
              <Col span={16}>
                <Text strong className={cls('_name')}>
                  {infoReview?.name}
                </Text>
              </Col>
            </Row>

            <Row justify={'start'} align={'top'} style={{ width: '100%' }}>
              <div className={cls('group_name')}>
                <div className={cls('member')}>Thành viên - Số lượng: {infoReview?.members?.length} </div>
                <div className={cls('item')}>
                  <Col span={24}>
                    {infoReview?.members.map((i, d) => {
                      const items: MenuProps['items'] = [
                        {
                          label: 'Mã GV: ' + i?.lecturer.username,
                          key: 1,
                        },

                        {
                          label: 'Trình độ:  ' + `${checkDegree(String(i?.lecturer?.degree))}`,
                          key: 2,
                        },
                      ];

                      return (
                        <div className={cls('item_name')}>
                          <Dropdown menu={{ items }}>
                            <Col span={10}>
                              <p onClick={(e) => e.preventDefault()}>
                                <Space>
                                  <Text className={cls('_item')}>{i?.lecturer?.name}</Text>
                                  <InfoCircleOutlined />
                                </Space>
                              </p>
                            </Col>
                          </Dropdown>
                        </div>
                      );
                    })}
                  </Col>
                </div>
              </div>
            </Row>
            {warmingLecturerReview === true && (
              <Text mark type="danger" className={cls('title')}>
                Nhóm có giảng viên là giảng viên hướng dẫn
              </Text>
            )}
          </>
        ) : (
          <Row gutter={[16, 24]} style={{ width: '100%', marginBottom: '10px' }}>
            <Col span={24}>
              <Text strong className={cls('_name')}>
                Chưa có nhóm
              </Text>
            </Col>
          </Row>
        )}
      </>
    );
  }, [status, groupLecturerReview, handleSelectChangeReview, infoReview]);

  const renderFormAssignSessionHost = useMemo(() => {
    return (
      <>
        <Form
          layout="vertical"
          onFinish={onFinishChosseGroupSessionHost}
          initialValues={statusHost === 'insert' ? {} : initDataHost}
          style={{ maxWidth: 600 }}
        >
          <Row>
            <Col span={18}>
              <Form.Item label="" rules={[{ required: true }]}>
                <Select
                  onChange={handleSelectChangeHost}
                  placeholder={infoHost?.name ? infoHost?.name : 'Chọn nhóm Hội đồng'}
                  options={groupLecturerHost.map((val) => {
                    let me = '';
                    if (val.id === user.id) {
                      me = '(Bạn)';
                    }
                    return {
                      value: val.id,
                      label: `${val.name} ${me} `,
                    };
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item wrapperCol={{ span: 24 }}>
                <Row justify={'end'} style={{ bottom: '0px' }}>
                  <Col>
                    <Space wrap>
                      <Tooltip title={getStatusGroup(String(inforGroup?.status))} color={getStatusGroupColor(String(inforGroup?.status))}>
                        <Button disabled={checkDisableButton(String(inforGroup?.status))} type="primary" htmlType="submit">
                          Cập nhật
                        </Button>
                      </Tooltip>
                    </Space>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        {infoHost?.name ? (
          <>
            <Row gutter={[16, 24]} style={{ width: '100%' }}>
              <Col span={8}>
                <Text strong className={cls('title')}>
                  Tên nhóm:
                </Text>
              </Col>
              <Col span={16}>
                <Text strong className={cls('_name')}>
                  {infoHost?.name}
                </Text>
              </Col>
            </Row>

            <Row justify={'start'} align={'top'} style={{ width: '100%' }}>
              <div className={cls('group_name')}>
                <div className={cls('member')}>Thành viên - Số lượng: {infoHost?.members?.length} </div>
                <div className={cls('item')}>
                  <Col span={24}>
                    {infoHost?.members.map((i, d) => {
                      const items: MenuProps['items'] = [
                        {
                          label: 'Mã GV: ' + i?.lecturer.username,
                          key: 1,
                        },

                        {
                          label: 'Trình độ:  ' + `${checkDegree(String(i?.lecturer?.degree))}`,
                          key: 2,
                        },
                      ];

                      return (
                        <div className={cls('item_name')}>
                          <Dropdown menu={{ items }}>
                            <Col span={10}>
                              <p onClick={(e) => e.preventDefault()}>
                                <Space>
                                  <Text className={cls('_item')}>{i?.lecturer?.name}</Text>
                                  <InfoCircleOutlined />
                                </Space>
                              </p>
                            </Col>
                          </Dropdown>
                        </div>
                      );
                    })}
                  </Col>
                </div>
              </div>
            </Row>
            {warmingLecturerHost === true && (
              <Text mark type="danger" className={cls('title')}>
                Nhóm có giảng viên là giảng viên hướng dẫn
              </Text>
            )}
          </>
        ) : (
          <Row gutter={[16, 24]} style={{ width: '100%', marginBottom: '10px' }}>
            <Col span={24}>
              <Text strong className={cls('_name')}>
                Chưa có nhóm
              </Text>
            </Col>
          </Row>
        )}
      </>
    );
  }, [statusHost, groupLecturerHost, handleSelectChangeHost, infoHost]);

  const renderFormTypeReport = useMemo(() => {
    return (
      <>
        {infoHost?.id ? (
          <Form layout="vertical" onFinish={onFinishChosseTypeReport} style={{ maxWidth: 600 }}>
            <Row>
              <Col span={18}>
                <Form.Item label="" rules={[{ required: true }]}>
                  <Select
                    onChange={handleSelectTypeReport}
                    placeholder={'Chọn loại báo cáo'}
                    options={optionsTypeReport}
                    value={typeReport}
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Row justify={'end'} style={{ bottom: '0px' }}>
                    <Col>
                      <Space wrap>
                        <Tooltip title={getStatusGroup(String(inforGroup?.status))} color={getStatusGroupColor(String(inforGroup?.status))}>
                          <Button disabled={checkDisableButton(String(inforGroup?.status))} type="primary" htmlType="submit">
                            Cập nhật
                          </Button>
                        </Tooltip>
                      </Space>
                    </Col>
                  </Row>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ) : null}
      </>
    );
  }, [statusHost, groupLecturerHost, handleSelectChangeHost, infoHost]);
  const color = getStatusGroupColor(String(inforGroup?.status));
  return (
    <div className={cls('group_detail')}>
      <ToastContainer />
      <Skeleton loading={loading} avatar active>
        <Badge.Ribbon>
          <Card
            title={
              <Descriptions title="">
                <Descriptions.Item label={''}>
                  <Row justify={'start'} align={'middle'} style={{ width: '100%' }}>
                    <Col>
                      <div className={cls('group_name')}>Tên nhóm: </div>
                    </Col>
                    <Col>
                      <div className={cls('_name')}>{inforGroup?.name}</div>
                    </Col>
                  </Row>
                  <Row justify={'end'} align={'middle'} style={{ width: '100%' }}>
                    <Col>
                      <div className={cls('group_status')}>Tình trạng: </div>
                    </Col>
                    <Col>
                      <div className={cls('_name_status')}>
                        <Tag color={color}>
                          <div style={{ color: color, fontSize: '16px' }}>{getStatusGroup(String(inforGroup?.status))}</div>
                        </Tag>
                      </div>
                    </Col>
                  </Row>
                </Descriptions.Item>
              </Descriptions>
            }
            size="default"
          >
            <Row justify={'center'} align={'top'} className={cls('group_member')}>
              <Col span={8} offset={2}>
                <div className={cls('student_lable')}>
                  <BiGroup style={{ fontSize: '24px', alignItems: 'center' }} /> Thành viên
                </div>
              </Col>
              <Col span={14} style={{ overflowY: 'auto', height: '88px' }}>
                {genderMemberForGroup}
              </Col>
            </Row>

            <Divider plain></Divider>

            <Row justify={'center'} align={'top'} className={cls('topic_content')}>
              <Col span={8} offset={2}>
                <div className={cls('_topic')}>
                  <MdOutlineTopic style={{ fontSize: '24px', alignItems: 'center' }} /> Đề tài
                </div>
              </Col>
              <Col span={14}> {renderTopic} </Col>
            </Row>

            <Divider plain></Divider>

            <Row justify={'center'} align={'top'} className={cls('lecturer')}>
              <Col span={8} offset={2}>
                <div className={cls('_topic')}>
                  <BiGroup style={{ fontSize: '24px', alignItems: 'center' }} /> Giảng viên hướng dẫn
                </div>
              </Col>
              <Col span={14}>{renderLecturerForGroup}</Col>
            </Row>

            <Row className={cls('lecturer')} justify={'space-between'}>
              <Col span={12}>
                <Card
                  title={<div className={cls('_title')}>Nhóm hội đồng chấm 'PHẢN BIỆN'</div>}
                  bordered={false}
                  style={{ height: '100%' }}
                >
                  {renderFormAssignReview}
                </Card>
              </Col>
              <Col span={12}>
                <Card title={<div className={cls('_title')}>Nhóm hội đồng chấm 'HỘI ĐỒNG'</div>} bordered={false}>
                  {renderFormAssignSessionHost}
                </Card>
                <Card title={<div className={cls('_title')}>Loại báo cáo</div>} bordered={false}>
                  {renderFormTypeReport}
                </Card>
              </Col>
            </Row>
          </Card>
        </Badge.Ribbon>
      </Skeleton>
    </div>
  );
};

export default GroupDetail;

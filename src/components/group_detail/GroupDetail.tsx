import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import style from './GroupDetail.module.scss';
import { Badge, Button, Card, Col, Descriptions, Divider, Dropdown, Form, MenuProps, Row, Select, Skeleton, Space, Typography } from 'antd';
import { useParams } from 'react-router-dom';
import studentService from '../../services/student';
import GroupStudent from '../../entities/group_student';
import topicService from '../../services/topic';
import Topic from '../../entities/topic';
import Teacher from '../../entities/teacher';
import GroupLecturer from '../group_lecturer/GroupLecturer';
import lecturerService from '../../services/lecturer';
import { useAppSelector } from '../../redux/hooks';
import { ToastContainer } from 'react-toastify';
import { checkDegree, checkGender, showMessage, showMessageEror } from '../../constant';
import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons';


const cls = classNames.bind(style);
interface GroupAssign {
  id: number;
  typeEvaluation: string;
  groupLecturer: {
    id: number;
    name: string;
  };
}

interface NameOfLecturer {
  key: number;
  name: string;
}

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

  const [groupAssignReview, setGroupAssignRieview] = useState<Array<GroupAssign>>([]);
  const [groupAssignSessionHost, setGroupAssignSessionHost] = useState<Array<GroupAssign>>([]);
  const termState = useAppSelector((state) => state.term);
  const [nameOfLecturerReview, setNameOfLecturerReview] = useState<Array<Teacher>>([]);
  const [nameOfLecturerHost, setNameOfLecturerHost] = useState<Array<Teacher>>([]);

  const { Text } = Typography;

  useEffect(() => {
    const idGroup = id;

    if (termState.term.length > 0) {
      studentService
        .getGroupStudentByID(Number(idGroup))
        .then((result) => {
          setLoading(false);
          setInfoGroup(result.data);
          getTopic(result.data?.topic?.id);
        })
        .catch((errr) => console.log('erre', errr));

      studentService
        .getGroupLecturerOfStudentByType(Number(idGroup), termState.termIndex.id, 'REVIEWER')
        .then((resutl) => {
          setGroupAssignRieview(resutl?.data);
        })
        .catch((error) => console.log('error REVIEWER', error));

      studentService
        .getGroupLecturerOfStudentByType(Number(idGroup), termState.termIndex.id, 'SESSION_HOST')
        .then((resutl) => {
          setGroupAssignSessionHost(resutl?.data);
        })
        .catch((error) => console.log('error SESSION_HOST', error));
    }
  }, [termState]);

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

  const handleChangeGroupReview = (value: string) => {
    const t = groupLecturerReview.filter((item) => item.id === Number(value))[0];
    setNameOfLecturerReview(t.members.map((m) => m.lecturer));
  };

  const handleChangeGroupHost = (value: string) => {
    const t = groupLecturerHost.filter((item) => item.id === Number(value))[0];
    setNameOfLecturerHost(t.members.map((m) => m.lecturer));
  };

  useEffect(() => {
    if (termState.term.length > 0) {
      lecturerService
        .getGroupLecturers({ termId: termState.termIndex.id, typeEvaluation: 'REVIEWER' })
        .then((resutl) => {
          setGroupLecturerReview(resutl?.data);
        })
        .catch((er) => console.log('getGroupLecturers REVIEW', er));
      lecturerService
        .getGroupLecturers({ termId: termState.termIndex.id, typeEvaluation: 'SESSION_HOST' })
        .then((resutl) => {
          setGroupLecturerHost(resutl?.data);
        })
        .catch((er) => console.log('getGroupLecturers Host', er));
    }
  }, [termState]);

  useEffect(() => {
    getInfoReview();
  }, [groupAssignReview?.[0]?.groupLecturer?.id, idGroupReview]);

  useEffect(() => {
    getInfoHost();
  }, [groupAssignSessionHost?.[0]?.groupLecturer?.id, idGroupHost]);

  const getInfoReview = () => {
    const groupId = id;
    if (groupAssignReview?.[0]?.groupLecturer?.id) {
      setStatus('update');
      setIdGroupReview(groupAssignReview?.[0]?.id);
      setInitData((prev: any) => {
        const data = {
          ...prev,
          groupId: groupId,
          groupLecturerId: groupAssignReview?.[0]?.groupLecturer?.id,
          typeEvaluation: 'REVIEWER',
        };
        return data;
      });
    }
  };

  const getInfoHost = () => {
    const groupId = id;
    if (groupAssignSessionHost?.[0]?.groupLecturer?.id) {
      setStatusHost('update');
      setIdGroupHost(groupAssignSessionHost?.[0]?.id);
      setInitDataHost((prev: any) => {
        const data = {
          ...prev,
          groupId: groupId,
          groupLecturerId: groupAssignSessionHost?.[0]?.groupLecturer?.id,
          typeEvaluation: 'SESSION_HOST',
        };
        return data;
      });
    }
  };

  const onFinishChosseGroupReview = (value: { typeEvaluation: string; groupLecturerId: number; groupId: number }) => {
    const idGroup = id;
    if (status === 'insert') {
      lecturerService
        .createAssignGroupLecturer({
          ...value,
          typeEvaluation: 'REVIEWER',
          groupLecturerId: value?.groupLecturerId,
          groupId: Number(idGroup),
        })
        .then((result) => {
          setStatus('update');
          setIdGroupReview(result?.data?.id);
          showMessage('Đã gắn nhóm thành công', 3000);
        })
        .catch((error) => {
          console.log(error);
          showMessageEror(error.response.data.error, 3000);
        });
    } else {
      lecturerService
        .updateAssignGroupLecturer(Number(idGroupReview), {
          ...value,
          groupId: Number(idGroup),
          groupLecturerId: value?.groupLecturerId,
          typeEvaluation: 'REVIEWER',
        })
        .then((result) => {
          showMessage('Cập nhật thành công', 3000);
        })
        .catch((error) => {
          showMessageEror(error.response.data.error, 3000);
        });
    }
  };

  const onFinishChosseGroupSessionHost = (value: { typeEvaluation: string; groupLecturerId: number; groupId: number }) => {
    const idGroup = id;
    if (statusHost === 'insert') {
      lecturerService
        .createAssignGroupLecturer({
          ...value,
          typeEvaluation: 'SESSION_HOST',
          groupLecturerId: value?.groupLecturerId,
          groupId: Number(idGroup),
        })
        .then((result) => {
          showMessage('Đã gắn nhóm thành công', 3000);
          setStatusHost('update');
          setIdGroupHost(result?.data?.id);
        })
        .catch((error) => {
          console.log(error);
          showMessageEror(error.response.data.error, 3000);
        });
    } else {
      lecturerService
        .updateAssignGroupLecturer(Number(idGroupHost), {
          ...value,
          groupId: Number(idGroup),
          groupLecturerId: value?.groupLecturerId,
          typeEvaluation: 'SESSION_HOST',
        })
        .then((result) => {
          showMessage('Cập nhật thành công', 3000);
        })
        .catch((error) => {
          showMessageEror(error.response.data.error, 3000);
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
                <Descriptions key={index} title="">
                  <Descriptions.Item label={'Sinh Viên'}>
                    <Dropdown menu={{ items }}>
                      <p onClick={(e) => e.preventDefault()}>
                        <Space>
                          <div className={cls('member')}>{i?.student?.name}</div>
                          <DownOutlined />
                        </Space>
                      </p>
                    </Dropdown>
                  </Descriptions.Item>
                </Descriptions>
              );
            })}
          </>
        );
      else
        return (
          <div style={{ width: '100%' }}>
            <Badge.Ribbon text="Thông báo" color="red">
              <Card title="Sinh viên" size="default">
                Chọn Sinh Viên
              </Card>
            </Badge.Ribbon>
          </div>
        );
    }
  }, [inforGroup?.members?.length]);
  const [open, setOpen] = useState(false);

  const renderTopic = useMemo(() => {
    const items: MenuProps['items'] = [
      {
        label: 'Mô tả: ' + topic?.description,
        key: 1,
      },
      {
        label: 'Yều cầu đầu vào: ' + topic?.requireInput,
        key: 2,
      },
      {
        label: 'Yều cầu đầu ra:  ' + topic?.standradOutput,
        key: 3,
      },
      {
        label: 'Ghi chú: ' + topic?.note,
        key: 4,
      },
    ];

    if (topic)
      return (
        <Row align={'middle'}>
          <Col span={8}>
            <Descriptions title="">
              <Descriptions.Item label={'Tên đề tài'}>
                <div className={cls('member')}>{topic?.name}</div>
              </Descriptions.Item>
            </Descriptions>
          </Col>

          <Col>
            <Dropdown menu={{ items }}>
              <p onClick={(e) => e.preventDefault()}>
                <Space>
                  Chi tiết đề tài
                  <DownOutlined />
                </Space>
              </p>
            </Dropdown>
          </Col>
        </Row>
      );
    else
      return (
        <div style={{ width: '100%' }}>
          <Badge.Ribbon text="Thông báo" color="red">
            <Card title="Đề tài" size="default">
              Nhóm chưa có đề tài
            </Card>
          </Badge.Ribbon>
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
        <Descriptions title="">
          <Descriptions.Item label={'Giảng viên hướng dẫn'}>
            <Dropdown menu={{ items }}>
              <p onClick={(e) => e.preventDefault()}>
                <Space>
                  <div className={cls('member')}>{lecturer?.name}</div>
                  <DownOutlined />
                </Space>
              </p>
            </Dropdown>
          </Descriptions.Item>
        </Descriptions>
      );
    else
      return (
        <div style={{ width: '100%' }}>
          <Badge.Ribbon text="Thông báo" color="red">
            <Card title="Giảng viên " size="default">
              Nhóm chưa có Giảng Viên hướng dẫn
            </Card>
          </Badge.Ribbon>
        </div>
      );
  }, [lecturer]);

  const renderFormAssignReview = useMemo(() => {
    const nameDefault = groupAssignReview?.[0]?.groupLecturer?.name;
    const data = groupLecturerReview.map((value) => {
      return {
        value: value.id,
        label: value.name,
      };
    });

    return (
      <Form
        labelCol={{ span: 14 }}
        wrapperCol={{ span: 24 }}
        layout="horizontal"
        onFinish={onFinishChosseGroupReview}
        initialValues={status === 'insert' ? {} : initData}
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="" rules={[{ required: true }]} name="groupLecturerId">
          <Select
            style={{ width: '100%' }}
            placeholder={nameDefault ? nameDefault : "Chọn Nhóm Giảng Viên chấm 'PHẢN BIỆN'"}
            onChange={(value) => handleChangeGroupReview(value)}
            optionLabelProp="label"
            options={data}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Row justify={'end'} style={{ marginTop: '10px', bottom: 0 }}>
            <Col>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Col>
          </Row>
        </Form.Item>

        <div className={cls('group_of_lecture')}>
          {nameOfLecturerReview.length > 0 ? (
            <>
              <Divider plain className={cls('title')} >
                <Text strong type="secondary" className={cls('title')}>
                  Thông tin nhóm Giảng viên
                </Text>
              </Divider>
              <Row align={'middle'}>
                <Col span={8}>
                  <Text strong className={cls('title_group')}>{`${nameOfLecturerReview.length} Giảng Viên: `}</Text>
                </Col>
                <Col span={16}>

                  {nameOfLecturerReview.map((i) => {
                    const items: MenuProps['items'] = [
                      {
                        label: 'Mã GV: ' + i?.username,
                        key: 1,
                      },

                      {
                        label: 'Trình độ:  ' + `${checkDegree(String(i?.degree))}`,
                        key: 2,
                      },
                    ];
                    return (
                      <Row justify={'space-evenly'}>
                        <Col>
                          <Dropdown menu={{ items }}>
                            <p onClick={(e) => e.preventDefault()}>
                              <Space>
                                <div className={cls('sub_name_group')}>{i?.name}</div>
                                <InfoCircleOutlined />
                              </Space>
                            </p>
                          </Dropdown>
                        </Col>
                      </Row>
                    );
                  })}
                </Col>
              </Row>
            </>
          ) : (
            ''
          )}
        </div>
      </Form>
    );
  }, [status, initData, groupLecturerReview, onFinishChosseGroupReview]);

  const renderFormAssignSessionHost = useMemo(() => {
    const nameDefault = groupAssignSessionHost?.[0]?.groupLecturer?.name;
    const data = groupLecturerHost.map((value) => {
      return {
        value: value.id,
        label: value.name,
      };
    });

    return (
      <Form
        labelCol={{ span: 14 }}
        wrapperCol={{ span: 24 }}
        layout="horizontal"
        onFinish={onFinishChosseGroupSessionHost}
        initialValues={statusHost === 'insert' ? {} : initDataHost}
        style={{ maxWidth: 600 }}
      >
        <Form.Item label="" rules={[{ required: true }]} name="groupLecturerId">
          <Select
            style={{ width: '100%' }}
            placeholder={nameDefault ? nameDefault : "Chọn Nhóm Giảng Viên chấm 'PHẢN BIỆN'"}
            onChange={(value) => handleChangeGroupHost(value)}
            optionLabelProp="label"
            options={data}
          ></Select>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Row justify={'end'} style={{ marginTop: '10px', bottom: 0 }}>
            <Col>
              <Button type="primary" htmlType="submit">
                Cập nhật
              </Button>
            </Col>
          </Row>
        </Form.Item>
        <div className={cls('group_of_lecture')}>


          {nameOfLecturerHost.length > 0 ? (
            <>
              <Divider plain className={cls('title')} >
                <Text strong type="secondary" className={cls('title')}>
                  Thông tin nhóm Giảng viên
                </Text>
              </Divider>
              <Row align={'middle'} >

                <Col span={8}>
                  <Text strong className={cls('title_group')}>{`${nameOfLecturerHost.length} Giảng Viên: `}</Text>
                </Col>
                <Col span={16}>
                  {nameOfLecturerHost.map((i) => {
                    const items: MenuProps['items'] = [
                      {
                        label: 'Mã GV: ' + i?.username,
                        key: 1,
                      },

                      {
                        label: 'Trình độ:  ' + `${checkDegree(String(i?.degree))}`,
                        key: 2,
                      },
                    ];
                    return (
                      <Row justify={'space-evenly'}>
                        <Col>
                          <Dropdown menu={{ items }}>
                            <p onClick={(e) => e.preventDefault()}>
                              <Space>
                                <div className={cls('sub_name_group')}>{i?.name}</div>
                                <InfoCircleOutlined />
                              </Space>
                            </p>
                          </Dropdown>
                        </Col>
                      </Row>
                    );
                  })}</Col>
              </Row>

            </>
          ) : (
            ''
          )}
        </div>
      </Form>
    );
  }, [statusHost, initDataHost, groupLecturerHost, onFinishChosseGroupSessionHost]);

  return (
    <div className={cls('group_detail')}>
      <ToastContainer />

      <Skeleton loading={loading} avatar active>
        <Badge.Ribbon>
          <Card
            title={
              <Descriptions title="">
                <Descriptions.Item label={<div className={cls('group_name')}>Tên nhóm</div>}>
                  <div className={cls('group_name')}>{inforGroup?.name}</div>
                </Descriptions.Item>
              </Descriptions>
            }
            size="default"
          >
            <Divider orientation="right">  <Text type="secondary" className={cls('title')}>
              Thông tin Sinh Viên
            </Text></Divider>
            <div className={cls('group_member')}>{genderMemberForGroup}</div>
            <Divider orientation="right">  <Text type="secondary" className={cls('title')}>
              Thông tin Đề Tài
            </Text></Divider>
            <div className={cls('topic')}>{renderTopic}</div>
            <Divider orientation="right">  <Text type="secondary" className={cls('title')}>
              Thông tin Giảng Viên Hướng Dẫn
            </Text></Divider>
            <div className={cls('lecturer')}>{renderLecturerForGroup}</div>
            <Divider orientation="left"></Divider>

            <Row className={cls('lecturer')} justify={'space-between'}>
              <Col span={12}>
                <Card title="Nhóm Giảng Viên chấm 'PHẢN BIỆN'" bordered={false}>
                  {renderFormAssignReview}
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Nhóm Giảng Viên chấm 'HỘI ĐỒNG'" bordered={false}>
                  {renderFormAssignSessionHost}
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

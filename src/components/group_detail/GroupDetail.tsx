import React, { useEffect, useMemo, useState, useCallback } from 'react';
import classNames from 'classnames/bind';
import style from './GroupDetail.module.scss';
import { Badge, Button, Card, Col, Descriptions, Divider, Dropdown, Form, MenuProps, Row, Select, Skeleton, Space, TreeSelect } from 'antd';
import { useParams } from 'react-router-dom';
import studentService from '~/services/student';
import GroupStudent from '~/entities/group_student';
import topicService from '~/services/topic';
import Topic from '~/entities/topic';
import Teacher from '~/entities/teacher';
import GroupLecturer from '../group_lecturer/GroupLecturer';
import Term from '~/entities/term';
import lecturerService from '~/services/lecturer';
import termService from '~/services/term';
import { useAppSelector } from '~/redux/hooks';
import { toast, ToastContainer } from 'react-toastify';
import { checkDegree, checkGender, showMessage } from '~/constant';
import { DownOutlined } from '@ant-design/icons';

const cls = classNames.bind(style);
interface GroupAssign {
  id: number;
  typeEvaluation: string;
  groupLecturer: {
    id: number;
    name: string;
  };
}

const GroupDetail = () => {
  const { id } = useParams();
  const [inforGroup, setInfoGroup] = useState<GroupStudent>();
  const [topic, setTopic] = useState<Topic>();
  const [lecturer, setLecturer] = useState<Teacher>();
  const [loading, setLoading] = useState(true);
  const [groupLecturer, setGroupLecturer] = useState<Array<GroupLecturer>>([]);
  const [term, setTerm] = useState<Array<Term>>([]);
  const [termSelect, setTermSelect] = useState<number | null>(null);
  const { user } = useAppSelector((state) => state.user);

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

  useEffect(() => {
    termService
      .getTerm({ majorsId: user.majors.id })
      .then((response) => {
        setTerm(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const idGroup = id;

    if (term.length > 0) {
      studentService
        .getGroupStudentByID(Number(idGroup))
        .then((result) => {
          console.log('getGroupStudentByID', result?.data);
          setLoading(false);
          setInfoGroup(result.data);
          getTopic(result.data?.topic?.id);
        })
        .catch((errr) => console.log('erre', errr));

      studentService
        .getGroupLecturerOfStudentByType(Number(idGroup), termSelect !== null ? termSelect : term[0].id, 'REVIEWER')
        .then((resutl) => {
          console.log(' REVIEWER', resutl?.data);
          setGroupAssignRieview(resutl?.data);
        })
        .catch((error) => console.log('error REVIEWER', error));



      studentService
        .getGroupLecturerOfStudentByType(Number(idGroup), termSelect !== null ? termSelect : term[0].id, 'SESSION_HOST')
        .then((resutl) => {
          console.log('SESSION_HOST', resutl?.data);
          setGroupAssignSessionHost(resutl?.data);
        })
        .catch((error) => console.log('error SESSION_HOST', error));
    }
  }, [term, termSelect]);

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

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  useEffect(() => {
    if (term.length > 0) {
      lecturerService.getGroupLecturers(termSelect !== null ? termSelect : term[0].id).then((resutl) => {
        setGroupLecturer(resutl?.data);
      });
    }
  }, [term, termSelect]);

  useEffect(() => {
    getInfoReview()
  }, [groupAssignReview?.[0]?.groupLecturer?.id, idGroupReview])


  useEffect(() => {
    getInfoHost()
  }, [groupAssignSessionHost?.[0]?.groupLecturer?.id, idGroupHost]);

  const getInfoReview = () => {
    const groupId = id;
    if (groupAssignReview?.[0]?.groupLecturer?.id) {
      setStatus('update');
      setIdGroupReview(groupAssignReview?.[0]?.id)
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
  }

  const getInfoHost = () => {
    const groupId = id;
    if (groupAssignSessionHost?.[0]?.groupLecturer?.id) {
      setStatusHost('update');
      setIdGroupHost(groupAssignSessionHost?.[0]?.id)
      setInitDataHost((prev: any) => {
        const data = {
          ...prev,
          groupId: groupId,
          groupLecturerId: groupAssignReview?.[0]?.groupLecturer?.id,
          typeEvaluation: 'REVIEWER',
        };
        return data;
      });
    }
  }




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
          setStatus('update')
          setIdGroupReview(result?.data?.id)
          showMessage("Đã gắn nhóm thành công", 3000)
        })
        .catch((error) => {
          console.log(error);
          showMessage(error.response.data.error, 3000)
        });
    } else {
      lecturerService
        .updateAssignGroupLecturer(Number(idGroupReview), {
          ...value, groupId: Number(idGroup),
          groupLecturerId: value?.groupLecturerId,
          typeEvaluation: 'REVIEWER',
        })
        .then((result) => {
          showMessage("Cập nhật thành công", 3000)
        })
        .catch((error) => {
          showMessage(error.response.data.error, 3000)
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
          showMessage("Đã gắn nhóm thành công", 3000)
          setStatusHost('update')
          setIdGroupHost(result?.data?.id)
        })
        .catch((error) => {
          console.log(error);
          showMessage(error.response.data.error, 3000)
        });
    } else {
      lecturerService
        .updateAssignGroupLecturer(Number(idGroupHost), {
          ...value, groupId: Number(idGroup),
          groupLecturerId: value?.groupLecturerId,
          typeEvaluation: 'SESSION_HOST',
        })
        .then((result) => {

          showMessage("Cập nhật thành công", 3000)
        })
        .catch((error) => {

          showMessage(error.response.data.error, 3000)
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
                  label: "Mã SV: " + i?.student?.username,
                  key: 1,
                },
                {
                  label: "Giới tính: " + `${checkGender(i?.student?.gender)}`,
                  key: 2,
                }


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
        label: "Mô tả: " + topic?.description,
        key: 1,
      },
      {
        label: "Yều cầu đầu vào: " + topic?.requireInput,
        key: 2,
      },
      {
        label: "Yều cầu đầu ra:  " + topic?.standradOutput,
        key: 3
      },
      {
        label: "Ghi chú: " + topic?.note,
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

          <Col  >

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
        label: "Mã GV: " + lecturer?.username,
        key: 1,
      },

      {
        label: "Trình độ:  " + `${checkDegree(String(lecturer?.degree))}`,
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
    const data = groupLecturer.map((value) => {
      return {
        value: value.id,
        label: value.name,
      };
    })
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
            onChange={handleChange}
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
      </Form>
    );
  }, [status, initData, groupLecturer, onFinishChosseGroupReview]);

  const renderFormAssignSessionHost = useMemo(() => {
    const nameDefault = groupAssignSessionHost?.[0]?.groupLecturer?.name;
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
            onChange={handleChange}
            optionLabelProp="label"
            options={groupLecturer.map((value) => {
              return {
                value: value.id,
                label: value.name,
              };
            })}
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
      </Form>
    );
  }, [statusHost, initDataHost, groupLecturer]);

  return (
    <div className={cls('group_detail')}>
      <ToastContainer />
      <Select
        style={{ width: 120 }}
        onChange={(value) => {
          setTermSelect(value);
        }}
        options={term.map((val) => {
          return {
            value: val.id,
            label: val.name,
          };
        })}
      />
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
            <div className={cls('group_member')}>{genderMemberForGroup}</div>
            <Divider orientation="left"></Divider>
            <div className={cls('topic')}>{renderTopic}</div>
            <Divider orientation="left"></Divider>
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

import classNames from 'classnames/bind';
import style from './GroupLecturer.module.scss';
import { ToastContainer, toast } from 'react-toastify';
import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Form,
  Input,
  Modal,
  Row,
  Select,
  SelectProps,
  Skeleton,
  Space,
  Table,
  Tooltip,
  Upload,
  UploadProps,
} from 'antd';
import { useAppSelector } from '../../redux/hooks';
import { DeleteOutlined, EditOutlined, GroupOutlined, MoreOutlined, PlusOutlined, UserSwitchOutlined } from '@ant-design/icons';
import lecturerService from '../../services/lecturer';
import Teacher from '../../entities/teacher';
import Meta from 'antd/es/card/Meta';
import { TypeEvaluation, showMessage, showMessageEror } from '../../constant';
import { Link } from 'react-router-dom';

const cls = classNames.bind(style);
const { Option } = Select;
interface GroupLecturer {
  id: number;
  name: string;
  members: {
    id: number;
    lecturer: Teacher;
    groupLecturer: number;
  }[];
}

interface GroupStudent {
  id: number;
  typeEvaluation: TypeEvaluation;
  group: {
    id: number;
    name: string;
    term: {
      id: number;
    };
    topic: {
      id: number;
    };
  };
  groupLecturer: {
    id: number;
  };
}
interface GroupLecturerTable extends GroupLecturer {
  key: number;
}

const GroupLecturer = () => {
  const [groupLecturers, setGroupLecturers] = useState<Array<GroupLecturerTable>>([]);

  const [loadingListGroup, setLoadingListGroup] = useState(true);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('insert');
  const [initData, setInitData] = useState<{
    termId: number;
    name: string;
    lecturerIds: [];
  }>({ termId: NaN, name: '', lecturerIds: [] });
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [lecturer, setListLecturer] = useState<Array<Teacher>>([]);
  const [groupDes, setGroupDes] = useState<GroupLecturer>(groupLecturers[0]);
  const [groupIdDelete, setGroupIdDelete] = useState<number | null>(null);
  const [groupStudents, setGroupStudents] = useState<Array<GroupStudent>>([]);
  const [loading, setLoading] = useState(true);
  const [loadingInfoGroup, setLoadingInfoGroup] = useState(true);
  const termState = useAppSelector((state) => state.term);

  useEffect(() => {
    getGroupLecturer();
  }, [termState]);

  useEffect(() => {
    if (termState.term.length > 0) {
      lecturerService.getWithTerm(termState.termIndex.id).then((response) => {
        setListLecturer(response.data);
      });
    }
  }, [termState]);

  const getGroupLecturer = () => {
    if (termState.term.length > 0) {
      lecturerService.getAllGroupLecturers({ termId: termState.termIndex.id }).then((response) => {
        const _data = response.data.map((value: GroupLecturer, index: number) => {
          return { ...value, key: index };
        });
        setLoadingListGroup(false);
        setGroupLecturers(_data);
      });
    }
  };

  const deleteGroupLecturer = (id: number) => {
    lecturerService
      .deleteGroupLecturer(id)
      .then(() => {
        showMessage('Xóa thành công', 3000);
        getGroupLecturer();
        setLoadingInfoGroup(true);
        setLoading(true);
      })
      .catch((error) => {
        showMessageEror(error.response.data.error, 3000);
      });
  };

  const getGroupStudentOfLecturer = (_id: number) => {
    setLoading(true);
    lecturerService
      .getGroupStudentOfLecturer(termState.termIndex.id, _id)
      .then((result) => {
        setLoading(false);
        setGroupStudents(result?.data);
      })
      .catch((er) => {
        console.log('er', er);
        setLoading(false);
        setGroupStudents([]);
      });
  };

  const setInfoGroupLecturer = (id: number) => {
    const m = groupLecturers.filter((value) => value.id === id)[0];

    setGroupDes(m);
    setLoadingInfoGroup(false);
    setGroupIdDelete(m?.id);
    getGroupStudentOfLecturer(Number(m?.id));
  };

  const showEditModal = (id: number) => {
    setUpdateId(id);
    setOpen(true);
    setStatus('update');
    const m = groupLecturers.filter((value) => value.id === id)[0];

    setInitData((prev: any) => {
      const data = {
        ...prev,
        termId: termState.termIndex.id,
        name: m.name,
        lecturerIds: m.members?.map((value) => value?.lecturer?.id),
      };

      return data;
    });
  };

  const deleteMemberGroupInfo = (id: any) => {
    lecturerService
      .deleteMemberOfGroupLecturer(groupIdDelete as number, id)
      .then((result) => {
        getGroupLecturer();
        showMessage('Xóa thành công', 3000);
        setLoadingInfoGroup(true);
        setLoading(true);
      })
      .catch((error) => {
        showMessageEror(error.response.data.error, 3000);
      });
  };

  const columns = [
    {
      title: 'Mã nhóm',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Xóa',
      dataIndex: 'id',
      render: (id: any) => (
        <Button onClick={() => deleteGroupLecturer(id)}>
          <DeleteOutlined style={{ color: 'red' }} />
        </Button>
      ),
    },
    {
      title: 'Sửa',
      dataIndex: 'id',
      render: (id: any) => (
        <Button onClick={() => showEditModal(id)}>
          <EditOutlined style={{ color: '#30a3f1' }} />
        </Button>
      ),
    },
    {
      title: '',
      dataIndex: 'id',
      render: (id: any) => (
        <Button
          onClick={() => {
            setInfoGroupLecturer(id);
          }}
        >
          <MoreOutlined style={{ color: '#30a3f1' }} />
        </Button>
      ),
    },
  ];

  const columnsLecturer = [
    {
      title: 'Mã GV',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Tên GV',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Trình độ',
      dataIndex: 'degree',
      key: 'degree',
    },
    {
      title: 'SĐT',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Xóa',
      dataIndex: 'id',
      render: (id: any) => (
        <Button onClick={() => deleteMemberGroupInfo(id)}>
          <DeleteOutlined style={{ color: 'red' }} />
        </Button>
      ),
    },
  ];

  const showModal = () => {
    setOpen(true);
    setStatus('insert');
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const onFinish = (value: { termId: number; name: string; lecturerIds: Array<number> }) => {
    if (status === 'insert')
      lecturerService
        .createGroupLecturer({
          ...value,
          termId: termState.termIndex.id,
          lecturerIds: `[${value.lecturerIds}]`,
        })
        .then((result) => {
          showMessage('Tạo thành công', 3000);
          getGroupLecturer();
          setOpen(false);
          setLoadingInfoGroup(true);
          setLoading(true);
        })
        .catch((error) => {
          showMessageEror(error.response.data.error, 3000);
          setOpen(false);
        });
    else {
      lecturerService
        .updateGroupLecturer(updateId as number, {
          ...value,
          termId: termState.termIndex.id,
          lecturerIds: `[${value.lecturerIds}]`,
        })
        .then((result) => {
          showMessage('Cập nhật thành công', 2000);
          getGroupLecturer();
          setOpen(false);
          setLoadingInfoGroup(true);
          setLoading(true);
          // window.location.reload();
        })
        .catch((error) => {
          showMessageEror(error.response.data.error, 2000);
          setOpen(false);
        });
    }
  };

  const renderGroupStudent = useMemo(() => {
    return (
      <>
        <Skeleton loading={loading} avatar active>
          {groupStudents?.length > 0 ? (
            <>
              <Card className={cls('scroll')}>
                {groupStudents?.map((item, index) => {
                  return (
                    <Card.Grid className={cls('item_group')} hoverable>
                      <div>
                        <Avatar style={{ backgroundColor: '#87d068', marginBottom: '10px' }} icon={<UserSwitchOutlined />} />
                        {/* <GroupOutlined size={30} className={cls('icon')} /> */}
                      </div>
                      <Meta
                        title={item?.group?.name}
                        description={
                          <div className={cls('group_more')}>
                            <Link to={'/group/' + item?.group?.id}> Chi tiết...</Link>
                          </div>
                        }
                      />
                    </Card.Grid>
                  );
                })}
              </Card>
            </>
          ) : (
            <>
              <Badge.Ribbon text="Thông báo" color="red">
                <Card title="Nhóm Sinh Viên" size="default">
                  Chưa có nhóm nào
                </Card>
              </Badge.Ribbon>
            </>
          )}
        </Skeleton>
      </>
    );
  }, [groupStudents, groupDes, loading, groupLecturers]);

  const renderTable = useMemo(() => {
    return <Table dataSource={groupLecturers} columns={columns} scroll={{ x: 400 }} />;
  }, [groupLecturers, columns, lecturer]);

  const renderTableGroupDes = useMemo(() => {
    return (
      <Table
        dataSource={groupDes?.members.map((value) => {
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
        scroll={{ x: 400, y: 200 }}
      />
    );
  }, [groupLecturers, groupDes, lecturer, loading]);

  return (
    <div className={cls('group_lecturer_management')}>
      <ToastContainer />
      <Row>
        <Col span={12}>
          <Skeleton loading={loadingListGroup} avatar active>
            <div className={cls('group_content')}>
              <div className={cls('function')}>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  size="large"
                  style={{
                    margin: '0 10px',
                    animation: 'none',
                    color: 'rgb(80, 72, 229)',
                  }}
                  onClick={showModal}
                >
                  Tạo
                </Button>
              </div>

              {renderTable}
            </div>
          </Skeleton>
        </Col>

        <Col span={12}>
          <div className={cls('info_item_des')}>
            <Descriptions title={<h3 className={cls('title_info')}>Thông tin nhóm</h3>}></Descriptions>
            <Skeleton loading={loadingInfoGroup} avatar active>
              <Descriptions title={<></>}>
                <Descriptions.Item label={<p className={cls('title_info_lecturer')}>Tên nhóm:</p>} span={1}>
                  <h4 className={cls('name_group')}>{groupDes?.name}</h4>
                </Descriptions.Item>
              </Descriptions>
              <Descriptions
                bordered
                layout="horizontal"
                column={2}
                title={<h3 className={cls('title_info_lecturer')}>Thông tin giảng viên</h3>}
              ></Descriptions>

              {renderTableGroupDes}
            </Skeleton>
          </div>
        </Col>

        <div className={cls('info_group_student')}>
          <Col span={24}>
            <Descriptions title={<h3 className={cls('title_info')}>Nhóm được quản lý</h3>}></Descriptions>

            {renderGroupStudent}
          </Col>
        </div>
      </Row>

      <Modal
        destroyOnClose
        open={open}
        title={status === 'insert' ? 'Tạo nhóm Giảng viên' : 'Cập nhật nhóm Giảng viên'}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
        ]}
      >
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          onFinish={onFinish}
          initialValues={status === 'insert' ? {} : initData}
          style={{ maxWidth: 600 }}
        >
          <Form.Item label="Tên nhóm" rules={[{ required: true, message: 'Vui lòng nhập tên' }]} name="name">
            <Input />
          </Form.Item>

          <Form.Item label="Giảng viên" rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]} name="lecturerIds">
            <Select mode="multiple" style={{ width: '100%' }} placeholder="Giảng viên" onChange={handleChange} optionLabelProp="label">
              {lecturer.map((value) => {
                return (
                  <>
                    <Option value={value.id} label={value.name}>
                      <Space>
                        <span>
                          {value.name} - Mã GV: {value.username}
                        </span>
                      </Space>
                    </Option>
                  </>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 24 }}>
            <Row>
              <Col span={24} offset={20}>
                <Button type="primary" htmlType="submit">
                  Tạo
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupLecturer;

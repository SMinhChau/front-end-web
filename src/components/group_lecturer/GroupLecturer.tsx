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
  SelectProps,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
} from 'antd';
import { useAppSelector } from '../../redux/hooks';
import { DeleteOutlined, EditOutlined, GroupOutlined, MoreOutlined, PlusOutlined, UserSwitchOutlined } from '@ant-design/icons';
import lecturerService from '../../services/lecturer';
import Teacher from '../../entities/teacher';
import Meta from 'antd/es/card/Meta';
import {
  ErrorCodeDefine,
  TypeEvaluation,
  checkDegree,
  checkTypeTraining,
  getColorLecturer,
  getStatusGroup,
  getStatusGroupColor,
  getTypeGroupLecturer,
  showMessage,
  showMessageEror,
} from '../../constant';
import { Link } from 'react-router-dom';
import { ColumnsType } from 'antd/es/table';
import Select from 'react-select';
import { TypeEvalution } from 'src/entities/assign';
import Student from 'src/entities/student';
import AssignAdvisor from 'src/entities/assign_advisor';

const cls = classNames.bind(style);
interface GroupLecturer {
  id: number;
  name: string;
  type: TypeEvaluation;
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
  members: Array<Student>;
}
interface GroupLecturerTable extends GroupLecturer {
  key: number;
}

interface SelectOption {
  value: number;
  lable: string;
}

const GroupLecturer = () => {
  const [groupLecturers, setGroupLecturers] = useState<Array<GroupLecturerTable>>([]);
  const [data, setData] = useState<Array<GroupLecturerTable>>([]);

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
  const [defaultValue, setDefaultValue] = useState([{ value: '', label: '' }]);
  const { user } = useAppSelector((state) => state.user);
  const [typeCreate, setTypeCreate] = useState('');

  useEffect(() => {
    getGroupLecturer();
  }, [termState]);

  useEffect(() => {
    if (termState.term.length > 0) {
      lecturerService.getWithTerm(termState.termIndex.id).then((response) => {
        console.log('setListLecturer ->', response.data);
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
        console.log('getGroupLecturer', _data);
        setLoadingListGroup(false);
        setGroupLecturers(_data);
        setData(_data);
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
        showMessageEror(ErrorCodeDefine[error.response.data.code].message, 3000);
      });
  };

  const getGroupStudentOfLecturer = (_id: number) => {
    setLoading(true);
    setLoadingInfoGroup(true);
    lecturerService
      .getGroupssignById(_id)
      .then((result) => {
        setLoading(false);
        console.log('getGroupStudentOfLecturer', result?.data);
        setLoadingInfoGroup(false);
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
    console.log(' id group lecture', id);

    setGroupIdDelete(m?.id);
    getGroupStudentOfLecturer(Number(m?.id));
  };

  const showEditModal = (id: number) => {
    setUpdateId(id);
    setOpen(true);
    setStatus('update');

    const m = groupLecturers.filter((value) => value.id === id)[0];

    const members = m.members.map((i) => ({
      value: i.lecturer.id,
      label: i.lecturer.name,
    }));
    setDefaultValue(members);

    setInitData((prev: any) => {
      const data = {
        ...prev,
        termId: termState.termIndex.id,
        name: m.name,
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
        showMessageEror(ErrorCodeDefine[error.response.data.code].message, 3000);
      });
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Mã nhóm',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => (
        <div className={cls('text_colum')} style={{ maxHeight: '100px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Loại nhóm',
      dataIndex: 'type',
      key: 'type',
      render: (text: string) => {
        const name = getTypeGroupLecturer(text);
        console.log('name ->>>>...', name);

        const color = getColorLecturer(text);
        return (
          <Tag color={color} key={getColorLecturer(text)}>
            <div className={cls('text_colum')} style={{ maxHeight: '100px', overflow: 'auto' }}>
              <div style={{ color: color }}> {name}</div>
            </div>
          </Tag>
        );
      },
    },
    {
      title: 'Xóa',
      dataIndex: 'id',
      width: 50,
      render: (id: any) => (
        <Button onClick={() => deleteGroupLecturer(id)}>
          <DeleteOutlined style={{ color: 'red' }} />
        </Button>
      ),
    },
    {
      title: 'Sửa',
      dataIndex: 'id',
      width: 50,
      render: (id: any) => (
        <Button onClick={() => showEditModal(id)}>
          <EditOutlined style={{ color: '#30a3f1' }} />
        </Button>
      ),
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
                setInfoGroupLecturer(id);
              }}
            >
              <MoreOutlined style={{ color: '#30a3f1' }} />
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const columnsLecturer: ColumnsType<any> = [
    {
      title: 'Mã GV',
      dataIndex: 'username',
      key: 'username',
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
            <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto' }}>
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

  const [id, setId] = useState<Array<SelectOption>>([]);

  const handleSelectChange = (selectedOption: any) => {
    setId(selectedOption);
  };

  const onFinish = (value: { termId: number; name: string }) => {
    let lecturerIds: number[] = [];
    id.forEach((i) => {
      lecturerIds.push(i.value);
    });

    if (status === 'insert')
      lecturerService
        .createGroupLecturer({
          ...value,
          name: `${getTypeGroupLecturer(typeCreate)} ${value.name}`,
          termId: termState.termIndex.id,
          lecturerIds: `[${lecturerIds}]`,
          type: typeCreate,
        })
        .then((result) => {
          showMessage('Tạo thành công', 3000);
          getGroupLecturer();
          setOpen(false);
          setLoadingInfoGroup(true);
          setLoading(true);
        })
        .catch((error) => {
          showMessageEror(ErrorCodeDefine[error.response.data.code].message, 3000);
          setOpen(false);
        });
    else {
      lecturerService
        .updateGroupLecturer(updateId as number, {
          ...value,
          termId: termState.termIndex.id,
          lecturerIds: `[${lecturerIds}]`,
          type: typeCreate,
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
          showMessageEror(ErrorCodeDefine[error.response.data.code].message, 2000);
          setOpen(false);
        });
    }
  };

  const renderGroupStudent = useMemo(() => {
    const baseColumns: ColumnsType<GroupStudent> = [
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
        title: 'Chi tiết',
        dataIndex: 'id',
        key: 'id',

        render: (text) => {
          return <Link to={'/group/' + id}> Chi tiết...</Link>;
        },
      },
    ];

    return (
      <>
        {groupStudents?.length > 0 ? (
          <>
            <Table columns={baseColumns} dataSource={groupStudents} scroll={{ x: 50, y: 90 }} />
          </>
        ) : (
          <>
            <div className={cls('group_student')}>
              <Badge.Ribbon text="Chưa có nhóm" color="red"></Badge.Ribbon>
            </div>
          </>
        )}
      </>
    );
  }, [groupStudents, groupDes, loading, groupLecturers]);

  const renderTable = useMemo(() => {
    return <Table dataSource={data} columns={columns} scroll={{ x: 400 }} pagination={{ pageSize: 7 }} />;
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
        scroll={{ x: 400, y: 150 }}
        pagination={{ pageSize: 2 }}
      />
    );
  }, [groupLecturers, groupDes, loading, data]);

  const handleSelectChangeFilter = (value: any) => {
    const _data = groupLecturers.filter((item) => item.type === value.value);
    console.log('data filter', _data);

    setData(_data);
  };
  const handleSelectChangeFilterCreate = (value: any) => {
    setTypeCreate(value.value);
  };

  const getAllGroup = () => {
    setData(groupLecturers);
  };
  return (
    <div className={cls('group_lecturer_management')}>
      <ToastContainer />
      <Row justify={'space-between'} align={'top'} style={{ width: '100%' }}>
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

                <div className={cls('select_content')}>
                  <Row justify={'center'} align={'middle'} style={{ marginBottom: '20px' }}>
                    <Col>
                      <p className={cls('title_info_lecturer')}>Loại nhóm:</p>
                    </Col>
                    <Col>
                      <div style={{ width: '200px' }}>
                        <Select
                          onChange={handleSelectChangeFilter}
                          options={[
                            { value: TypeEvalution.ADVISOR, label: getTypeGroupLecturer(TypeEvalution.ADVISOR) },
                            { value: TypeEvalution.REVIEWER, label: getTypeGroupLecturer(TypeEvalution.REVIEWER) },
                            { value: TypeEvalution.SESSION_HOST, label: getTypeGroupLecturer(TypeEvalution.SESSION_HOST) },
                          ]}
                        />
                      </div>
                    </Col>
                    <Button
                      type="dashed"
                      size="large"
                      style={{
                        margin: '0 10px',
                        animation: 'none',
                        color: 'rgb(80, 72, 229)',
                      }}
                      onClick={getAllGroup}
                    >
                      Tất cả
                    </Button>
                  </Row>
                </div>
              </div>

              {renderTable}
            </div>
          </Skeleton>
        </Col>
        <Col span={12}>
          <div className={cls('left')}>
            <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
              <Col span={24}>
                <div className={cls('info_item_des')}>
                  <Skeleton loading={loadingInfoGroup} paragraph={{ rows: 5 }} avatar active>
                    <Row justify={'start'} align={'middle'} style={{ marginBottom: '20px' }}>
                      <Col span={12}>
                        <p className={cls('title_info_lecturer')}>Mã nhóm:</p>
                      </Col>
                      <Col span={12}>
                        <h4 className={cls('name_group')}>{groupDes?.id}</h4>
                      </Col>
                    </Row>
                    <Row justify={'start'} align={'middle'} style={{ marginBottom: '20px' }}>
                      <Col span={12}>
                        <p className={cls('title_info_lecturer')}>Tên nhóm hội đồng:</p>
                      </Col>
                      <Col span={12}>
                        <h4 className={cls('name_group')}>{groupDes?.name}</h4>
                      </Col>
                    </Row>

                    {renderTableGroupDes}
                  </Skeleton>
                </div>
              </Col>
            </Row>

            <Row justify={'center'} align={'top'} style={{ width: '100%' }}>
              <div className={cls('info_group_student')}>
                <Skeleton loading={loading} avatar active>
                  <Col span={24}>
                    <Descriptions title={<h3 className={cls('title_info')}>danh sách nhóm sinh viên đang quản lý</h3>}></Descriptions>
                    {renderGroupStudent}
                  </Col>
                </Skeleton>
              </div>
            </Row>
          </div>
        </Col>
      </Row>

      <Modal
        destroyOnClose
        open={open}
        title={status === 'insert' ? 'Tạo Nhóm hội đồng' : 'Cập nhật Nhóm hội đồng'}
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
            <Input placeholder={getTypeGroupLecturer(typeCreate)} />
          </Form.Item>

          <Form.Item label="Giảng viên" rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}>
            <Select
              defaultValue={status === 'insert' ? [] : defaultValue}
              onChange={handleSelectChange}
              closeMenuOnSelect={false}
              isMulti
              options={lecturer.map((val) => {
                let me = '';
                if (val.id === user.id) {
                  me = '(Bạn)';
                }
                return {
                  value: val.id,
                  label: `${val.name} ${me} - (Mã: ${val.username} - Trình độ: ${checkDegree(val.degree)})`,
                };
              })}
            />
          </Form.Item>

          {status === 'insert' ? (
            <>
              <Row>
                <Col>
                  <p className={cls('title_info_lecturer')}>Loại nhóm Hội đồng:</p>
                </Col>
                <Col>
                  <div style={{ width: '200px', marginLeft: '20px' }}>
                    <Select
                      onChange={handleSelectChangeFilterCreate}
                      options={[
                        { value: TypeEvalution.REVIEWER, label: getTypeGroupLecturer(TypeEvalution.REVIEWER) },
                        { value: TypeEvalution.SESSION_HOST, label: getTypeGroupLecturer(TypeEvalution.SESSION_HOST) },
                      ]}
                    />
                  </div>
                </Col>
              </Row>
            </>
          ) : (
            <></>
          )}
          <Form.Item wrapperCol={{ span: 24 }}>
            <Row>
              <Col span={24} offset={20}>
                <Button type="primary" htmlType="submit">
                  {status === 'insert' ? ' Tạo' : ' Sửa'}
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

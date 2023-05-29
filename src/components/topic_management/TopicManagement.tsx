import { useMemo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './TopicManagement.module.scss';
import Term from '../../entities/term';
import termService from '../../services/term';
import { useAppSelector } from '../../redux/hooks';
import { Table, Button, Modal, Form, Input, InputNumber, Row, Col, Tag, Typography } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, MoreOutlined, ArrowRightOutlined, ArrowsAltOutlined } from '@ant-design/icons';
import topicService from '../../services/topic';
import Select from 'react-select';
import { default as base_column } from './column';
import { toast, ToastContainer } from 'react-toastify';
import Config from '../../utils/config';
import ColumnSetting from '../column_setting/ColumnSetting';
import TextArea from 'antd/es/input/TextArea';
import {
  ErrorCodeDefine,
  formatString,
  getLevelColorTopic,
  getLevelTopic,
  getNameStatus,
  showMessage,
  showMessageEror,
} from '../../constant';
import { EnumRole } from 'src/enum';
import RejectUserLogin from '../notification/RejectUserLogin';
import { ColumnsType } from 'antd/es/table';
import Topic from 'src/entities/topic';
import TruncatedText from './TruncatedText';
import studentService from 'src/services/student';
import Student from 'src/entities/student';
import lecturerService from 'src/services/lecturer';

const cls = classNames.bind(style);

const TopicManagement = () => {
  const userState = useAppSelector((state) => state.user).user;
  const _userState = useAppSelector((state) => state.user);

  const [topic, setTopic] = useState<Array<Topic>>([]);
  const [open, setOpen] = useState(false);
  const [openModalAssign, setModalAssign] = useState(false);

  const [status, setStatus] = useState('insert');
  const [initData, setInitData] = useState({});
  const [idUpdate, setIdUpdate] = useState<number | null>(null);
  const [asignId, setIdAssign] = useState<number | null>(null);
  const [columnVisible, setColumnVisible] = useState<Array<any>>([]);
  const termState = useAppSelector((state) => state.term);
  const [studentOfList, setStudentOfList] = useState<Array<Student>>([]);
  const [topicName, setTopicName] = useState<Topic>();
  const [level, setLevel] = useState('');
  const [levelUpdate, setLevelUpdate] = useState('');

  useEffect(() => {
    getListLecturerOfMajor();
  }, []);

  const getListLecturerOfMajor = () => {
    studentService.getStudent({ termId: termState.termIndex.id }).then((result) => {
      setStudentOfList(result.data);
    });
  };

  const baseColumns: ColumnsType<any> = [
    {
      title: 'Tên đề tài',
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      width: 200,
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto', fontWeight: '500' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'SL nhóm tối đa',
      dataIndex: 'quantityGroupMax',
      key: 'quantityGroupMaxh',
      width: 100,
      render: (text) => <div className={cls('text_colum')}>{text}</div>,
    },

    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      render: (text) => {
        return (
          <>
            <div className={cls('text_colum')} style={{ maxHeight: '180px', overflow: 'auto' }}>
              {text && formatString(text)}
            </div>
          </>
        );
      },
    },

    {
      title: 'Mục tiêu',
      dataIndex: 'target',
      key: 'target',
      width: 300,
      render: (text) => {
        return (
          <>
            <div className={cls('text_colum')} style={{ maxHeight: '180px', overflow: 'auto' }}>
              {text && formatString(text)}
            </div>
          </>
        );
      },
    },
    {
      title: 'Cấp độ',
      dataIndex: 'level',
      key: 'level',
      render: (text) => {
        const _name = getLevelTopic(text);
        return (
          <Tag color={getLevelColorTopic(text)} key={getLevelTopic(text)}>
            <div className={cls('text_colum')} style={{ maxHeight: '160px', color: getLevelColorTopic(text) }}>
              {_name}
            </div>
          </Tag>
        );
      },
    },
    {
      title: 'Bình luận',
      dataIndex: 'comment',
      key: 'comment',
      width: 200,
      render: (text) => {
        return (
          <>
            <div className={cls('text_colum')}>{text && text.slice(0, 90)}</div>{' '}
          </>
        );
      },
    },

    {
      title: 'Xem chi tiết',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      render: (id: any) => {
        return <TruncatedText id={id} listOfTopic={topic} />;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      width: 100,
      render: (status: any) => {
        return (
          <div style={{ justifyItems: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
            <Tag color={status === 'PEDING' ? 'green' : 'red'} key={getNameStatus(status)}>
              {getNameStatus(status)}
            </Tag>
          </div>
        );
      },
    },
    {
      title: '',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      render: (id: any) => {
        const _data = topic.filter((i) => i.id == id)[0];
        const isAssign = _data?.status === 'ACCEPT' ? true : false;
        return (
          <>
            {isAssign === true && (
              <Button
                className={cls('btn')}
                onClick={() => showAsign(id)}
                type="dashed"
                icon={<ArrowsAltOutlined color="blue" />}
                size="small"
                style={{
                  animation: 'none',
                  color: 'green',
                  fontWeight: '600',
                  marginTop: '5px',
                }}
              >
                Gắn đề tài
              </Button>
            )}
          </>
        );
      },
    },
    {
      title: '',
      dataIndex: 'id',
      fixed: 'left',
      width: 120,
      render: (id: any) => {
        return (
          <div className={cls('button')}>
            <Button className={cls('btn')} onClick={() => deleteTerm(id)} disabled={status === 'PEDING' ? false : true}>
              <DeleteOutlined style={{ color: 'red' }} />
            </Button>
            <Button className={cls('btn')} onClick={() => showEditModal(id)}>
              <EditOutlined style={{ color: '#30a3f1' }} />
            </Button>
          </div>
        );
      },
    },
  ];

  const getTopic = (termId: number) => {
    topicService
      .getTopic({
        termId,
        lecturerId: userState.id,
      })
      .then((response) => {
        setTopic(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (termState.term.length > 0) getTopic(termState.termIndex.id);
  }, [termState]);

  useEffect(() => {
    if (termState.termIndex.id) {
      getTopic(termState.termIndex.id);
    }
  }, [termState]);

  const showModal = () => {
    setOpen(true);
    setStatus('insert');
  };

  const showAsign = (id: number) => {
    const _name = topic.filter((i) => i.id === id)[0];
    setTopicName(_name);
    setModalAssign(true);
  };

  const handleCancel = () => {
    setOpen(false);
    setInitData({});
  };
  const handleCancelModalAssign = () => {
    setModalAssign(false);
  };
  const onFinish = (value: any) => {
    if (status === 'insert')
      topicService
        .createTopic({
          ...value,
          level: level,
          termId: termState.termIndex.id,
        })
        .then((_response) => {
          showMessage('Tạo thành công', 5000);
          setOpen(false);
          getTopic(termState.termIndex.id);
        })
        .catch((error) => {
          console.log(error);
        });
    else
      topicService
        .updateTopic(idUpdate as number, {
          ...value,
          termId: termState.termIndex.id,
          level: levelUpdate,
        })
        .then((_response) => {
          showMessage('Cập nhật thành công', 5000);
          setOpen(false);
          getTopic(termState.termIndex.id);
        })
        .catch((error) => {
          showMessageEror(ErrorCodeDefine[error.response.data.code].message, 5000);
        });
  };

  const deleteTerm = (id: number) => {
    topicService
      .deleteTopic(id)
      .then(() => {
        showMessage('Đã xóa', 5000);
        getTopic(termState.termIndex.id);
      })
      .catch((error) => {
        showMessageEror(ErrorCodeDefine[error.response.data.code].message, 5000);
      });
  };
  const showEditModal = (id: number) => {
    const velel = topic.filter((i) => i.id === id)[0];
    setLevelUpdate(velel.level);

    setOpen(true);
    setStatus('update');
    setIdUpdate(id);
    const t = topic.filter((value) => value.id === id)[0];
    setInitData(t);
  };

  const handleSelectChange = (selectedOptionReview: any) => {
    const id = selectedOptionReview.value;

    setIdAssign(id);
  };
  const handleSelectChangeLevel = (option: any) => {
    setLevel(option.value);

    if (status === 'update') {
      setLevelUpdate(option.value);
    }
  };

  const handleSelectChangeLevelUpdate = (option: any) => {
    setLevelUpdate(option.value);
  };

  const handleAssignforStudent = () => {
    lecturerService
      .asignTopicForStudent({ topicId: Number(topicName?.id), studentId: Number(asignId) })
      .then((result) => {
        showMessage('Gắn đề tài thành công', 3000);
      })
      .catch((error) => {
        showMessageEror(ErrorCodeDefine[error.response.data.code].message, 5000);
      });
  };

  const renderNameforTopicModal = useMemo(() => {
    return (
      <>
        <Form.Item
          label={
            <div className={cls('title_model')} style={{ fontSize: '14px' }}>
              Mã đề tài
            </div>
          }
        >
          <Input disabled style={{ fontSize: '16px', width: '100px', textAlign: 'center' }} placeholder={String(topicName?.id)} />
        </Form.Item>
        <Form.Item
          label={
            <div className={cls('title_model')} style={{ fontSize: '14px' }}>
              Tên đề tài
            </div>
          }
        >
          <TextArea disabled style={{ fontSize: '16px' }} placeholder={String(topicName?.name)} />
        </Form.Item>
      </>
    );
  }, [topicName]);

  return (
    <>
      <div className={cls('topic_management')}>
        <ToastContainer />
        <div className={cls('semester_func')}>
          <div className={cls('selectTerm')}></div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              size="large"
              style={{
                marginBottom: '10px',
                animation: 'none',
                color: 'rgb(80, 72, 229)',
                fontWeight: '600',
              }}
              onClick={showModal}
            >
              Tạo
            </Button>
            {/* <ColumnSetting
          setColumnVisible={setColumnVisible}
          columns={baseColumns}
          cacheKey={Config.TOPIC_CACHE_KEY}
          style={{ marginLeft: 20 }}
        /> */}
          </div>

          <Modal
            destroyOnClose
            open={open}
            title={status === 'insert' ? 'Tạo đề tài' : 'Cập nhật đề tài'}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Hủy
              </Button>,
            ]}
            width={1000}
          >
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              layout="horizontal"
              onFinish={onFinish}
              size="large"
              style={{ maxWidth: 1000 }}
              initialValues={initData}
            >
              <Row justify={'space-between'} style={{ width: '100%' }}>
                <Col span={24}>
                  <Form.Item label="Tên" rules={[{ required: true, message: 'Vui lòng nhập tên' }]} name="name">
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="Số lượng"
                    rules={[{ required: true, message: 'Vui lòng nhập số lượng sinh viên ' }]}
                    name="quantityGroupMax"
                  >
                    <InputNumber min={1} max={10} />
                  </Form.Item>

                  <Form.Item label="Cấp độ">
                    <div style={{ width: '200px' }}>
                      {status === 'insert' ? (
                        <Select
                          placeholder={'Chọn cấp độ'}
                          onChange={handleSelectChangeLevel}
                          options={[
                            { value: 'HIGH', label: 'Rất khó' },
                            { value: 'MEDIUM', label: 'Khó' },
                            { value: 'LOW', label: 'Trung Bình' },
                          ]}
                        />
                      ) : (
                        <Select
                          placeholder={getLevelTopic(levelUpdate)}
                          onChange={handleSelectChangeLevelUpdate}
                          options={[
                            { value: 'HIGH', label: 'Rất khó' },
                            { value: 'MEDIUM', label: 'Khó' },
                            { value: 'LOW', label: 'Trung Bình' },
                          ]}
                        />
                      )}
                    </div>
                  </Form.Item>

                  <Form.Item label="Mô tả" rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]} name="description">
                    <TextArea rows={2} />
                  </Form.Item>
                  <Form.Item label="Ghi chú" rules={[{ required: true, message: 'Vui lòng nhập ghi chú' }]} name="note">
                    <TextArea rows={2} />
                  </Form.Item>

                  <Form.Item label="Mục tiêu" rules={[{ required: true, message: 'Vui lòng nhập mục tiêu' }]} name="target">
                    <TextArea rows={2} />
                  </Form.Item>

                  <Form.Item label="Chuẩn đầu ra" rules={[{ required: true, message: 'Vui lòng nhập chuẩn đầu ra' }]} name="standradOutput">
                    <TextArea rows={2} />
                  </Form.Item>

                  <Form.Item
                    label="Yêu cầu đầu vào"
                    rules={[{ required: true, message: 'Vui lòng nhập chuẩn đầu vào' }]}
                    name="requireInput"
                  >
                    <TextArea rows={2} />
                  </Form.Item>
                  <Row justify={'end'}>
                    <Form.Item label=" ">
                      <Button type="primary" htmlType="submit" style={{ marginRight: '30px' }}>
                        {status === 'insert' ? 'Tạo đề tài' : 'Cập nhật đề tài'}
                      </Button>
                    </Form.Item>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
        <Table className={cls('custom-table')} columns={baseColumns} dataSource={topic} pagination={{ pageSize: 7 }} />

        <Modal
          destroyOnClose
          open={openModalAssign}
          title={<div style={{ fontSize: '16px', marginBottom: '10px' }}>Gắn đề tài cho sinh viên</div>}
          onCancel={handleCancelModalAssign}
          footer={[
            <Button key="back" onClick={handleCancelModalAssign}>
              Hủy
            </Button>,
          ]}
        >
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            layout="horizontal"
            onFinish={handleAssignforStudent}
            style={{ maxWidth: 600 }}
          >
            {renderNameforTopicModal}

            <Form.Item
              label={
                <div className={cls('title_model')} style={{ fontSize: '14px' }}>
                  Sinh viên
                </div>
              }
              rules={[{ required: true, message: 'Vui lòng chọn sinh viên' }]}
            >
              <Select
                placeholder={'Chọn sinh viên'}
                onChange={handleSelectChange}
                options={studentOfList.map((val) => {
                  return {
                    value: val.id,
                    label: `${val.name}  - (Mã: ${val.username})`,
                  };
                })}
              />
            </Form.Item>

            <Form.Item label=" ">
              <Row justify={'end'} align={'middle'}>
                <Col offset={20}>
                  <Button type="primary" htmlType="submit">
                    Gắn đề tài
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default TopicManagement;

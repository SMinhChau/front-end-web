import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './TopicManagement.module.scss';
import Term from '../../entities/term';
import termService from '../../services/term';
import { useAppSelector } from '../../redux/hooks';
import { Select, Table, Button, Modal, Form, Input, InputNumber, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import topicService from '../../services/topic';
import Topic from '../../entities/topic';
import { default as base_column } from './column';
import { toast, ToastContainer } from 'react-toastify';
import Config from '../../utils/config';
import ColumnSetting from '../column_setting/ColumnSetting';
import TextArea from 'antd/es/input/TextArea';
import { showMessage, showMessageEror } from '../../constant';
import { EnumRole } from 'src/enum';
import RejectUserLogin from '../notification/RejectUserLogin';

const cls = classNames.bind(style);

interface TopicData extends Topic {
  key: number;
}

const TopicManagement = () => {
  const userState = useAppSelector((state) => state.user).user;
  const _userState = useAppSelector((state) => state.user);

  const [topic, setTopic] = useState<Array<TopicData>>([]);
  const [open, setOpen] = useState(false);

  const [status, setStatus] = useState('insert');
  const [initData, setInitData] = useState({});
  const [idUpdate, setIdUpdate] = useState<number | null>(null);
  const [columnVisible, setColumnVisible] = useState<Array<any>>([]);
  const termState = useAppSelector((state) => state.term);

  const baseColumns = [
    ...base_column,
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: any) => (
        <span
          style={{
            padding: '5px 10px',
            color: '#fff',
            backgroundColor: status === 'PEDING' ? '#29CC57' : '#FEC400',
            fontSize: '11px',
            borderRadius: '100px',
            fontWeight: '600',
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: '',
      dataIndex: 'id',
      render: (id: any) => (
        <Button onClick={() => deleteTerm(id)}>
          <DeleteOutlined style={{ color: 'red' }} />
        </Button>
      ),
    },
    {
      title: '',
      dataIndex: 'id',
      render: (id: any) => {
        return (
          <Button onClick={() => showEditModal(id)}>
            <EditOutlined style={{ color: '#30a3f1' }} />
          </Button>
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
        setTopic(
          response.data.map((value: Topic) => {
            return {
              ...value,
              key: value.id,
            };
          }),
        );
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
  const handleCancel = () => {
    setOpen(false);
    setInitData({});
  };
  const onFinish = (value: any) => {
    if (status === 'insert')
      topicService
        .createTopic({
          ...value,
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
        })
        .then((_response) => {
          showMessage('Cập nhật thành công', 5000);
          setOpen(false);
          getTopic(termState.termIndex.id);
        })
        .catch((error) => {
          showMessageEror(error.response.data.error, 5000);
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
        showMessageEror(error.response.data.error, 5000);
      });
  };
  const showEditModal = (id: number) => {
    setOpen(true);
    setStatus('update');
    setIdUpdate(id);
    const t = topic.filter((value) => value.id === id)[0];
    setInitData(t);
  };

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
          >
            <Form
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 15 }}
              layout="horizontal"
              onFinish={onFinish}
              size="large"
              style={{ maxWidth: 600 }}
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
                      <Button type="primary" htmlType="submit">
                        Tạo
                      </Button>
                    </Form.Item>
                  </Row>
                </Col>
              </Row>
            </Form>
          </Modal>
        </div>
        <Table columns={baseColumns} dataSource={topic} />
      </div>
    </>
  );
};

export default TopicManagement;

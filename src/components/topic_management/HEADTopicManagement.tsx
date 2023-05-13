import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import style from './TopicManagement.module.scss';
import { useAppSelector } from '../../redux/hooks';
import { Table, Button, Modal, Form, Input, Row, Tag, Space, Tooltip } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import topicService from '../../services/topic';
import Topic from '../../entities/topic';

import { ToastContainer } from 'react-toastify';

import { getNameStatus, showMessage } from '../../constant';
import { ColumnsType } from 'antd/es/table';
const { TextArea } = Input;

const cls = classNames.bind(style);

interface TopicData extends Topic {
  key: number;
}

const HEADTopicManagement = () => {
  const [topic, setTopic] = useState<Array<TopicData>>([]);
  const [open, setOpen] = useState(false);

  const [status, setStatus] = useState<'ACCEPT' | 'REFUSE'>('ACCEPT');
  const [idUpdate, setIdUpdate] = useState<number | null>(null);
  const [columnVisible, setColumnVisible] = useState<Array<any>>([]);

  const termState = useAppSelector((state) => state.term);

  const baseColumns: ColumnsType<any> = [
    {
      title: 'Tên đề tài',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div className={cls('text_colum')}>{text}</div>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantityGroupMax',
      key: 'quantityGroupMaxh',
      width: 80,
      render: (text) => <div className={cls('text_colum')}>{text}</div>,
    },

    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',

      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Mục tiêu',
      dataIndex: 'target',
      key: 'target',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Chuẩn đầu ra',
      dataIndex: 'standradOutput',
      key: 'standradOutput',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Yếu cầu đầu vào',
      dataIndex: 'requireInput',
      key: 'requireInput',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Bình luận',
      dataIndex: 'comment',
      key: 'comment',
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto' }}>
          {text}
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (status: any) => {
        return (
          <Tag color={status === 'PEDING' ? 'green' : 'red'} key={getNameStatus(status)}>
            {getNameStatus(status)}
          </Tag>
        );
      },
    },
    {
      title: '',
      render: (row: any) => {
        return row.status === 'PEDING' ? (
          <Space wrap>
            <Tooltip title="Chấp nhận đề tài" color={'geekblue'}>
              <Button onClick={() => accept(row.id)}>
                <CheckOutlined style={{ color: 'red' }} />
              </Button>
            </Tooltip>
          </Space>
        ) : (
          <></>
        );
      },
    },
    {
      title: '',
      render: (row: any) => {
        return row.status === 'PEDING' ? (
          <Space wrap>
            <Tooltip title="Từ chối đề tài" color={'volcano'}>
              <Button onClick={() => reject(row.id)}>
                <CloseOutlined style={{ color: '#30a3f1' }} />
              </Button>
            </Tooltip>
          </Space>
        ) : (
          <></>
        );
      },
    },
  ];

  useEffect(() => {
    getListOfTopic();
  }, [termState]);

  const getListOfTopic = () => {
    if (termState.termIndex.id) {
      topicService
        .getTopic({ termId: termState.termIndex.id })
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
    }
  };

  const showModal = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const onFinish = (value: any) => {
    const data = {
      status,
      ...value,
    };
    topicService.updateTopicStatus(idUpdate as number, data).then(() => {
      showMessage('Đã duyệt đề tài', 3000);
      setOpen(false);
      getListOfTopic();
    });
  };

  const accept = (id: number) => {
    setStatus('ACCEPT');
    setIdUpdate(id);
    showModal();
  };
  const reject = (id: number) => {
    setStatus('REFUSE');
    setIdUpdate(id);
    showModal();
  };

  return (
    <div className={cls('topic_management')}>
      <ToastContainer />

      <div className={cls('semester_func')}>
        <div className={cls('selectTerm')}></div>
        <div style={{ display: 'flex', alignItems: 'center' }}></div>

        <Modal
          destroyOnClose
          open={open}
          title={<div className={cls('modal')}>Ghi chú</div>}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>,
          ]}
        >
          <Form name="control-hooks" onFinish={onFinish} style={{ maxWidth: 600 }}>
            <Form.Item name="comment" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
              <TextArea rows={4} />
            </Form.Item>
            <Row justify={'end'}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Xác nhận
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </Modal>
      </div>

      <Table columns={baseColumns} dataSource={topic} pagination={{ pageSize: 2 }} />
    </div>
  );
};

export default HEADTopicManagement;

import { useState, useEffect, useMemo } from 'react';
import classNames from 'classnames/bind';
import style from './TopicManagement.module.scss';
import { useAppSelector } from '../../redux/hooks';
import { Table, Button, Modal, Form, Input, Row, Tag, Space, Tooltip, Col } from 'antd';
import { CheckOutlined, CloseOutlined, DatabaseFilled, ExportOutlined } from '@ant-design/icons';
import topicService from '../../services/topic';
import Topic from '../../entities/topic';

import { ToastContainer } from 'react-toastify';

import { getNameStatus, showMessage } from '../../constant';
import { ColumnsType } from 'antd/es/table';
import Select from 'react-select';
import { log } from 'console';
import TruncatedText from './TruncatedText';
const { TextArea } = Input;

const cls = classNames.bind(style);

interface TopicData extends Topic {
  key: number;
}

interface Filter {
  value: number;
  label: string;
}
const HEADTopicManagement = () => {
  const [topic, setTopic] = useState<Array<Topic>>([]);
  const [open, setOpen] = useState(false);

  const [status, setStatus] = useState<'ACCEPT' | 'REFUSE'>('ACCEPT');
  const [idUpdate, setIdUpdate] = useState<number | null>(null);
  const [columnVisible, setColumnVisible] = useState<Array<any>>([]);
  const [listLerturer, setListLecturer] = useState<Array<Filter>>([]);
  const [data, setData] = useState<Array<Topic>>([]);

  const termState = useAppSelector((state) => state.term);

  const baseColumns: ColumnsType<Topic> = [
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

      render: (text) => {
        return (
          <>
            <div className={cls('text_colum')}>{text && text.slice(0, 90)}....</div>{' '}
          </>
        );
      },
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
      render: (text) => {
        return (
          <>
            <div className={cls('text_colum')}>{text && text.slice(0, 90)}....</div>{' '}
          </>
        );
      },
    },
    {
      title: 'Mục tiêu',
      dataIndex: 'target',
      key: 'target',

      render: (text) => {
        return (
          <>
            <div className={cls('text_colum')}>{text && text.slice(0, 90)}....</div>{' '}
          </>
        );
      },
    },
    {
      title: 'Chuẩn đầu ra',
      dataIndex: 'standradOutput',
      key: 'standradOutput',

      render: (text) => {
        return (
          <>
            <div className={cls('text_colum')}>{text && text.slice(0, 90)}....</div>{' '}
          </>
        );
      },
    },
    {
      title: 'Yêu cầu đầu vào',
      dataIndex: 'requireInput',
      key: 'requireInput',

      render: (text) => {
        return (
          <>
            <div className={cls('text_colum')}>{text && text.slice(0, 90)}....</div>
          </>
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
      title: 'Giảng viên',
      dataIndex: 'lecturer',
      key: 'lecturer',

      filterSearch: true,
      render: (text) => (
        <div className={cls('text_colum')} style={{ maxHeight: '160px', overflow: 'auto' }}>
          {text.name}
        </div>
      ),
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
      width: 80,
      render: (status: any) => {
        return (
          <Tag color={status === 'PEDING' ? 'green' : 'red'} key={getNameStatus(status)}>
            <div style={{ color: getNameStatus(status)?.toLocaleLowerCase() === 'Đã duyệt'.toLocaleLowerCase() ? 'green' : 'red' }}>
              {getNameStatus(status)}
            </div>
          </Tag>
        );
      },
    },
    {
      title: '',
      width: 60,
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
      width: 60,
      render: (row: any) => {
        return row.status === 'PEDING' ? (
          <Space wrap style={{ marginLeft: '5px' }}>
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
          setTopic(response.data);
          setData(response.data);
          const _data: Filter[] = response.data.reduce(
            (accumulator: { value: number; label: string }[], current: { lecturer: { id: number; name: string } }) => {
              const existingItem = accumulator.find((item) => item.value === current.lecturer.id);
              if (!existingItem) {
                accumulator.push({ value: current.lecturer.id, label: current.lecturer.name });
              }
              return accumulator;
            },
            [],
          );
          setListLecturer(_data);
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

  const handleSelectChange = (selectedOptionReview: any) => {
    const id = selectedOptionReview.value;
    console.log('name');
    const m = topic.filter((value) => value.lecturer?.id === id);
    setData(m);
    console.log('m ->', m);
  };
  const handleGetAll = (selectedOptionReview: any) => {
    setData(topic);
  };
  const renderTable = useMemo(() => {
    return <Table columns={baseColumns} dataSource={data} pagination={{ pageSize: 7 }} />;
  }, [data, handleSelectChange]);

  return (
    <div className={cls('topic_management')}>
      <ToastContainer />

      <div className={cls('semester_func')}>
        <Button
          type="dashed"
          onClick={handleGetAll}
          size="large"
          style={{
            animation: 'none',
            color: 'rgb(80, 72, 229)',
            fontWeight: '600',
          }}
          className={cls('btn')}
        >
          Tất cả
        </Button>
        <div className={cls('selectTerm')}>
          <Row justify={'end'} align={'middle'} style={{ width: '100%' }}>
            <div className={cls('name')}>Chọn giảng viên</div>
            <Col>
              <div style={{ width: '200px' }}>
                <Select
                  placeholder={'Tất cả'}
                  onChange={handleSelectChange}
                  options={listLerturer.map((val) => {
                    return {
                      value: val.value,
                      label: val.label,
                    };
                  })}
                />
              </div>
            </Col>
          </Row>
        </div>
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

      {renderTable}
    </div>
  );
};

export default HEADTopicManagement;

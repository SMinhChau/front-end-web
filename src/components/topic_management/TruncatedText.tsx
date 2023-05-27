import { useStateManager } from 'react-select';

import { useState, useEffect } from 'react';
import { Button, Col, Modal, Row, Typography } from 'antd';
import classNames from 'classnames/bind';
import style from './TruncatedText.module.scss';
import { ArrowRightOutlined } from '@ant-design/icons';
import Topic from 'src/entities/topic';
const { Text } = Typography;

interface Props {
  text?: string;
  listOfTopic?: Array<Topic>;
  topicInfo?: Topic;
  topicfromDetail?: boolean;
  id?: number;
}
const cls = classNames.bind(style);

const TruncatedText: React.FC<Props> = ({ id, listOfTopic, topicInfo, topicfromDetail }) => {
  const [modal, setShowModal] = useState(false);
  const [rows, setRows] = useState(7);
  const [topic, setTopic] = useState<Topic>();

  useEffect(() => {
    if (topicfromDetail === true) {
      setTopic(topicInfo);
    } else {
      const __data = listOfTopic?.filter((value) => value.id === id)[0];
      setTopic(__data);
    }
  }, [topic, topicInfo, topicfromDetail]);

  const toggleExpand = () => {
    setShowModal(!modal);
  };

  interface Info {
    lable: string;
    value: string;
  }

  const DATA: Info[] = [
    {
      lable: 'Tên đề tài',
      value: String(topic?.name),
    },
    {
      lable: 'Mô tả',
      value: String(topic?.description),
    },
    {
      lable: 'Số lượng Sinh viên có thể đăng ký',
      value: String(topic?.quantityGroupMax),
    },

    {
      lable: 'Ghi chú',
      value: String(topic?.note),
    },
    {
      lable: 'Mục tiêu',
      value: String(topic?.target),
    },
    {
      lable: 'Chuẩn đầu vào',
      value: String(topic?.requireInput),
    },
    {
      lable: 'Yêu cầu đầu ra',
      value: String(topic?.standradOutput),
    },
    {
      lable: 'Bình luận',
      value: topic?.comment ? String(topic?.comment) : 'Chưa có bình luận ',
    },
  ];

  return (
    <>
      {/* <Text ellipsis className={cls('name')}>
        {text}
      </Text> */}

      {modal === false && (
        <div className={cls('text_colum')} style={{ color: 'blue' }}>
          <Button
            className={cls('btn')}
            onClick={toggleExpand}
            type="dashed"
            icon={<ArrowRightOutlined color="blue" />}
            size="large"
            style={{
              animation: 'none',
              color: 'blue',
              fontWeight: '600',
            }}
          >
            Xem thêm
          </Button>
        </div>
      )}

      <Modal
        title={<div className={cls('lableModal')}>Chi tiết đề tài</div>}
        footer={[
          <Button key="back" onClick={() => setShowModal(false)}>
            Đóng
          </Button>,
        ]}
        centered
        open={modal}
        onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
        width={1000}
      >
        <div className={cls('content_modal')}>
          {DATA.map((i) => {
            if (i.lable == 'Tên đề tài') {
              return (
                <div key={i.lable} style={{ paddingBottom: '10px' }}>
                  <Row>
                    <Col>
                      <div className={cls('lable')}> {`*** ${i.lable}`}</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className={cls('lable_title')}>
                        {i.value &&
                          i.value
                            ?.replace(/2\./g, '\n2.' || '\n-')
                            .replace(/3\./g, '\n3.' || '\n-')
                            .replace(/4\./g, '\n4.' || '\n-')
                            .replace(/5\./g, '\n5.' || '\n-')
                            .replace(/6\./g, '\n6.' || '\n-')
                            .replace(/7\./g, '\n7.' || '\n-')
                            .replace(/8\./g, '\n8.' || '\n-')}
                      </div>
                    </Col>
                  </Row>
                </div>
              );
            }

            return (
              <div style={{ paddingBottom: '10px' }}>
                <Row>
                  <Col>
                    <div className={cls('lable')}>{`*** ${i.lable}`}</div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className={cls('value')}>
                      {i.value &&
                        i.value
                          ?.replace(/2\./g, '\n2.' || '\n-')
                          .replace(/3\./g, '\n3.' || '\n-')
                          .replace(/4\./g, '\n4.' || '\n-')
                          .replace(/5\./g, '\n5.' || '\n-')
                          .replace(/6\./g, '\n6.' || '\n-')
                          .replace(/7\./g, '\n7.' || '\n-')
                          .replace(/8\./g, '\n8.' || '\n-')}
                    </div>
                  </Col>
                </Row>
              </div>
            );
          })}
        </div>
        {/* <div className={cls('name')}>
          {text &&
            text
              .replace(/2\./g, '\n2.' || '\n-')
              .replace(/3\./g, '\n3.' || '\n-')
              .replace(/4\./g, '\n4.' || '\n-')
              .replace(/5\./g, '\n5.' || '\n-')
              .replace(/6\./g, '\n6.' || '\n-')
              .replace(/7\./g, '\n7.' || '\n-')
              .replace(/8\./g, '\n8.' || '\n-')}
        </div> */}
      </Modal>
    </>
  );
};

export default TruncatedText;

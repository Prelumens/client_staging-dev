import {  Collapse, Select, Avatar, Space, Row, Col,Button, Tag, Image, Tooltip, Modal   } from 'antd';
const { Panel } = Collapse;
const { Option } = Select;
import Link from "next/link";
import { toast } from 'react-toastify'
import { SnippetsOutlined,
    EditOutlined,
    DeleteOutlined, } from '@ant-design/icons';

const ActivityQuestions = ({
    questionArray,
    setQuestionArray,
    setEditQuestion,
    setVisible,
    setActiveQuestion,
    editQuestion,
    setQuestionIndex
}) => {
    const deleteQuestion = (index) => {
        const temp = [...questionArray]
        const deleteItem = () => {
            console.log("deleteItem")
            temp.splice(index, 1)
            setQuestionArray(temp)
            toast.success("Question removed")
        }
        Modal.confirm({
            title: 'Are you sure you want to delete this question?',
            onOk: () => {
              deleteItem()
            }
        })
	}
    const handleEdit = (index) =>{
        const temp = [...questionArray]
        setQuestionIndex(index)
        setEditQuestion(true)
        setVisible(true);
        setActiveQuestion(temp[index]);
    }
    return (
        <Collapse
        bordered={false}
        expandIconPosition="right"
        >
            {questionArray?.map((question, index) => (
                <Panel
                key={index}
                header={
                    <Space>
                        <Avatar size="small" >{index +1}</Avatar>
                        <li>{question.titleField}</li>
                    </Space>
                }
                extra={
                    <Space size="middle">
                        <Tooltip title="Remove" onClick={() => deleteQuestion(index)}>
                            <DeleteOutlined style={{ fontSize: '18px' }} className="text-danger" />
                        </Tooltip>
                        <Tooltip title="Edit" onClick={() => handleEdit(index)}>
                            <EditOutlined style={{ fontSize: '18px' }} className="text-warning"/>
                        </Tooltip>

                        {question.type === 'plain-text' ? (
                            <Tag color="gold">Text</Tag>
                        ):(
                            <Tag color="geekblue">Image</Tag>
                        )}
                    </Space >
                }
                >
                    <Row gutter={[40, 16]}>
                        {question.choices.map((choice, ind) => (
                            <Col span={12} key={ind} className="text-center">
                                {!choice.image ? (
                                    <>
                                        {choice.text === question.correctAnswer ? (
                                            <Button type="primary" shape="round" size="large" block>
                                                {choice.text}
                                            </Button>
                                        ):(
                                            <Button danger shape="round" size="large" block>
                                                {choice.text}
                                            </Button>
                                        )
                                        }
                                    </>
                                ):(
                                    <Space size="large" direction='vertical' align='center'>
                                        {choice.image.Key === question.correctAnswer ? (
                                            <Avatar
                                                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                                src={
                                                    <Image
                                                    src={choice.image.Location}
                                                    />
                                                }
                                                style={{border:'5px solid #1890ff'}}
                                            />
                                        ):(
                                            <Avatar
                                                size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
                                                src={
                                                    <Image
                                                    src={choice.image.Location}
                                                    />
                                                }
                                                style={{border:'5px solid #ff4d4f'}}
                                            />
                                        )
                                        }
                                        {choice.text ?
                                            <Button type="secondary" shape="round" size="large" block>
                                                {choice.text}
                                            </Button>
                                        :''
                                        }
                                    </Space>
                                )
                                }
                            </Col>
                        ))}
                    </Row>
                </Panel>
            ))}

        </Collapse>
    );
};

export default ActivityQuestions;

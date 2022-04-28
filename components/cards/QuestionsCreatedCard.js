import { Descriptions, Card, Row, Col, Tag, Badge, Popconfirm, Modal, Image, Avatar } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import {EditOutlined, DeleteOutlined, ConsoleSqlOutlined} from "@ant-design/icons"
import { toast } from 'react-toastify';
import { useRouter } from "next/router";
import AddQuestionForm from "../../components/forms/AddQuestionForm"

const QuestionsCreatedCard = ({
    questionArray,
    quiz,
    setVisible,
    setEditQuestion,
    addQuestionHandle,
    editQuestionHandle,
    editPage,
    viewPage,
    setQuestionArray,
    setQuestionIndex,
    setActiveQuestion,
    editQuestion = false,
    initialQuestions
}) => {
    // destructure
    const { options } = questionArray;
    const [visibleEdit, setVisibleEdit] = useState(false);

    const router = useRouter();
    const editPageHandleDelete = async(quizId, question, index) => {
        console.log('initialQuestions',initialQuestions)
        console.log('question',question)
        console.log('initialQuestions.includes(question)',initialQuestions.includes(question))
        if(initialQuestions.includes(question)){
            try {
                const { deletedQuiz } = await axios.put(`/api/quiz/delete-question/${quizId}/${question._id}`);
                console.log(deletedQuiz)
                toast.success("Question deleted successfuly.")
                // window.location.reload(false);
            } catch (error) {
                console.log(error)
            }
        }
        let questions = [...questionArray]
        const removed = questions.splice(index, 1);
        setQuestionArray(questions)
    }
    const handleDelete = async(index) => {
        console.log('handleDelete')
        let questions = [...questionArray]
        const removed = questions.splice(index, 1);
        setQuestionArray(questions)
        toast.success("Question deleted successfuly.")
    }
    const editModalClose = () =>{
        setVisibleEdit(false)
        setActiveQuestion({})
        setToEdit({})
    }
    const handleEdit = (question,index) =>{
        setQuestionIndex(index)
        setEditQuestion(true)
        setVisible(true);
        setActiveQuestion(question);
    }


    return (
        <>
            <Row className="" gutter={[24, 0]}>
                    {questionArray.map((q, index) => (
                        <Col
                        key={index}
                        className="mb-24"
                        span={24}
                        >
                        { q.optionType === "radio" ? (
                            <Badge.Ribbon text="Single Answer" color="cyan">
                                <Card
                                bordered={false}
                                className="mt-3"
                                title={q.title}
                                actions={ !viewPage &&
                                    [<Popconfirm
                                        title="Are you sure you want to delete?"
                                        onConfirm={() => {
                                            if (editPage) editPageHandleDelete(quiz._id,q, index)
                                            else handleDelete(index)
                                        }
                                        }
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <DeleteOutlined className="text-danger"/>
                                    </Popconfirm>,
                                    <EditOutlined className="text-warning" key="edit"
                                    onClick={() => handleEdit(q,index)}
                                    />]
                                }
                                >
                                    <Descriptions>
                                        <Descriptions.Item label="Answer/s" span={3}>
                                            {q.options.map((options, index) => (
                                                <div key={index}>
                                                    {options.isCorrect &&
                                                        <div>
                                                        {options.text.length !== 0 && !options.image?.Location ?
                                                            <p>
                                                                {!options.text.includes('prelms-bucket') ? options.text : ''}
                                                            </p>
                                                        : options.text.length !== 0 ||  options.image.Location ?
                                                            <div className="text-center">
                                                                <Avatar size={200} src={options.image.Location}/>
                                                                <p>{!options.text.includes('prelms-bucket') ? options.text : ''}</p>
                                                            </div>
                                                        :''
                                                        }
                                                        </div>
                                                    }
                                                </div>
                                            ))}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Badge.Ribbon>
                        ) : q.optionType === 'check' ? (
                            <Badge.Ribbon text="Multiple Answer" color="gold">
                                <Card bordered={false} className="circlebox " title={q.title}
                                    actions={ !viewPage &&
                                        [<Popconfirm
                                            title="Are you sure you want to delete?"
                                            onConfirm={() => {
                                                if (editPage) editPageHandleDelete(quiz._id,q, index)
                                                else handleDelete(index)
                                            }
                                            }
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <DeleteOutlined className="text-danger"/>
                                        </Popconfirm>,
                                        <EditOutlined className="text-warning" key="edit"
                                        onClick={() => handleEdit(q, index)}
                                        />
                                    ]
                                    }>
                                    <Descriptions>
                                        <Descriptions.Item label="Answer/s" span={3}>
                                            {q.options.map((options, index) => (
                                                <div key={index}>
                                                    {options.isCorrect &&

                                                        <ul>
                                                            {options.text.length !== 0 && !options.image?.Location ?
                                                                <li>
                                                                    {options.text}
                                                                </li>
                                                            : options.text.length !== 0 ||  options.image?.Location ?
                                                                <li className="text-center">
                                                                    <Avatar size={200} src={options.image.Location}/>
                                                                    <div>{options.text}</div>
                                                                </li>
                                                            :''
                                                        }
                                                        </ul>
                                                    }
                                                </div>
                                            ))}
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Card>
                            </Badge.Ribbon>
                        ) : (
                            <Badge.Ribbon text="Audio Answer" color="geekblue">
                                <Card bordered={false} className="circlebox " title={q.title}
                                    actions={ !viewPage &&
                                        [<Popconfirm
                                            title="Are you sure you want to delete?"
                                            onConfirm={() => {
                                                if (editPage) editPageHandleDelete(quiz._id,q, index)
                                                else handleDelete(index)
                                            }
                                            }
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <DeleteOutlined className="text-danger"/>
                                        </Popconfirm>,
                                        <EditOutlined className="text-warning" key="edit"
                                        onClick={() => handleEdit(q,index)}
                                        />
                                    ]
                                    }>
                                    <p className="text-warning">To be manually checked.</p>
                                </Card>
                            </Badge.Ribbon>
                            )
                        }
                        </Col>
                    ))}
                </Row>
        </>
    )
};

export default QuestionsCreatedCard;
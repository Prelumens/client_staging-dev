import { Card, Button, Avatar, Image, Col  } from "antd";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Meta } = Card;

const InteractiveCard = (
{    id,
    questionArray,
    addPoint,
    state,
    answers,
    setId,
    handleSubmit
}
) => {
    const { question, isLoading, isLast } = state
    const [isClicked, setClicked] = useState(false)
    const [answered, setAnswered] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState('')

    const handleClick = (answer, index) => {
        setAnswered(true)
        let isCorrect = false
        if(answer.image){
            isCorrect = answer.image.Key.toString() === question.correctAnswer.toString()
            answers.push(answer.image.Key.toString())
        } else {
            isCorrect = answer.text.toString() === question.correctAnswer.toString()
            answers.push(answer.text.toString())
        }
        setSelectedIndex(index);
        setClicked(true)
        if (isCorrect) {
          addPoint()
        }
      }

    const onNext = () => {
        setAnswered(false)
        console.log('answers', answers)
        if(isLast){
            handleSubmit()
        } else {
            setId(prevState => prevState + 1)
            setClicked(false)
        }
    }
    return (
        <div className="px-4 pt-5">
            <div className="h4 mb-4 title">
                {question.titleField}

            </div>
            <div className="pb-3">
                {question.choices && question.choices.map((item, index) => (
                    <div key={index} className={`${!answered ? 'active' : '' }`}>
                        {!item.image?
                            <Button
                                onClick={() =>handleClick(item, index)}
                                type="primary"
                                block
                                disabled={answered}
                                size="large"
                                shape="round"
                                className={`mb-3
                                    ${isClicked ? 'disabled' : 'notAnswered' }
                                    ${isClicked ? index === selectedIndex ? item.text === question.correctAnswer ? 'choice-correct': 'choice-wrong': "" : ""}
                                    ${answered && item.text === question.correctAnswer && index !== selectedIndex && 'choice-correct'}`
                                }
                            >
                                    <div className="row d-flex align-items-center w-100 mb-3">
                                        <div className="col-2 m-0">{String.fromCharCode(65 + index)}</div>
                                        <div className="col-8 m-0 choice-text">{item.text}</div>
                                        <div className="col-2 m-0 choice-icon ">
                                            { isClicked ?
                                                index === selectedIndex ?
                                                    item.text === question.correctAnswer ?
                                                    (<CheckCircleOutlined style={{ fontSize: '24px'}}/>)
                                                    : (<CloseCircleOutlined style={{ fontSize: '24px'}}/>)
                                                : ""
                                            : ""
                                            }
                                        </div>
                                    </div>
                            </Button>
                        :
                        <div className={`text-center ${!answered ? 'image-type-active' : '' }`}>
                            <Button
                                disabled={answered}
                                shape="round"
                                style={{height:'fit-content', border:'0px'}}
                                className={`p-3 mb-1
                                    ${isClicked ? index === selectedIndex ? item.image.Key === question.correctAnswer ? 'choice-correct': 'choice-wrong': "" : ""}
                                    ${answered && item.image.Key === question.correctAnswer && index !== selectedIndex && 'choice-correct'}`
                                }
                            >
                                <Avatar
                                    className={` btn
                                        ${isClicked ? 'disabled' : '' }`
                                    }
                                    disabled={answered}
                                    onClick={() =>handleClick(item, index)}
                                    size={200}
                                    style={{borderRadius:'24px'}}
                                    src={item.image.Location}
                                    shape='square'
                                />

                            </Button>
                        </div>
                        }
                    </div>
                ))}
            </div>
            <div className="mb-3 question-toggle-btn">
                { isClicked &&
                    <Button onClick={onNext} className="mb-3" type="dashed">
                        { isLast
                            ? <p>SUBMIT</p>
                            : <p>NEXT</p>
                        }
                    </Button>
                }
            </div>
        </div>
    );
};

export default InteractiveCard;

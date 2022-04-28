import { Card, Button, Skeleton  } from "antd";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Meta } = Card;

const InteractiveResultCard = (
    { score }
) => {
    return (
        <div className="px-4 pt-5 text-center">
            <div className="mb-4 results">
                <img className="pb-3 result-gif" src="../../gif/exam.gif" alt="Exam logo" />
                <h5 className="py-3 bold">Activity Result</h5>
                <div className="pb-3">Good job! You got {score} points!</div>
                <Button size='large' type="primary" href="/user" className="mb-4">Home</Button>
            </div>
        </div>
    );
};

export default InteractiveResultCard;

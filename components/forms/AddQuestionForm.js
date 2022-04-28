import React, { useState, useRef, useEffect } from 'react'
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { Input, Select, Button, Tooltip, Space, Row, Col, message,Avatar, Image, Badge, Modal  } from 'antd';
import {
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    SaveOutlined,
	FileAddOutlined,
	PictureOutlined
} from "@ant-design/icons";
import { toast } from 'react-toastify';

const AddQuestionForm = ({
    // default values
	title = '',
	opType = 'radio',
	opArray,
	index = -1,

    // passed props
    visible,
    setVisible,
	addQuestionHandle,
    editQuestionHandle,
    question,
    editQuestion,
    setVisibleEdit,
	editPage,
	setEditQuestion
}) => {
    const { TextArea } = Input;
    const { Option } = Select;
	const [optionType, setOptionType] = useState('radio')
	const [optionsArray, setOptionsArray] = useState([])
	const [editedOption, setEditedOption] = useState(null)
	const [editOpIndex, setEditOpIndex] = useState(-1)
	const [titleField, setTitleField] = useState('')
	const [image, setImage] = useState({})
	const [imageOption, setImageOption] = useState({})
	const optionsRef = useRef(null)
	const checkBoxRef = useRef(null)
    const handleTypeChange = (value) => {
		console.log("type", value)
		setOptionType(value)
	}


    useEffect(() => {
		if (editQuestion && question) {
			console.log('question',question)
			setTitleField(question.title)
			setOptionType(question.optionType)
			setImage(question.image)
			if (question.options) setOptionsArray(question.options)
		} else {
			setTitleField('')
			setOptionsArray([])
			setImage({})
			setOptionType('radio')
		}
	}, [visible, title, opType, opArray, question])

    const addOption = () => {
		const arr = [...optionsArray]
		let alternativeAnswer =''
		if(optionsRef.current.value.length > 0){
			alternativeAnswer = optionsRef.current.value
			if(!alternativeAnswer) return
		} else {
			alternativeAnswer = imageOption.Location
			if(!alternativeAnswer) return
		}
		if(!imageOption){
			if (optionsRef.current.value.length === 0) return
			if (
			optionsArray.findIndex((op) => op.text === optionsRef.current.value) !==
			-1
		) {
			message.error('Option already exists.')
			return
		}
		}


		if (optionType === 'radio' && checkBoxRef.current.checked)
			// For radio options, set all other options incorrect
			arr.forEach((op) => (op.isCorrect = false))

		arr.push({
			text: alternativeAnswer,
			image: imageOption,
			isCorrect: checkBoxRef.current.checked,
		})
		console.group('imageOption',imageOption)
		optionsRef.current.value = ''
		checkBoxRef.current.checked = false
		setImageOption({})
		setOptionsArray(arr)
	}
    const deleteHandler = (index) => {
		const temp = [...optionsArray]
		temp.splice(index, 1)
		setOptionsArray(temp)
		setEditOpIndex(-1)
	}

    const handleEdit = (index) => {
		if (editOpIndex === -1) {
			setEditOpIndex(index)
			setEditedOption(optionsArray[index].text)
		}
	}

    const saveEdited = () => {
		const temp = [...optionsArray]
		temp[editOpIndex].text = editedOption
		setOptionsArray(temp)
		setEditOpIndex(-1)
	}

    const addQuestionCallBack = () => {
		const tempArr = [...optionsArray]
		if(optionType !== "audio"){
			if (optionsRef.current.value.length !== 0) {
				// For radio options, set all other options incorrect
				if (optionType === 'radio' && checkBoxRef.current.checked)
					tempArr.forEach((op) => (op.isCorrect = false))

				tempArr.push({
					text: optionsRef.current.value,
					isCorrect: checkBoxRef.current.checked,
				})
			}
		}
		// Error Handling
		if (!titleField.length && optionsArray.length < 2) {
			message.error('Please add Question and atleast 2 options.')
			return
		} else if (!titleField.length) {
			message.error('Please add Question.')
			return
		} else if (optionsArray.length < 2 && optionType !== "audio") {
			message.error('Number of Options must be greater than 1.')
			return
		}
		const correctOp = optionsArray.filter((op) => op.isCorrect)
		console.log("correctOp", correctOp.isCorrect)
		if (correctOp.length < 1 && optionType !== "audio") {
			message.error('No correct option was selected.')
			return
		}
		if (index !== -1) addQuestionHandle(titleField, optionType, tempArr, index, correctOp, image)
		else {
            addQuestionHandle(titleField, optionType, tempArr, correctOp,image)
            toast("Question added!");
            setVisible(false)
            setTitleField('')
			setOptionsArray([])
			setImage({})
			setImageOption({})
			setOptionType('radio')
        }
	}

    const editQuestionCallBack = () => {
		const tempArr = [...optionsArray]
		if(optionType !== "audio"){
			if (optionsRef.current.value.length !== 0) {
				// For radio options, set all other options incorrect
				if (optionType === 'radio' && checkBoxRef.current.checked)
					tempArr.forEach((op) => (op.isCorrect = false))

				tempArr.push({
					text: optionsRef.current.value,
					isCorrect: checkBoxRef.current.checked,
				})
			}
		}
		// Error Handling
		if (!titleField.length && optionsArray.length < 2) {
			message.error('Please add Question and atleast 2 options.')
			return
		} else if (!titleField.length) {
			message.error('Please add Question.')
			return
		} else if (optionsArray.length < 2 && optionType !== "audio") {
			message.error('Number of Options must be greater than 1.')
			return
		}
		const correctOp = optionsArray.filter((op) => op.isCorrect)
		if (correctOp.length < 1 && optionType !== "audio") {
			message.error('No correct option was selected.')
			return
		}
		if (index !== -1) editQuestionHandle(titleField, optionType, tempArr, index, correctOp, image)
		else {
            editQuestionHandle(titleField, optionType, tempArr, index, correctOp, image)
            setVisible(false)
            setTitleField('')
			setOptionsArray([])
			setImage({})
			setImageOption({})
			setOptionType('radio')
        }
	}

	const handleImage = (e) => {
		let file = e.target.files[0];

		//resize
		Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
		  try {
			let { data } = await axios.post('/api/s3/upload', {
				image: uri,
				folder: 'activities/images'
			});
			console.log('IMAGE UPLOADED', data)
			//set image in the state, set loading to false
			setImage(data)
			message.success("Image uploaded succesfully!")
		  } catch (err) {
			console.log(err)
			message.error('Image upload failed. Try later')
		  }
		})
	};

	const handleImageRemove = async () => {
		console.log('REMOVE IMAGE')
		try {
		  // const res = await axios.post('/api/course/remove-image', { image })
		  setImage({})
		} catch (err) {
		  console.log(err)
		  message.error('Image remove failed. Try later')
		}
	  }
	const handleOptionImage = (e) => {
		let file = e.target.files[0];

		//resize
		Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
		  try {
			let { data } = await axios.post('/api/s3/upload', {
				image: uri,
				folder: 'activities/images'
			});
			//set image in the state, set loading to false
			setImageOption(data)
			message.success("Image uploaded succesfully!")
		  } catch (err) {
			console.log(err)
			message.error('Image upload failed. Try later')
		  }
		})
	}

    return(
        <>

			<Modal
				title={!editQuestion ? "+ Add Question" : "Edit Question"}
				centered
				visible={visible}
				onCancel={() => {
					setVisible(false)
					setEditQuestion(false)
				}}
				footer={null}
				width={750}
			>
            <div className='questionCard'>
				<Row>
					<Col span={15}>
                    	<h3 className='font-weight-bold'>Question:</h3>
					</Col>
					<Col span={9} className="text-right">
						<Select
							placeholder="Question Type"
							onChange={handleTypeChange}
							defaultValue={optionType}
							value={optionType}
						>
							<Option className='selectOp' value='radio'>Single Answer</Option>
							<Option className='selectOp' value='check'>Multiple Answers</Option>
							<Option className='selectOp' value='audio'>Audio Answer</Option>
						</Select>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col span={22}>
						<TextArea
							placeholder="Type Question Here"
							autoFocus
							allowClear
							className='p-2'
							value={titleField}
							onChange={(e) => setTitleField(e.target.value)}
						/>
						<div className='mt-2 p-2'>
						{image?.Location &&
							<Badge count={"X"} onClick={handleImageRemove} className="pointer">
								<Image width={200} src={image.Location} />
							</Badge>
						}
						</div>
					</Col>
					<Col className='text-left align-center p-0'>
					<Tooltip title="Attach Image">
						<label className="btn p-0 pt-1">
							<input
								type="file"
								name="image"
								onChange={handleImage}
								accept="image/*"
								hidden
							/>
							<Avatar icon={<FileAddOutlined style={{fontSize:'18px'}}/>}/>
						</label>
					</Tooltip>
					</Col>
				</Row>
				{optionType !== 'audio' && (
					<>
					<Row>
						<h5>Choices:</h5>
					</Row>
					<div className='create-options' id='one-op'>
						{optionsArray.map((option, index) => (
								<Row gutter={[8, 16]} key={index}>
									<Col span={1} >
									<input
										type={optionType === 'radio' ? 'radio' : 'checkbox'}
										disabled={true}
										className='radio-in'
										name='option'
										checked={option.isCorrect}
									/>
									</Col>
									<Col span={17}>

										{editOpIndex === index ? (
											<input
												value={editedOption}
												onChange={(e) => setEditedOption(e.target.value)}

											/>
										) : (
											<Space>
												{option.image?.Location ?
													<Avatar size={64} shape="square" src={option.image.Location}/>
												:''}
												<p className='add-op'>{!option.text.includes('prelms-bucket') ? option.text : ''}</p>
											</Space>
										)}
									</Col>
									<Col span={6} style={{alignSelf:'center'}}>
									<Space>
										{editOpIndex === index ? (
											<Tooltip title="Save">
												<SaveOutlined
													onClick={() => saveEdited()}
													className="h6 pointer text-success"
												/>
											</Tooltip>

										) : (
											<Tooltip title="Edit">
												<EditOutlined
													onClick={() => handleEdit(index)}
													className="h6 pointer text-warning"
												/>
											</Tooltip>
										)}
										<Tooltip title="Delete">
											<DeleteOutlined
												onClick={() => {
													deleteHandler(index)
												}}
												className="h6 pointer text-danger"
											/>
										</Tooltip>
									</Space>
									</Col>
								</Row>

						))}
						</div>
						<Row className='add-op' >
							<Col span={1} style={{alignSelf:'center'}}>
								<input
									type={optionType === 'radio' ? 'radio' : 'checkbox'}
									ref={checkBoxRef}
									className='radio-in'
									name='option'
								/>
							</Col>
							<Col span={17}>
								{imageOption.Location ? <Avatar size={64} shape="square" src={imageOption.Location}/> :''}
								<input
									type='text'
									ref={optionsRef}
									className='op-text question-choices m-2'
									style={{
										borderRadius: 0,
										border: "none",
										borderBottom: "2px solid #b7b7b7",
										width: '90%'
									}}
									placeholder={`Option ${optionsArray.length + 1}`}
								/>
							</Col>
							<Col span={6} style={{alignSelf:'center'}}>
								<Space align='center'>
									<Tooltip title="Attach Image">
										<label className="btn p-0 m-0">
											<input
												type="file"
												name="image"
												onChange={handleOptionImage}
												accept="image/*"
												hidden
											/>
											<Avatar icon={<PictureOutlined />} style={{backgroundColor:'#ffc107'}}/>
										</label>
									</Tooltip>
									<Tooltip title="Add Choice">
										<Button type="primary" shape="circle" onClick={addOption}>
											<PlusCircleOutlined/>
										</Button>
									</Tooltip>
								</Space>
							</Col>
					</Row>
					</>
			)}

				<div className="modal-buttons row justify-content-end pr-3">
					<Space size="middle">
						<Button
							type="primary"
							onClick={ () => {
								if (editQuestion) editQuestionCallBack()
								else addQuestionCallBack()
							}}
						>
							{editQuestion ? 'Save ' : 'Add '}
								Question
						</Button>
					</Space>
				</div>
            </div>
            </Modal>
        </>
    );
};

export default AddQuestionForm;
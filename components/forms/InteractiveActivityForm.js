import { useState, useRef, useEffect } from 'react'
import Resizer from "react-image-file-resizer";
import axios from "axios";
import { Input, Select, Divider , Tooltip, Button, Row, Col, Radio, Space, message, Avatar, Badge, Modal   } from 'antd';
import {
    PlusCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    SaveOutlined,
	FileImageOutlined
} from "@ant-design/icons";
import { toast } from 'react-toastify';

const InteractiveActivityForm = ({
    // default values
	index = -1,
	// passed props
	question,
    visible,
    setVisible,
	addQuestionHandle,
    editQuestionHandle,
    editQuestion,
	setEditQuestion,
    setActiveQuestion
}) => {
    const { Option } = Select;
	const [type, setType] = useState('plain-text')
	const [choices, setChoices] = useState([])
	const [correctAnswer, setCorrectAnswer] = useState("")
	const [editedOption, setEditedOption] = useState(null)
	const [editOpIndex, setEditOpIndex] = useState(-1)
	const [titleField, setTitleField] = useState('')
	const [image, setImage] = useState({})
	const [uploadButtonText, setUploadButtonText] = useState("Upload Image")
	const optionsRef = useRef(null)
	const checkBoxRef = useRef(null)

	useEffect(() => {
		if (editQuestion && question) {
			console.log('question',question)
			setTitleField(question.titleField)
			setType(question.type)
			setCorrectAnswer(question.correctAnswer)
			if (question.choices) setChoices(question.choices)
		} else {
			setTitleField('')
			setChoices([])
			setType('plain-text')
		}
	}, [question])

    const handleTypeChange = (value) => {
		setType(value)
		setChoices([])
	}

	const addOption = () => {
		console.log("addOption")
		console.log("optionsRef.current.value",optionsRef.current.value)
		console.log("checkBoxRef.current.state.checked", checkBoxRef.current.state.checked)
		if (optionsRef.current.value.length === 0) return

		const arr = [...choices]
		if (
			choices.findIndex((op) => op === optionsRef.current.value) !==
			-1
		) {
			alert('Option already exists.')
			return
		}
		if(checkBoxRef.current.state.checked){
			correctAnswer = optionsRef.current.value
		}
		setCorrectAnswer(correctAnswer);
		arr.push({
			text:optionsRef.current.value
		})
		setChoices(arr)
		optionsRef.current.value = ''
		checkBoxRef.current.state.checked = false
		console.log("correctAnswer", correctAnswer)
		console.log("arr", arr)
		console.log("choices", choices)
	}
	const addOptionImage = () => {
		console.log("addOption")
		console.log("optionsRef.current.value",optionsRef.current.value)
		console.log("checkBoxRef.current.state.checked", checkBoxRef.current.state.checked)
		const arr = [...choices]
		if (
			choices.findIndex((op) => op === optionsRef.current.value) !==
			-1
		) {
			alert('Option already exists.')
			return
		}


		if(checkBoxRef.current.state.checked){
			if(type === 'plain-text'){
				correctAnswer = optionsRef.current.value
			} else {
				correctAnswer = image.Key
			}
		}
		setCorrectAnswer(correctAnswer);
		if(image?.Location){
			arr.push({
				text: optionsRef.current.value,
				image: image
			})
		} else {
			message.error('Please attach an image.')
		}
		setChoices(arr)
		optionsRef.current.value = ''
		checkBoxRef.current.state.checked = false
		setUploadButtonText("Upload Image")
		setImage(null)
	}
	const handleEdit = (index) => {
		if (editOpIndex === -1) {
			setEditOpIndex(index)
			setEditedOption(choices[index].text)
		}
	}

    const saveEdited = () => {
		const temp = [...choices]
		temp[editOpIndex].text = editedOption
		setChoices(temp)
		setEditOpIndex(-1)
	}

	const deleteHandler = (index) => {
		const temp = [...choices]
		if(temp[index].text === correctAnswer){
			correctAnswer = ""
			setCorrectAnswer("")
		}
		temp.splice(index, 1)
		setChoices(temp)
		setEditOpIndex(-1)
	}

	const addQuestionCallBack = () => {
		const tempArr = [...choices]
		// Error Handling
		if (!titleField.length && choices.length < 2) {
			message.error('Please add Question and atleast 2 options.');
			return
		} else if (!titleField.length) {
			message.error('Please add Question.')
			return
		} else if (choices.length < 2) {
			message.error('Number of Options must be greater than 1.')
			return
		}
		if (!correctAnswer) {
			message.error('No correct option was selected.')
			return
		}
		console.log("addQuestionCallBack")
		if (index !== -1) addQuestionHandle(titleField, type, tempArr,correctAnswer, index)
		else {
            addQuestionHandle(titleField, type, tempArr,correctAnswer)
            toast("Question added!");
            setVisible(false)
            setTitleField('')
			setChoices([])
			setType('plain-text')
        }
	}
	const editQuestionCallBack = () => {
		const tempArr = [...choices]
		// Error Handling
		if (!titleField.length && choices.length < 2) {
			message.error('Please add Question and atleast 2 options.');
			return
		} else if (!titleField.length) {
			message.error('Please add Question.')
			return
		} else if (choices.length < 2) {
			message.error('Number of Options must be greater than 1.')
			return
		}
		if (!correctAnswer) {
			message.error('No correct option was selected.')
			return
		}
		editQuestionHandle(titleField, type, tempArr,correctAnswer)
		setVisible(false)
	}
	const handleImage = (e) => {
		let file = e.target.files[0];
		//show file name
		setUploadButtonText(file.name)

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
			toast('Image upload failed. Try later')
		  }
		})
	};
    return(
        <>
        <Modal
          title={!editQuestion ? "+ Add Question" : "Edit Question"}
          centered
          visible={visible}
          onCancel={() => {
			setVisible(false)
			setEditQuestion(false)
			setActiveQuestion({})
		}}
          footer={null}
          width={750}
        >
			<Row className='mb-2'>
				<Col span={24} className="text-right">
					<Select
						defaultValue={type}
						placeholder="Question Type"
						onChange={handleTypeChange}
					>
						<Option value='plain-text'>Plain Text</Option>
						<Option value='image'>Images</Option>
					</Select>
				</Col>

			</Row>
			<Input
				placeholder="Type question here"
				value={titleField}
				onChange={(e) => setTitleField(e.target.value)}
			/>
			<Divider />
			<div>
				{choices.map((choice, index) => (
					<Row className='instruction-list-item' key={index} gutter={[16, 16]}>
						<Col>
							<Radio
								checked={type ==='plain-text' ? (
									choice.text === correctAnswer
								):(
									choice.image.Key === correctAnswer
								)
								}
							>
								{editOpIndex === index ? (
									<input
										value={editedOption}
										onChange={(e) => setEditedOption(e.target.value)}
									/>
								) : (
									<>
									{choice.image ? (
										<>
											<Avatar size={64} shape="square" src={choice.image.Location}/>
											<p>{choice.text}</p>
										</>
									):(
										<p>{choice.text}</p>
									)}
									</>
								)}
							</Radio>
						</Col >
							<Col>
								<Space size="small">
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
			<div className='add-choice'>
				<Row gutter={[16, 16]}>
					<Col>
						<Space>
						<Radio
							ref={checkBoxRef}
						>
							{type === "plain-text" ? (
								<>
								<input
									type='text'
									ref={optionsRef}
									className='op-text question-choices m-2'
									style={{
										borderRadius: 0,
										border: "none",
										borderBottom: "2px solid #b7b7b7",
										width: '30vw'
									}}
									placeholder={`Option ${choices.length + 1}`}
								/>
									<Tooltip title="Add Choice">
										<Button type="primary" shape="circle"  onClick={addOption}>
											<PlusCircleOutlined/>
										</Button>
									</Tooltip>
								</>

							):(
								<div>
									<input
									type='text'
									ref={optionsRef}
									className='op-text question-choices m-2'
									style={{
										borderRadius: 0,
										border: "none",
										borderBottom: "2px solid #b7b7b7",
										width: '30vw'
									}}
									placeholder={`Option ${choices.length + 1}`}
								/>
									<Tooltip title="Add Choice">
											<Button type="primary" shape="circle"  onClick={addOptionImage}>
												<PlusCircleOutlined/>
											</Button>
									</Tooltip>
									<Tooltip title="Attach Image">
										<label className="btn btn-outline-secondary btn-block text-left">
                							{uploadButtonText}
											<input
												type="file"
												name="image"
												onChange={handleImage}
												accept="image/*"
												hidden
											/>
										</label>
									</Tooltip>
								</div>
							)}
						</Radio>
						</Space>
					</Col>
				</Row>
				<Divider/>
				<div className="modal-buttons row justify-content-end pr-3">
                    <Space size="middle">
                        <Button onClick={() => setVisible(false)}>Close</Button>
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

export default InteractiveActivityForm;
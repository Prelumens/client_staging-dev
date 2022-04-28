import { useState, useEffect, useContext } from 'react'
import axios from "axios";
import { useRouter } from "next/router";
import SingleCourseJumbotron from '../../components/cards/SingleCourseJumbotron';
import PreviewModal from "../../components/modal/PreviewModal";
import SingleCourseLessons from '../../components/cards/SingleCourseLessons';
import { Context } from '../../context';
import { toast } from "react-toastify";
import { Modal, Button, Input } from 'antd';
import { KeyOutlined } from '@ant-design/icons';

const SingleCourse = ({ course }) => {

    const router = useRouter();
    const { slug } = router.query;

    //state
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);

    const [enrolled, setEnrolled] = useState({})

    //context
    const { state: { user } } = useContext(Context)

    //enrollment key
    const [enrollmentKeyModal, setEnrollmentKeyModal] = useState(false)
    const [enrollmentKeyValue, setEnrollmentKeyValue] = useState("")

    useEffect(() => {
        if (user && course) checkEnrollment()
    }, [user, course])

    const checkEnrollment = async () => {
        const { data } = await axios.get(`/api/check-enrollment/${course._id}`)
        console.log("Check enrollment", data)
        setEnrolled(data)
    }



    const handleFreeEnrollment = async (e) => {
        e.preventDefault();
        try {
            // check if user is logged in
            if (!user) router.push("/login");

            // check if already enrolled
            if (enrolled.status && user.parentMode == false)
                return router.push(`/user/course/${enrolled.course.slug}`);

            setLoading(false)
            setEnrollmentKeyModal(true)
        } catch (err) {
            toast('Enrollment failed. Try again');
            console.log(err);
            setLoading(false);
        }
    }

    const handleSubmit = async () => {
        setEnrollmentKeyModal(false)
        if (enrollmentKeyValue == course.enrollmentKey) {
            try {
                setLoading(true);
                console.log(course._id)

                const { data } = await axios.post(`/api/free-enrollment/${course._id}`);
                console.log(data)

                toast("Congratulations, you are now enrolled in this course");
                router.push("/user")

            } catch (error) {
                console.log(error)
            }
        } else {
            toast('Wrong enrollment key. Try again')
            setLoading(false);
            setEnrollmentKeyValue("")
        }
    }

    const handleCancel = () => {
        setEnrollmentKeyModal(false)
        setEnrollmentKeyValue("")
    }

    return (
        <>
            <SingleCourseJumbotron
                course={course}
                showModal={showModal}
                setShowModal={setShowModal}
                setPreview={setPreview}
                preview={preview}
                user={user}
                loading={loading}
                handleFreeEnrollment={handleFreeEnrollment}
                enrolled={enrolled}
                setEnrolled={setEnrolled}
            />

            <PreviewModal
                showModal={showModal}
                setShowModal={setShowModal}
                preview={preview}
            />

            {course.lessons && (
                <SingleCourseLessons
                    lessons={course.lessons}
                    setPreview={setPreview}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            )}

            {/* modal to enter the enrollment key */}
            <Modal
                title="🔐 Enter Enrollment Key"
                centered
                visible={enrollmentKeyModal}
                onCancel={handleCancel}
                footer={[
                    <Button key="submit" type="primary" onClick={handleSubmit}>
                        Submit
                    </Button>,
                    <Button key="submit" onClick={handleCancel}>
                        Cancel
                    </Button>,
                ]}
                width='600px'
            >

                <Input
                    size="large"
                    className="mb-2"
                    prefix={<KeyOutlined />}
                    value={enrollmentKeyValue}
                    onChange={(e) => setEnrollmentKeyValue(e.target.value)}
                />
                <small className="ml-1">You can ask the instructor of this course for the enrollment key.</small>
            </Modal>
        </>
    )
}

export async function getServerSideProps({ query }) {
    const { data } = await axios.get(`${process.env.API}/course/${query.slug}`);
    return {
        props: {
            course: data.course,
        }
    };
}

export default SingleCourse;
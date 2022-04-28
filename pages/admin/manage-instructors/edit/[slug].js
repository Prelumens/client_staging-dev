import AdminRoute from "../../../../components/routes/AdminRoute";
import InstructorRegForm from "../../../../components/forms/InstructorRegForm";
import { useState, useEffect, useContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import Resizer from "react-image-file-resizer";
import { Context } from "../../../../context";
import { useRouter } from 'next/router'
import { message } from "antd";

const EditInstructor = () => {
    //state
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState({})
    const [preview, setPreview] = useState("");
    const [uploadButtonText, setUploadButtonText] = useState("Upload Image")
    const [values, setValues] = useState({
        email: "",
        password: "",
        firstName: "",
        middleName: "",
        lastName: "",
        birthDate: "",
        gender: null,
        contact: "",
        address: ""
    });

    //to modify data in chatengine io
    const [oldFirstName, setOldFirstName] = useState("")
    const [oldLastName, setOldLastName] = useState("")

    //state
    const { state: { user } } = useContext(Context);

    //allow no access to register page once logged in
    useEffect(() => {
        if (user && user.role.includes("Instructor"))
            router.push("/")
        else if (user && user.role.includes("Subscriber"))
            router.push("/")
    }, [user]);

    useEffect(() => {
        document.title = "Update Instructor"
    }, []);

    // router
    const router = useRouter();
    const { slug } = router.query

    useEffect(() => {
        loadInstructors()
    }, [slug])

    const loadInstructors = async () => {
        const { data } = await axios.get(`/api/admin/instructor/${slug}`)
        if (data) {
            setValues(data)
            setOldFirstName(data.firstName)
            setOldLastName(data.lastName)
        }
        if (data.image) {
            setPreview(data.image)
            setImage(data.image)
            if (data.image.Location) {
                setPreview(data.image.Location)
                setImage(data.image.Location)
            }
        }
    }

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        try {
            //to update user
            try {
                const { updatedUser } = await axios.put(`/api/admin/edit-user/${slug}`, {
                    ...values,
                    image
                });
            } catch (err) {
                console.log(err);
            }

            //to update Instructor
            try {
                const { updatedInstructor } = await axios.put(`/api/admin/edit-instructor/${slug}`, {
                    ...values,
                    oldFirstName,
                    oldLastName,
                    image
                });
            } catch (err) {
                toast.error(err.response.data)
                console.log(err);
            }

            toast.success('instructor record updated')
            router.push("/admin/manage-instructors/list-instructor");
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    };
    const handleImage = (e) => {
        let file = e.target.files[0];
        //show image preview
        setPreview(window.URL.createObjectURL(file))
        //show file name
        setUploadButtonText(file.name)
        setValues({ ...values, loading: false })

        //resize
        Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
            try {
                let { data } = await axios.post('/api/s3/upload', {
                    image: uri,
                    folder: 'users'
                });
                console.log('IMAGE UPLOADED', data)
                //set image in the state, set loading to false
                setImage(data)
                setValues({ ...values, loading: false })
            } catch (err) {
                console.log(err)
                setValues({ ...values, loading: false })
                toast('Image upload failed. Try later')
            }
        })
    };

    const handleImageRemove = async () => {
        message.success("Image removed.")
        try {
            setValues({ ...values, loading: true })
            // const res = await axios.post('/api/admin/remove-image', { image })
            setImage({})
            setPreview('')
            setUploadButtonText('Upload Image')
            setValues({ ...values, image: {} })
            console.log('REMOVE IMAGE', image)
            console.log('preview', preview)
            console.log('values.image', values.image)
        } catch (err) {
            console.log(err)
            setValues({ ...values, loading: false })
            toast('Image upload failed. Try later')
        }
    }
    return (
        <AdminRoute>
            <div className="layout-default layout-student-dashboard">
                <div className="content">
                    <div className="admin-add-students-banner-bg">
                        <h1 className="">Edit Instructor Information</h1>
                    </div>
                </div>

                <InstructorRegForm
                    loading={loading}
                    handleSubmit={handleSubmit}
                    handleChange={handleChange}
                    values={values}
                    setValues={setValues}
                    handleImage={handleImage}
                    preview={preview}
                    uploadButtonText={uploadButtonText}
                    handleImageRemove={handleImageRemove}
                    editPage={true}
                />
            </div>
        </AdminRoute>
    )
}
export default EditInstructor;
import AdminRoute from "../../../../components/routes/AdminRoute";
import RegistrationForm from "../../../../components/forms/RegistrationForm";
import { useState, useEffect, useContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import Resizer from "react-image-file-resizer";
import { Context } from "../../../../context";
import { useRouter } from 'next/router'
import { message } from "antd";

const EditStudent = () => {
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
        studentNum: "",
        birthDate: "",
        gender: null,
        guardian: "",
        contact: "",
        address: "",
        level: null
    });

    //for updating the data in chat engine io
    const [oldGuardianName, setOldGuardianName] = useState("")
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

    // router
    const router = useRouter();
    const { slug } = router.query

    useEffect(() => {
        const loadStudent = async () => {
            if (slug) {
                try {
                    const { data } = await axios.get(`/api/student/${slug}`)
                    console.log('STUDENT TO EDIT =>', data)
                    console.log('Student Image', data.image)
                    if (data) {
                        setValues(data)
                        setOldGuardianName(data.guardian)
                        setOldFirstName(data.firstName)
                        setOldLastName(data.lastName)
                    }
                    if (data.image) {
                        setPreview(data.image)
                        setImage(data.image)
                    }
                    if (data.image.Location) {
                        setPreview(data.image.Location)
                        setImage(data.image.Location)
                    }
                } catch (error) {
                    console.log(error)
                }
                console.log(slug)
            }
        }

        loadStudent()
    }, [slug])

    useEffect(() => {
        document.title = "Update Student"
    }, [])


    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
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

            //to update student
            try {
                const { updatedStudent } = await axios.put(`/api/admin/edit-student/${slug}`, {
                    ...values,
                    oldGuardianName,
                    oldFirstName,
                    oldLastName,
                    image
                });
            } catch (err) {
                toast.error(err.response.data)
                console.log(err);
            }

            toast.success('Student record updated')
            router.push("/admin/manage-students/list-student");

        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    };
    const handleImage = (e) => {
        let file = e.target.files[0];
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
                //show image preview
                setPreview(data.Location)
                console.log('preview', preview)
                console.log('values.image', values.image)
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
                        <h1 className="">Edit Student Information</h1>
                    </div>
                </div>
                <RegistrationForm
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
                    setPreview={setPreview}
                />
            </div>

        </AdminRoute>
    )
}
export default EditStudent;
import AdminRoute from "../../../components/routes/AdminRoute";
import { useState, useEffect, useContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import Resizer from "react-image-file-resizer";
import { SyncOutlined } from '@ant-design/icons'
import Link from 'next/link'
import AdminRegForm from "../../../components/forms/AdminRegForm";
import { Context } from "../../../context";
import { useRouter } from 'next/router'

const AddAdmin = () => {
  //username prefix
  const usernamePrefix = "admin-000"
  const [numberOfAdmin, setNumberOfAdmin] = useState()
  const [adminId, setAdminId] = useState("")

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await axios.get("/api/admin/username-generator");
      setNumberOfAdmin(data.admin + 1);
      console.log(data.admin)

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    generateUsername()
  }, [numberOfAdmin, adminId])

  const generateUsername = () => {
    setAdminId(usernamePrefix.concat(numberOfAdmin))
    console.log(adminId);
  }

  //state
  const [image, setImage] = useState({})
  const [preview, setPreview] = useState("");
  const [username, setUsername] = useState("")
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false)

  //state
  const { state: { user } } = useContext(Context);
  //router
  const router = useRouter();
  //allow no access to register page once logged in
  useEffect(() => {
    if (user && user.role.includes("Instructor"))
      router.push("/")
    else if (user && user.role.includes("Subscriber"))
      router.push("/")
  }, [user]);

  useEffect(() => {
    document.title = "Add Admin"
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true)
    try {
      //register admin to db
      try {
        const { data } = await axios.post(`/api/register`, {
          username: adminId,
          name,
          email,
          password,
          image
        })
        toast.success('Registration successful')
        setUsername('')
        setName('');
        setEmail('');
        setPassword('');
        router.push("/admin/manage-admin/list-admin");
        setLoading(false);
        setIsValid(true)
      } catch (err) {
        console.log(err)
        console.log(err.response.data)
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
    }

  };
  const handleImage = (e) => {
    let file = e.target.files[0];
    //show image preview
    setPreview(window.URL.createObjectURL(file))

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
      } catch (err) {
        console.log(err)
        toast('Image upload failed. Try later')
      }
    })
  };

  const handleImageRemove = async () => {
    console.log('REMOVE IMAGE')
    try {
      // const res = await axios.post('/api/admin/remove-image', { image })
      setImage({})
      setPreview('')
    } catch (err) {
      console.log(err)
      toast('Image upload failed. Try later')
    }
  }
  return (
    <AdminRoute>
      <div className="layout-default layout-student-dashboard">
        <div className="content">
          <div className="admin-add-instructors-banner-bg">
            <h1 className="">Add Admin</h1>
          </div>
          <AdminRegForm
            username={username}
            name={name}
            loading={loading}
            email={email}
            password={password}
            handleSubmit={handleSubmit}
            setName={setName}
            setEmail={setEmail}
            setPassword={setPassword}
            editPage={false}
            handleImage={handleImage}
            preview={preview}
            handleImageRemove={handleImageRemove}
            adminId={adminId}
          />
        </div>
      </div>


    </AdminRoute>
  )
}
export default AddAdmin;
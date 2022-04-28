import AdminRoute from "../../../../components/routes/AdminRoute";
import { useState, useEffect, useContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'
import Resizer from "react-image-file-resizer";
import { SyncOutlined } from '@ant-design/icons'
import Link from 'next/link'
import AdminRegForm from "../../../../components/forms/AdminRegForm";
import { Context } from "../../../../context";
import { useRouter } from 'next/router'

const EditAdmin = () => {  //state
  const [image, setImage] = useState({})
  const [preview, setPreview] = useState("");
  const [username, setUsername] = useState("")
  const [name, setName] = useState("");
  const [oldName, setOldName] = useState("")
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false)

  //state
  const { state: { user } } = useContext(Context);
  //router
  const router = useRouter();
  const { slug } = router.query

  //allow no access to register page once logged in
  useEffect(() => {
    if (user && user.role.includes("Instructor"))
      router.push("/")
    else if (user && user.role.includes("Subscriber"))
      router.push("/")
  }, [user]);

  useEffect(() => {
    loadAdmin()
  }, [slug])
  const loadAdmin = async () => {
    const { data } = await axios.get(`/api/admin/admin/${slug}`)
    console.log("ADMIN EDIT",data)
    if (data) {
      setOldName(data.name)
      setUsername(data.username)
      setName(data.name)
      setEmail(data.email)
      setPassword(data.password)
    }
    if (data.picture) {
        setPreview(data.picture)
        setImage(data.picture)
        if (data.picture.Location) {
            setPreview(data.picture.Location)
            setImage(data.picture.Location)
        }
    }
  }

  useEffect(() => {
    document.title = "Edit Admin"
  }, []);

  const handleSubmit = async (e) => {
    setLoading(true)
    try {

      //to update in admin collection
      try {
        const { data } = await axios.put(`/api/admin/chief/edit-admin/${slug}`, {
          name,
          email,
          image
        });
      } catch (err) {
        console.log(err);
      }

      //to update user
      try {
        const { data } = await axios.put(`/api/admin/edit-admin/${slug}`, {
          oldName,
          username,
          name,
          email,
          image
        });
      } catch (err) {
        console.log(err);
      }

      toast.success('Admin record updated.')
      router.push("/admin/manage-admin/list-admin");
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
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
            <h1 className="">Edit Admin</h1>
          </div>
          <AdminRegForm
            name={name}
            loading={loading}
            email={email}
            password={password}
            handleSubmit={handleSubmit}
            setName={setName}
            setEmail={setEmail}
            setPassword={setPassword}
            editPage={true}
            handleImage={handleImage}
            preview={preview}
            username={username}
            handleImageRemove={handleImageRemove}
          />
        </div>
      </div>


    </AdminRoute>
  )
}
export default EditAdmin;
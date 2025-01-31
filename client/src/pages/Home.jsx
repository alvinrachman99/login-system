import profile_picture from "../assets/profile_picture.svg";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { FaPencilAlt, FaRegUser } from "react-icons/fa";
import { getUserByEmail, updateUser, updateImage } from "../features/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/AuthSlice";
import axiosInstance from "../axios/AxiosConfig";

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.user);
  console.log(data)
  useEffect(() => {
    dispatch(getUserByEmail());
  }, [dispatch]);

  const [user, setUser] = useState({
    id:"",
    firstname: "",
    lastname: "",
  });

  useEffect(() => {
    if (data && !loading) {
      setUser({
        id: data.data.id,
        firstname: data.data.firstname,
        lastname: data.data.lastname,
      });
    }
  }, [data, loading]);

  const [toggleEdit, setToggleEdit] = useState(false)

  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
  });

  const inputRefs = {
    firstname: useRef(null),
    lastname: useRef(null),
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!user.firstname) {
      formErrors.firstname = "nama depan harus di isi";
      isValid = false;
    }

    if (!user.lastname) {
      formErrors.lastname = "nama belakang harus di isi";
      isValid = false;
    }

    setErrors(formErrors);

    // Autofokus pada kolom pertama yang memiliki error
    if (!isValid) {
      for (let field in formErrors) {
        if (formErrors[field] && inputRefs[field]?.current) {
          inputRefs[field].current.focus();
          break;
        }
      }
    }

    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleEdit = () => {
    setToggleEdit(!toggleEdit)
  }

  const handleSubmit = async () => {
    const { id, ...dataUser } = user
    
    try {
      await dispatch(updateUser({id, user:dataUser}))
      dispatch(getUserByEmail());
      setToggleEdit(!toggleEdit)
  } catch (error) {
      console.log(error)
    }
  }

  const inputFile = useRef(null);
  const handleInputFile = () => {
    inputFile.current.click();
  };

  const handleUpdateImage = async (e) => {
    const file = e.target.files[0];
    // console.log('file:', file)
    if (!file) return;

    // Validasi ukuran file (maksimum 100KB)
    const MAX_SIZE = 100 * 1024; // 100KB
    if (file.size > MAX_SIZE) {
      alert('Ukuran file maksimum adalah 100KB.');
      return;
    }

    // Validasi tipe file (hanya JPG, JPEG, PNG yang diperbolehkan)
    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert('Hanya file JPG, JPEG, dan PNG yang diperbolehkan.');
      return;
    }

    try {
      await dispatch(updateImage({file:file, id:user.id}))
      dispatch(getUserByEmail());
    } catch (error) {
      console.log(error)
    }
  }

  const handleLogout = async () => {
    await dispatch(logout())
    navigate("/login")
  }

  return (
    <div className="container max-w-full">
      <div className="grid h-screen items-center">
        <div className="flex flex-col w-3/4 md:w-1/2 lg:w-1/4 mx-auto">
          <div className="relative">
            <FaPencilAlt onClick={handleInputFile} className="absolute border-2 text-2xl bg-gray-500 text-white rounded-full w-8 h-8 p-1 bottom-6 right-20 cursor-pointer"/>
            <img
              src={data ? `${axiosInstance.defaults.baseURL}/images/${data.data.picture}` : profile_picture}
              alt="profile_picture"
              className="mx-auto w-60 h-60 border-2 border-indigo-500 rounded-full object-cover object-center shadow-lg"
            />
            <input
              type="file"
              ref={inputFile}
              accept="image/jpeg, image/png"
              onChange={handleUpdateImage}
              style={{ display: 'none' }} 
            />
          </div>
          <div className="text-center my-2 text-xl">{data?.data.firstname} {data?.data.lastname}</div>
          <div className="flex flex-col my-1.5 relative">
            <label>Email</label>
            <MdOutlineAlternateEmail className="absolute top-9 left-2 text-gray-400" />
            <input
              value={localStorage.getItem('email')}
              type="text"
              className="my-1 py-1 pl-8 rounded-md border-2 focus:outline-none text-gray-400"
              placeholder="email"
              readOnly
            />
          </div>
          <div className="flex flex-col my-1.5 relative">
            <label>Nama depan</label>
            <FaRegUser className="absolute top-9 left-2 text-gray-400" />
            <input
              ref={inputRefs.firstname}
              value={user.firstname}
              onChange={toggleEdit ? handleChange : undefined}
              readOnly={!toggleEdit}
              name="firstname"
              type="text"
              className="my-1 py-1 pl-8 rounded-md border-2 focus:outline-indigo-500"
              placeholder="nama depan"
            />
          </div>
          <div className="flex flex-col my-1.5 relative">
            <label>Nama belakang</label>
            <FaRegUser className="absolute top-9 left-2 text-gray-400" />
            <input
              ref={inputRefs.lastname}
              value={user.lastname}
              onChange={toggleEdit ? handleChange : undefined}
              readOnly={!toggleEdit}
              name="lastname"
              type="text"
              className="my-1 py-1 pl-8 rounded-md border-2 focus:outline-indigo-500"
              placeholder="nama belakang"
            />
          </div>
          {
            !toggleEdit ? (
              <>
                <div className="my-1">
                  <button 
                  onClick={handleEdit}
                  type="button" className="rounded-md py-1 text-center w-full bg-indigo-500 text-white">
                    Edit
                  </button>
                </div>
                <div className="my-1">
                  <button 
                  onClick={handleLogout}
                  type="button" className="rounded-md py-1 text-center w-full bg-red-500 text-white">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="my-1 flex gap-2">
                  <button 
                  onClick={handleEdit}
                  type="button" className="rounded-md py-1 text-center w-full bg-gray-500 text-white">
                    Batalkan
                  </button>
                  <button 
                  onClick={handleSubmit}
                  type="button" className="rounded-md py-1 text-center w-full bg-indigo-500 text-white">
                    Simpan
                  </button>
                </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default Home;

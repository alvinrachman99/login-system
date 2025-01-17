import { MdOutlineAlternateEmail, MdOutlineLock } from "react-icons/md";
import { FaRegUser } from "react-icons/fa";
import login_picture from "../assets/login.png"
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../features/AuthSlice";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [register, setRegister] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    conf_password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    conf_password: "",
  });

  const inputRefs = {
    email: useRef(null),
    firstname: useRef(null),
    lastname: useRef(null),
    password: useRef(null),
    conf_password: useRef(null),
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!register.email) {
      formErrors.email = "email harus di isi";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(register.email)) {
      formErrors.email = "email tidak valid";
      isValid = false;
    }

    if (!register.firstname) {
      formErrors.firstname = "nama depan harus di isi";
      isValid = false;
    }

    if (!register.lastname) {
      formErrors.lastname = "nama belakang harus di isi";
      isValid = false;
    }

    if (!register.password) {
      formErrors.password = "password harus di isi";
      isValid = false;
    } else if (register.password.length < 8) {
      formErrors.password = "password harus setidaknya mempunyai 8 karakter";
      isValid = false;
    }

    if (!register.conf_password) {
      formErrors.conf_password = "konfirmasi password tidak boleh kosong";
      isValid = false;
    } else if (register.conf_password !== register.password) {
      formErrors.conf_password = "password tidak sama";
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
    setRegister({
      ...register,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!validateForm()) return;

    if (loading) return;

    // Buat salinan register tanpa confirm_password
    const { confirm_password, ...dataToSend } = register;

    try {
      await dispatch(registerUser(dataToSend)).unwrap();
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className='container max-w-full'>
        <div className="grid md:grid-cols-2 h-screen items-center">
          <div className='w-3/4 mx-auto flex flex-col text-center'>
              <h4 className='my-1 text-2xl font-semibold'>Login Sistem</h4>
              <h3 className='my-1 text-base'>Lengkapi data untuk membuat akun</h3>
              <div className='my-2 relative'>
                <MdOutlineAlternateEmail className="absolute top-3 left-3 text-gray-400" />
                <input 
                ref={inputRefs.email}
                value={register.email}
                onChange={handleChange}
                name="email"
                type="text" className='w-full rounded-md py-1 pl-8 border-2 focus:outline-indigo-500' placeholder='masukan email anda' />
                {errors.email && (
                  <span
                    className="text-red-500 flex text-sm px-2"
                  >
                    {errors.email}
                  </span>
                )}
              </div>
              <div className='my-2 relative'>
                <FaRegUser className="absolute top-3 left-3 text-gray-400" />
                <input 
                ref={inputRefs.firstname}
                value={register.firstname}
                onChange={handleChange}
                name="firstname"
                type="text" className='w-full rounded-md py-1 pl-8 border-2 focus:outline-indigo-500' placeholder='nama depan' />
                {errors.firstname && (
                  <span
                    className="text-red-500 flex text-sm px-2"
                  >
                    {errors.firstname}
                  </span>
                )}
              </div>
              <div className='my-2 relative'>
                <FaRegUser className="absolute top-3 left-3 text-gray-400" />
                <input 
                ref={inputRefs.lastname}
                value={register.lastname}
                onChange={handleChange}
                name="lastname"
                type="text" className='w-full rounded-md py-1 pl-8 border-2 focus:outline-indigo-500' placeholder='nama belakang' />
                {errors.lastname && (
                  <span
                    className="text-red-500 flex text-sm px-2"
                  >
                    {errors.lastname}
                  </span>
                )}
              </div>
              <div className='my-2 relative'>
                <MdOutlineLock className="absolute top-3 left-3 text-gray-400" />
                <input 
                ref={inputRefs.password}
                value={register.password}
                onChange={handleChange}
                name="password"
                type="password" className='w-full rounded-md py-1 pl-8 border-2 focus:outline-indigo-500' placeholder='buat password' />
                {errors.password && (
                  <span
                    className="text-red-500 flex text-sm px-2"
                  >
                    {errors.password}
                  </span>
                )}
              </div>
              <div className='my-2 relative'>
                <MdOutlineLock className="absolute top-3 left-3 text-gray-400" />
                <input 
                ref={inputRefs.conf_password}
                value={register.conf_password}
                onChange={handleChange}
                name="conf_password"
                type="password" className='w-full rounded-md py-1 pl-8 border-2 focus:outline-indigo-500' placeholder='konfirmasi password' />
                {errors.conf_password && (
                  <span
                    className="text-red-500 flex text-sm px-2"
                  >
                    {errors.conf_password}
                  </span>
                )}
              </div>
              <button 
              onClick={handleSubmit}
              type='button' className='bg-indigo-500 py-1 my-2 rounded-md text-white'>Registrasi</button>
              <p>sudah punya akun? login <Link to="/login" className='text-indigo-500'>disini</Link></p>
          </div>
          <div className="bg-slate-500 h-screen hidden md:block">
            <img src={login_picture} alt="login" className="w-full h-screen object-cover object-center" />
          </div>
        </div>
    </div>
  )
}

export default Register
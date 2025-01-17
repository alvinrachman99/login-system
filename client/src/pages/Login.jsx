import { MdOutlineAlternateEmail, MdOutlineLock } from "react-icons/md";
import login_picture from "../assets/login.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";
import { loginUser } from "../features/AuthSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const inputRefs = {
    email: useRef(null),
    password: useRef(null),
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!login.email) {
      formErrors.email = "email harus di isi";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(login.email)) {
      formErrors.email = "email tidak valid";
      isValid = false;
    }

    if (!login.password) {
      formErrors.password = "password harus di isi";
      isValid = false;
    } else if (login.password.length < 8) {
      formErrors.password = "password harus setidaknya mempunyai 8 karakter";
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
    setLogin({
      ...login,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validasi
    if (!validateForm()) return;

    if (loading) return;

    try {
      const result = await dispatch(loginUser(login)).unwrap();
      if(result.status === 200){
        navigate("/");
      } else {
        console.log(result.message)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <div className="container max-w-full">
      <div className="grid md:grid-cols-2 h-screen items-center">
        <div className="w-3/4 mx-auto flex flex-col text-center">
          <h4 className="my-1 text-2xl font-semibold">Login Sistem</h4>
          <h3 className="my-1 text-base">Masuk atau buat akun untuk memulai</h3>
          <div className="my-2 relative">
            <MdOutlineAlternateEmail className="absolute top-3 left-3 text-gray-400" />
            <input
                ref={inputRefs.email}
                value={login.email}
                onChange={handleChange}
                name="email"
              type="text"
              className="w-full rounded-md py-1 pl-8 border-2 focus:outline-indigo-500"
              placeholder="masukan email anda"
            />
            {errors.email && (
                  <span
                    className="text-red-500 flex text-sm px-2"
                  >
                    {errors.email}
                  </span>
                )}
          </div>
          <div className="my-2 relative">
            <MdOutlineLock className="absolute top-3 left-3 text-gray-400" />
            <input
            ref={inputRefs.password}
            value={login.password}
            onChange={handleChange}
            name="password"
              type="password"
              className="w-full rounded-md py-1 pl-8 border-2 focus:outline-indigo-500"
              placeholder="buat password"
            />
            {errors.password && (
                  <span
                    className="text-red-500 flex text-sm px-2"
                  >
                    {errors.password}
                  </span>
                )}
          </div>
          <button
            onClick={handleSubmit}
            type="button"
            className="bg-indigo-500 py-1 my-2 rounded-md text-white"
          >
            Masuk
          </button>
          <p>
            belum punya akun? registrasi{" "}
            <Link to="/register" className="text-indigo-500">disini</Link>
          </p>
        </div>
        <div className="bg-slate-500 h-screen hidden md:block">
          <img
            src={login_picture}
            alt="login"
            className="w-full h-screen object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;

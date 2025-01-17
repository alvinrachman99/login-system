import profile_picture from "../assets/profile_picture.svg";

function Home() {
  return (
    <div className="container max-w-full">
      <div className="grid h-screen bg-slate-200 justify-center items-center">
        <div className="flex flex-col">
          <div>
            <img src={profile_picture} alt="profile_picture" className="w-60" />
          </div>
          <div className="text-center my-2 text-xl">nama lengkap</div>
          <div className="flex flex-col my-1.5">
            <label>nama depan</label>
            <input type="text" className="my-1" placeholder="nama depan" />
          </div>
          <div className="flex flex-col my-1.5">
            <label>nama belakang</label>
            <input type="text" className="my-1" placeholder="nama belakang" />
          </div>
          <div className="flex flex-col my-1.5">
            <label>password</label>
            <input type="text" className="my-1" placeholder="password" />
          </div>
          <div className="flex flex-col my-1.5">
            <label>konfirmasi password</label>
            <input type="text" className="my-1" placeholder="konfirmasi password" />
          </div>
          <div className="my-1">
            <button className="text-center w-full bg-indigo-500 text-white">Edit</button>
          </div>
          <div className="my-1">
            <button className="text-center w-full bg-red-500 text-white">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

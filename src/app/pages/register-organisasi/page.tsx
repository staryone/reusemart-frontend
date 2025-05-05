import Link from "next/link";

export default function Register() {
  return (
    <div>
      <div className="overflow-x-hidden w-screen h-screen p-10 place-items-center place-content-center bg-gray-100">
        <form className="border-1 border-gray-300 rounded-lg w-1/2 p-10 bg-white">
          <div className="text-5xl mb-3 font-bold">Registrasi Organisasi</div>
          <div className="flex justify-center gap-15">
            <div className="flex flex-col items-start w-full">
              <div className="my-3 w-full">
                <div className="mb-1">Nama Organisasi</div>
                <input
                  type="text"
                  className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"
                />
              </div>
              <div className="my-3 w-full">
                <div className="mb-1">Alamat</div>
                <input
                  type="text"
                  className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"
                />
              </div>
              <div className="my-3 w-full">
                <div className="mb-1">No. Handphone</div>
                <input
                  type="text"
                  className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"
                />
              </div>
              <div className="my-3 w-full">
                <div className="mb-1">Deskripsi Organisasi</div>
                <textarea
                  name=""
                  id=""
                  className="border-1 border-gray-400 rounded-sm w-full px-2 h-20"
                ></textarea>
              </div>
            </div>
            <div className="flex flex-col items-start w-full">
              <div className="my-3 w-full">
                <div className="mb-1">Password</div>
                <input
                  type="password"
                  className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"
                />
              </div>
              <div className="my-3 w-full">
                <div className="mb-1">Konfirmasi Password</div>
                <input
                  type="password"
                  className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"
                />
              </div>
              <button
                type="submit"
                className="my-3 rounded-[0.5rem] py-2 px-8 bg-[#1980e6] text-white hover:bg-white hover:text-[#1980e6] border-1 hover:border-[#1980e6] transition-colors"
              >
                Registrasi
              </button>
              <div className="my-3">
                <Link
                  href={"/pages/login"}
                  className="text-[#1980e6]/80 underline hover:text-[#1980e6]"
                >
                  Sudah punya akun?
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

import Link from "next/link";

export default function Login() {
  return (
    <div>
      <div className="overflow-x-hidden w-screen h-screen p-10 place-items-center place-content-center bg-gray-100">
        <form className="flex flex-col items-start border-1 border-gray-300 rounded-lg w-1/3 p-10 bg-white">
            <div className="text-5xl mb-3 font-bold">Log in</div>
            <div className="my-3">
            Belum mempunyai akun?{" "}
            <Link
              href={"/pages/register-pembeli"}
              className="text-[#1980e6]/80 underline hover:text-[#1980e6]"
            >
              Daftar disini!
            </Link>
          </div>
            <div className="my-3 w-full">
                <div className="mb-1">Email</div>
                <input type="text" className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"/>
            </div>
            <div className="my-3 w-full">
                <div className="mb-1">Password</div>
                <input type="password" className="border-1 border-gray-400 rounded-sm h-10 w-full px-2"/>
            </div>
            <button type="submit" className="my-3 rounded-[0.5rem] py-2 px-8 bg-[#1980e6] text-white hover:bg-white hover:text-[#1980e6] border-1 hover:border-[#1980e6] transition-colors">Log in</button>
            <div className="my-3">
                <Link href={"#"} className="text-[#1980e6]/80 underline hover:text-[#1980e6]">Forgot Password</Link>
            </div>
        </form>
      </div>
    </div>
  );
}

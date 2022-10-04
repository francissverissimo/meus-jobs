import { useAuth } from "../hooks/useAuth";
import { Button } from "antd";
import { Logo } from "../components/Logo";
import { Footer } from "../components/Footer";
import { GoogleOutlined } from "@ant-design/icons";
import bgOne from "../assets/backgroundOne.jpg";
import bgTwo from "../assets/backgroundTwo.jpg";

export function SignIn() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex">
      <div className="w-0 sm:w-1/4 md:w-2/4 lg:3/4 min-h-screen relative">
        <img
          src={bgTwo}
          alt="Background images signin page."
          className="h-full object-cover"
        />

        <div className="bg-orange-500/20 absolute w-full h-full inset-0"></div>
      </div>

      <div className="flex flex-1 flex-col gap-6 bg-gradient-to-t from-zinc-400 via-zinc-200 to-zinc-100 justify-center items-center px-2 relative">
        <Logo />

        <div className="flex flex-col">
          <span className="text-zinc-700 text-xl text-center">
            Olá, que bom te ver por aqui!
          </span>

          <span className="text-zinc-700 text-2xl text-center">
            Boas-vindas!!
          </span>
        </div>

        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-1 text-xl border-2 border-orange-500 text-orange-500 p-2 rounded w-fit transition hover:scale-[102%] hover:text-zinc-50 hover:bg-orange-500"
        >
          <GoogleOutlined className="text-3xl" />
          Continuar com o Google
        </button>

        <Footer tailwindStyle="absolute bottom-2" />
      </div>
    </div>
  );
}

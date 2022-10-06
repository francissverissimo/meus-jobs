import { Loading } from "../components/Loading";
import { useAuth } from "../hooks/useAuth";
import { Dashboard } from "./Dashboard";
import { SignIn } from "./SignIn";

export function Home() {
  const { user } = useAuth();

  return (
    <>
      {user === undefined ? (
        <Loading />
      ) : user === "OFF" ? (
        <SignIn />
      ) : (
        <Dashboard />
      )}
    </>
  );
}

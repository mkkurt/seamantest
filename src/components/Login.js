import { useState } from "react";
import { useStore } from "../store";

const LoginComponent = () => {
  const { state, login } = useStore();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    login(username, password);
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Login form fields */}
      <button type="submit">Login</button>
      {state.error && <p>{state.error}</p>}
    </form>
  );
};

export default LoginComponent;

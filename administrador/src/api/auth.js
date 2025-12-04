import { auth } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";

const API_URL = "http://localhost:3000/auth/";

const login = async (email, password) => {

  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  console.log(userCredential);
  const idToken = await userCredential.user.getIdToken();

  const res = await fetch(API_URL + "login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
    body: JSON.stringify({ idToken }),
  });

  if (!res.ok) throw new Error("Error en el login del backend");

  const data = await res.json();
  localStorage.setItem("user", JSON.stringify(data.user));

  return data.user;
};


const logout = () => {
  localStorage.removeItem("user");
};

export default { login, logout };

import Login from "../components/login/login";

const Registrar = () => {
    return (
      <div className="p-6 text-center">
        <div className="loginuser" style={{ backgroundImage:"url(../../../public/assets/1.webp);" , display: "flex", justifyContent: "center", alignItems: "center", minHeight: "75vh" }}>
        <Login />
        </div>
      </div>
    );
  };
  
  export default Registrar;
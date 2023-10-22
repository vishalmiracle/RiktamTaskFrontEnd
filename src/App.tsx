import "./App.css";

import Login from "./Pages/Login";

import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import Dashboard from "./Pages/Dashboard";
import { GlobalProvider } from "./Services/Providers/GlobalContext";
import CreateUser from "./Pages/CreateUser";
import GroupChat from "./Pages/GroupChat";
import Groups from "./Pages/Groups";
import GroupSetting from "./Pages/GroupSetting";

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard/*" element={<Dashboard />}>
              <Route path="createUser" element={<CreateUser />} />
              <Route path="groupChat/:id" element={<GroupChat />} />
              <Route path="groupSetting/:id" element={<GroupSetting/>}/>
              <Route path="groups" element={<Groups/>} />
            </Route>
          </Routes>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;

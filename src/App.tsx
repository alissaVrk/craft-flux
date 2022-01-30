import './App.css';
import { login as serverLogin } from 'modules/auth/data/actions';
import { initOrchestrator } from 'modules/global-data';
import { setAuthDataDB } from 'core/axios-defaults';
import { v4 as uuidv4 } from 'uuid';


const sessionId = uuidv4();
function App() {
  async function login(){
    const {userInfo, token} = await serverLogin();
    setAuthDataDB({
      sessionId: sessionId,
      token,
      userId: userInfo.id
    })
    console.log("UUUU", userInfo)
    const state = await initOrchestrator(userInfo);
    console.log("SSSS", state);
  }

  return (
    <div className="App">
      <button onClick={() => login()}>login</button>
    </div>
  );
}

export default App;

import './App.css';


function App() {
  const CLIENT_ID = "6da5fdd529f686d8caa4bfc0b436cf14";
  const REDIRECT_URI =  "http://localhost:5000/kakao/code";
  const KAKAO_AUTH_URL = 
  `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h1>Connectly Assignment</h1>
      <br />
      <a href={KAKAO_AUTH_URL}>
        <div className='kakao_btn'>
        </div>
      </a>
    </div>
  );
}

export default App;

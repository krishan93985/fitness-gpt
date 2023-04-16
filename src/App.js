import { Route, Routes } from 'react-router-dom';
import './App.css';
import Chats from './pages/Chats/Chats';

function App() {
  return (
    <div className="App">
      <div className='background-image'></div>
      <Routes>
        <Route exact path='/chats' element={
          <Chats />
        } />
      </Routes>
    </div>
  );
}

export default App;

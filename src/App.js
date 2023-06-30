import './App.css';
import {Routes,Route, BrowserRouter} from 'react-router-dom';
import Home from './components/Home';
import EditorPage from'./components/EditorPage';
import { Toaster } from 'react-hot-toast';


function App() {
  return (
    <>
      <div>
        <Toaster 
        position='bottom-center'
        toastOptions={{
          success:{
            theme:{
              primary: '#b185eb',
            },
          },
        }}
        >
        </Toaster>
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />}> </Route>
          <Route path='/editor/:roomId' element={<EditorPage />}> </Route>
        </Routes>
      </BrowserRouter> 
      {/* <EditorPage /> */}
    </>
  );
}

export default App;

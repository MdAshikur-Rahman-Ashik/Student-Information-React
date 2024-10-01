import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Nav } from './layers/Nav'
import { List } from './components/List'
import { Create } from './components/Create'
import { Edit } from './components/Edit'
import { Footer } from './layers/Footer'
import { Home } from './components/Home'
 import 'bootstrap/dist/css/bootstrap.min.css';

function App() { 
  return (<>  <div className='container'>
<BrowserRouter><Nav/><Routes>
  <Route path='/' element= {<Home/>}/>
  <Route path='/list' element= {<List/>}/>
  <Route path='/list/add' element= {<Create/>}/>
  <Route path='/list/edit/:id' element={<Edit/>}/>
 
</Routes>
<Footer/></BrowserRouter> </div> </>  )
}
export default App

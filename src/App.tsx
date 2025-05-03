import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import HomePage from '@/features/home/pages/HomePage';
import FacilityDetailPage from '@/features/facility/pages/FacilityDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="facility/:id" element={<FacilityDetailPage/>}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
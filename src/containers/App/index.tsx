import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'mobx-react';

import { Doctor, Patient, Schedule, Cabinet } from 'containers';

import store from 'stores';

import 'sources/styles/styles.scss';
import 'antd/dist/antd.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Provider {...store}>
        <Routes>
          <Route path="/" element={<Navigate to="/schedule" />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="cabinet" element={<Cabinet />} />
          <Route path="patient" element={<Patient />} />
          <Route path="doctor" element={<Doctor />} />
        </Routes>
      </Provider>
    </BrowserRouter>
  );
}

export default App;

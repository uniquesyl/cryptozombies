'use client';

import React from 'react';
import CreateZombie from '../../components/CreateZombie';
import DiagnosticInfo from '../../components/DiagnosticInfo';
import Header from '../../components/Header';

const CreateZombiePage: React.FC = () => {
  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <DiagnosticInfo />
        <CreateZombie />
      </div>
    </div>
  );
};

export default CreateZombiePage; 
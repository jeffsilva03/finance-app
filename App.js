import React from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { IniciarBD } from './databases/iniciarBD';
import { Index } from './inicial';

export default function App() {
  return (
    <SQLiteProvider databaseName="financas.db" onInit={IniciarBD}>
      <Index />
    </SQLiteProvider>
  );
}
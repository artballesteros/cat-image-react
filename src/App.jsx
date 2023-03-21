import './App.css'
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;
let URL = `https://api.thecatapi.com/v1/images/search?limit=30&has_breeds=1&api_key=${ACCESS_KEY}`;

function App() {
  const [cat, setCat] = useState(null);
  const [data, setData] = useState(null);
  const [bannedAttributes, setBannedAttributes] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchData = async () => {
    const response = await fetch(URL);
    const json = await response.json();
    setData(json);
  };

  const getRandomCat = () => {
    if (!data) return null;

    const filteredData = data.filter(cat => {
      for (let i = 0; i < bannedAttributes.length; ++i) {
        if (cat.breeds[0].life_span === bannedAttributes[i] ||
        cat.breeds[0].origin === bannedAttributes[i] ||
        cat.breeds[0].weight.metric === bannedAttributes[i]) {
          return false;
        }
      }
      return true;
    });
    if (filteredData.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * filteredData.length);
    return filteredData[randomIndex];
  };

  const handleBanAttribute = attribute => {
    setBannedAttributes([...bannedAttributes, attribute]);
  };

  return (
    <div>
      <Typography variant='h1'>Cats for dayz</Typography>
      <div style={{display: 'flex'}}>
        <div style={{flex: 1}}>
          <Typography variant="h6">Banned:</Typography>
          <ul>
            {bannedAttributes.map(attribute => (
              <li key={attribute}>{attribute}</li>
            ))}
          </ul>
        </div>
        <div style={{flex: 2}}>
          <Button variant="contained" color="secondary" onClick={() => {
            if (data != null) setHistory([...history, data]);
            fetchData();
            setCat(getRandomCat());
          }}>
            Meow!!
          </Button>
          {cat ? (
            <div>
              <Typography variant="h5">{cat.name}</Typography>
              <img src={cat.url} alt={cat.breeds[0].name} width={600}/>
              <Typography variant="body1">{cat.breeds.description}</Typography>
              <Button variant="contained" color="secondary" onClick={() => handleBanAttribute(cat.breeds[0].life_span)}>
                {cat.breeds[0].life_span}
              </Button>
              <Button variant="contained" color="secondary" onClick={() => handleBanAttribute(cat.breeds[0].origin)}>
                {cat.breeds[0].origin}
              </Button>
              <Button variant="contained" color="secondary" onClick={() => handleBanAttribute(cat.breeds[0].weight.metric)}>
                {cat.breeds[0].weight.metric}
              </Button>
            </div>
          ) : (
            <h2>Nothing to display!</h2>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
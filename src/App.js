import './App.css';
import React, { useState, useEffect } from 'react';
import { getWeatherData } from './Busca/servidor';
import axios from 'axios';

function App() {

  const [weatherdata, setWeatherData] = useState([]);
  const [city, setCity] = useState(null);
  const [historico, setHistorico] = useState([])
  const [maisBuscadas, setMaisBuscadas] = useState([])
  // const [loading, setLoading] = useState(false);


  const getHistorico = async () => {

    try {
      const endpoint = `http://localhost:3001/api/clima/historico`
      const result = await axios.get(endpoint)

      /*Metodo para filtrar as 5 ultimas cidades buscadas*/
      const ultimasBuscadas = result.data.filter((dados, i) => dados.id > (result.data.length - 5)).sort(function (a, b) {
        if (a.id < b.id) return 1;
        if (a.id > b.id) return -1;
        return 0;
      })

      setHistorico(ultimasBuscadas)

      /*Metodo para filtrar as 5 mais procuradas*/
      let x = 0

      const maisProcuradas = result.data.reduce((acum, atual, i) => {
        let objeto = acum

        if (acum.filter((dados, i) => dados.cidade === atual.cidade).length === 0) {

          objeto[x] = {
            cidade: atual.cidade,
            npesquisa: result.data.filter((fil, i) =>
              fil.cidade === atual.cidade).length
          }
          x = x + 1

        }
        return objeto

      }, []).sort(function (a, b) {
        if (a.npesquisa < b.npesquisa) return 1;
        if (a.npesquisa > b.npesquisa) return -1;
        return 0;
      }).filter((filtro, i) => i < 5).sort(function (a, b) {
        if (a.npesquisa < b.npesquisa) return 1;
        if (a.npesquisa > b.npesquisa) return -1;
        return 0;
      })


      setMaisBuscadas(maisProcuradas)


    } catch (error) {

    }
  }


  const getData = async () => {

    try {
      const data = await getWeatherData(city);

      const body = {
        cidade: data.name,
        pais: data.sys.country,
        temperatura: data.main.temp,
        umidade: data.main.humidity,
        clima: data.weather[0].main
      }
      setWeatherData(body);

      const endpoint = `http://localhost:3001/api/clima/gravar`
      const result = await axios.post(endpoint, body)


      getHistorico();

      console.log(result, 'Resultado API')

    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getHistorico();
  }, []);

  return (
    <div className="App">
      <h2 className="title">Weathermap</h2>
      <div className="search">
        <input type="text" onChange={(e) => setCity(e.target.value)} placeholder="Digite sua cidade..." />
        <button type="button" onClick={() => getData()}>Pesquisar</button>
      </div>
      <div className="principal" >
        <div style={{ width: "100%", backgroundColor: 'white', borderRadius: '15px', marginBottom: '10px' }}>
          <div className="cidade">
            <h1>
              <div style={{ width: "50%", }}>Cidade: </div>
              <div style={{ width: "50%" }}>{weatherdata.cidade}</div>
            </h1>
          </div>

          <div className="pais">
            <h1>
              <div style={{ width: "50%" }}>Pais:</div>
              <div style={{ width: "50%" }}>{weatherdata.pais}</div></h1>
          </div>

          <div className="temp">
            <h1>
              <div style={{ width: "50%" }}>Temperatura:</div>
              <div style={{ width: "50%" }}>{Math.round(weatherdata.temperatura - 273.15)}&deg;C</div>
            </h1>
          </div>

          <div className="umi">
            <h1>
              <div style={{ width: "50%" }}>Umidade Ar:</div>
              <div style={{ width: "50%" }}>{weatherdata.umidade}</div></h1>
          </div>

          <div className="clima">
            <h1>
              <div style={{ width: "50%" }}>Clima:</div>
              <div style={{ width: "50%" }}>{weatherdata.clima}</div>
            </h1>
          </div>
        </div>
        <div className="dados" style={{ width: "100%", backgroundColor: 'Gainsboro' }}>

          <div style={{ width: "49%" }}>
            <h1>
              <div style={{ width: "100%", fontSize: '30px', backgroundColor: 'white', borderRadius: '15px', marginBottom: '10px' }}>Ultimas 5 cidades Buscadas: </div>
              <div style={{ width: "100%", display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRadius: '15px' }}>
                {historico.map((dados, i) => <div style={{ backgroundColor: 'Gainsboro', borderRadius: '15px', margin: '5px', textAlign: 'left', paddingLeft: '20px', fontSize: '25px' }}>{dados.cidade}</div>)}
              </div>
            </h1>
          </div>

          <div style={{ width: "49%" }}>
            <h1>
              <div style={{ width: "100%", fontSize: '30px', backgroundColor: 'white', borderRadius: '15px', marginBottom: '10px' }}>Cidades Mais Buscadas: </div>
              <div style={{ width: "100%", display: 'flex', flexDirection: 'column', backgroundColor: 'white', borderRadius: '15px' }}>
                {maisBuscadas.map((dados, i) => <div style={{ backgroundColor: 'Gainsboro', borderRadius: '15px', margin: '5px', textAlign: 'left', paddingLeft: '20px', fontSize: '25px' }}>{dados.cidade} x {dados.npesquisa} </div>)}
              </div>
            </h1>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;

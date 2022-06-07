import React, { useState, useEffect } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./CountryData.css";

const CountryData = () => {
  
  const [IndiaData, setIndiaData] = useState(null);
  const [switzerlandData, setswitzerlandData] = useState(null);
  const [brazilData, setbrazilData] = useState(null);
  const [label, setlabel] = useState(null);
  const [tempData, settempData] = useState(null);
  const [switzerland, setswitzerland] = useState(true);
  const [isloading, setisloading] = useState(true);
  const [india, setIndia] = useState(true);
  const [brazil, setbrazil] = useState(true);

  Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  

  const getCountryData = () => {
    Promise.all([
      fetch(
        "https://api.covid19api.com/country/switzerland/status/confirmed?from=2020-03-01T00:00:00Z&to=2020-03-30T00:00:00Z"      ),
      fetch(
        "https://api.covid19api.com/country/india/status/confirmed?from=2020-03-01T00:00:00Z&to=2020-03-30T00:00:00Z"
      ),
      fetch(
        "https://api.covid19api.com/country/brazil/status/confirmed?from=2020-03-01T00:00:00Z&to=2020-03-30T00:00:00Z"
      ),
    ])
      .then((responses) => {
        return Promise.all(
          responses.map((response) => {
            return response.json();
          })
        );
      })
      .then((data) => {
        graphData(data);
        setisloading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const graphData =(countryData)=>{
    countryData && countryData.forEach((i)=>{
     if(i[0].Country === 'India'){
       setIndiaData(i);
     }
     if(i[0].Country === 'Brazil'){
       setbrazilData(i);
     }
     if(i[0].Country ==='Switzerland'){
       setswitzerlandData(i);
     }
     seprateData();
  });
  } 
  
  useEffect(() => {
    getCountryData();
  }, [tempData]);

  
  
   const seprateData = () =>{

      let labelData = brazilData && brazilData.map(i=>i.Date);
      setlabel(labelData);

    let IndiaCases =  IndiaData && IndiaData.map(i=>i.Cases);
     let BrazilCases = brazilData && brazilData.map(i=>i.Cases);
    let SwitzerlandCases =  switzerlandData && switzerlandData.map(i=>i.Cases);
    settempData([{
      label:'India',
      data:IndiaCases && IndiaCases,
      backgroundColor:'blue'
    },
    {
      label:'Switzerland',
      data: SwitzerlandCases && SwitzerlandCases,
      backgroundColor:'red'
    },
    {
      label:'Brazil',
      data: BrazilCases && BrazilCases,
      backgroundColor:'green'
    }])
   }
  

   

   
   let data = {
    labels:label && label,
    datasets : tempData && tempData
  }

 
  
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Covid Bar Chart",
      },
    },
  };  
  const handleIndiaBar = () =>{
    let updatedList = tempData.filter(items=>items.label !== 'India');
    settempData(updatedList);
  }
  const handleBrazilBar = () =>{
    let updatedList = tempData.filter(items=>items.label !== 'Brazil');
    settempData(updatedList);
  }
  const handleSwitzerlandBar = ()=>{
    let updatedList = tempData.filter(items=>items.label !== 'Switzerland');
    settempData(updatedList);
  }
  return (
    <>
      <div className="container">
        {isloading ? (
          <div className="loading">
            <h1>Loading....</h1>
          </div>
        ) : (
          <div className="container_main">
               <h1>Covid Data from 01/03/2020 to 2020-03-30 </h1>

              <div className="button_align">              
                  <div
              className="button"
              onClick={() => handleSwitzerlandBar()}
            >
              Switzerland
            </div>
            <div className="button" onClick={()=>handleIndiaBar()}>
              India
            </div>
            <div className="button" onClick={() => handleBrazilBar()}>
              Brazil
            </div>                  
            </div>
            {

              <div>
              <Bar  options={options} data={data}/>           
             </div>
            }  
          </div>
        )}
      </div>
    </>
  );
};

export default CountryData;

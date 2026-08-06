import { useEffect, useState } from "react";
import { geoPath, geoMercator } from "d3-geo";
import { feature } from "topojson-client";

import { countries } from "./data/countries";


function App() {

  const [mapData, setMapData] = useState<any>(null);


  useEffect(() => {
    fetch("/maps/world.json")
      .then((res) => res.json())
      .then((data) => {

        const countries =
          feature(
            data,
            data.objects.countries
          );

        setMapData(countries);

      });

  }, []);



  const visitedCountries = countries.filter(
    (country) => country.visited
  );


  const visitedCount =
    visitedCountries.length;


  const progress =
    ((visitedCount / 195) * 100).toFixed(1);


  const remainingCountries =
    195 - visitedCount;



  const nextDestinations =
    countries
      .filter((country) => country.next)
      .sort(
        (a, b) =>
          (a.totalCost ?? 0) -
          (b.totalCost ?? 0)
      )
      .slice(0, 5);



  const visitedNames =
    visitedCountries.map(
      (country) => country.name
    );



  const projection =
    geoMercator()
      .scale(120)
      .translate([400, 250]);


  const path =
    geoPath()
      .projection(projection);



  return (

    <main>

      <header>
        <h1>🌍 My World</h1>

        <p>
          My goal: visit every country
          in the world.
        </p>

      </header>



      <section>

        <h2>{visitedCount}</h2>

        <p>
          Countries visited
        </p>


        <h3>
          {progress}%
        </h3>


        <p>
          {remainingCountries}
          {" "}countries left
        </p>

      </section>



      <section>

        <h2>
          World Map
        </h2>


        <svg
          width="800"
          height="500"
          viewBox="0 0 800 500"
        >

          {
            mapData &&
            mapData.features.map(
              (country:any) => (

                <path
                  key={
                    country.id
                  }

                  d={
                    path(country) || ""
                  }

                  fill={
                    visitedNames.includes(
                      country.properties.name
                    )
                    ? "#263321"
                    : "#E8E8E8"
                  }

                  stroke="#FFFFFF"
                />

              )
            )
          }


        </svg>


      </section>



      <section>

        <h2>
          Next destinations
        </h2>


        {
          nextDestinations.map(
            (country) => (

              <p key={country.name}>

                {country.emoji}
                {" "}
                {country.name}
                {" — "}
                {country.totalCost?.toLocaleString(
                  "en-US"
                )}
                ₽

              </p>

            )
          )
        }


      </section>


    </main>

  );
}


export default App;
export const getWeatherByCoords = async (lat, lon) => {
    const API_KEY = "0e51087001226d6e3280198987bb05e4";
  
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;
  
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al obtener clima");
  
    return await res.json();
  };
  
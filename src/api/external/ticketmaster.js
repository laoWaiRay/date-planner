// Methods for making external API calls to Ticketmaster API

// To Do: allow custom queries on location
async function getTicketmasterEvents() {
  const result = await fetch(`http://localhost:8000/ticketmaster`);
  const data = await result.json();
  return data;
}

async function getTicketmasterEventById(id) {
  const result = await fetch(`http://localhost:8000/ticketmaster/${id}`);
  const data = await result.json();
  return data;
}


async function getTicketmasterEventByCountry(countryCode) {
  const result = await fetch(`http://localhost:8000/ticketmaster/country=${countryCode}`);
  const data = await result.json();
  return data;
}

async function getTicketmasterEventByLocation(city, countryCode) {
  const result = await fetch(`http://localhost:8000/ticketmaster/country=${countryCode}&city=${city}`);
  const data = await result.json();
  return data;
}


export {
  getTicketmasterEvents,
  getTicketmasterEventById,
  getTicketmasterEventByCountry,
  getTicketmasterEventByLocation,
}


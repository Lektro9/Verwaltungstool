const SERVER_URL = "http://0.0.0.0:3004/api/v1/personenverwaltung/persons/";

export const getAllPersons = async () => {
  return await fetch(SERVER_URL);
};

export const deletePerson = async (personId) => {
  return await fetch(SERVER_URL + personId, { method: "DELETE" });
};

const getPersonById = async (personId) => {
  return await fetch(SERVER_URL + personId);
};

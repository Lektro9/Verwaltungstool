const OverviewPersonData = ({ general, specific }) => {

    let key = Object.keys(specific)[0];

    const translation = {
      fieldPosition: "Position",
      handedness: "Handigkeit",
      experience: "Erfahrung",
      treatmentType: "Therapiemethode"
    }
  return (
    <div>
      Type: {general.type} <br />
      Vorname: {general.firstName} <br />
      Nachname: {general.lastName} <br />
      Geburtstag: {general.birthday} <br />
      {translation[key]}: {specific[key]} 
    </div>
  );
};

export default OverviewPersonData;

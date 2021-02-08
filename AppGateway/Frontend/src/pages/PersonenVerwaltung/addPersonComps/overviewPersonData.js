const OverviewPersonData = ({ general, specific }) => {
    console.log("her", general, specific)
  return (
    <div>
      Type: {general.type} <br />
      Vorname: {general.firstName} <br />
      Nachname: {general.lastName} <br />
      Geburtstag: {general.date} <br />
    </div>
  );
};

export default OverviewPersonData;

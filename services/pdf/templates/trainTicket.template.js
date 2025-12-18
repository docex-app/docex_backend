const trainTicketTemplate = (data) => `
<html>
<head>
<style>
body { font-family: Arial; padding: 20px; }
.ticket-box { border: 2px solid #000; padding: 20px; }
</style>
</head>
<body>
  <div class="ticket-box">
    <h2>TRAIN TICKET</h2>
    <p><b>PNR:</b> ${data.pnr}</p>
    <p><b>Passenger:</b> ${data.paxName}</p>
    <p><b>From:</b> ${data.sourceStation}</p>
    <p><b>To:</b> ${data.destStation}</p>
    <p><b>Number of passengers:</b> ${data.numOfPax}</p>
    <p><b>Date:</b> ${data.travelDate}</p>
    <p><b>Fare per passenger:</b> ₹${data.farePerPax}</p>
  </div>
</body>
</html>
`;


export default trainTicketTemplate;
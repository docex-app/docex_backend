const baseTicketFields = {
  paxName: {
    type: String,
    required: true
  },
  numOfPax: {
    type: Number,
    required: true
  },
  farePerPax: {
    type: Number,
    required: true
  },
  travelDate: {
    type: Date,
    required: true
  },
  pnr: {
    type: String,
    required: true,
    unique: true
  },
  passengerEmail: {
  type: String,
  required: true,
}
};

export default baseTicketFields;

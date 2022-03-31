import { v4 as uuid } from "uuid";

const vendors = [
  {
    _id: uuid(),
    name: "Mohamed",
    phone: "+20 100 663 8022",
    address: {
      country: "KSA",
      state: "Riyadh",
      city: "An Nakheel",
      zip: "11564",
      latitude: "24.749333",
      longitude: "46.652643",
    },
  },
  {
    _id: uuid(),
    name: "Ali",
    phone: "+20 100 663 8022",
    address: {
      country: "KSA",
      state: "Riyadh",
      city: "An Nakheel",
      zip: "11564",
      latitude: "24.749333",
      longitude: "46.652643",
    },
  },
  {
    _id: uuid(),
    name: "Ahmed",
    phone: "+20 100 663 8022",
    address: {
      country: "KSA",
      state: "Riyadh",
      city: "An Nakheel",
      zip: "11564",
      latitude: "24.749333",
      longitude: "46.652643",
    },
  },
];

export default vendors;

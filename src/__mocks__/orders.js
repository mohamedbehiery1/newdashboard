import { v4 as uuid } from "uuid";

const orders = [
  {
    _id: uuid(),
    createdAt: 1555016400000,
    merchant: {
      _id: uuid(),
      name: "Namshi",
    },
    user: {
      name: "Mohamed Foda",
      phone: "+20 100 663 8022",
    },
    address: {
      country: "KSA",
      state: "Riyadh",
      city: "An Nakheel",
      zip: "11564",
      latitude: "24.749333",
      longitude: "46.652643",
    },
    zone: "A1",
    qrcode: "",
    note: "Call before delivery",
  },
  {
    _id: uuid(),
    createdAt: 1555016400000,
    merchant: {
      _id: uuid(),
      name: "Namshi",
    },
    user: {
      name: "Mohamed Foda",
      phone: "+20 100 663 8022",
    },
    address: {
      country: "KSA",
      state: "Riyadh",
      city: "An Nakheel",
      zip: "11564",
      latitude: "24.749333",
      longitude: "46.652643",
    },
    zone: "A1",
    qrcode: "",
    note: "Call before delivery",
  },
  {
    _id: uuid(),
    createdAt: 1554930000000,
    merchant: {
      _id: uuid(),
      name: "Namshi",
    },
    user: {
      name: "Mohamed Foda",
      phone: "+20 100 663 8022",
    },
    address: {
      country: "KSA",
      state: "Riyadh",
      city: "An Nakheel",
      zip: "11564",
      latitude: "24.749333",
      longitude: "46.652643",
    },
    zone: "A1",
    qrcode: "",
    note: "Call before delivery",
  },
  {
    _id: uuid(),
    createdAt: 1554930000000,
    merchant: {
      _id: uuid(),
      name: "Namshi",
    },
    user: {
      name: "Mohamed Foda",
      phone: "+20 100 663 8022",
    },
    address: {
      country: "KSA",
      state: "Riyadh",
      city: "An Nakheel",
      zip: "11564",
      latitude: "24.749333",
      longitude: "46.652643",
    },
    zone: "A1",
    qrcode: "",
    note: "Call before delivery",
  },
  {
    _id: uuid(),
    createdAt: 1554757200000,
    merchant: {
      _id: uuid(),
      name: "Namshi",
    },
    user: {
      name: "Mohamed Foda",
      phone: "+20 100 663 8022",
    },
    address: {
      country: "KSA",
      state: "Riyadh",
      city: "An Nakheel",
      zip: "11564",
      latitude: "24.749333",
      longitude: "46.652643",
    },
    zone: "A1",
    qrcode: "",
    note: "Call before delivery",
  },
  {
    _id: uuid(),
    createdAt: 1554757200000,
    merchant: {
      _id: uuid(),
      name: "Namshi",
    },
    user: {
      name: "Mohamed Foda",
      phone: "+20 100 663 8022",
    },
    address: {
      country: "KSA",
      state: "Riyadh",
      city: "An Nakheel",
      zip: "11564",
      latitude: "24.749333",
      longitude: "46.652643",
    },
    zone: "A1",
    qrcode: "",
    note: "Call before delivery",
  },
  {
    _id: uuid(),
    createdAt: 1554670800000,
    merchant: {
      _id: uuid(),
      name: "Namshi",
    },
    user: {
      name: "Mohamed Foda",
      phone: "+20 100 663 8022",
    },
    address: {
      country: "KSA",
      state: "Riyadh",
      city: "An Nakheel",
      zip: "11564",
      latitude: "24.749333",
      longitude: "46.652643",
    },
    zone: "A1",
    qrcode: "",
    note: "Call before delivery",
  },
  {
    _id: uuid(),
    createdAt: 1554670800000,
    merchant: {
      _id: uuid(),
      name: "Namshi",
    },
    user: {
      name: "Mohamed Foda",
      phone: "+20 100 663 8022",
    },
    address: {
      country: "KSA",
      state: "Riyadh",
      city: "An Nakheel",
      zip: "11564",
      latitude: "24.749333",
      longitude: "46.652643",
    },
    zone: "A1",
    qrcode: "",
    note: "Call before delivery",
  },
  // {
  //   id: uuid(),
  //   address: {
  //     country: "USA",
  //     state: "West Virginia",
  //     city: "Parkersburg",
  //     street: "2849 Fulton Street",
  //   },
  //   avatarUrl: "/static/images/avatars/avatar_3.png",
  //   createdAt: 1555016400000,
  //   email: "ekaterina.tankova@devias.io",
  //   name: "Ekaterina Tankova",
  //   phone: "304-428-3097",
  // },
  // {
  //   id: uuid(),
  //   address: {
  //     country: "USA",
  //     state: "Bristow",
  //     city: "Iowa",
  //     street: "1865  Pleasant Hill Road",
  //   },
  //   avatarUrl: "/static/images/avatars/avatar_4.png",
  //   createdAt: 1555016400000,
  //   email: "cao.yu@devias.io",
  //   name: "Cao Yu",
  //   phone: "712-351-5711",
  // },
  // {
  //   id: uuid(),
  //   address: {
  //     country: "USA",
  //     state: "Georgia",
  //     city: "Atlanta",
  //     street: "4894  Lakeland Park Drive",
  //   },
  //   avatarUrl: "/static/images/avatars/avatar_2.png",
  //   createdAt: 1555016400000,
  //   email: "alexa.richardson@devias.io",
  //   name: "Alexa Richardson",
  //   phone: "770-635-2682",
  // },
  // {
  //   id: uuid(),
  //   address: {
  //     country: "USA",
  //     state: "Ohio",
  //     city: "Dover",
  //     street: "4158  Hedge Street",
  //   },
  //   avatarUrl: "/static/images/avatars/avatar_5.png",
  //   createdAt: 1554930000000,
  //   email: "anje.keizer@devias.io",
  //   name: "Anje Keizer",
  //   phone: "908-691-3242",
  // },
  // {
  //   id: uuid(),
  //   address: {
  //     country: "USA",
  //     state: "Texas",
  //     city: "Dallas",
  //     street: "75247",
  //   },
  //   avatarUrl: "/static/images/avatars/avatar_6.png",
  //   createdAt: 1554757200000,
  //   email: "clarke.gillebert@devias.io",
  //   name: "Clarke Gillebert",
  //   phone: "972-333-4106",
  // },
  // {
  //   id: uuid(),
  //   address: {
  //     country: "USA",
  //     state: "California",
  //     city: "Bakerfield",
  //     street: "317 Angus Road",
  //   },
  //   avatarUrl: "/static/images/avatars/avatar_1.png",
  //   createdAt: 1554670800000,
  //   email: "adam.denisov@devias.io",
  //   name: "Adam Denisov",
  //   phone: "858-602-3409",
  // },
  // {
  //   id: uuid(),
  //   address: {
  //     country: "USA",
  //     state: "California",
  //     city: "Redondo Beach",
  //     street: "2188  Armbrester Drive",
  //   },
  //   avatarUrl: "/static/images/avatars/avatar_7.png",
  //   createdAt: 1554325200000,
  //   email: "ava.gregoraci@devias.io",
  //   name: "Ava Gregoraci",
  //   phone: "415-907-2647",
  // },
  // {
  //   id: uuid(),
  //   address: {
  //     country: "USA",
  //     state: "Nevada",
  //     city: "Las Vegas",
  //     street: "1798  Hickory Ridge Drive",
  //   },
  //   avatarUrl: "/static/images/avatars/avatar_8.png",
  //   createdAt: 1523048400000,
  //   email: "emilee.simchenko@devias.io",
  //   name: "Emilee Simchenko",
  //   phone: "702-661-1654",
  // },
  // {
  //   id: uuid(),
  //   address: {
  //     country: "USA",
  //     state: "Michigan",
  //     city: "Detroit",
  //     street: "3934  Wildrose Lane",
  //   },
  //   avatarUrl: "/static/images/avatars/avatar_9.png",
  //   createdAt: 1554702800000,
  //   email: "kwak.seong.min@devias.io",
  //   name: "Kwak Seong-Min",
  //   phone: "313-812-8947",
  // },
  // {
  //   id: uuid(),
  //   address: {
  //     country: "USA",
  //     state: "Utah",
  //     city: "Salt Lake City",
  //     street: "368 Lamberts Branch Road",
  //   },
  //   avatarUrl: "/static/images/avatars/avatar_10.png",
  //   createdAt: 1522702800000,
  //   email: "merrile.burgett@devias.io",
  //   name: "Merrile Burgett",
  //   phone: "801-301-7894",
  // },
];

export const ordersForAWB = [
  {
    "user": {
      "address": {
        "city": "Cairo",
        "area": "Hadayek Al Ahram",
        "street": "5A",
        "houseNumber": "34A",
        "floor": "1",
        "flat": "1",
        "landmark": "Leave at door."
      },
      "location": {
        "type": "Point",
        "coordinates": [
          46.71388876757848,
          24.667124640072913
        ]
      },
      "name": "Mohamed Foda",
      "phone": "1006638022",
      "phoneCode": "+20"
    },
    "zone": {
      "coordinates": [
        [
          46.68436301074388,
          24.928291041804812
        ],
        [
          46.35202658496277,
          24.79559003932924
        ],
        [
          46.39253866992263,
          24.554746613356258
        ],
        [
          46.60814535937641,
          24.507271952296676
        ],
        [
          46.84572470507936,
          24.52976218747385
        ],
        [
          47.00021994433777,
          24.79060319112982
        ],
        [
          46.83473837695408,
          24.897153367907833
        ],
        [
          46.68436301074388,
          24.928291041804812
        ]
      ],
      "name": "Riyadh"
    },
    "packagesCount": 1,
    "pickedPackages": 0,
    "subMerchant": {
      "_id": "61fa95feffd7a8001631c545",
      "name": "Test"
    },
    "currentStatus": "ORDER_CREATED",
    "deleted": false,
    "zoneId": {
      "properties": {
        "name": "Riyadh"
      },
      "_id": "61faa34effd7a8001631c6ba"
    },
    "amountPayable": 14,
    "driver": null,
    "locationSmsTime": null,
    "notes": null,
    "_id": "621fe486f2469b00167c9d89",
    "orderItems": [
      
    ],
    "merchant": {
      "_id": "61f97d87e226ef00169ed49a",
      "companyName": "Mohamed Foda Market",
      "logo": "it0y3uxfsm6fzyiw9m8i.png"
    },
    "proofOfDelivery": "444365",
    "statusTrack": [
      {
        "dateTime": "2022-03-02T21:41:26.733Z",
        "_id": "621fe486f2469b00167c9d8a",
        "status": "ORDER_CREATED"
      }
    ],
    "barCode": [
      {
        "picked": false,
        "_id": "621fe487f2469b00167c9d8e",
        "text": "281248",
        "image": "rtryi6oqv0hkb3t33hjw.png"
      }
    ],
    "createdAt": "2022-03-02T21:41:26.749Z",
    "updatedAt": "2022-03-02T21:41:27.363Z",
    "orderNumber": 1248,
    "__v": 1,
    "qr": "zn6jawy3vjnk9tv1fizo.png"
  },
  {
    "user": {
      "address": {
        "city": "Cairo",
        "area": "Hadayek Alahram",
        "street": "5A",
        "houseNumber": "34A",
        "floor": "1",
        "flat": "1",
        "landmark": "Leave at door"
      },
      "location": {
        "type": "Point",
        "coordinates": [
          46.71526205859442,
          24.660260587782005
        ]
      },
      "name": "Mohamed Foda",
      "phone": "1006638022",
      "phoneCode": "+20"
    },
    "zone": {
      "coordinates": [
        [
          46.68436301074388,
          24.928291041804812
        ],
        [
          46.35202658496277,
          24.79559003932924
        ],
        [
          46.39253866992263,
          24.554746613356258
        ],
        [
          46.60814535937641,
          24.507271952296676
        ],
        [
          46.84572470507936,
          24.52976218747385
        ],
        [
          47.00021994433777,
          24.79060319112982
        ],
        [
          46.83473837695408,
          24.897153367907833
        ],
        [
          46.68436301074388,
          24.928291041804812
        ]
      ],
      "name": "Riyadh"
    },
    "packagesCount": 1,
    "pickedPackages": 0,
    "subMerchant": {
      "_id": "61fa95feffd7a8001631c545",
      "name": "Test"
    },
    "currentStatus": "ORDER_CREATED",
    "deleted": false,
    "zoneId": {
      "properties": {
        "name": "Riyadh"
      },
      "_id": "61faa34effd7a8001631c6ba"
    },
    "amountPayable": 20,
    "driver": null,
    "locationSmsTime": null,
    "notes": null,
    "_id": "621ff10ff2469b00167c9ec8",
    "orderItems": [
      
    ],
    "merchant": {
      "_id": "61f97d87e226ef00169ed49a",
      "companyName": "Mohamed Foda Market",
      "logo": "it0y3uxfsm6fzyiw9m8i.png"
    },
    "proofOfDelivery": "729894",
    "statusTrack": [
      {
        "dateTime": "2022-03-02T22:34:55.816Z",
        "_id": "621ff10ff2469b00167c9ec9",
        "status": "ORDER_CREATED"
      }
    ],
    "barCode": [
      {
        "picked": false,
        "_id": "621ff110f2469b00167c9ecd",
        "text": "301251",
        "image": "vkha4c3y7wytynawsazd.png"
      }
    ],
    "createdAt": "2022-03-02T22:34:55.827Z",
    "updatedAt": "2022-03-02T22:34:56.440Z",
    "orderNumber": 1251,
    "__v": 1,
    "qr": "xl5v6quqvmgovmdo8y4y.png"
  },
  {
    "user": {
      "address": {
        "city": "Cairo",
        "area": "Hadayek Alahram",
        "street": "5A",
        "houseNumber": "34A",
        "floor": "1",
        "flat": "1",
        "landmark": "Leave at door"
      },
      "location": {
        "type": "Point",
        "coordinates": [
          46.70290243945428,
          24.70518207438539
        ]
      },
      "name": "Mohamed Foda",
      "phone": "1006638022",
      "phoneCode": "+20"
    },
    "zone": {
      "coordinates": [
        [
          46.68436301074388,
          24.928291041804812
        ],
        [
          46.35202658496277,
          24.79559003932924
        ],
        [
          46.39253866992263,
          24.554746613356258
        ],
        [
          46.60814535937641,
          24.507271952296676
        ],
        [
          46.84572470507936,
          24.52976218747385
        ],
        [
          47.00021994433777,
          24.79060319112982
        ],
        [
          46.83473837695408,
          24.897153367907833
        ],
        [
          46.68436301074388,
          24.928291041804812
        ]
      ],
      "name": "Riyadh"
    },
    "packagesCount": 2,
    "pickedPackages": 0,
    "subMerchant": {
      "_id": "61fa95feffd7a8001631c545",
      "name": "Test"
    },
    "currentStatus": "ORDER_CREATED",
    "deleted": false,
    "zoneId": {
      "properties": {
        "name": "Riyadh"
      },
      "_id": "61faa34effd7a8001631c6ba"
    },
    "amountPayable": 30,
    "driver": null,
    "locationSmsTime": null,
    "notes": null,
    "_id": "621ff172f2469b00167c9f01",
    "orderItems": [
      
    ],
    "merchant": {
      "_id": "61f97d87e226ef00169ed49a",
      "companyName": "Mohamed Foda Market",
      "logo": "it0y3uxfsm6fzyiw9m8i.png"
    },
    "proofOfDelivery": "138820",
    "statusTrack": [
      {
        "dateTime": "2022-03-02T22:36:34.380Z",
        "_id": "621ff172f2469b00167c9f02",
        "status": "ORDER_CREATED"
      }
    ],
    "barCode": [
      {
        "picked": false,
        "_id": "621ff173f2469b00167c9f06",
        "text": "851252-1",
        "image": "jksmim89ej6p4ftclmxt.png"
      },
      {
        "picked": false,
        "_id": "621ff173f2469b00167c9f07",
        "text": "851252-2",
        "image": "cpluivexancyjjhjuwco.png"
      }
    ],
    "createdAt": "2022-03-02T22:36:34.388Z",
    "updatedAt": "2022-03-02T22:36:35.929Z",
    "orderNumber": 1252,
    "__v": 1,
    "qr": "cd86nienwqy4ffzv7vov.png"
  }
]

export default orders;

import CarouselSlides from "@/components/layout/carouselSlides";
import {
  ActivitySquareIcon,
  CarTaxiFront,
  Map,
  SettingsIcon,
} from "lucide-react";
import {
  aboutIcon,
  adminIcon,
  agentDriverIcon,
  agentsIcon,
  dashboardIcon,
  driverIcon,
  homeIcon,
  peopleIcon,
  profileIcon,
  revenueIcon,
  scanIcon,
  searchIcon,
  securityIcon,
} from "./icons";

export const SIDEBAR_LINKS = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: dashboardIcon,
  },
  {
    title: "Admins",
    href: "/admins",
    icon: adminIcon,
  },
  {
    title: "Activities",
    href: "/activities",
    icon: <ActivitySquareIcon className="h-5 w-5" />,
  },
  {
    title: "Agents",
    href: "/agents",
    icon: agentsIcon,
  },
  {
    title: "Vehicles",
    href: "/vehicles?page=1&limit=15",
    icon: <CarTaxiFront className="h-5 w-5" />,
  },
  // {
  // 	title: 'Drivers',
  // 	href: '/drivers',
  // 	icon: driverIcon,
  // },
  // {
  // 	title: 'Fines & Penalties',
  // 	href: '/fines',
  // 	icon: finesIcon,
  // },
  {
    title: "Scan",
    href: "/scan",
    icon: scanIcon,
  },
  {
    title: "Search",
    href: "/search",
    icon: searchIcon,
  },
  {
    title: "Revenue",
    href: "/revenue",
    icon: revenueIcon,
  },
  {
    title: "Map",
    href: "/map",
    icon: <Map className="h-5 w-5" />,
  },
  // {
  // 	title: 'Property',
  // 	href: '/property',
  // 	icon: <HomeIcon className='h-4 w-4' />,
  // },
  {
    title: "Settings",
    href: "/settings",
    icon: <SettingsIcon className="h-5 w-5" />,
  },
];
export const SIDEBAR_LINKS_ADMIN = [
  {
    title: "Dashboard",
    href: "/",
    icon: dashboardIcon,
  },
  {
    title: "Agents",
    href: "/agents",
    icon: agentsIcon,
  },
  {
    title: "Vehicles",
    href: "/vehicles",
    icon: driverIcon,
  },
  // {
  // 	title: 'Fines & Penalties',
  // 	href: '/fines',
  // 	icon: finesIcon,
  // },
  {
    title: "Scan",
    href: "/scan",
    icon: scanIcon,
  },
  {
    title: "Search",
    href: "/search",
    icon: searchIcon,
  },
];
export const SIDEBAR_LINKS_AGENT = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: dashboardIcon,
  },
  {
    title: "Vehicles",
    href: "/vehicles?page=1&limit=15",
    icon: driverIcon,
  },
  {
    title: "Scan",
    href: "/scan",
    icon: scanIcon,
  },
  {
    title: "Search",
    href: "/search",
    icon: searchIcon,
  },
];
export const SIDEBAR_LINKS_GREEN = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: dashboardIcon,
  },
  {
    title: "Vehicles",
    href: "/green-engine/vehicles",
    icon: driverIcon,
  },
  {
    title: "Scan",
    href: "/scan",
    icon: scanIcon,
  },
];
export const SIDEBAR_NO_USER = [
  {
    title: "Scan",
    href: "/scan",
    icon: scanIcon,
  },
  {
    title: "Search",
    href: "/search",
    icon: searchIcon,
  },
];
export const MANAGE_SIDEBAR_LINKS = [
  {
    name: "Home",
    href: "/manage",
    icon: homeIcon,
  },
  {
    name: "My Profile",
    href: "/manage/profile",
    icon: profileIcon,
  },
  {
    name: "Security",
    href: "/manage/security",
    icon: securityIcon,
  },
  {
    name: "About Us",
    href: "/manage/about",
    icon: aboutIcon,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: dashboardIcon,
  },
  {
    title: "Search",
    href: "/search",
    icon: searchIcon,
  },
];
export const DRIVERS_CARD = [
  {
    name: "Personal Information",
    description: "Edit Drivers information",
    href: "/vehicles?page=1&limit=15",
    image: "/personalinfo.png",
  },
  {
    name: "Payment",
    description: "Make Payment & Check Payment History",
    href: "/revenue",
    image: "/payment.png",
  },
  // {
  // 	name: 'Fines & Penalties',
  // 	description: 'Fine Driver & Check Fine Payment',
  // 	href: '/fines',
  // 	image: '/fineandpenal.png',
  // },
];
export const DASHBOARD_CARD = [
  {
    name: "Agents",
    description: "Agents List",
    icon: peopleIcon,
    number: "500",
    href: "/agents",
    image: "/tricycle.jpg",
  },
  {
    name: "Vehicles",
    description: "Drivers list & Update",
    icon: peopleIcon,
    number: "9,200",
    href: "/vehicles?page=1&limit=15",
    image: "/tricycle.jpg",
  },
  // {
  // 	name: 'Fines & Penalties',
  // 	description: 'Create fines & penalties',
  // 	icon: finesIcon,
  // 	number: '10,000',
  // 	href: '/fines',
  // 	image: '/tricycle.jpg',
  // },
  {
    name: "Scan Plate",
    description: "Scan Driver Plate to retrieve drivers information plate",
    icon: "",
    number: "",
    href: "/scan",
    image: "/scanplate.png",
  },
  {
    name: "Revenue and Stats",
    description: "View Money raised and submitted.",
    icon: "",
    number: "",
    href: "/revenue",
    image: "/tricycle.jpg",
  },
];
export const AGENT_DASHBOARD_CARD = [
  {
    name: "Vehicles",
    description: "Vehicle list & Update",
    icon: peopleIcon,
    number: "",
    href: "/vehicles?page=1&limit=15",
    image: "/tricycle.jpg",
  },
  // {
  // 	name: 'Fines & Penalties',
  // 	description: 'Create fines & penalties',
  // 	icon: finesIcon,
  // 	number: '10,000',
  // 	href: '/fines',
  // 	image: '/tricycle.jpg',
  // },
  // {
  //      name: "Scan Plate",
  //      description:
  //           "Scan Driver Plate to retrieve drivers information plate",
  //      icon: "",
  //      number: "",
  //      href: "/scan",
  //      image: "/scanplate.png",
  // },
];
export const AGENT_TABLE = [
  {
    name: "Emeka Ignatius",
    area: "Agege",
    phone: "08061719533",
    status: "active",
  },
  {
    name: "Emmanuel Ozigbo",
    area: "Festac",
    phone: "08061719533",
    status: "inactive",
  },
  {
    name: "Agent 1",
    area: "Agege",
    phone: "08065543210",
    status: "active",
  },
  {
    name: "Agent 2",
    area: "Festac",
    phone: "08062345678",
    status: "inactive",
  },
  {
    name: "Agent 3",
    area: "Ikeja",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent 4",
    area: "Surulere",
    phone: "08064321098",
    status: "inactive",
  },
  {
    name: "Agent 5",
    area: "Lekki",
    phone: "08063456789",
    status: "active",
  },
  {
    name: "Agent 6",
    area: "Ajao Estate",
    phone: "08060987654",
    status: "inactive",
  },
  {
    name: "Agent 7",
    area: "Yaba",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent 8",
    area: "Oshodi",
    phone: "08067654321",
    status: "inactive",
  },
  {
    name: "Agent 9",
    area: "Ikoyi",
    phone: "08064321987",
    status: "active",
  },
  {
    name: "Agent 10",
    area: "Victoria Island",
    phone: "08063456781",
    status: "inactive",
  },
  {
    name: "Agent 11",
    area: "Maryland",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent 12",
    area: "Ikorodu",
    phone: "08067654321",
    status: "inactive",
  },
  {
    name: "Agent 13",
    area: "Gbagada",
    phone: "08064321987",
    status: "active",
  },
  {
    name: "Agent 14",
    area: "Magodo",
    phone: "08063456781",
    status: "inactive",
  },
  {
    name: "Agent 15",
    area: "Sangotedo",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent 16",
    area: "Egbeda",
    phone: "08067654321",
    status: "inactive",
  },
  {
    name: "Agent 17",
    area: "Apapa",
    phone: "08064321987",
    status: "active",
  },
  {
    name: "Agent 18",
    area: "Ijebu Ode",
    phone: "08063456781",
    status: "inactive",
  },
  {
    name: "Agent 19",
    area: "Akoka",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent 20",
    area: "Mushin",
    phone: "08067654321",
    status: "inactive",
  },
  {
    name: "Agent 21",
    area: "Ikeja",
    phone: "08064321987",
    status: "active",
  },
  {
    name: "Agent 22",
    area: "Ajao Estate",
    phone: "08063456781",
    status: "inactive",
  },
  {
    name: "Agent 23",
    area: "Yaba",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent 24",
    area: "Oshodi",
    phone: "08067654321",
    status: "inactive",
  },
  {
    name: "Agent 25",
    area: "Ikoyi",
    phone: "08064321987",
    status: "active",
  },
  {
    name: "Agent 26",
    area: "Victoria Island",
    phone: "08063456781",
    status: "inactive",
  },
  {
    name: "Agent 27",
    area: "Maryland",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent 28",
    area: "Ikorodu",
    phone: "08067654321",
    status: "inactive",
  },
  {
    name: "Agent 29",
    area: "Gbagada",
    phone: "08064321987",
    status: "active",
  },
  {
    name: "Agent 30",
    area: "Magodo",
    phone: "08063456781",
    status: "inactive",
  },
  {
    name: "Agent 31",
    area: "Sangotedo",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent 32",
    area: "Egbeda",
    phone: "08067654321",
    status: "inactive",
  },
  {
    name: "Agent 33",
    area: "Apapa",
    phone: "08064321987",
    status: "active",
  },
  {
    name: "Agent 34",
    area: "Ijebu Ode",
    phone: "08063456781",
    status: "inactive",
  },
  {
    name: "Agent 35",
    area: "Akoka",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent 36",
    area: "Mushin",
    phone: "08067654321",
    status: "inactive",
  },
  {
    name: "Agent 37",
    area: "Festac",
    phone: "08064321987",
    status: "active",
  },
  {
    name: "Agent 38",
    area: "Agege",
    phone: "08063456781",
    status: "inactive",
  },
  {
    name: "Agent 39",
    area: "Lekki",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent 40",
    area: "Surulere",
    phone: "08067654321",
    status: "inactive",
  },
  {
    name: "Agent A",
    area: "Ikeja",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent B",
    area: "Yaba",
    phone: "08064321987",
    status: "inactive",
  },
  {
    name: "Agent C",
    area: "Surulere",
    phone: "08063456781",
    status: "active",
  },
  {
    name: "Agent D",
    area: "Oshodi",
    phone: "08067654321",
    status: "inactive",
  },
  {
    name: "Agent E",
    area: "Lekki",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent F",
    area: "Ikoyi",
    phone: "08064321987",
    status: "inactive",
  },
  {
    name: "Agent G",
    area: "Ajao Estate",
    phone: "08063456781",
    status: "active",
  },
  {
    name: "Agent H",
    area: "Festac",
    phone: "08067654321",
    status: "inactive",
  },
  {
    name: "Agent I",
    area: "Victoria Island",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent J",
    area: "Agege",
    phone: "08064321987",
    status: "inactive",
  },
  {
    name: "Agent K",
    area: "Ikorodu",
    phone: "08063456781",
    status: "active",
  },
  {
    name: "Agent L",
    area: "Magodo",
    phone: "08067654321",
    status: "inactive",
  },
  {
    name: "Agent M",
    area: "Maryland",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent N",
    area: "Egbeda",
    phone: "08064321987",
    status: "inactive",
  },
  {
    name: "Agent O",
    area: "Gbagada",
    phone: "08063456781",
    status: "active",
  },
  {
    name: "Agent P",
    area: "Apapa",
    phone: "08067654321",
    status: "inactive",
  },
  {
    name: "Agent Q",
    area: "Mushin",
    phone: "08061234567",
    status: "active",
  },
  {
    name: "Agent R",
    area: "Akoka",
    phone: "08064321987",
    status: "inactive",
  },
  {
    name: "Agent S",
    area: "Ijebu Ode",
    phone: "08063456781",
    status: "active",
  },
  {
    name: "Agent T",
    area: "Sangotedo",
    phone: "08067654321",
    status: "inactive",
  },
];
export const DRIVER_TABLE = [
  {
    name: "Emeka Ignatius",
    plate: "tfgh-ilt",
    status: "active",
    category: "cleared",
  },
  {
    name: "Emmanuel Ozigbo",
    plate: "trhb6-9jw",
    status: "inactive",
    category: "debtors",
  },
  {
    name: "Divine Onyekachukwu",
    plate: "gtw8-owg",
    status: "waived",
    category: "debtors",
  },
  {
    name: "Oyeniran Ayobami",
    plate: "97yy-kjy",
    status: "active",
    category: "cleared",
  },
];
export const PAYMENT_TABLE = [
  {
    driver: "Emeka Ignatius",
    amount: "1,500",
    date: "11/08/23",
    status: "successful",
  },
  {
    driver: "Emmanuel Ozigbo",
    amount: "3,000",
    date: "11/08/23",
    status: "processing",
  },
  {
    driver: "Divine Onyekachukwu",
    amount: "8,392",
    date: "11/08/23",
    status: "pending",
  },
  {
    driver: "Divine Onyekachukwu",
    amount: "8,392",
    date: "11/08/23",
    status: "pending",
  },
  {
    driver: "Divine Onyekachukwu",
    amount: "8,392",
    date: "11/08/23",
    status: "pending",
  },
  {
    driver: "Oyeniran Ayobami",
    amount: "6,793",
    date: "11/08/23",
    status: "failed",
  },
  {
    driver: "Oyeniran Ayobami",
    amount: "6,793",
    date: "11/08/23",
    status: "failed",
  },
  {
    driver: "Oyeniran Ayobami",
    amount: "6,793",
    date: "11/08/23",
    status: "failed",
  },
  {
    driver: "Oyeniran Ayobami",
    amount: "6,793",
    date: "11/08/23",
    status: "failed",
  },
  {
    driver: "Oyeniran Ayobami",
    amount: "6,793",
    date: "11/08/23",
    status: "failed",
  },
  {
    driver: "Oyeniran Ayobami",
    amount: "6,793",
    date: "11/08/23",
    status: "failed",
  },
  {
    driver: "Oyeniran Ayobami",
    amount: "6,793",
    date: "11/08/23",
    status: "failed",
  },
  {
    driver: "Oyeniran Ayobami",
    amount: "6,793",
    date: "11/08/23",
    status: "failed",
  },
  {
    driver: "Oyeniran Ayobami",
    amount: "6,793",
    date: "11/08/23",
    status: "failed",
  },
  {
    driver: "Oyeniran Ayobami",
    amount: "6,793",
    date: "11/08/23",
    status: "failed",
  },
  {
    driver: "Oyeniran Ayobami",
    amount: "6,793",
    date: "11/08/23",
    status: "failed",
  },
];
export const VIEW_DRIVER_TABLE = [
  {
    Date: "23-08-2023",
    amount_NGN: "15000",
    payment_type: "Cash",
    handled_by: "Agent john",
  },
  {
    Date: "22-08-2023",
    amount_NGN: "10000",
    payment_type: "Bank Transfer",
    handled_by: "Agent James",
  },
  {
    Date: "24-08-2023",
    amount_NGN: "25000",
    payment_type: "Cash",
    handled_by: "Agent Jane",
  },
  {
    Date: "21-08-2023",
    amount_NGN: "60,000",
    payment_type: "Mobile Transfer",
    handled_by: "Agent Janet",
  },
  {
    Date: "23-08-2023",
    amount_NGN: "5000",
    payment_type: "Cash",
    handled_by: "Agent Jonathan",
  },
  {
    Date: "25-08-2023",
    amount_NGN: "19000",
    payment_type: "Cash",
    handled_by: "Agent Helen",
  },
  {
    Date: "25-08-2023",
    amount_NGN: "19000",
    payment_type: "Cash",
    handled_by: "Agent Helen",
  },
  {
    Date: "25-08-2023",
    amount_NGN: "19000",
    payment_type: "Cash",
    handled_by: "Agent Helen",
  },
  {
    Date: "25-08-2023",
    amount_NGN: "19000",
    payment_type: "Cash",
    handled_by: "Agent Helen",
  },
];
export const ADD_DRIVER_TABLE = [
  {
    Name: "Okechukwu John",
    Phone_Number: "09078398045",
  },
  {
    Name: "Ikechukwu Jonathan",
    Phone_Number: "09078398048",
  },
  {
    Name: "Tobechukwu Tony",
    Phone_Number: "09078398047",
  },
  {
    Name: "Godson Alfred",
    Phone_Number: "09078398075",
  },
  {
    Name: "Godwin Emmanuel",
    Phone_Number: "09078399045",
  },
  {
    Name: "Micheal Thomas",
    Phone_Number: "09078398065",
  },
  {
    Name: "Abraham Pius",
    Phone_Number: "09078398985",
  },
  {
    Name: "Anthony Wilson",
    Phone_Number: "09078398095",
  },
  {
    Name: "Obi Moses",
    Phone_Number: "09078398105",
  },
];
// WEB AGENT
export const WEB_AGENT_SIDEBAR_LINKS = [
  {
    name: "Dashboard",
    href: "/web-agent",
    icon: dashboardIcon,
  },
  {
    name: "Scan",
    href: "/web-agent/scan",
    icon: scanIcon,
  },
  {
    name: "Driver",
    href: "/web-agent/driver",
    icon: agentDriverIcon,
  },
];
export const WEB_AGENT_CARD = [
  {
    name: "Scan Plate",
    description: "Scan Driver Plate to retrieve drivers information plate",
    icon: "",
    number: "",
    href: "/web-agent/scan",
    image: "/scanplate.png",
  },

  // {
  // 	name: 'Drivers',
  // 	description: 'Drivers list & Update',
  // 	icon: peopleIcon,
  // 	number: '2,500',
  // 	href: '/web-agent/driver',
  // 	image: '/drivers.png',
  // },
];
export const WEB_AGENT_DRIVER_CARD = [
  {
    name: "Vehicle Information",
    description: "View Vehicle information",
    href: "/web-agent/driver/editinfo",
    image: "/personalinfo.png",
  },
  {
    name: "Payment",
    description: "Make Payment & Check Payment History",
    href: "/web-agent/driver/payment",
    image: "/payment.png",
  },
  {
    name: "Fines & Penalties",
    description: "Fine Driver & Check Fine Payment",
    href: "/web-agent/driver/plate/fines",
    image: "/fineandpenal.png",
  },
  {
    name: "Waiver Form",
    description: "Fill waiver form to process driver grace period.",
    href: "/web-agent",
    image: "/fineandpenal.png",
  },
];
// export const FINE_CARDS: FinesCardP[] = [
//      {
//           id: 0,
//           title: "Speeding",
//           description: "Exceeding the speed limit on the highway.",
//           type: "fine",
//           amount: 10000, // Amount in Nigerian Naira
//      },
//      {
//           id: 1,
//           title: "Driving without License",
//           description: "Operating a vehicle without a valid driver's license.",
//           type: "fine",
//           amount: 8000,
//      },
//      {
//           id: 2,
//           title: "Running Red Light",
//           description: "Passing through a red traffic light signal.",
//           type: "fine",
//           amount: 12000,
//      },
//      {
//           id: 3,
//           title: "Overloading Vehicle",
//           description: "Carrying more passengers or goods than allowed.",
//           type: "fine",
//           amount: 15000,
//      },
//      {
//           id: 4,
//           title: "Using Mobile While Driving",
//           description:
//                "Using a mobile phone without a hands-free device while driving.",
//           type: "fine",
//           amount: 5000,
//      },
//      {
//           id: 5,
//           title: "Unauthorized Parking",
//           description: "Parking in a no-parking zone or blocking traffic.",
//           type: "fine",
//           amount: 7000,
//      },
//      {
//           id: 6,
//           title: "Operating Vehicle without Insurance",
//           description: "Driving a vehicle without valid insurance coverage.",
//           type: "fine",
//           amount: 10000,
//      },
//      {
//           id: 7,
//           title: "Driving Under the Influence",
//           description: "Driving while intoxicated by alcohol or drugs.",
//           type: "fine",
//           amount: 20000,
//      },
// ];
// ADMINS PAGE
export const ADMINS_TABLE = [
  {
    id: "0",
    name: "Emeka Ignatius",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "123-456-7890",
    },
    address: "1st avenue idumota road",
    status: "active",
  },
  {
    id: "1",
    name: "Emmanuel Ozigbo",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08061719533",
    },
    address: "frank way 2nd plot 2435",
    status: "inactive",
  },
  {
    id: "2",
    name: "Agent 1",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08065543210",
    },
    address: "estherwill street",
    status: "active",
  },
  {
    id: "3",
    name: "Agent 2",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08062345678",
    },
    address: "fege road",
    status: "inactive",
  },
  {
    id: "4",
    name: "Agent 3",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08061234567",
    },
    address: "Upper Iweka road plot 6574",
    status: "active",
  },
  {
    id: "5",
    name: "Agent 4",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08064321098",
    },
    address: "Main Market Onitsha",
    status: "inactive",
  },
  {
    name: "Agent 5",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 6",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08060987654",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 7",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 8",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 9",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 10",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 11",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 12",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 13",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 14",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 15",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 16",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 17",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 18",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 19",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 20",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 21",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 22",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 23",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "08061234567",
    status: "active",
  },
  {
    name: "Agent 24",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 25",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 26",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 27",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 28",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 29",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 30",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 31",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 32",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 33",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 34",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 35",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 36",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 37",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 38",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent 39",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent 40",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent A",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent B",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent C",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent D",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent E",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "08061234567",
    status: "active",
  },
  {
    name: "Agent F",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent G",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent H",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent I",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent J",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent K",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent L",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent M",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent N",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent O",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent P",
    contact: {
      "emekaignatius5@gmail.com": "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent Q",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent R",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
  {
    name: "Agent S",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "active",
  },
  {
    name: "Agent T",
    contact: {
      email: "emekaignatius5@gmail.com",
      phone: "08063456789",
    },
    address: "Awada, okiki street, flat 3 block 18",
    status: "inactive",
  },
];
export const PERSONAL_INFORMATION = [
  {
    title: "Name",
    entry: "Isaac Emperor",
  },
  {
    title: "E-mail Address",
    entry: "IsaacEmperor@gmail.com",
  },
  {
    title: "Phone Number",
    entry: "080-332-7264",
  },
];
export const ADDRESS_INFORMATION = [
  {
    title: "Address",
    entry: "No, 14 Agbero Road, Anambra",
  },
  {
    title: "Area Location",
    entry: "Mile 1-3",
  },
];
export const LOGIN_DETAILS = [
  {
    title: "User ID",
    entry: "AgentISCE",
  },
  {
    title: "Password",
    entry: "IsaacE2000",
  },
];
export const WAIVER_HISTORY = [
  {
    timeline: "Jan 31 - Feb 20",
    reason: "Car Repair",
    status: "active",
    generated_by: "Agent Emeka 1",
  },
  {
    timeline: "May 21 - June 1",
    reason: "Car Repair",
    status: "inactive",
    generated_by: "Agent Leo1",
  },
  {
    timeline: "Dec 31 - Jan 20",
    reason: "Car Repair",
    status: "inactive",
    generated_by: "Agent Divine1",
  },
  {
    timeline: "Oct 31 - Nov 20",
    reason: "Car Repair",
    status: "inactive",
    generated_by: "Agent Emeka 1",
  },
  {
    timeline: "Jan 31 - Feb 20",
    reason: "Car Repair",
    status: "active",
    generated_by: "Agent Emeka 1",
  },
  {
    timeline: "Jan 31 - Feb 20",
    reason: "Car Repair",
    status: "active",
    generated_by: "Agent Emeka 1",
  },
  {
    timeline: "Jan 31 - Feb 20",
    reason: "Car Repair",
    status: "inactive",
    generated_by: "Agent Emeka 1",
  },
  {
    timeline: "Jan 31 - Feb 20",
    reason: "Car Repair",
    status: "inactive",
    generated_by: "Agent Emeka 1",
  },
  {
    timeline: "Jan 31 - Feb 20",
    reason: "Car Repair",
    status: "inactive",
    generated_by: "Agent Emeka 1",
  },
  {
    timeline: "Jan 31 - Feb 20",
    reason: "Car Repair",
    status: "active",
    generated_by: "Agent Divine1",
  },
  {
    timeline: "May 15 - June 13",
    reason: "Car Repair",
    status: "active",
    generated_by: "Agent Leo1",
  },
];
export const LGA = [
  "Aguata",
  "Anambra East",
  "Anambra West",
  "Anaocha",
  "Awka North",
  "Awka South",
  "Ayamelum",
  "Dunukofia",
  "Ekwusigo",
  "Idemili North",
  "Idemili South",
  "Ihiala",
  "Njikoka",
  "Nnewi North",
  "Nnewi South",
  "Ogbaru",
  "Onitsha North",
  "Onitsha South",
  "Orumba North",
  "Orumba South",
  "Oyi",
];
// export const API = 'https://squid-app-ruxoz.ondigitalocean.app';
// export const API = 'http://localhost:5000';
// export const API = 'https://guided-adequately-hare.ngrok-free.app'; // Abdullah PC
// export const API =
// 	process.env.TEST_BACKEND_URL ||
// 	'https://pig-crisp-logically.ngrok-free.app'; // Rex PC

export const API =
  process.env.LIVE_BACKEND_URL ||
  "https://generally-equal-elephant.ngrok-free.app";
export const URLS = {
  activity: {
    all: "/api/v1/activities",
  },
  "audit-trails": {
    all: "/api/v1/audit-trails",
    vehicle: "/api/v1/audit-trails/vehicles",
    user: "/api/v1/audit-trails/users",
  },
  admin: {
    all: "/api/v1/admins",
    me: "/api/v1/admins/me",
  },
  agent: {
    all: "/api/v1/agents",
    me: "/api/v1/agents/me",
  },
  green: {
    all: "/api/v1/greenengine",
    me: "/api/v1/greenengine/me",
    search: "/api/v1/greenengine/search",
  },
  auth: {
    signin: {
      admin: "/api/v1/users/login",
      agent: "/api/v1/users/login",
    },
  },
  dashboard: {
    default: "/api/v1/dashboard",
    total_revenue_yearly: "/api/v1/dashboard/total-year-revenue",
    total_revenue_monthly: "/api/v1/dashboard/total-month-revenue",
    total_revenue_weekly: "/api/v1/dashboard/total-week-revenue",
    total_revenue_daily: "/api/v1/dashboard/total-day-revenue",
    net_total: "/api/v1/dashboard/net-total",
    total_tracker_yearly: "/api/v1/dashboard/total-trackers-revenue",
    activities_with_limit: "/api/v1/dashboard/all-activities",
    blacklisted_admin: "/api/v1/dashboard/blacklisted-admins",
    chart: "/api/v1/dashboard/chart",
  },
  driver: {
    all: "/api/v1/drivers",
    blacklist: "/api/v1/drivers/blacklist", // add vehicle to blacklist
  },
  revenue: {
    stats: "/api/v1/revenue/stats",
    report: "/api/v1/revenue/report",
  },
  vehicle: {
    all: "/api/v1/vehicles",
    blacklist: "/api/v1/vehicles/blacklist", // add vehicle to blacklist
    search: "/api/v1/vehicles/search", // add vehicle to blacklist
    asin: "/api/v1/vehicles/verify", // verify vehicle using ASIN
    fareflex: "/api/v1/vehicles/imei", // add fareflex to vehicle
  },
  settings: "/api/v1/settings", // for add ${id} for single.
  tracker: {
    location: "/location/find",
    stat: "/stat/find",
  },
  transactions: {
    all: "/api/v1/transaction",
    "net-total": "/api/v1/transaction/total-net",
    "total-revenue": "/api/v1/transaction/total-revenue",
    "total-tracker": "/api/v1/transaction/total-tracker",
  },
  user: "/api/v1/users",
};

export const TRACKER_BASE_URL =
  "https://api.gwgps12580.com/v1/Ch_manage_controller/api";
export const BUS_IMAGE_SAMPLE =
  "https://images.unsplash.com/photo-1616792577902-f1d86383a21b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2803&q=80";
export const SLIDES = [
  <>
    <CarouselSlides
      desc="Accountability in a civilized society is the stepping stone to development and progressive environment"
      images="/avater.png"
      author="ISCE Digital Concept"
      title="Ananmbra State"
    />
  </>,
  // <>
  // 	<CarouselSlides
  // 		desc='We believe that accountability is fundamental for societal progress, and TRANSPAY stands as a testament to that ethos, offering a reliable and efficient means for commuters'
  // 		images='/mbanefo.jpeg'
  // 		author='Hon. Afam Mbanefo'
  // 		title='Minister of Transport'
  // 	/>
  // </>,
  // <>
  // 	<CarouselSlides
  // 		desc='Just as development relies on being accountable for our actions, TRANSPAY cultivates an efficient and sustainable transit system, contributing to the growth and prosperity of our community.'
  // 		images='/ibezim.jpg'
  // 		author='Dr. Onyeka Ibezim'
  // 		title='Deputy Governor of Anambra State'
  // 	/>
  // </>,
];

// export const PROPERTIES: IProperty[] = [
//      {
//           propertyId: "ABC123",
//           ownerName: "John Doe",
//           address: "123 Main Street",
//           propertyType: "Residential",
//           assessmentValue: 250000,
//           taxRate: 0.02,
//           taxAmount: 5000,
//           paymentDueDate: "2023-12-31",
//           isPaid: false,
//           paymentRecords: [
//                {
//                     paymentDate: "2023-01-15",
//                     amountPaid: 2000,
//                },
//                {
//                     paymentDate: "2023-02-28",
//                     amountPaid: 3000,
//                },
//                {
//                     paymentDate: "2023-04-15",
//                     amountPaid: 2500,
//                },
//           ],
//      },
//      {
//           propertyId: "DEF456",
//           ownerName: "Jane Smith",
//           address: "456 Oak Avenue",
//           propertyType: "Commercial",
//           assessmentValue: 500000,
//           taxRate: 0.03,
//           taxAmount: 15000,
//           paymentDueDate: "2023-11-15",
//           isPaid: true,
//           paymentRecords: [
//                {
//                     paymentDate: "2023-01-15",
//                     amountPaid: 2000,
//                },
//                {
//                     paymentDate: "2023-02-28",
//                     amountPaid: 3000,
//                },
//                {
//                     paymentDate: "2023-04-15",
//                     amountPaid: 2500,
//                },
//           ],
//      },
//      {
//           propertyId: "GHI789",
//           ownerName: "Bob Johnson",
//           address: "789 Pine Street",
//           propertyType: "Residential",
//           assessmentValue: 300000,
//           taxRate: 0.025,
//           taxAmount: 7500,
//           paymentDueDate: "2023-10-31",
//           isPaid: false,
//           paymentRecords: [
//                {
//                     paymentDate: "2023-01-15",
//                     amountPaid: 2000,
//                },
//                {
//                     paymentDate: "2023-02-28",
//                     amountPaid: 3000,
//                },
//                {
//                     paymentDate: "2023-04-15",
//                     amountPaid: 2500,
//                },
//           ],
//      },
//      {
//           propertyId: "JKL012",
//           ownerName: "Alice Williams",
//           address: "12 Cedar Avenue",
//           propertyType: "Commercial",
//           assessmentValue: 700000,
//           taxRate: 0.035,
//           taxAmount: 24500,
//           paymentDueDate: "2023-09-15",
//           isPaid: true,
//           paymentRecords: [
//                {
//                     paymentDate: "2023-01-15",
//                     amountPaid: 2000,
//                },
//                {
//                     paymentDate: "2023-02-28",
//                     amountPaid: 3000,
//                },
//                {
//                     paymentDate: "2023-04-15",
//                     amountPaid: 2500,
//                },
//           ],
//      },
//      {
//           propertyId: "MNO345",
//           ownerName: "Charlie Brown",
//           address: "345 Elm Street",
//           propertyType: "Residential",
//           assessmentValue: 400000,
//           taxRate: 0.03,
//           taxAmount: 12000,
//           paymentDueDate: "2023-08-31",
//           isPaid: false,
//           paymentRecords: [
//                {
//                     paymentDate: "2023-01-15",
//                     amountPaid: 2000,
//                },
//                {
//                     paymentDate: "2023-02-28",
//                     amountPaid: 3000,
//                },
//                {
//                     paymentDate: "2023-04-15",
//                     amountPaid: 2500,
//                },
//           ],
//      },
//      {
//           propertyId: "PQR678",
//           ownerName: "Eva Davis",
//           address: "678 Maple Avenue",
//           propertyType: "Commercial",
//           assessmentValue: 600000,
//           taxRate: 0.04,
//           taxAmount: 24000,
//           paymentDueDate: "2023-07-15",
//           isPaid: true,
//           paymentRecords: [
//                {
//                     paymentDate: "2023-01-15",
//                     amountPaid: 2000,
//                },
//                {
//                     paymentDate: "2023-02-28",
//                     amountPaid: 3000,
//                },
//                {
//                     paymentDate: "2023-04-15",
//                     amountPaid: 2500,
//                },
//           ],
//      },
//      {
//           propertyId: "STU901",
//           ownerName: "David Wilson",
//           address: "901 Oak Street",
//           propertyType: "Residential",
//           assessmentValue: 350000,
//           taxRate: 0.028,
//           taxAmount: 9800,
//           paymentDueDate: "2023-06-30",
//           isPaid: false,
//           paymentRecords: [
//                {
//                     paymentDate: "2023-01-15",
//                     amountPaid: 2000,
//                },
//                {
//                     paymentDate: "2023-02-28",
//                     amountPaid: 3000,
//                },
//                {
//                     paymentDate: "2023-04-15",
//                     amountPaid: 2500,
//                },
//           ],
//      },
//      {
//           propertyId: "VWX234",
//           ownerName: "Grace Taylor",
//           address: "234 Birch Avenue",
//           propertyType: "Commercial",
//           assessmentValue: 800000,
//           taxRate: 0.045,
//           taxAmount: 36000,
//           paymentDueDate: "2023-05-15",
//           isPaid: true,
//           paymentRecords: [
//                {
//                     paymentDate: "2023-01-15",
//                     amountPaid: 2000,
//                },
//                {
//                     paymentDate: "2023-02-28",
//                     amountPaid: 3000,
//                },
//                {
//                     paymentDate: "2023-04-15",
//                     amountPaid: 2500,
//                },
//           ],
//      },
//      {
//           propertyId: "YZA567",
//           ownerName: "Frank Miller",
//           address: "567 Pine Street",
//           propertyType: "Residential",
//           assessmentValue: 450000,
//           taxRate: 0.032,
//           taxAmount: 14400,
//           paymentDueDate: "2023-04-30",
//           isPaid: false,
//           paymentRecords: [
//                {
//                     paymentDate: "2023-01-15",
//                     amountPaid: 2000,
//                },
//                {
//                     paymentDate: "2023-02-28",
//                     amountPaid: 3000,
//                },
//                {
//                     paymentDate: "2023-04-15",
//                     amountPaid: 2500,
//                },
//           ],
//      },
//      {
//           propertyId: "BCD890",
//           ownerName: "Helen Clark",
//           address: "890 Elm Avenue",
//           propertyType: "Commercial",
//           assessmentValue: 900000,
//           taxRate: 0.05,
//           taxAmount: 45000,
//           paymentDueDate: "2023-03-15",
//           isPaid: true,
//           paymentRecords: [
//                {
//                     paymentDate: "2023-01-15",
//                     amountPaid: 2000,
//                },
//                {
//                     paymentDate: "2023-02-28",
//                     amountPaid: 3000,
//                },
//                {
//                     paymentDate: "2023-04-15",
//                     amountPaid: 2500,
//                },
//           ],
//      },
// ];

export const BANK_RATE = 0.0043;
export const TRANSPAY = 0.08;
export const AIRS = 0.92;

export const FNTC = new Intl.NumberFormat("en-NG", {
  currency: "NGN",
  style: "currency",
});

// export const DURATIONREVENUESUMMARY: IDurationSummary[] = [
//      {
//           duration: "YEARLY",
//           totalDurationTricycleRev: 1000,
//           totalDurationSmallShuttleRev: 2000,
//           totalDurationBigShuttleRev: 3000,
//           totalDurationTrackerRev: 1000,
//           lgaRevenueSummary: [
//                {
//                     lga: "LGA 1",
//                     totalRev: 200,
//                     tricycleRev: 300,
//                     smallshuttleRev: 400,
//                     bigshuttleRev: 400,
//                     trackerRev: 400,
//                },
//                {
//                     lga: "LGA 2",
//                     totalRev: 200,
//                     tricycleRev: 300,
//                     smallshuttleRev: 400,
//                     bigshuttleRev: 400,
//                     trackerRev: 400,
//                },
//                {
//                     lga: "LGA 3",
//                     totalRev: 200,
//                     tricycleRev: 300,
//                     smallshuttleRev: 400,
//                     bigshuttleRev: 400,
//                     trackerRev: 400,
//                },
//                {
//                     lga: "LGA 4",
//                     totalRev: 200,
//                     tricycleRev: 300,
//                     smallshuttleRev: 400,
//                     bigshuttleRev: 400,
//                     trackerRev: 400,
//                },
//           ],
//      },
// ];
export const ALLOWED_VEHICLE_FIELDS = [
  "id",
  "vehicle_id",
  "color",
  "category",
  "plate_number",
  "image",
  "user_role",
  "user_id",
  "blacklisted",
  "current_driver",
  "status",
  "deleted",
  "vehicle_type",
  "vin",
  "barcode_string",
  "owners_phone_number",
  "owners_name",
  "tracker_id",
  "createdAt",
  "updatedAt",
];

export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://transpay.vercel.app"
    : "http://localhost:8726";

export enum TRANSACTION_TYPE {
  all = "ALL",
  daily = "DAILY_FEES",
  tracker = "TRACKER_FEES",
}
export enum WAIVER_STATUS {
  approved = "APPROVED",
  declined = "DECLINED",
  pending = "PENDING",
  cancelled = "CANCELLED",
}
export const LANDING_CARD_CONTENTS: {
  title: string;
  description: string;
}[] = [
  {
    title: "Efficient Revenue Collection",
    description:
      "Our advanced system automates the revenue collection process, reducing human error and ensuring accurate data recording.",
  },
  {
    title: "On and Off Activities",
    description:
      "We detect on and off-road activities using Fare Flex devices.",
  },
  {
    title: "User-Friendly Interface",
    description:
      "Transpay offers an interactive interface for both government officials and vehicle operators, making it easy to manage and monitor transactions.",
  },
  {
    title: "Secure Transactions",
    description:
      "Transpay ensures that all transactions are safe and secure, using security protocols to protect sensitive information.",
  },
];
export const HOW_IT_WORKS: {
  title: string;
  description: string;
}[] = [
  {
    title: " Fare Flex Device Installation",
    description:
      "Each commercial vehicle is equipped with a state-of-the-art Fare Flex Device.",
  },
  {
    title: "Revenue Generation",
    description:
      "Transpay processes the data, calculates the revenue, and facilitates  payment processing.",
  },
  {
    title: "Monitoring and Reporting",
    description:
      "Authorities can monitor the entire process and generate detailed reports for auditing and analysis.",
  },
];

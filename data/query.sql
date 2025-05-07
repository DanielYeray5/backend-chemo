use chemo_autos;

db.createCollection("cars");

db.cars.insertMany([
    {
        name: "Chevrolet Camaro ZL1 Panther",
        description: "Año: 2024",
        price: 2314900,
        image: "/images/Chevrolet Camaro ZL1 Panther.jpg"
    },
    {
        name: "Ford Mustang GT",
        description: "Año: 2025",
        price: 1150000,
        image: "/images/FORD_MUSTANG_GT.png"
    },
    {
        name: "Porsche 911 Carrera",
        description: "Año: 2025",
        price: 2500000,
        image: "/images/Porsche 911 Carrera .jpg"
    },
    {
        name: "BMW M4 Competition",
        description: "Año: 2025",
        price: 2300000,
        image: "/images/BMW M4 Competition .jpg"
    },
    {
        name: "SUBARU BRZ Limited 6MT",
        description: "Año: 2024",
        price: 769900,
        image: "/images/SUBARU_BRZ.jpg"
    },
    {
        name: "Nissan Z Touring AT",
        description: "Año: 2024",
        price: 1377900,
        image: "/images/NISSAN_Z.jpg"
    },
    {
        name: "Ford Fiesta S",
        description: "Año: 2019",
        price: 152500,
        image: "/images/FORD_FIESTA_S.jpg"
    },
    {
        name: "MAZDA 3 SEDÁN",
        description: "Año: 2025",
        price: 403900,
        image: "/images/MAZDA3_SEDAN.jpg"
    },
    {
        name: "Honda Civic",
        description: "Año: 2025",
        price: 590900,
        image: "/images/HONDA_CIVIC.jpg"
    }
]);

db.cars.insertMany([
    {
        name: "Toyota GR86 Premium 6MT",
        description: "Año: 2024",
        price: 774900,
        image: "/images/TOYOTA_GR86.jpg"
    },
    {
        name: "Chevrolet Camaro RS Coupe AT",
        description: "Año: 2024",
        price: 1356400,
        image: "/images/CHEVROLET_CAMARO_RS.jpg"
    },
    {
        name: "Volkswagen Polo Trendline",
        description: "Año: 2019",
        price: 155000,
        image: "/images/VOLKSWAGEN_POLO.jpg"
    },
    {
        name: "KIA Forte Sedán EX",
        description: "Año: 2025",
        price: 410000,
        image: "/images/KIA_FORTE.jpg"
    },
    {
        name: "Hyundai Elantra Limited",
        description: "Año: 2025",
        price: 598500,
        image: "/images/HYUNDAI_ELANTRA.jpg"
    }
]);

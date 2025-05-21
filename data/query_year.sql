use chemo_autos;

db.createCollection("cars");

db.cars.insertMany([
    {
        name: "Chevrolet Camaro ZL1 Panther",
        year: 2024,
        price: 2314900,
        image: "/images/Chevrolet_Camaro_ZL1_Panther.jpg",
        stock: 15
    },
    {
        name: "Ford Mustang GT",
        year: 2025,
        price: 1150000,
        image: "/images/FORD_MUSTANG_GT.png",
        stock: 18
    },
    {
        name: "Porsche 911 Carrera",
        year: 2025,
        price: 2500000,
        image: "/images/Porsche_911_Carrera.jpg",
        stock: 12
    },
    {
        name: "BMW M4 Competition",
        year: 2025,
        price: 2300000,
        image: "/images/BMW_M4_Competition.jpg",
        stock: 17
    },
    {
        name: "SUBARU BRZ Limited 6MT",
        year: 2024,
        price: 769900,
        image: "/images/SUBARU_BRZ.jpg",
        stock: 13
    },
    {
        name: "Nissan Z Touring AT",
        year: 2024,
        price: 1377900,
        image: "/images/NISSAN_Z.jpg",
        stock: 16
    },
    {
        name: "Ford Fiesta S",
        year: 2019,
        price: 152500,
        image: "/images/FORD_FIESTA_S.jpg",
        stock: 14
    },
    {
        name: "MAZDA 3 SEDÁN",
        year: 2025,
        price: 403900,
        image: "/images/MAZDA3_SEDAN.jpg",
        stock: 19
    },
    {
        name: "Honda Civic",
        year: 2025,
        price: 590900,
        image: "/images/HONDA_CIVIC.jpg",
        stock: 11
    }
]);

db.cars.insertMany([
    {
        name: "Toyota GR86 Premium 6MT",
        year: 2024,
        price: 774900,
        image: "/images/toyota_GR86_2024.heif",
        stock: 13
    },
    {
        name: "Chevrolet Camaro RS Coupe AT",
        year: 2024,
        price: 1356400,
        image: "/images/CHEVROLETCAMARO.jpg",
        stock: 17
    },
    {
        name: "Volkswagen Polo Trendline",
        year: 2019,
        price: 155000,
        image: "/images/VOLKSWAGEN_POLO.jpg",
        stock: 10
    },
    {
        name: "KIA Forte Sedán EX",
        year: 2025,
        price: 410000,
        image: "/images/KIA_K4.jpeg",
        stock: 18
    },
    {
        name: "Hyundai Elantra Limited",
        year: 2025,
        price: 598500,
        image: "/images/HYUNDAI_ELANTRA.jpg",
        stock: 15
    }
]);

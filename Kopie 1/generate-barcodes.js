const bwipjs = require("bwip-js");
const fs = require("fs");
const path = require("path");

// Create output directory
const outputDir = path.join(__dirname, "barcodes");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

// Function to calculate EAN-13 check digit
function calculateCheckDigit(barcode) {
    const digits = barcode.split("").map(Number);
    let sum = 0;

    for (let i = 0; i < digits.length; i++) {
        sum += (i % 2 === 0 ? 1 : 3) * digits[i];
    }

    return (10 - (sum % 10)) % 10;
}

// Product data
const products = [
    "Lays Classic Chips",
    "Doritos Nacho Cheese",
    "Pringles Original",
    "Ritz Crackers",
    "Oreos",
    "Cheez-It",
    "Goldfish Crackers",
    "Cheetos Crunchy",
    "Popcorn Microwaveable Butter",
    "Pretzels",
    "Snickers",
    "Twix",
    "KitKat",
    "Mars Bar",
    "Hershey's Milk Chocolate",
    "M&M's Peanut",
    "Reese's Peanut Butter Cups",
    "Toblerone",
    "Cadbury Dairy Milk",
    "Coca-Cola",
    "Pepsi",
    "Sprite",
    "Fanta Orange",
    "Mountain Dew",
    "Dr Pepper",
    "Red Bull",
    "Monster Energy",
    "Gatorade Lemon-Lime",
    "Lipton Iced Tea",
    "Skittles",
    "Haribo Goldbears",
    "Jelly Belly",
    "Sour Patch Kids",
    "Airheads",
    "Laffy Taffy",
    "Dubble Bubble",
    "Smarties",
    "Warheads",
    "Nutella",
    "Peanut Butter",
    "Hershey's Syrup",
    "Pop-Tarts",
    "Ketchup",
    "Mayonnaise",
    "Mustard",
    "Hot Sauce",
    "Milky Way",
    "Starburst",
    "Breakfast Cereal",
    "Pickles",
];

// Generate and save barcodes
products.forEach((product, index) => {
    const baseBarcode = String(index + 1).padStart(11, "0"); // Generate base barcode (11 digits)
    const fullBarcode = baseBarcode + calculateCheckDigit(baseBarcode); // Add check digit

    const outputPath = path.join(outputDir, `${index + 1}-${product.replace(/\s+/g, "_")}.png`);

    bwipjs.toBuffer(
        {
            bcid: "ean13", // Barcode type
            text: fullBarcode, // EAN-13 barcode
            scale: 3, // Scale factor
            height: 10, // Height in mm
            includetext: true, // Include human-readable text
            textxalign: "center", // Center align text
            backgroundcolor: "FFFFFF", // Set background color to white
        },
        (err, png) => {
            if (err) {
                console.error(`Error generating barcode for ${product}: ${err.message}`);
            } else {
                fs.writeFileSync(outputPath, png);
                console.log(`Barcode saved for ${product} as ${outputPath}`);
            }
        }
    );
});


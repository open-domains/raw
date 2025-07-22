const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "../../domains");
const outputIndexPath = path.join(__dirname, "raw/index.json");
const globalCountPath = path.join(__dirname, "raw/domains-badge.json");

let combinedArray = [];

// Ensure output directory exists
const outputDir = path.join(__dirname, "raw");
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(directoryPath, function (err, files) {
    if (err) throw err;

    // Remove "reserved" from list
    files = files.filter((value) => value !== "reserved");

    let filesRead = 0;

    files.forEach(function (file) {
        const filePath = path.join(directoryPath, file);

        fs.readFile(filePath, "utf8", (err, data) => {
            if (err) throw err;

            console.log(filePath);

            const parsed = JSON.parse(data);
            const dataArray = [parsed];
            combinedArray = combinedArray.concat(dataArray);

            filesRead++;

            if (filesRead === files.length) {
                // Write the combined index.json
                fs.writeFile(outputIndexPath, JSON.stringify(combinedArray, null, 2), (err) => {
                    if (err) throw err;
                });

                // Create a single Shields.io badge for total count
                const totalCount = files.length;
                const badgeData = {
                    schemaVersion: 1,
                    label: "domains",
                    message: String(totalCount),
                    color: "blue"
                };

                fs.writeFile(globalCountPath, JSON.stringify(badgeData), (err) => {
                    if (err) throw err;
                    console.log("Generated index.json and domains-badge.json.");
                });
            }
        });
    });
});

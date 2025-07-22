const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "../../domains");
const outputIndexPath = path.join(__dirname, "raw/index.json");
const countsDirectoryPath = path.join(__dirname, "raw/counts");

let combinedArray = [];

// Ensure counts directory exists
if (!fs.existsSync(countsDirectoryPath)) {
    fs.mkdirSync(countsDirectoryPath, { recursive: true });
}

fs.readdir(directoryPath, function (err, files) {
    if (err) throw err;

    // Fix: Remove "reserved"
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

            // Generate Shields.io-compatible count badge
            const count = Array.isArray(parsed)
                ? parsed.length
                : typeof parsed === "object"
                ? Object.keys(parsed).length
                : 1;

            const badgeData = {
                schemaVersion: 1,
                label: file,
                message: String(count),
                color: "blue"
            };

            fs.writeFile(
                path.join(countsDirectoryPath, `${file}.json`),
                JSON.stringify(badgeData),
                (err) => {
                    if (err) throw err;
                }
            );

            filesRead++;

            // When all files are processed, write index
            if (filesRead === files.length) {
                fs.writeFile(outputIndexPath, JSON.stringify(combinedArray, null, 2), (err) => {
                    if (err) throw err;
                    console.log("index.json and Shields.io badges generated successfully.");
                });
            }
        });
    });
});

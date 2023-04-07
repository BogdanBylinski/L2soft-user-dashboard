const { spawn } = require("child_process");

function importJsonToCollection(dbName, collectionName, jsonFilePath) {
  return new Promise((resolve, reject) => {
    const mongoimport = spawn("mongoimport", [
      "--db",
      "Auth-App",
      "--collection",
      "keys",
      "--file",
      "./u.json",
      "--jsonArray",
    ]);

    mongoimport.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    mongoimport.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    mongoimport.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`mongoimport failed with code ${code}`));
      }
    });
  });
}
exports.module = importJsonToCollection;

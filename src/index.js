import * as fs from "node:fs";
import jsonMaker from "./jsonMaker.js";

const dirpath = "./src/data/nhk_original/";

const filenames = fs.readdirSync(dirpath);

const jsonall = Promise.all(filenames.map((filename) => jsonMaker(filename)));

let japanVoteing = {};

let japanVoteingJson = {};

jsonall
  .then((results) => {
    results.map((obj) => {
      Object.assign(japanVoteing, obj);
    });

    japanVoteingJson = JSON.stringify(japanVoteing, null, 2)

    fs.writeFileSync("./shusen2021.json", japanVoteingJson);
    console.log("Done!!");
  })
  .catch((error) => {
    console.log(`errorです。${error}`);
  });

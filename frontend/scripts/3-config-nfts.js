import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x156E3800528CC8604C77788f9d629D47113479d4",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "NFTree",
        description: "This NFT will give you access to TreeDAO!",
        image: readFileSync("scripts/assets/logo.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()

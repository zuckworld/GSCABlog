import React from "react";
import Image from "next/image";

import { grpahCMSImageLoader } from "../util";

const Author = ({ author }) => (
  <div className="text-center mt-20 mb-8 p-12 relative rounded-xl postcardtab">
    <div className="absolute left-1/2 -top-14 transform -translate-x-1/2">
      <Image
        unoptimized
        loader={grpahCMSImageLoader}
        alt={author.name}
        height={100}
        width={100}
        className="align-middle rounded-full"
        src={author.photo.url}
      />
    </div>
    <h3 className="text-white mb-4 text-xl font-bold mt-10">{author.name}</h3>
    <p className="text-white text-ls">{author.bio}</p>
  </div>
);

export default Author;

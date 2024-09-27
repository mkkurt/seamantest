const { SitemapStream, streamToPromise } = require("sitemap");
const { Readable } = require("stream");
const fs = require("fs");

const generateSitemap = () => {
  const links = [{ url: "/", changefreq: "daily", priority: 1 }];
  const stream = new SitemapStream({
    hostname: "https://gemiadamisorulari.com",
  });
  return streamToPromise(Readable.from(links).pipe(stream)).then((data) =>
    fs.writeFileSync("./public/sitemap.xml", data.toString())
  );
};

generateSitemap();

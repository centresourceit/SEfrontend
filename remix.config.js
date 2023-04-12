/** @type {import('@remix-run/dev').AppConfig} */
const { defineRoutes } = require("@remix-run/dev/dist/config/routes");
const { flatRoutes } = require('remix-flat-routes')
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  flatRoutes: async defineRoutes => {
    return flatRoutes("routes", defineRoutes);
  },
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // serverBuildPath: "build/index.js",
  // publicPath: "/build/",
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
    unstable_postcss: true,
    unstable_tailwind: true,
  },
};

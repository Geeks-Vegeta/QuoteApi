class CustomTestSequencer {
  sort(testPaths) {
    return testPaths.sort((a, b) => {
      const fileA = a && a.path ? a.path : "";
      const fileB = b && b.path ? b.path : "";

      if (fileA.includes("first-test")) return -1;
      if (fileB.includes("second-test")) return 1;
      if (fileA.includes("third-test")) return -1;
      if (fileB.includes("second-test")) return 1;
      return 0;
    });
  }
  cacheResults(results) {
    return {};
  }
}

module.exports = CustomTestSequencer;

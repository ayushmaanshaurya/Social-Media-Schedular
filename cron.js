const cron = require("node-cron");

module.exports = (posts) => {
  // Har 1 minute me run hoga
  cron.schedule("* * * * *", () => {
    const now = new Date();

    posts.forEach((post) => {
      if (
        post.status === "Upcoming" &&
        post.date &&
        new Date(post.date) <= now
      ) {
        post.status = "Published";
        console.log("✅ Post auto-published:", post.id);
      }
    });
  });
};

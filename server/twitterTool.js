import { TwitterApi } from 'twitter-api-v2';
import { config } from 'dotenv';

config();

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

export async function createPost(status) {
  const newPost = await twitterClient.v2.tweet(status);

  return {
    content: [
      {
        type: 'text',
        text: `Tweeted: ${status}`,
      },
    ],
  };
}


// Note: This code hasn't been fully tested due to Twitter API access limitations.
// Additional error handling may be needed with a production Twitter developer account.

export async function getUserTimeline(userId) {
  const timeline = await twitterClient.v2.userTimeline(userId, {
    max_results: 5,
    exclude: 'replies',
  });

  return timeline.data.map((tweet) => ({
    content: [
      {
        type: 'text',
        text: `Tweeted: ${tweet.text}`,
      },
    ],
  }));
}

export async function getFollowers(userId) {
  const followers = await twitterClient.v2.followers(userId, {
    max_results: 5,
  });

  return followers.data.map((follower) => ({
    content: [
      {
        type: 'text',
        text: `Follower: ${follower.username}`,
      },
    ],
  }));
}

export async function getFollowing(userId) {
  const following = await twitterClient.v2.following(userId, {
    max_results: 5,
  });

  return following.data.map((followedUser) => ({
    content: [
      {
        type: 'text',
        text: `Following: ${followedUser.username}`,
      },
    ],
  }));
}

export async function getSearchResult(username) {
  const foundUsers = await twitterClient.v2.usersByUsername(username, {
    max_results: 5,
  });
  return foundUsers.data.map((user) => ({
    content: [
      {
        type: 'text',
        text: `User: ${user.username}`,
      },
    ],
  }));
}

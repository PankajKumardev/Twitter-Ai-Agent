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

export async function getUserTimeline(username) {
  const user = await twitterClient.v2.userByUsername(username, {
    'user.fields': ['created_at', 'description', 'public_metrics'],
  });
  const timeline = await twitterClient.v2.userTimeline(user.data.id, {
    'tweet.fields': ['created_at', 'public_metrics'],
    max_results: 5,
  });

  return {
    content: [
      {
        type: 'text',
        text: `User: ${user.data.username}`,
      },
      {
        type: 'text',
        text: `Tweets: ${timeline.data.map((tweet) => tweet.text).join('\n')}`,
      },
    ],
  };
}

export async function getUserFollowers(username) {
  const user = await twitterClient.v2.userByUsername(username, {
    'user.fields': ['created_at', 'description', 'public_metrics'],
  });
  const followers = await twitterClient.v2.followers(user.data.id, {
    'user.fields': ['created_at', 'description', 'public_metrics'],
    max_results: 5,
  });

  return {
    content: [
      {
        type: 'text',
        text: `User: ${user.data.username}`,
      },
      {
        type: 'text',
        text: `Followers: ${followers.data
          .map((follower) => follower.username)
          .join('\n')}`,
      },
    ],
  };
}

export async function getUserFollowing(username) {
  const user = await twitterClient.v2.userByUsername(username, {
    'user.fields': ['created_at', 'description', 'public_metrics'],
  });
  const following = await twitterClient.v2.following(user.data.id, {
    'user.fields': ['created_at', 'description', 'public_metrics'],
    max_results: 5,
  });

  return {
    content: [
      {
        type: 'text',
        text: `User: ${user.data.username}`,
      },
      {
        type: 'text',
        text: `Following: ${following.data
          .map((followed) => followed.username)
          .join('\n')}`,
      },
    ],
  };
}
